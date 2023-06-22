import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  GetBankByIdRepository,
  QueryBanksRepository,
  SyncBanksRepository,
  Transaction,
} from '@core/abstractions';
import { Bank as BankModel } from '@core/domain';
import {
  GetBankByIdInput,
  GetBankByIdOutput,
  QueryBanksInput,
  QueryBanksOutput,
  SyncBanksRepositoryInput,
} from '@core/models';
import { MongooseTransaction } from '@infra/adapters';
import { Bank, BankDocument } from '@infra/providers';

@Injectable()
export class BanksRepository
  implements GetBankByIdRepository, QueryBanksRepository, SyncBanksRepository
{
  constructor(
    @InjectModel(Bank.name) private readonly dataAccess: Model<BankDocument>,
  ) {}

  private assertMongooseTransaction(
    transaction: Transaction,
  ): asserts transaction is MongooseTransaction {
    if (transaction.constructor.name !== MongooseTransaction.name) {
      throw new Error(
        'InvalidArguments: Provided Transaction is not a valid MongooseTransaction',
      );
    }
  }

  private getSessionFromTransaction(transaction: Transaction) {
    if (!transaction) {
      return;
    }

    this.assertMongooseTransaction(transaction);
    return transaction.session;
  }

  async createMany(
    data: SyncBanksRepositoryInput,
    transaction?: Transaction,
  ): Promise<void> {
    const session = this.getSessionFromTransaction(transaction);
    await this.dataAccess.create(data, { session });
  }

  async deleteAll(transaction?: Transaction): Promise<void> {
    const session = this.getSessionFromTransaction(transaction);
    await this.dataAccess.deleteMany(null, { session }).exec();
  }

  async getById(input: GetBankByIdInput): Promise<GetBankByIdOutput> {
    const data = await this.dataAccess.findById(input.id).exec();
    if (!data) {
      return;
    }

    return this.map(data);
  }

  async getMany({ compe, ispb }: QueryBanksInput): Promise<QueryBanksOutput> {
    const query: Record<string, any> = {};

    if (compe && ispb) {
      query.$or = [{ compe }, { ispb }];
    } else if (compe) {
      query.compe = compe;
    } else if (ispb) {
      query.ispb = ispb;
    }

    const data = await this.dataAccess.find(query).exec();
    return data.map(this.map);
  }

  private map({ id, name, compe, ispb }: BankDocument) {
    return new BankModel(id, name, compe, ispb);
  }
}
