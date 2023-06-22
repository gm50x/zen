import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BacenBanksProviderService } from './bacen-banks-provider.service';

@Module({
  imports: [HttpModule.register({ baseURL: 'https://www.bcb.gov.br' })],
  providers: [BacenBanksProviderService],
  exports: [BacenBanksProviderService],
})
export class BacenBanksProviderModule {}
