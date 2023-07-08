import { Controller, Get, Logger, Param } from '@nestjs/common';

import { GetBankById } from '@core/application';

@Controller('banks/:id')
export class GetBankByIdController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly handler: GetBankById) {}
  @Get()
  async getById(@Param('id') id: string) {
    this.logger.log(`Fetching bank with id ${id}`);
    return await this.handler.execute({ id });
  }
}
