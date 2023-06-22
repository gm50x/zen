import { QueryBanksInput, QueryBanksOutput } from '@core/models';

export interface QueryBanksRepository {
  getMany(input: QueryBanksInput): Promise<QueryBanksOutput>;
}
export abstract class QueryBanksRepository /* NOSONAR */
  implements QueryBanksRepository {}
