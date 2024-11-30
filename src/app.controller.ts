import { Body, Controller, Get, Post, Query, UseGuards, HttpException, HttpStatus, Headers, Put, Patch, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { MediaService } from './media/media.service';
import { SearchMovieByNameRequest, SearchMovieByNameResponse, SearchSerieByNameRequest, SearchSerieByNameResponse } from './media/media_search_engine.pb';
import { catchError, map, Observable } from 'rxjs';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth/auth_service.pb';
import * as jwt from 'jsonwebtoken';
import { UserMediaService } from './user_media/user_media.service';
import { DeleteMediaFromUserResponse, GetUserMediaListResponse } from './user_media/user_media_service.pb';
import { status } from '@grpc/grpc-js';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';



function grpcToHttpException(grpcStatus: number): void {
  switch (grpcStatus) {
    case status.CANCELLED:
      throw new HttpException('Request was cancelled', HttpStatus.REQUEST_TIMEOUT);
    
    case status.UNKNOWN:
      throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);

    case status.INVALID_ARGUMENT:
      throw new HttpException('Invalid argument', HttpStatus.BAD_REQUEST);

    case status.DEADLINE_EXCEEDED:
      throw new HttpException('Deadline exceeded', HttpStatus.GATEWAY_TIMEOUT);

    case status.NOT_FOUND:
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);

    case status.ALREADY_EXISTS:
      throw new HttpException('Resource already exists', HttpStatus.CONFLICT);

    case status.PERMISSION_DENIED:
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);

    case status.RESOURCE_EXHAUSTED:
      throw new HttpException('Resource exhausted', HttpStatus.TOO_MANY_REQUESTS);

    case status.FAILED_PRECONDITION:
      throw new HttpException('Failed precondition', HttpStatus.PRECONDITION_FAILED);

    case status.ABORTED:
      throw new HttpException('Operation aborted', HttpStatus.CONFLICT);

    case status.OUT_OF_RANGE:
      throw new HttpException('Out of range', HttpStatus.BAD_REQUEST);

    case status.UNIMPLEMENTED:
      throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);

    case status.INTERNAL:
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);

    case status.UNAVAILABLE:
      throw new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE);

    case status.DATA_LOSS:
      throw new HttpException('Data loss', HttpStatus.INTERNAL_SERVER_ERROR);

    case status.UNAUTHENTICATED:
      throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED);

    default:
      throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


