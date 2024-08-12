import { Inject, Injectable } from '@nestjs/common';
import { AuthServiceClient, AuthServiceController, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ValidateRequest, ValidateResponse } from './auth_service.pb';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements AuthServiceController {
    private authService: AuthServiceClient;
    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>('AuthService');
    }

    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.authService.register(request);
    }
    login(request: LoginRequest): Observable<LoginResponse> {
        return this.authService.login(request);
    }
    validate(request: ValidateRequest): Observable<ValidateResponse>{
       return this.authService.validate(request);
    }
}
