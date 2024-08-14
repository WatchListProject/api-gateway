import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ValidateRequest, ValidateResponse } from './auth_service.pb';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
  ) { }

  canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const validateRequest: ValidateRequest = { token: token }

    return this.authService.validate(validateRequest).pipe(
      map((response: ValidateResponse) => {
        if (response.valid) {
          return true;
        }
        throw new UnauthorizedException('Invalid token');
      }),
      catchError((error) => {
        throw new HttpException(`Error authentication: ${error.message}`, HttpStatus.UNAUTHORIZED);
      })
    );
  }
}
