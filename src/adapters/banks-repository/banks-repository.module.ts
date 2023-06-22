import { Module } from '@nestjs/common';
import {
  GetBankByIdRepository,
  QueryBanksRepository,
  SyncBanksRepository,
} from '../../core/abstractions';
import { BanksDatastoreModule } from '../../providers';
import { BanksRepository } from './banks.repository';

@Module({
  imports: [BanksDatastoreModule.forRoot()],
  providers: [
    BanksRepository,
    {
      provide: GetBankByIdRepository,
      useExisting: BanksRepository,
    },
    {
      provide: QueryBanksRepository,
      useExisting: BanksRepository,
    },
    {
      provide: SyncBanksRepository,
      useExisting: BanksRepository,
    },
  ],
  exports: [GetBankByIdRepository, QueryBanksRepository, SyncBanksRepository],
})
export class BanksRepositoryModule {}
