import { GedaiConsumer } from '@infra/config';
import {
  AttemptCount,
  Headers,
  MessageHeaders,
  Subscribe,
} from '@infra/providers/amqp';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

@Controller()
export class GedaiSubscriptionController {
  @Subscribe('foo.bar', GedaiConsumer)
  async getById(
    @Payload() data: any,
    @Headers() headers: MessageHeaders,
    @AttemptCount() attemptCount: number,
  ) {
    console.log('GEDAI', { data, attemptCount, headers });
  }
}
