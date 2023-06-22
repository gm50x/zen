import { INestApplication, Logger } from '@nestjs/common';
import compression from 'compression';

export const configureCompression = (app: INestApplication) => {
  app.use(compression());
  Logger.log('Compression initialized', 'Config');
  return app;
};
