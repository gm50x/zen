import { Injectable } from '@nestjs/common';
import { BanksProvider } from '../../../core/abstractions';
import { Bank } from '../../../core/domain';
import { BacenBanksProviderService } from '../../providers';

@Injectable()
export class BacenBanksAdapter implements BanksProvider {
  constructor(private readonly provider: BacenBanksProviderService) {}

  async getAll(): Promise<Omit<Bank, 'id'>[]> {
    const data = await this.provider.getAllBanks();
    return data.map(({ ispb, compe, shortName }) => ({
      ispb,
      compe,
      name: shortName,
    }));
  }
}
