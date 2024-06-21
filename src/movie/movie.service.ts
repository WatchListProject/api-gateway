import { Injectable } from '@nestjs/common';
import { Movie, SearchMovieByNameRequest } from './movie.pb';

@Injectable()
export class MovieService {
    searchMovieByName(searchMovieByNameRequest: SearchMovieByNameRequest): Movie[] {
      throw new Error('Method not implemented.');
    }


    getMovie(): string {
        return 'Movie service works';
    }

}
