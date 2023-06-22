export interface Transaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface TransactionManager {
  createTransaction(): Promise<Transaction>;
}

export abstract class TransactionManager /*NOSONAR*/
  implements TransactionManager {}
