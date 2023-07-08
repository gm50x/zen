import { DynamicModule, Module } from '@nestjs/common';
import { AmqpConnection } from './amqp.connection';
import { AmqpModuleAsyncOptions, AmqpModuleOptions } from './amqp.models';
import { AmqpService } from './amqp.service';

@Module({})
export class AmqpModule {
  static forRoot(options: AmqpModuleOptions): DynamicModule {
    return {
      module: AmqpModule,
      providers: [
        { provide: 'AmqpExchangeOptions', useValue: { url: options.url } },
        AmqpConnection,
        AmqpService,
      ],
      exports: [AmqpConnection],
    };
  }

  static forRootAsync(options: AmqpModuleAsyncOptions): DynamicModule {
    const { imports, useFactory, inject } = options || {};

    return {
      module: AmqpModule,
      imports,
      providers: [
        { provide: 'AmqpExchangeOptions', inject, useFactory },
        AmqpConnection,
        AmqpService,
      ],
      exports: [AmqpConnection],
    };
  }
}
