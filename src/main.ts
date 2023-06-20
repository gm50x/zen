import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  configureCORS,
  configureLogger,
  configureServerSecurity,
} from './config';
import { configureCompression } from './config/compression.config';

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
