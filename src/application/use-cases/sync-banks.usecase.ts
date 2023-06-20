import { Injectable, OnModuleInit } from '@nestjs/common';
import { BanksProvider, SyncBanksRepository, UseCase } from '../abstractions';
import { SyncBanksInput, SyncBanksOutput } from '../models';

@Injectable()
export class SyncBanks
  implements UseCase<SyncBanksInput, SyncBanksOutput>, OnModuleInit
{
  constructor(
    private readonly repository: SyncBanksRepository,
    private readonly banksProvider: BanksProvider,
  ) {}

  async onModuleInit() {
    await this.execute();
  }

  async execute(): Promise<SyncBanksOutput> {
    /**
     * TODO:
     * When we have a transaction running, we can perform both getAll and deleteAll in parallel, gaining performance. If any fails the transactions gets rolled back;
     */
    const banks = await this.banksProvider.getAll();
    /**
     * TODO:
     * add transaction to only commit if we are successful
     */
    await this.repository.deleteAll();
    await this.repository.createMany(banks);
  }
}
