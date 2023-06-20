import { Bank } from '../../domain/models/bank.model';

export type SyncBanksInput = void /* NOSONAR */;
export type SyncBanksOutput = void; /* NOSONAR */

export type SyncBanksRepositoryInput = Omit<Bank, 'id'>[];
export type SyncBanksRepositoryOutput = void; /* NOSONAR */
