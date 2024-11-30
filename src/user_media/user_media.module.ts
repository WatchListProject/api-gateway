import { Module } from '@nestjs/common';
import { UserMediaService } from './user_media.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';
import * as grpc from '@grpc/grpc-js';
config();

const USER_MEDIA_SERVICE_URL = process.env.USER_MEDIA_SERVICE_URL;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../node_modules/protos/user_media_service.proto'),
          url: USER_MEDIA_SERVICE_URL,
           //credentials: grpc.credentials.createSsl(),  // Añadir soporte TLS para GCP, quitar para local
        },
      },
    ]),
  ],
  providers: [UserMediaService],
  exports: [UserMediaService],  
})
export class UserMediaModule { }
