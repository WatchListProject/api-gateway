import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthGuard } from './auth.guard';
import * as grpc from '@grpc/grpc-js';
import { config } from 'dotenv';
config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../node_modules/protos/auth_service.proto'),
          url: AUTH_SERVICE_URL,
          // credentials: grpc.credentials.createSsl(),  // Añadir soporte TLS para GCP, quitar para local
        },
      },
    ]),
  ],
  providers: [AuthService,AuthGuard],
  exports: [AuthService],
})
export class AuthModule { }
