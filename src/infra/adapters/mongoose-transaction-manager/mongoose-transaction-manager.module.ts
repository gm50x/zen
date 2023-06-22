import { TransactionManager } from '@core/abstractions';
import { Module } from '@nestjs/common';
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
