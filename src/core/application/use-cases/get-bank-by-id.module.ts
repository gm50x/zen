import { Module } from '@nestjs/common';
import { BanksRepositoryModule } from '../../../adapters';
import { GetBankById } from './get-bank-by-id.usecase';

@Module({
  imports: [BanksRepositoryModule],
  providers: [GetBankById],
  exports: [GetBankById],
})
export class GetBankByIdModule {}
