import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MediaService } from './media/media.service';
import { SearchMovieByNameRequest, SearchMovieByNameResponse } from './media/media_search_engine.pb';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mediaService: MediaService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('movie_test')
  getTest(): string {
    return this.mediaService.getMovie();
  }

  @Get('search')
  searchMovie(@Query('name') name: string): Observable<SearchMovieByNameResponse> {
    const request: SearchMovieByNameRequest = { name };
    return this.mediaService.searchMovieByName(request);
  }

}
