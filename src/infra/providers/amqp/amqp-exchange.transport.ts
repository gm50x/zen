import { Logger } from '@nestjs/common';
import {
  CustomTransportStrategy,
  MessageHandler,
  Server,
} from '@nestjs/microservices';
import { ChannelWrapper } from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';
import { isObservable, lastValueFrom } from 'rxjs';
import { AmqpConnection } from './amqp.connection';
import {
  AmqpExchange,
  AmqpExchangeTransportOptions,
  ControlHeaders,
} from './amqp.models';

export class AmqpExchangeTransport
  extends Server
  implements CustomTransportStrategy
{
  readonly transportId: symbol;

  protected readonly logger = new Logger(this.constructor.name);

  private readonly exchange: AmqpExchange;
  private connection: AmqpConnection;
  private channel: ChannelWrapper;
  private routingKeys: { routingKey: string; regex: RegExp }[];

  constructor(private readonly options: AmqpExchangeTransportOptions) {
    super();

    const { connection, url } = options;
    if (!connection && !url) {
      throw new Error('AmqpError: neither connection nor url provided');
    }

    this.transportId = options.consumerId || Symbol.for(options.exchange.name);

    this.exchange = new AmqpExchange(
      this.options.exchange.name,
      this.options.exchange.type,
    );
  }

  async listen(callback: () => void) {
    this.connect();

    /**
     * @TODO: trigger multiple subscription endpoints on the same microservice.
     * For example the same microservice config should be able to handle
     * both foo.bar handle and foo.*.
     */

    this.channel.consume(this.exchange.main, this.onMessage.bind(this), {
      noAck: true,
    });
    callback();
  }

  async close() {
    await this.connection.close();
  }

  //#region internals
  private async assertExchange(channel: Channel) {
    await channel.assertExchange(this.exchange.name, this.exchange.type);
  }

  private async assertQueues(channel: Channel) {
    const { name: exchange, main, retry, dead } = this.exchange;

    await channel.assertQueue(main, {
      deadLetterExchange: exchange,
      deadLetterRoutingKey: retry,
    });

    await channel.assertQueue(retry, {
      deadLetterExchange: exchange,
      deadLetterRoutingKey: main,
    });

    await channel.assertQueue(dead);
  }

  private getRoutingKeyRegex(routingKey: string) {
    const bindingKey = routingKey
      .replaceAll('.', '\\.')
      .replaceAll('*', '[a-zA-Z0-9-]+')
      .replaceAll('#', '.+');

    return new RegExp(`^${bindingKey}$`);
  }

  private async bindQueues(channel: Channel) {
    const { name: exchange, main, retry } = this.exchange;

    await channel.bindQueue(main, exchange, main);
    await channel.bindQueue(retry, exchange, retry);
  }

  private async bindRoutingKeys(channel: Channel) {
    const routingKeys = Array.from(this.messageHandlers.keys());

    this.routingKeys = routingKeys.map((x) => ({
      routingKey: x,
      regex: this.getRoutingKeyRegex(x),
    }));

    await Promise.all(
      routingKeys.map((key) =>
        channel.bindQueue(this.exchange.main, this.exchange.name, key),
      ),
    );
  }

  private async bindExchanges(channel: Channel) {
    const exchangeToBind = this.options.exchange.bindToExchange;
    if (!exchangeToBind) {
      return;
    }

    await channel.bindExchange(
      this.exchange.name,
      exchangeToBind.name,
      exchangeToBind.routingKey,
    );
  }

  private async setup(channel: Channel) {
    await this.assertExchange(channel);
    await this.assertQueues(channel);
    await this.bindQueues(channel);
    await this.bindRoutingKeys(channel);
    await this.bindExchanges(channel);
  }

  private connect() {
    const { url, connection } = this.options;
    if (!connection) {
      this.connection = new AmqpConnection({ url });
    } else {
      this.connection = connection;
    }

    this.connection.connect();

    this.channel = this.connection.createChannel(
      this.constructor.name,
      this.setup.bind(this),
    );
  }

  private tryParse(message: ConsumeMessage) {
    try {
      return JSON.parse(message.content.toString('utf8'));
    } catch {
      return message.content.toString('utf8');
    }
  }

  private getExpiration(totalAttempts: number) {
    const { interval = 10000, maxInterval } = this.options.retry;

    const retryDelayFactor = 2;
    const expiration =
      interval + interval * ((totalAttempts - 1) * retryDelayFactor);

    return maxInterval && expiration > maxInterval ? maxInterval : expiration;
  }

  private getHandlerByRoutingKey(
    routingKey: string,
  ): MessageHandler<any, any, any> {
    const handler = this.routingKeys.find((x) => x.regex.test(routingKey));
    return this.getHandlerByPattern(handler.routingKey);
  }

  private async onMessage(message: ConsumeMessage) {
    const routingKey =
      message.properties.headers['x-original-routing-key'] ||
      message.fields.routingKey;

    /** TODO: this should return multiple handler that need all be triggered */
    const handler = this.getHandlerByRoutingKey(routingKey);
    if (!handler) {
      this.logger.warn(
        `No handler found for message with pattern ${routingKey}`,
      );
      return;
    }

    try {
      const result = await handler(this.tryParse(message), message);
      if (isObservable(result)) {
        await lastValueFrom(result);
      }
    } catch (err) {
      await this.onMessageError(message);
    }
  }

  private async onMessageError(message: ConsumeMessage) {
    /** TODO: Allow retrying unique handlers:
     * If we have two subscriptions on the same microservice
     * that get triggered by the same message we should be able to
     * retry each handler independendly of each other.
     * For example:
     * ```typescript
     *  @SubscribePattern('foo.bar') fooBarHandler() {}
     *  @SubscribePattern('foo.*') fooAnyHandler() {}
     * ```
     * We then would want to be able to retry `foo.bar` independently
     * from `foo.*`. The current setup only allows this through the use
     * of multiple exchanges and therefore subscriptions...
     */
    const { limit = 10 } = this.options.retry;
    const totalAttempts =
      message.properties.headers[ControlHeaders.AttemptCount] || 1;

    const routingKey =
      message.properties.headers[ControlHeaders.OriginalRoutingKey] ||
      message.fields.routingKey;

    if (totalAttempts > limit) {
      await this.channel.sendToQueue(this.exchange.dead, message.content, {
        headers: {
          [ControlHeaders.DeadReason]: `Maximum attempts of ${limit} reached`,
          [ControlHeaders.OriginalRoutingKey]: routingKey,
          [ControlHeaders.AttemptCount]: totalAttempts,
        },
      });

      return;
    }

    const expiration = this.getExpiration(totalAttempts);
    await this.channel.sendToQueue(this.exchange.retry, message.content, {
      expiration,
      headers: {
        [ControlHeaders.OriginalRoutingKey]: routingKey,
        [ControlHeaders.AttemptCount]: totalAttempts + 1,
      },
    });
  }
  //#endregion internals
}
