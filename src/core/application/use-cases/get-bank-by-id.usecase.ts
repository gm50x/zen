import { Injectable } from '@nestjs/common';
import { Bank } from '../../../core/domain';
import { GetBankByIdRepository, UseCase } from '../abstractions';
import { GetBankByIdInput, GetBankByIdOutput } from '../models';

@Injectable()
export class GetBankById
  implements UseCase<GetBankByIdInput, GetBankByIdOutput>
{
  constructor(private readonly repository: GetBankByIdRepository) {}

  async execute(input: GetBankByIdInput): Promise<Bank> {
    return await this.repository.getById(input);
  }
}
