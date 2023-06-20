import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bank, BankDocument } from '@zen/banks-datastore';
import { Model } from 'mongoose';
import {
  GetBankByIdRepository,
  QueryBanksRepository,
  SyncBanksRepository,
} from '../../application/abstractions';
import {
  GetBankByIdInput,
  GetBankByIdOutput,
  QueryBanksInput,
  QueryBanksOutput,
  SyncBanksRepositoryInput,
} from '../../application/models';

@Injectable()
export class BanksRepository
  implements GetBankByIdRepository, QueryBanksRepository, SyncBanksRepository
{
  constructor(
    @InjectModel(Bank.name) private readonly dataAccess: Model<BankDocument>,
  ) {}

  async createMany(data: SyncBanksRepositoryInput): Promise<void> {
    await this.dataAccess.create(data);
  }

  async deleteAll(): Promise<void> {
    await this.dataAccess.deleteMany().exec();
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
    return {
      id,
      name,
      compe: compe?.toUpperCase() === 'N/A' ? null : compe,
      ispb,
    };
  }
}
