import { Inject, Injectable } from '@nestjs/common';
import { AddMediaToUserRequest, AddMediaToUserResponse, DeleteMediaFromUserRequest, DeleteMediaFromUserResponse, GetUserMediaListRequest, GetUserMediaListResponse, SetSeenStatusRequest, SetSeenStatusResponse, UserMediaServiceClient, UserMediaServiceController } from './user_media_service.pb';
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

    deleteMediaFromUser(request: DeleteMediaFromUserRequest): Observable<DeleteMediaFromUserResponse> {
        return this.userMediaService.deleteMediaFromUser(request);
    }

    setSeenStatus(request: SetSeenStatusRequest): Observable<SetSeenStatusResponse> {
        return this.userMediaService.setSeenStatus(request);
    }
    
}
