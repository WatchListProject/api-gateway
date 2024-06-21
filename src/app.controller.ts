import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { MovieService } from './media/media.service';
import { Movie, SearchMovieByNameRequest } from './media/media_search_engine.pb';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly movieService: MovieService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('movie_test')
  getTest(): string {
    return this.movieService.getMovie();
  }

  @Get('search_movie_by_name/:movie_name')
  getMovie(@Param('movie_name') searchMovieByNameRequest: SearchMovieByNameRequest): Movie[] {
    return this.movieService.searchMovieByName(searchMovieByNameRequest);
  }

}
