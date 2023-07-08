import { ZenConsumer } from '@infra/config';
import {
  AmqpException,
  AttemptCount,
  Headers,
  MessageHeaders,
  Subscribe,
} from '@infra/providers/amqp';
import { Controller, Logger, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ClsGuard } from 'nestjs-cls';

@Controller()
@UseGuards(ClsGuard)
export class ZenSubscriptionController {
  private readonly logger = new Logger(this.constructor.name);

  @Subscribe('foo.bar', ZenConsumer)
  async getById(
    @Payload() data: any,
    @Headers() headers: MessageHeaders,
    @AttemptCount() attemptCount: number,
  ) {
    if (data.fail >= attemptCount) {
      this.logger.log({ message: 'throwing', attemptCount });

      throw new AmqpException(
        'Required fail greater than current attempt count',
      );
    }

    this.logger.log({
      message: 'Completing message handling',
      data,
      attemptCount,
      headers,
    });
  }
}
