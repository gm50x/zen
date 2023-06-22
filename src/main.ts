import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import {
  configureCORS,
  configureCompression,
  configureLogger,
  configureServerSecurity,
} from '@infra/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
    .then(configureLogger)
    .then(configureServerSecurity)
    .then(configureCompression)
    .then(configureCORS);

  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');

  await app.listen(port);
}
bootstrap();
