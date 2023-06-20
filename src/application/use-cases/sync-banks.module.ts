import { Module } from '@nestjs/common';
import { BacenBanksAdapterModule, BanksRepositoryModule } from '../../adapters';
import { SyncBanks } from './sync-banks.usecase';

@Module({
  imports: [BacenBanksAdapterModule, BanksRepositoryModule],
  providers: [SyncBanks],
  exports: [SyncBanks],
})
export class SyncBanksModule {}
