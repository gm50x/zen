import { ModuleMetadata } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ConsumeMessage } from 'amqplib';
import { AmqpConnection } from './amqp.connection';

/** TODO: we should receive an options asserts object with queues and exchnges to assert during startup */
export type AmqpConnectionOptions = {
  url: string;
};

export type AmqpModuleOptions /* NOSONAR */ = AmqpConnectionOptions;

export interface AmqpModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => AmqpConnectionOptions;
}

export type AmqpExchangeType = 'direct' | 'topic';

export class AmqpExchange {
  constructor(readonly name: string, readonly type: AmqpExchangeType) {}

  get main() {
    return `${this.name}.main`;
  }

  get retry() {
    return `${this.name}.retry`;
  }

  get dead() {
    return `${this.name}.dead`;
  }
}

export type AmqpExchangeOption = {
  name: string;
  type: AmqpExchangeType;
};

export type AmqpRetryOptions = {
  limit: number;
  interval: number;
  maxInterval?: number;
};

export type AmqpExchangeTransportOptions = {
  url?: string;
  connection?: AmqpConnection;
  consumerId?: symbol;
  exchange: AmqpExchangeOption;
  retry: AmqpRetryOptions;
};

export type Message = ConsumeMessage;
export type MessageHeaders = Record<string, any>;

export const ControlHeaders = {
  AttemptCount: 'x-attempt-count',
  OriginalRoutingKey: 'x-original-routing-key',
  DeadReason: 'x-dead-reason',
} as const;

export type MessageOptions = {
  headers?: Record<string, any>;
  expiration?: number;
};

export class AmqpException extends RpcException {}
