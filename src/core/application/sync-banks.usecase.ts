import { Injectable, OnModuleInit } from '@nestjs/common';

import {
  BanksProvider,
  SyncBanksRepository,
  TransactionManager,
} from '@core/abstractions';
import { SyncBanksInput, SyncBanksOutput } from '../models';
import { UseCase } from './usecase';

@Injectable()
export class SyncBanks
  implements UseCase<SyncBanksInput, SyncBanksOutput>, OnModuleInit
{
  constructor(
    private readonly repository: SyncBanksRepository,
    private readonly banksProvider: BanksProvider,
    private readonly transactionManager: TransactionManager,
  ) {}

  async onModuleInit() {
    await this.execute();
  }

  async execute(): Promise<SyncBanksOutput> {
    const transaction = await this.transactionManager.createTransaction();
    const banks = await this.banksProvider.getAll();
    try {
      await this.repository.deleteAll(transaction);
      await this.repository.createMany(banks, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  }
}
