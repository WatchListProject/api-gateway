import { Body, Controller, Get, Post, Query, UseGuards, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { MediaService } from './media/media.service';
import { SearchMovieByNameRequest, SearchMovieByNameResponse, SearchSerieByNameRequest, SearchSerieByNameResponse } from './media/media_search_engine.pb';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth/auth_service.pb';
import * as jwt from 'jsonwebtoken';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mediaService: MediaService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('movie_test')
  getTest(): string {
    return this.mediaService.getMovie();
  }

  @Get('search_movie')
  @UseGuards(AuthGuard)
  searchMovie(@Query('name') name: string, @Headers('authorization') authHeader: string): Observable<SearchMovieByNameResponse> {

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    // Acceder al expiration time (exp) y loguearlo
    if (decodedToken && decodedToken.exp) {
      const expirationTime = new Date(decodedToken.exp * 1000);
      console.log(`Token expiration time: ${expirationTime}`);
    }

    const request: SearchMovieByNameRequest = { name };
    return this.mediaService.searchMovieByName(request).pipe(
      catchError((error) => {
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error searching movie: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  @Get('search_serie')
  @UseGuards(AuthGuard)
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
        // Devuelve una respuesta HTTP adecuada
        throw new HttpException(`Error during login: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }

  @Post('register')
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
}
