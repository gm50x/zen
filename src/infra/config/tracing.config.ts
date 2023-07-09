import { Message } from '@infra/providers/amqp';
import { randomUUID } from 'crypto';
import { ClsModule } from 'nestjs-cls';

export class TracingModule {
  static forRoot() {
    return ClsModule.forRoot({
      global: true,
      guard: {
        mount: true,
        generateId: true,
        idGenerator: (context) => {
          const contextType = context.getType();
          let traceId = randomUUID();
          switch (contextType) {
            case 'http':
              const request = context.switchToHttp().getRequest();
              traceId =
                request.headers['x-trace-id'] ||
                request.body?.attributes?.traceId ||
                traceId;
              return traceId;
            case 'rpc':
              /** @LIMITATION currently working with amqp only */
              /** @LIMITATION this will generate a single traceId for all handlers */
              const rawMessage = context.switchToRpc().getContext<Message>();
              traceId =
                rawMessage.properties.headers['x-trace-id'] || randomUUID();
              rawMessage.properties.headers['x-trace-id'] = traceId;

              return traceId;
          }
        },
      },
    });
  }
}
