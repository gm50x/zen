import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from './banks-datastore.schema';

@Module({})
export class BanksDatastoreModule {
  static forRoot() {
    return MongooseModule.forFeature([
      {
        name: Bank.name,
        schema: BankSchema,
      },
    ]);
  }
}
