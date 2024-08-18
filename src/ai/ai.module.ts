import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';
import * as grpc from '@grpc/grpc-js';
config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

@Module({
  imports: [ClientsModule.register([
    {
      name: 'AI_PACKAGE',
      transport: Transport.GRPC,
      options: {
        package: 'ai',
        protoPath: join(__dirname, '../../node_modules/protos/ai_service.proto'),
        url: AI_SERVICE_URL,
        credentials: grpc.credentials.createSsl(),  // Añadir soporte TLS para GCP, quitar para local
      },
    },
  ]),],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
