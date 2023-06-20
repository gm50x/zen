import { Bank } from '../../domain/models/bank.model';

export type GetBankByIdInput = {
  id: string;
};

export type GetBankByIdOutput = Bank;
