import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import {
  configureCORS,
  configureCompression,
  configureLogger,
  configureMicroservices,
  configureServerSecurity,
} from '@infra/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
    .then(configureLogger)
    .then(configureServerSecurity)
    .then(configureCompression)
    .then(configureCORS)
    .then(configureMicroservices);

  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');

  await app.listen(port);
  await app.startAllMicroservices();
  Logger.log('🚀 Application is running', 'Startup');
}
bootstrap();
