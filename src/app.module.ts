import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TracingModule } from './config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TracingModule.forHTTP()],
})
export class AppModule {}
