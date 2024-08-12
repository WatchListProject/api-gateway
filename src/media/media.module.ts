import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MEDIA_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'media',
          protoPath: join(__dirname, '../../node_modules/protos/media_search_engine.proto'),
          url: '0.0.0.0:5002',
        },
      },
    ]),
  ],
  providers: [MediaService],
  controllers: [],
  exports: [MediaService], 
})
export class MediaModule {}
