import { Inject, Injectable } from '@nestjs/common';
import { AIServiceClient, AIServiceController, MediaRecommendationRequest, MediaRecommendationResponse } from './ai_service.pb';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AiService implements AIServiceController {
    private aiService: AIServiceClient;
    constructor(@Inject('AI_PACKAGE') private client: ClientGrpc) { }
    mediaRecommendation(request: MediaRecommendationRequest): Observable<MediaRecommendationResponse> {
        console.log(request);
        return this.aiService.mediaRecommendation(request);
    }

    onModuleInit() {
        this.aiService = this.client.getService<AIServiceClient>('AIService');
    }
}
