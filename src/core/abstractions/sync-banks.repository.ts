import { SyncBanksRepositoryInput } from '@core/models';
import { Transaction } from './transaction.manager';

export abstract class SyncBanksRepository /* NOSONAR */ {}
export interface SyncBanksRepository {
  createMany(
    data: SyncBanksRepositoryInput,
    transaction?: Transaction,
  ): Promise<void>;
  deleteAll(transaction?: Transaction): Promise<void>;
}
