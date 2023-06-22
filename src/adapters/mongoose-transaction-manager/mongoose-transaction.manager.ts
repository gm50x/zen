import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  Transaction,
  TransactionManager,
} from '../../application/abstractions';
import { MongooseTransaction } from './models';

@Injectable()
export class MongooseTransactionManager implements TransactionManager {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  async createTransaction(): Promise<Transaction> {
    const session = await this.conn.startSession();
    session.startTransaction();

    return new MongooseTransaction(session);
  }
}
