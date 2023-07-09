# @gedai/nestjs-amqp

# Description

The AMQP Exchanges module for NestJS is a powerful tool that enhances your application's messaging capabilities using the AMQP (Advanced Message Queuing Protocol) protocol. It is built on top of the [amqp-connection-manager](https://github.com/benbria/node-amqp-connection-manager) library, which ensures high resiliency and robustness in handling server connections.

This module provides a range of features to streamline your messaging workflows. One of its key functionalities is the ability to automatically retry failed messages. Whenever a message fails to be processed, the module will handle the retry logic, ensuring that the message is reprocessed without manual intervention.

Additionally, the module enables you to introduce delays between retrials of failed messages. This feature is particularly useful when dealing with transient errors or situations where a delay is required before retrying message processing.

Another essential feature offered by the AMQP Exchanges module is dead lettering. Messages that have repeatedly failed to be processed can be automatically sent to a dead letter exchange, allowing you to isolate and analyze problematic messages separately.

With this module, you can also establish multiple bindings per consumer. This means that a single consumer can receive messages from multiple exchanges, simplifying the process of managing and organizing message routing within your application. It also supports consuming the same message from multiple handlers withing the application enhancing flexibilty of your messaging system.

Overall, the AMQP Exchanges module for NestJS empowers your application with advanced messaging capabilities, you can efficiently handle and process messages within your NestJS application.

# Before we start

A few guidelines should be considered.

In RabbitMQ you can route your messages using the multiword(`#`) or the singleword(`*`) wildcards. For example, a message with a routing key of `foo.bar.bin` will be routed to a handler registered with `foo.*.bin`, as well as a handler registered with `#.bin`. A few matching examples should help understanding the routing capabilities:

| Message Routing Key | Registered Handler | Description          |
| ------------------- | ------------------ | -------------------- |
| `foo.bar.bin.baz`   | `foo.bar.bin.baz`  | Direct binding       |
| `foo.bar.bin.baz`   | `*.bar.bin.baz`    | Single word wildcard |
| `foo.bar.bin.baz`   | `foo.*.*.baz`      | Single word wildcard |
| `foo.bar.bin.baz`   | `foo.#.baz`        | Multi word wildcard  |
| `foo.bar.bin.baz`   | `#.bin.baz`        | Multi word wildcard  |
| `foo.bar.bin.baz`   | `#.baz`            | Multi word wildcard  |
| `foo.bar.bin.baz`   | `#`                | Anything wildcard    |

# Getting Started

## Install the required packages

```bash
npm install @gedai/nestjs-amqp amqplib amqp-connection-manager
```

## Common setup

```typescript
// Create a controller to subscribe to messages
@Controller()
export class MySubscriptionController {
  @Subscribe('foo.bar.bin') // we can provide the consumerId here to allow multiple consumer in a single app
  async myHandler(
    @Payload() payload: any // the parsed message data, with Nest's default decorator
    @Headers() headers: any // these are not Nest's @Headers decorators, it's the one exposed from the package
    @AttemptCount() count: number // current attempt count, starts at 1
  ) {
    // do magic 😎
  }
}

// Bind the controller to your appplications's modules
@Module({
  imports: [],
  providers: [],
  controllers: [MySubscriptionController],
})
export class AppModule {}

```

## Hybrid application setup

```typescript
// import AmqpModule in your application's modules
@Module({
  imports: [
    AmqpModule.forRoot({
      url: 'amqp://rabbit:rabbit@localhost:5672',
      // you can also provide more async configuration with forRootAsync and useFactory.
      isGlobal: true,
    }),
  ],
  providers: [],
  controllers: [MySubscriptionController],
})
export class AppModule {}

// in your main file
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // to reuse the same connection we can provide it here
  const connection = app.get(AmqpConnection);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new AmqpExchangeTransport({
      connection,
      exchange: { name: 'gedai' },
      retry: {
        maxInterval: 10000,
        interval: 2500,
        limit: 5,
      },
    }),
  });

  await app.listen(3000);
  await app.startAllMicroservices();
}
```

## Microservice application setup

```typescript
// in your main file
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new AmqpExchangeTransport({
        url: 'amqp://rabbit:rabbit@localhost:5672',
        exchange: { name: 'gedai' },
        retry: {
          maxInterval: 10000,
          interval: 2500,
          limit: 5,
        },
      }),
    },
  );

  await app.listen();
}
```

# Decorators

This package provides the `@Subscribe` decorator to be used within your controllers. It's just an alias to Nest's default `@MessagePattern` decorator. We do this just to simplify understanding how to provide the routing keys and bind to specific consumers.

We also provide extra utilities decorators that are built on top of Nest's default createParamDecorator. Here's a list of the most used decorators:

