// src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MEDIA_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'media',
          protoPath: join(__dirname, '../node_modules/protos/media_search_engine.proto'),
          url: 'localhost:5002', // URL del microservicio MediaService
        },
      },
    ]),
  ],
  controllers: [MediaController, AppController],
  providers: [MediaService, AppService],
})
export class AppModule {}
