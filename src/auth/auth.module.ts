import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../node_modules/protos/auth_service.proto'),
          url: '0.0.0.0:5001',
        },
      },
    ]),

  ],
  providers: [AuthService,AuthGuard],
  exports: [AuthService],
})
export class AuthModule { }