@ApiTags('app.controller')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mediaService: MediaService,
    private readonly authService: AuthService,
    private readonly userMediaService: UserMediaService,
  ) { }



  @Get("test")
  test(): string {
    return "test";
  }
 
  @Get('search_movie')
  @ApiQuery({ name: 'name', required: true, description: 'Name of the movie to search' })
  searchMovie(@Query('name') name: string): Observable<SearchMovieByNameResponse> {
    const request: SearchMovieByNameRequest = { name };
    return this.mediaService.searchMovieByName(request).pipe(
      catchError((error) => {
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error searching movie: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  @Get('search_serie')
  @ApiQuery({ name: 'name', required: true, description: 'Name of the series to search' })
  searchSeries(@Query('name') name: string): Observable<SearchSerieByNameResponse> {
    const request: SearchSerieByNameRequest = { name };
    return this.mediaService.searchSerieByName(request).pipe(
      catchError((error) => {
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error searching series: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { 
          type: 'string', 
          description: 'User email',
          example: 'Hello@gmail.com'
        },
        password: { 
          type: 'string', 
          description: 'User password',
          example: 'Hello',
        },
      },
      required: ['email', 'password'],
    },
  })
  login(@Body('email') email: string, @Body('password') password: string): Observable<LoginResponse> {
    const request: LoginRequest = { email, password };
    return this.authService.login(request).pipe(
      map((response: LoginResponse) => {
        if (!response.success) {
          throw new HttpException(response.message, HttpStatus.UNAUTHORIZED);
        }
        return response;
      }),
      catchError((error) => {
        if (error.code) {
          grpcToHttpException(error.code); // Lanza la excepción HTTP correspondiente
        }
        throw error; // Lanza la excepción original si no es un RpcException
      })
      
    );
  }

  @Post('register')
  @ApiBody({
    description: 'User registration',
    schema: {
      type: 'object',
      properties: {
        email: { 
          type: 'string', 
          description: 'User email',
          example: 'Hello@gmail.com'
        },
        password: { 
          type: 'string', 
          description: 'User password',
          example: 'Hello',
        },
        repeatedPassword: { 
          type: 'string', 
          description: 'Confirm user password',
          example: 'Hello', 
        },
      },
      required: ['email', 'password', 'repeatedPassword'],
    },
  })
  register(@Body('email') email: string, @Body('password') password: string, @Body('repeatedPassword') repeatedPassword: string): Observable<RegisterResponse> {
    const request: RegisterRequest = { email, password, repeatedPassword };
    return this.authService.register(request).pipe(
      map((response: RegisterResponse) => {
        if (!response.success) {
          throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
        }
        return response;
      }),
      catchError((error) => {
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error during registration: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }


  @Get('/user_media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  @ApiHeader({
    name: 'authorization',
    description: 'Put the token on the lock symbol',
    required: false,
    schema: {
      default: ' ', 
    },
  })
  getUserMedia(@Headers('authorization') authHeader: string): Observable<any> {
    return this.appService.getUserMedia(authHeader);
  }

  @Post('/user_media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  @ApiHeader({
    name: 'authorization',
    description: 'Put the token on the lock symbol',
    required: false,
    schema: {
      default: ' ', 
    },
  })
  @ApiBody({
    description: 'Add media to the user list',
    schema: {
      type: 'object',
      properties: {
        mediaId: { 
          type: 'string', 
          description: 'Media Id',
          example: '134134134'
        },
        mediaType: { 
          type: 'string', 
          description: 'Media type: "MOVIE" or "SERIE"',
          example: 'MOVIE',
        },
      },
      required: ['mediaId', 'mediaType'],
    },
  })
  addMediaToUser(@Headers('authorization') authHeader: string, @Body('mediaId') mediaId: string, @Body('mediaType') mediaType: string): Observable<any> {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    return this.userMediaService.addMediaToUser({ userId: decodedToken.userId, mediaId: mediaId, mediaType: mediaType }).pipe(
      catchError((error) => {
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error adding media to user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  @Patch('/user_media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  @ApiHeader({
    name: 'authorization',
    description: 'Put the token on the lock symbol',
    required: false,
    schema: {
      default: ' ', 
    },
  })
  @ApiBody({
    description: 'Set the seen status of one media from the user media list',
    schema: {
      type: 'object',
      properties: {
        mediaId: { 
          type: 'string', 
          description: 'Media Id',
          example: '134134134'
        },
        seenStatus: { 
          type: 'boolean', 
          description: 'Seen status: true or false',
          example: true
        },
      },
      required: ['mediaId', 'seenStatus'],
    },
  })
  setSeenStatus(@Headers('authorization') authHeader: string, @Body('mediaId') mediaId: string, @Body('seenStatus') seenStatus: boolean): Observable<DeleteMediaFromUserResponse> {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    return this.userMediaService.setSeenStatus({ userId: decodedToken.userId, mediaId: mediaId, seenStatus: seenStatus }).pipe(
      catchError((error) => {
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error setting media seen status: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  @Delete('/user_media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  @ApiHeader({
    name: 'authorization',
    description: 'Put the token on the lock symbol',
    required: false,
    schema: {
      default: ' ', 
    },
  })
  @ApiBody({
    description: 'Delete media from the user media list',
    schema: {
      type: 'object',
      properties: {
        mediaId: { 
          type: 'string', 
          description: 'Media Id',
          example: '134134134'
        },
      },
      required: ['mediaId'],
    },
  })
  deleteMediaFromUser(@Headers('authorization') authHeader: string, @Body('mediaId') mediaId: string): Observable<DeleteMediaFromUserResponse> {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    return this.userMediaService.deleteMediaFromUser({ userId: decodedToken.userId, mediaId: mediaId }).pipe(
      catchError((error) => {
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error deleting media: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  @Get('/user_media/recomendations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  @ApiHeader({
    name: 'authorization',
    description: 'Put the token on the lock symbol',
    required: false,
    schema: {
      default: ' ', 
    },
  })
  getRecommendations(@Headers('authorization') authHeader: string): Observable<any> {
    return this.appService.getRecommendations(authHeader);
  }

}
