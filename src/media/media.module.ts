import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';
import * as grpc from '@grpc/grpc-js';
config();

const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MEDIA_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'media',
          protoPath: join(__dirname, '../../node_modules/protos/media_search_engine.proto'),
          url: MEDIA_SERVICE_URL,
          credentials: grpc.credentials.createSsl(),  // Añadir soporte TLS para GCP, quitar para local
        },
      },
    ]),
  ],
  providers: [MediaService],
  controllers: [],
  exports: [MediaService], 
})
export class MediaModule {}
