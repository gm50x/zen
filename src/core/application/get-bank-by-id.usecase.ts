import { Injectable } from '@nestjs/common';
import { GetBankByIdRepository } from '../abstractions';
import { Bank } from '../domain';
import { GetBankByIdInput, GetBankByIdOutput } from '../models';
import { UseCase } from './usecase';

@Injectable()
export class GetBankById
  implements UseCase<GetBankByIdInput, GetBankByIdOutput>
{
  constructor(private readonly repository: GetBankByIdRepository) {}

  async execute(input: GetBankByIdInput): Promise<Bank> {
    return await this.repository.getById(input);
  }
}
