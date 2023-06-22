import { Bank } from '@core/domain';

export interface BanksProvider {
  getAll(): Promise<Omit<Bank, 'id'>[]>;
}
export abstract class BanksProvider /* NOSONAR */ implements BanksProvider {}
