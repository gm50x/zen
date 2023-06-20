import { Controller, Get, Query } from '@nestjs/common';
import { QueryBanks } from '../../application/use-cases';

@Controller('banks')
export class QueryBanksController {
  constructor(private readonly handler: QueryBanks) {}

  @Get()
  getById(
    @Query('compe') compe?: string,
    @Query('ispb') ispb?: string,
  ): Promise<any> {
    return this.handler.execute({ compe, ispb });
  }
}
