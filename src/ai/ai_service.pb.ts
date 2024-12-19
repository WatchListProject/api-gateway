// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.180.0
//   protoc               v3.20.3
// source: ai_service.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "ai";

export interface Media {
  title: string;
  mediaType: string;
}

export interface MediaRecommendationRequest {
  mediaList: Media[];
}

export interface MediaRecommendationResponse {
  recommendation: string;
  status: string;
}

export const AI_PACKAGE_NAME = "ai";

export interface AIServiceClient {
  mediaRecommendation(request: MediaRecommendationRequest): Observable<MediaRecommendationResponse>;
}

export interface AIServiceController {
  mediaRecommendation(
    request: MediaRecommendationRequest,
  ): Promise<MediaRecommendationResponse> | Observable<MediaRecommendationResponse> | MediaRecommendationResponse;
}

export function AIServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["mediaRecommendation"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AIService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AIService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AI_SERVICE_NAME = "AIService";
