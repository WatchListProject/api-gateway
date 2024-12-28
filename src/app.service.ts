import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';
import { GetUserMediaListResponse } from './user_media/user_media_service.pb';
import { MediaService } from './media/media.service';
import { UserMediaService } from './user_media/user_media.service';
import { AiService } from './ai/ai.service';
import { MediaRecommendationRequest } from './ai/ai_service.pb';

@Injectable()
export class AppService {
  constructor(
    private readonly userMediaService: UserMediaService,
    private readonly mediaService: MediaService,
    private readonly aiService: AiService,

  ) { }

  getUserMedia(authHeader: string): Observable<any> {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    return this.userMediaService.getUserMediaList({ email: decodedToken.email }).pipe(
      switchMap((response: GetUserMediaListResponse) => {
        const mediaDetailObservables = response.mediaList.map((media) => {
          return this.mediaService.getMediaById({ mediaId: media.mediaId, mediaType: media.mediaType }).pipe(
            catchError((error) => of({ error: `Error getting details for mediaId: ${media.mediaId}, mediaType: ${media.mediaType}: ${error.message}` }))
          );
        });

        return forkJoin(mediaDetailObservables).pipe(
          map((mediaDetails) => ({
            mediaList: response.mediaList,
            mediaDetails,
          }))
        );
      }),
      map(({ mediaList, mediaDetails }) => {
        return mediaDetails.map((details, index) => {
          const originalMedia = mediaList[index];
            const addedAtDate = new Date(originalMedia.addedAt);
      
            const formattedAddedAt = `${addedAtDate.getDate().toString().padStart(2, '0')}/${
              (addedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${
              addedAtDate.getFullYear()} ${
              addedAtDate.getHours().toString().padStart(2, '0')}:${
              addedAtDate.getMinutes().toString().padStart(2, '0')}`;
          if ('error' in details) {
            return {
              mediaId: originalMedia.mediaId,
              mediaType: originalMedia.mediaType,
              seen: originalMedia.seenStatus,
              addedAt: formattedAddedAt,
              error: details.error,
            };
          }

          return {
            mediaId: originalMedia.mediaId,
            mediaType: originalMedia.mediaType,
            seen: originalMedia.seenStatus,
            addedAt: formattedAddedAt,
            ...details.movie, 
            ...details.serie, 
          };
        });
      }),
      catchError((error) => {
        throw new HttpException(`Error getting user media: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  getRecommendations(authHeader: string): Observable<any> {
    return this.getUserMedia(authHeader).pipe(
      switchMap((userMedia) => {
        const mediaListForAI = userMedia.map((media) => ({
          title: media.title,
          mediaType: media.mediaType,
        }));
        return this.aiService.mediaRecommendation({ mediaList: mediaListForAI });
      }),
      catchError((error) => {
        throw new HttpException(
          `Error fetching user media: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }
  
  


}
