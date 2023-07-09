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

  @Subscribe('foo.*.bin', ZenConsumer)
  async fooSomeBin(
    @Payload() data: any,
    @Headers() headers: MessageHeaders,
    @AttemptCount() attemptCount: number,
  ) {
    this.logger.log('Got message', 'foo.*.bin');
    if (data.fail >= attemptCount) {
      this.logger.warn('Throwing message', 'foo.*.bin');

      throw new AmqpException(
        'Required fail greater than current attempt count',
      );
    }
    this.logger.log('Completed message', 'foo.*.bin');
  }

  /** THIS NEVER GETS SUBSCRIBED UNLESS IT'S PART OF ANOTHER CONSUMER, NOT YET REACTIVE */
  @Subscribe('#.bin', ZenConsumer)
  async allBin(
    @Payload() data: any,
    @Headers() headers: MessageHeaders,
    @AttemptCount() attemptCount: number,
  ) {
    this.logger.log('Got message', '#.bin');
    this.logger.log('Completed message', '#.bin');
  }

  @Subscribe('#.dead', ZenConsumer)
  async dead(
    @Payload() data: any,
    @Headers() headers: MessageHeaders,
    @AttemptCount() attemptCount: number,
  ) {
    this.logger.log('Got message', '#.dead');
    this.logger.log('Completed message', '#.dead');
  }
}
