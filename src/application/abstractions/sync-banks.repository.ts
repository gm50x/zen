import { SyncBanksRepositoryInput } from '../models';

export abstract class SyncBanksRepository /* NOSONAR */ {}
export interface SyncBanksRepository {
  createMany(data: SyncBanksRepositoryInput): Promise<void>;
  deleteAll(): Promise<void>;
}
