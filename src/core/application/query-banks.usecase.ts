import { Injectable } from '@nestjs/common';

import { QueryBanksRepository } from '@core/abstractions';
import { QueryBanksInput, QueryBanksOutput } from '@core/models';
import { UseCase } from './usecase';

@Injectable()
export class QueryBanks implements UseCase<QueryBanksInput, QueryBanksOutput> {
  constructor(private readonly repository: QueryBanksRepository) {}

  async execute({ compe, ispb }: QueryBanksInput): Promise<QueryBanksOutput> {
    return await this.repository.getMany({ compe, ispb });
  }
}
