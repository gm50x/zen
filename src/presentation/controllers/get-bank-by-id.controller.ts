import { Controller, Get, Param } from '@nestjs/common';
import { GetBankById } from '../../application/use-cases';

@Controller('banks/:id')
export class GetBankByIdController {
  constructor(private readonly handler: GetBankById) {}
  @Get()
  async getById(@Param('id') id: string) {
    return await this.handler.execute({ id });
  }
}
