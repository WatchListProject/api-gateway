import { Injectable } from '@nestjs/common';
import { Movie, SearchMovieByNameRequest } from './media_search_engine.pb';

@Injectable()
export class MovieService {
    searchMovieByName(searchMovieByNameRequest: SearchMovieByNameRequest): Movie[] {
      throw new Error('Method not implemented.');
    }


    getMovie(): string {
        return 'Media service works';
    }

}
