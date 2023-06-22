import { Module } from '@nestjs/common';
import { TransactionManager } from '../../../core/abstractions';
import { MongooseTransactionManager } from './mongoose-transaction.manager';

@Module({
  providers: [
    {
      provide: TransactionManager,
      useClass: MongooseTransactionManager,
    },
  ],
  exports: [TransactionManager],
})
export class MongooseTransactionManagerModule {}
