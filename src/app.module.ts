import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MovieService } from './movie/movie.service';

@Module({
  imports: [MovieModule],
  controllers: [AppController],
  providers: [AppService, MovieService],
})
export class AppModule {}
