import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

type Bank = {
  compe: string;
  ispb: string;
  shortName: string;
  longName: string;
};

@Injectable()
export class BacenBanksProviderService {
  constructor(private readonly http: HttpService) {}

  async getAllBanks(): Promise<Bank[]> {
    const [CRLF, LF] = ['\r\n', '\n'];
    return this.http.axiosRef
      .get<string>('pom/spb/estatistica/port/ParticipantesSTRport.csv')
      .then((res) => {
        const { data: rawCSV } = res;
        const mappedBanks = rawCSV
          .trim()
          .replace(new RegExp(CRLF, 'g'), LF)
          .split(LF)
          .slice(1)
          .map((x) => x.split(','))
          .map(([ispb, shortName, compe, , , longName]) => [
            ispb?.trim(),
            compe?.trim(),
            shortName?.trim(),
            longName?.trim(),
          ])
          .map(([ispb, compe, shortName, longName]) => ({
            ispb,
            compe,
            shortName,
            longName,
          }));

        return mappedBanks;
      });
  }
}
