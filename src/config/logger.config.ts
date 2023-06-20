import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModule,
  WinstonModuleOptions,
  utilities as nestWinstonUtils,
} from 'nest-winston';
import { ClsService } from 'nestjs-cls';
import * as winston from 'winston';

let traceStorage: ClsService;

const { Console } = winston.transports;
const { combine, timestamp, json } = winston.format;
const { nestLike } = nestWinstonUtils.format;

const levels = {
  default: 'DEFAULT',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  verbose: 'VERBOSE',
} as const;

const severity = winston.format((info) => {
  const { level } = info;
  return Object.assign({}, info, { severity: levels[level] });
});

const trace = winston.format((info) => {
  const traceId = traceStorage.getId();
  return Object.assign({}, info, { traceId });
});

const remoteFormat = () => combine(timestamp(), severity(), trace(), json());
const localFormat = (appName: string) =>
  combine(timestamp(), severity(), trace(), nestLike(appName));

export const configureLogger = (app: INestApplication) => {
  const config = app.get(ConfigService);
  traceStorage = app.get(ClsService);
  const [env, appName] = [
    config.get('NODE_ENV', 'production'),
    config.get('APP_NAME', 'nest-app'),
  ];

  const useLocalFormat = env === 'development';

  const loggerConfig: WinstonModuleOptions = {
    levels: winston.config.npm.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: useLocalFormat ? localFormat(appName) : remoteFormat(),
    transports: [new Console()],
  };

  const logger = WinstonModule.createLogger(loggerConfig);
  app.useLogger(logger);
  Logger.log('Logger initialized', 'ConfigLogger');
  return app;
};
