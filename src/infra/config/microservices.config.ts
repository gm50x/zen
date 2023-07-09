import { AmqpConnection, AmqpExchangeTransport } from '@infra/providers/amqp';
import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

export const ZenConsumer = Symbol.for('Zen');
const zenMicroserviceConfig = (
  connection: AmqpConnection,
): MicroserviceOptions => ({
  strategy: new AmqpExchangeTransport({
    consumerId: ZenConsumer,
    connection,
    exchange: {
      name: 'zen',
      bindToExchanges: [
        {
          name: 'zen.dlx',
          routingKey: '#.dead',
        },
      ],
    },
    retry: {
      maxInterval: 2500,
      interval: 2500,
      limit: 5,
    },
  }),
});

export const GedaiConsumer = Symbol.for('Gedai');
const gedaiMicroserviceConfig = (
  connection: AmqpConnection,
): MicroserviceOptions => ({
  strategy: new AmqpExchangeTransport({
    consumerId: GedaiConsumer,
    connection,
    exchange: {
      name: 'gedai',
      bindToExchanges: [
        {
          name: 'zen',
          routingKey: 'foo.#',
        },
      ],
    },
  }),
});

export const configureMicroservices = (app: INestApplication) => {
  Logger.log('Microservices initialized', 'Config');
  const connection = app.get(AmqpConnection);

  app.connectMicroservice<MicroserviceOptions>(
    zenMicroserviceConfig(connection),
  );

  app.connectMicroservice<MicroserviceOptions>(
    gedaiMicroserviceConfig(connection),
  );

  return app;
};
