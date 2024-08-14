import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';
import { GetUserMediaListResponse } from './user_media/user_media_service.pb';
import { MediaService } from './media/media.service';
import { UserMediaService } from './user_media/user_media.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userMediaService: UserMediaService,
    private readonly mediaService: MediaService,
  ) {}

  getUserMedia(authHeader: string): Observable<any> {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    return this.userMediaService.getUserMediaList({ userId: decodedToken.userId }).pipe(
      switchMap((response: GetUserMediaListResponse) => {
        // Itera sobre la lista de medios del usuario y realiza una llamada al servicio de medios para obtener detalles de cada medio
        const mediaDetailObservables = response.mediaList.map((media) => {
          return this.mediaService.getMediaById({ mediaId: media.mediaId, mediaType: media.mediaType }).pipe(
            // Si hay un error, devuelve un mensaje de error en lugar de los detalles del medio
            catchError((error) => of({ error: `Error getting details for mediaId: ${media.mediaId}, mediaType: ${media.mediaType}: ${error.message}` }))
          );
        });

        // Combina todas las observables en una única observable que emitirá un array de resultados cuando todas las llamadas estén completadas
        return forkJoin(mediaDetailObservables).pipe(
          map((mediaDetails) => ({
            mediaList: response.mediaList,
            mediaDetails,
          }))
        );
      }),
      // Itera sobre la lista de detalles de medios y los asocia con los medios originales en una estructura aplanada
      map(({ mediaList, mediaDetails }) => {
        return mediaDetails.map((details, index) => {
          const originalMedia = mediaList[index];

          // Verifica si el resultado contiene un error
          if ('error' in details) {
            return {
              mediaId: originalMedia.mediaId,
              mediaType: originalMedia.mediaType,
              seen: originalMedia.seenStatus,
              error: details.error,
            };
          }

          // Combina los detalles de la película o serie con los datos originales
          return {
            mediaId: originalMedia.mediaId,
            mediaType: originalMedia.mediaType,
            seen: originalMedia.seenStatus,
            ...details.movie, // Agrega los detalles si es una película
            ...details.serie, // Agrega los detalles si es una serie
          };
        });
      }),
      // Controla cualquier error general que pueda ocurrir en todo el proceso
      catchError((error) => {
        throw new HttpException(`Error getting user media: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }
}
