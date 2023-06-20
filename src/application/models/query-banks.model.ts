import { Bank } from '../../domain/models/bank.model';

export type QueryBanksInput = Partial<Pick<Bank, 'compe' | 'ispb'>>;
export type QueryBanksOutput = Bank[];
