import { Module } from '@nestjs/common';
import {
  BacenBanksAdapterModule,
  BanksRepositoryModule,
  MongooseTransactionManagerModule,
} from '../../adapters';
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
