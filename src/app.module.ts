// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { UserMediaModule } from './user_media/user_media.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    AuthModule,
    MediaModule,
    UserMediaModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