- `@Subscribe('foo.bar')` binds the handler with messages that have the `foo.bar` routing key
- `@Subscribe('foo.bar', Symbol.for('Consumer1'))` binds the handler with messages that have the `foo.bar` on a specific consumer
- `@Headers()` injects the entire message headers into the param object
- `@Headers('only-one')` injects the `only-one` message header into the param object
- `@AttemptCount()` injects the current attempt count of the message into the param object, it starts at 1.

# Configurations

## Retrial Configurations

You may have noticed that we are using some customized retry configuration in our consumers. That is an optional configuration you can provide in order to fine tune the consumption and retrial of events to your needs. First, consider that a maximum retrial of 5 means that your handler will execute at most 6 times, not 5. That is because we don't consider the first attempt as a retrial, but rather the expected first attempt. Then, if your message fails, we try again for a maximum of the configured retrial number.

Interval between retrials is the number of millis to wait, this interval gets doubled with every attempt to the maximum of the configured maxInterval. If none is provided, we'll keep doubling indefinitely.

## Consuming other exchanges

In order to consume another exchange we can bind the exchange as follows:

```typescript
app.connectMicroservice<MicroserviceOptions>({
  strategy: new AmqpExchangeTransport({
    connection,
    exchange: {
      name: 'zen',
      //here
      bindToExchanges: [
        {
          name: 'zen.dlx',
          routingKey: '#.dead',
        },
      ],
    },
    retry: {
      maxInterval: 2500,
      interval: 2500,
      limit: 5,
    },
  }),
});
```

By doing this, we receive whatever gets published into that exchange following the routing key in the service exchange. We can do this to bind to any existing exchange, in this example we have bound to the dead letter exchange `.dlx`, but it would work with any other exchange.

## How to use multiple consumers in the same app

That might be tricky, but you can connect as many consumers as your have resources to handle. We recomend that you create an object that will control your subscriptions ids in your app and provide it to each consumer when instantiating the transport. For example:

```typescript
// Somewhere in your app
export const Consumers = {
  ZenConsumer: Symbol.for('Zen'),
  GedaiConsumer: Symbol.for('Gedai'),
};

// in main
app.connectMicroservice<MicroserviceOptions>({
  strategy: new AmqpExchangeTransport({
    consumerId: Consumers.ZenConsumer, // here
    connection,
    exchange: {
      name: 'zen',
    },
    retry: {
      maxInterval: 2500,
      interval: 2500,
      limit: 5,
    },
  }),
});

app.connectMicroservice<MicroserviceOptions>({
  strategy: new AmqpExchangeTransport({
    consumerId: Consumers.GedaiConsumer, // and here
    connection,
    exchange: {
      name: 'zen',
    },
    retry: {
      maxInterval: 2500,
      interval: 2500,
      limit: 5,
    },
  }),
});

// in controllers you specify to which consumer you are binding the events
@Controller()
export class MySubscriptionController {
  @Subscribe('foo.bar.bin', Consumers.ZenConsumer) // here
  async myHandler() {
    // do magic 😎
  }

  @Subscribe('bazinga.foo.bar', Consumers.GedaiConsumer) // and here
  async myOtherHandler() {
    // do magic 😎
  }
}
```

This setup allows you to configure multiple consumers in a hybrid application and bind to events independently from each other. You might event have similar routing keys, but they will only get triggered when a message comes to that specific consumer (which means, falling in its conrolling exchange).

# Behind the Scenes (inside RabbitMQ Server)

Behind the scenes we are creating two exchanges for our consumers to work with. The first one, is the actual consumer's exchange and will have the same name you provide in the exchange parameter. It will bind to two queues, the `main` and the `retry` which are sufixes to the exchange name.

For example, `zen` exchange produces two queues `zen.main` and `zen.retry`.

Any message that fails our consumer (eg.`throws`) will get sent to the retry queue with an expiration period, when that expiration period expires, the message dies and gets requeued into the exchange which resends the message to the main queue for retrial. When all attempts fail, we send that message to the dead letter exchange, which again is a sufix to the original exchange's name. In our example, `zen` gets the `zen.dlx` exchange that has no bindings unless you decide to do so.

So, with the following setup:

```typescript
// consumer config
app.connectMicroservice<MicroserviceOptions>({
  strategy: new AmqpExchangeTransport({
    consumerId: Consumers.GedaiConsumer, // and here
    connection,
    exchange: {
      name: 'zen',
    },
  }),
});

// controller config
class Controller {
  @Subscribe('foo.bar')
  async myHandler() {
    // do magic 😎
  }
}
```

You get the following RabbitMQ artifacts:

- Exchanges:
- - zen
- - zen.dlx
- Queues:
- - zen.main
- - zen.retry
- Bindings:
- - exchange(zen) => routingKey(zen.main) => queue(zen.main) [used for rerouting retrials]
- - exchange(zen) => routingKey(zen.retry) => queue(zen.retry) [used for waiting between retrials]
- - exchange(zen) => routingKey(foo.\*) => queue(zen.main) [used for actually binding messages]
