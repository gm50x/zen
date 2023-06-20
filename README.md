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

- [ ] Add description of the layers in this repository
- [ ] Add authentication
