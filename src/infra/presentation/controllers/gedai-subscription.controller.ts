import { GedaiConsumer } from '@infra/config';
import {
  AttemptCount,
  Headers,
  MessageHeaders,
  Subscribe,
} from '@infra/providers/amqp';
import { Controller, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

@Controller()
export class GedaiSubscriptionController {
  private readonly logger = new Logger(this.constructor.name);

  @Subscribe('foo.bar.bin', GedaiConsumer)
  async getById(
    @Payload() data: any,
    @Headers() headers: MessageHeaders,
    @AttemptCount() attemptCount: number,
  ) {
    this.logger.log('GEDAI ON');
  }
}
