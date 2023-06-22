import { Module } from '@nestjs/common';
import { BacenBanksAdapterModule, BanksRepositoryModule } from '../../adapters';
import { MongooseTransactionManagerModule } from '../../adapters/mongoose-transaction-manager';
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
