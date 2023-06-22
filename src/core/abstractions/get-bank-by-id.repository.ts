import { GetBankByIdInput, GetBankByIdOutput } from '@core/models';

export interface GetBankByIdRepository {
  getById(input: GetBankByIdInput): Promise<GetBankByIdOutput>;
}
export abstract class GetBankByIdRepository /* NOSONAR */
  implements GetBankByIdRepository {}
