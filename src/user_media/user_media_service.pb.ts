// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.180.0
//   protoc               v3.20.3
// source: user_media_service.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface GetUserMediaListRequest {
  email: string;
}

export interface GetUserMediaListResponse {
  mediaList: Media[];
}

export interface AddMediaToUserRequest {
  email: string;
  mediaId: string;
  mediaType: string;
}

export interface AddMediaToUserResponse {
  success: boolean;
  message?: string | undefined;
}

export interface DeleteMediaFromUserRequest {
  email: string;
  mediaId: string;
}

export interface DeleteMediaFromUserResponse {
  success: boolean;
  message?: string | undefined;
}

export interface SetSeenStatusRequest {
  email: string;
  mediaId: string;
  seenStatus: boolean;
}

export interface SetSeenStatusResponse {
  success: boolean;
  message?: string | undefined;
}

export interface Media {
  mediaId: string;
  mediaType: string;
  seenStatus: boolean;
  addedAt: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserMediaServiceClient {
  getUserMediaList(request: GetUserMediaListRequest): Observable<GetUserMediaListResponse>;

  addMediaToUser(request: AddMediaToUserRequest): Observable<AddMediaToUserResponse>;

  deleteMediaFromUser(request: DeleteMediaFromUserRequest): Observable<DeleteMediaFromUserResponse>;

  setSeenStatus(request: SetSeenStatusRequest): Observable<SetSeenStatusResponse>;
}

export interface UserMediaServiceController {
  getUserMediaList(
    request: GetUserMediaListRequest,
  ): Promise<GetUserMediaListResponse> | Observable<GetUserMediaListResponse> | GetUserMediaListResponse;

  addMediaToUser(
    request: AddMediaToUserRequest,
  ): Promise<AddMediaToUserResponse> | Observable<AddMediaToUserResponse> | AddMediaToUserResponse;

  deleteMediaFromUser(
    request: DeleteMediaFromUserRequest,
  ): Promise<DeleteMediaFromUserResponse> | Observable<DeleteMediaFromUserResponse> | DeleteMediaFromUserResponse;

  setSeenStatus(
    request: SetSeenStatusRequest,
  ): Promise<SetSeenStatusResponse> | Observable<SetSeenStatusResponse> | SetSeenStatusResponse;
}

export function UserMediaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUserMediaList", "addMediaToUser", "deleteMediaFromUser", "setSeenStatus"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserMediaService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserMediaService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_MEDIA_SERVICE_NAME = "UserMediaService";
