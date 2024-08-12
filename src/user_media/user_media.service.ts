import { Inject, Injectable } from '@nestjs/common';
import { AddMediaToUserRequest, AddMediaToUserResponse, GetUserMediaListRequest, GetUserMediaListResponse, UserMediaServiceClient, UserMediaServiceController } from './user_media_service.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UserMediaService implements UserMediaServiceController {
    private userMediaService: UserMediaServiceClient;
    constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.userMediaService = this.client.getService<UserMediaServiceClient>('UserMediaService');
    }

    getUserMediaList(request: GetUserMediaListRequest): Observable<GetUserMediaListResponse> {
        return this.userMediaService.getUserMediaList(request);
    }
    addMediaToUser(request: AddMediaToUserRequest): Observable<AddMediaToUserResponse> {
        return this.userMediaService.addMediaToUser(request);
    }




}
