// src/app.module.ts
import { Module } from '@nestjs/common';
import { MediaController } from './media/media.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    AuthModule,
    MediaModule
  ],
  controllers: [MediaController, AppController],
  providers: [AppService],
})
export class AppModule { }
