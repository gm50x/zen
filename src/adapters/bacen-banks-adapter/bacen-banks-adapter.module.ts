import { Module } from '@nestjs/common';
import { BanksProvider } from '../../core/abstractions';
import { BacenBanksProviderModule } from '../../providers';
import { BacenBanksAdapter } from './bacen-banks.adapter';

@Module({
  imports: [BacenBanksProviderModule],
  providers: [
    BacenBanksAdapter,
    {
      provide: BanksProvider,
      useExisting: BacenBanksAdapter,
    },
  ],
  exports: [BanksProvider],
})
export class BacenBanksAdapterModule {}
