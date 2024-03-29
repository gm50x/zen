import { Transaction } from '@core/abstractions';
import { ClientSession } from 'mongoose';

export class MongooseTransaction implements Transaction {
  constructor(private readonly clientSession: ClientSession) {}

  get session() {
    return this.clientSession;
  }

  async commit(): Promise<void> {
    try {
      await this.clientSession.commitTransaction();
    } finally {
      await this.clientSession.endSession();
    }
  }

  async rollback(): Promise<void> {
    try {
      await this.clientSession.abortTransaction();
    } finally {
      await this.clientSession.endSession();
    }
  }
}
