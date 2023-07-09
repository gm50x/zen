import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GetBankByIdModule,
  QueryBanksModule,
  SyncBanksModule,
} from '@core/application';
import { MongoConfig, TracingModule } from '@infra/config';
import {
  GedaiSubscriptionController,
  GetBankByIdController,
  QueryBanksController,
  ZenSubscriptionController,
} from '@infra/presentation/controllers';
import { AmqpModule } from '@infra/providers/amqp';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TracingModule.forRoot(),
    MongooseModule.forRootAsync({ useClass: MongoConfig }),
    AmqpModule.forRootAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (config: ConfigService) => ({ url: config.get('AMQP_URL') }),
    }),
    SyncBanksModule,
    QueryBanksModule,
    GetBankByIdModule,
  ],
  controllers: [
    GetBankByIdController,
    QueryBanksController,
    ZenSubscriptionController,
    GedaiSubscriptionController,
  ],
})
export class AppModule {}
