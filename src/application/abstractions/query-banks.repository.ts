import { QueryBanksInput, QueryBanksOutput } from '../models';

export interface QueryBanksRepository {
  getMany(input: QueryBanksInput): Promise<QueryBanksOutput>;
}
export abstract class QueryBanksRepository /* NOSONAR */
  implements QueryBanksRepository {}
