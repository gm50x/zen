import { Bank } from '../../../core/domain';

export type GetBankByIdInput = {
  id: string;
};

export type GetBankByIdOutput = Bank;
