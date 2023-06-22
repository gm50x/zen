import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
  constructor(private readonly config: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.getOrThrow('MONGO_URL'),
      appName: this.config.getOrThrow('APP_NAME'),
    };
  }
}
