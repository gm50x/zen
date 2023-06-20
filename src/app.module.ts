import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TracingModule } from './config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TracingModule.forHTTP()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
