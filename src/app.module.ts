import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './media/media.module';
import { MovieService } from './media/media.service';

@Module({
  imports: [MovieModule],
  controllers: [AppController],
  providers: [AppService, MovieService],
})
export class AppModule {}
