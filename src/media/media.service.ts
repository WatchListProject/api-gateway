// src/media/media.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { MediaSearchEngineClient, SearchMovieByNameRequest, SearchMovieByNameResponse, Movie, SearchSerieByNameRequest, GetMediaByIdResponse, GetMediaByIdRequest, SearchSerieByNameResponse } from './media_search_engine.pb';
import { Observable } from 'rxjs';
import * as request from 'supertest';

@Injectable()
export class MediaService {
  private mediaService: MediaSearchEngineClient;
  constructor(@Inject('MEDIA_PACKAGE') private client: ClientGrpc) { }

  onModuleInit() {
    this.mediaService = this.client.getService<MediaSearchEngineClient>('MediaSearchEngine');
  }

  searchMovieByName(request: SearchMovieByNameRequest): Observable<SearchMovieByNameResponse> {
    return this.mediaService.searchMovieByName(request);
  }

  searchSerieByName(request: SearchSerieByNameRequest): Observable<SearchSerieByNameResponse> {
    return this.mediaService.searchSerieByName(request);
  }

  getMediaById(request: GetMediaByIdRequest): Observable<GetMediaByIdResponse>{
    return this.mediaService.getMediaById(request);
  }

  getMovie(): string {
    return 'Media service works';
  }

}
