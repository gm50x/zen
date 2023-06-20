import { INestApplication, Logger } from '@nestjs/common';
import helmet from 'helmet';

export const configureServerSecurity = (app: INestApplication) => {
  app.use(helmet());
  Logger.log('Server security initialized', 'Config');
  return app;
};
