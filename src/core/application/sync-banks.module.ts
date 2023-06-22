import { Module } from '@nestjs/common';
import {
  BacenBanksAdapterModule,
  BanksRepositoryModule,
  MongooseTransactionManagerModule,
} from '../../infra/adapters';
import { SyncBanks } from './sync-banks.usecase';

@Module({
  imports: [
    BacenBanksAdapterModule,
    BanksRepositoryModule,
    MongooseTransactionManagerModule,
  ],
  providers: [SyncBanks],
  exports: [SyncBanks],
})
export class SyncBanksModule {}
