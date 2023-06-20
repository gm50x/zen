import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureLogger } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true }).then(
    configureLogger,
  );

  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');

  await app.listen(port);
}
bootstrap();
