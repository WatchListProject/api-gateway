// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { UserMediaModule } from './user_media/user_media.module';

@Module({
  imports: [
    AuthModule,
    MediaModule,
    UserMediaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
