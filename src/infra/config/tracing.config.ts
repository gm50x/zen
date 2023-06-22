import { randomUUID } from 'crypto';
import { Request } from 'express';
import { ClsModule } from 'nestjs-cls';

export class TracingModule {
  static forHTTP() {
    return ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) =>
          req.headers['x-trace-id'] ||
          req.body?.attributes?.traceId ||
          randomUUID(),
      },
    });
  }
}
