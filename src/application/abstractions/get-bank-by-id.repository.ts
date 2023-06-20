import { GetBankByIdInput, GetBankByIdOutput } from '../models';

export interface GetBankByIdRepository {
  getById(input: GetBankByIdInput): Promise<GetBankByIdOutput>;
}
export abstract class GetBankByIdRepository /* NOSONAR */
  implements GetBankByIdRepository {}
