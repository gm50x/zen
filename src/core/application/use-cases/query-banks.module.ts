import { Module } from '@nestjs/common';
import { BanksRepositoryModule } from '../../../adapters';
import { QueryBanks } from './query-banks.usecase';

@Module({
  imports: [BanksRepositoryModule],
  providers: [QueryBanks],
  exports: [QueryBanks],
})
export class QueryBanksModule {}
