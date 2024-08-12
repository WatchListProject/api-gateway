import { Test, TestingModule } from '@nestjs/testing';
import { UserMediaService } from './user_media.service';

describe('UserMediaService', () => {
  let service: UserMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMediaService],
    }).compile();

    service = module.get<UserMediaService>(UserMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
