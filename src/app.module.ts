import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GetBankByIdModule,
  QueryBanksModule,
  SyncBanksModule,
} from './core/application';
import { MongoConfig, TracingModule } from './infra/config';
import {
  GetBankByIdController,
  QueryBanksController,
} from './infra/presentation/controllers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TracingModule.forHTTP(),
    MongooseModule.forRootAsync({ useClass: MongoConfig }),
    SyncBanksModule,
    QueryBanksModule,
    GetBankByIdModule,
  ],
  controllers: [GetBankByIdController, QueryBanksController],
})
export class AppModule {}
