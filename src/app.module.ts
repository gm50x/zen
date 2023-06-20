import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig, TracingModule } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TracingModule.forHTTP(),
    MongooseModule.forRootAsync({ useClass: MongoConfig }),
  ],
})
export class AppModule {}
