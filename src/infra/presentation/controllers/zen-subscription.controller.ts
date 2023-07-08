import { ZenConsumer } from '@infra/config';
import {
  AmqpException,
  AttemptCount,
  Headers,
  MessageHeaders,
  SubscribePattern,
} from '@infra/providers/amqp';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

@Controller()
export class ZenSubscriptionController {
  @SubscribePattern('foo.bar', ZenConsumer)
  async getById(
    @Payload() data: any,
    @Headers() headers: MessageHeaders,
    @AttemptCount() attemptCount: number,
  ) {
    if (data.fail > attemptCount) {
      console.log('throwing...', { attemptCount });
      throw new AmqpException(
        'Required fail greater than current attempt count',
      );
    }

    console.log('success', { data, attemptCount, headers });
  }
}
