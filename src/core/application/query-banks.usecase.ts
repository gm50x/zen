import { Injectable } from '@nestjs/common';
import { QueryBanksRepository } from '../abstractions';
import { QueryBanksInput, QueryBanksOutput } from '../models';
import { UseCase } from './usecase';

@Injectable()
export class QueryBanks implements UseCase<QueryBanksInput, QueryBanksOutput> {
  constructor(private readonly repository: QueryBanksRepository) {}

  async execute({ compe, ispb }: QueryBanksInput): Promise<QueryBanksOutput> {
    return await this.repository.getMany({ compe, ispb });
  }
}
