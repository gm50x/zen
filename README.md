<div style="display:flex; justify-content: space-between; margin: 0 5em">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="http://docker.com" target="blank"><img src="https://blog.knoldus.com/wp-content/uploads/2018/04/docker.png" width="200" alt="Docker Logo" /></a>
  <a href="http://mongodb.com" target="blank"><img src="https://www.pngall.com/wp-content/uploads/13/Mongodb-PNG-Image-HD.png" width="200" alt="Mongo Logo" /></a>
</div>

## Description

Clean Architecture Example

This repository tries to apply concepts from Clean Architecture in NestJS.

## Tools:

- [Nest](https://nestjs.com) is the framework used to tie everything together.
- [Docker](https://docker.com) is the runtime for for local development.
- [MongoDB](https://www.mongodb.com) is the database provider for the environment.

## Running the app

```bash
# Create an environment file
$ cp .env.template .env

# Start the applications (database and app)
$ docker compose up -d

# Inspect logs
$ docker logs -f zen-banks-api

# Cleanup
$ docker compose down -v

```

## TODOs:

- [ ] Abstract away the usage of transactions
- [ ] Add logging
- [ ] Add authentication
- [ ] Add unit tests
- [ ] Add e2e tests

# Layers:

## Domain

This layer contains application entities, which represent business rules in their most natural and atomic form. They don't know anything about the external world, not even about the use cases where they are applied. These models don't do any external communication or work, but they signal whatever might be done to the use case layer. This layer also contains errors, aka domain errors.

## Application - Use Case, Orchestration Layer

Together with the domain, these are the core of our application. This layer orchestrations everything that happens in the application and is not allowed to reference the external world.

In this layer we have the actual use case handlers, which are orchestrators. We also have use case specific models and abstractions which are essential to prevent this layer from knowing anything external. In order for anything from the external world to be used in the Use Case, they need to implement the contracts existing in abstractions which will be swapped via Dependnecy Injection in runtime.

## Adapters - Anti Corruption Layer

This layer provides two central units of work to our use cases. They are the **repositories**, which provide strucutred and semi-strucutred data acess to the use cases and **services** which provide any other form of abstraction to the use cases. These can only be exposed in the use cases through the implementation of an abstraction from the Application Layer.

## Presentation

This is where the framework lives. Entrypoints and any raw validators exist within this layer. Some of its artifacts are Controllers, Resolvers, Validators, Guards, Interceptors and Models. It's the layers that exposes your application to the outside world or trigger whatever it is that our service does.

## Providers

These are IO drivers, they are the very first layer of defence between our system and the outside world. A provider can be an http client, an external service client or a database model mapping for data access. They stand in front of your system and the world and will be adapted in the adapter layer in order to be used within the use cases.

## Config

Central to the service itself, these provide any sort of configuration that's needed. It's **no man's land**, everything is allowed here.
