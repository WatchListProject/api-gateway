// src/media/media.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { MediaSearchEngineClient, SearchMovieByNameRequest, SearchMovieByNameResponse, Movie } from './media_search_engine.pb';
import { Observable } from 'rxjs';

@Injectable()
export class MediaService {
  private mediaService: MediaSearchEngineClient;
  
  constructor(@Inject('MEDIA_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.mediaService = this.client.getService<MediaSearchEngineClient>('MediaSearchEngine');
  }

  searchMovieByName(request: SearchMovieByNameRequest): Observable<SearchMovieByNameResponse> {
    return this.mediaService.searchMovieByName(request);
  }

    getMovie(): string {
        return 'Media service works';
    }

}
