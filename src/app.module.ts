import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig, TracingModule } from './config';
import {
  GetBankByIdModule,
  QueryBanksModule,
  SyncBanksModule,
} from './core/application';
import {
  GetBankByIdController,
  QueryBanksController,
} from './presentation/controllers';

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
