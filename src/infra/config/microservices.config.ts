import { AmqpConnection, AmqpExchangeTransport } from '@infra/providers/amqp';
import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

const zenMicroserviceConfig = (
  connection: AmqpConnection,
): MicroserviceOptions => ({
  strategy: new AmqpExchangeTransport({
    connection,
    exchange: {
      name: 'zen',
      type: 'topic',
    },
    retry: {
      maxInterval: 5000,
      interval: 5000,
      limit: 5,
    },
  }),
});

export const configureMicroservices = (app: INestApplication) => {
  Logger.log('Microservices initialized', 'Config');
  const connection = app.get(AmqpConnection);

  app.connectMicroservice<MicroserviceOptions>(
    zenMicroserviceConfig(connection),
  );

  return app;
};
