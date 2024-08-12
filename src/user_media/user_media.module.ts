import { Module } from '@nestjs/common';
import { UserMediaService } from './user_media.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../node_modules/protos/user_media_service.proto'),
          url: '0.0.0.0:5003',
        },
      },
    ]),
  ],
  providers: [UserMediaService],
  exports: [UserMediaService],  
})
export class UserMediaModule { }
