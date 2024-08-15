import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'AI_PACKAGE',
      transport: Transport.GRPC,
      options: {
        package: 'ai',
        protoPath: join(__dirname, '../../node_modules/protos/ai_service.proto'),
        url: '0.0.0.0:5004',
      },
    },
  ]),],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
