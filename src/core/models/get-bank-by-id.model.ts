import { Bank } from '../domain';

export type GetBankByIdInput = {
  id: string;
};

export type GetBankByIdOutput = Bank;
