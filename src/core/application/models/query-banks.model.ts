import { Bank } from '../../../core/domain';

export type QueryBanksInput = Partial<Pick<Bank, 'compe' | 'ispb'>>;
export type QueryBanksOutput = Bank[];
