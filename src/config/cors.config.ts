import { INestApplication, Logger } from '@nestjs/common';

export const configureCORS = (app: INestApplication) => {
  app.enableCors();
  Logger.log('CORS initialized', 'Config');
  return app;
};
