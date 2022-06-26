import { Test, TestingModule } from '@nestjs/testing';
import { LinkedPrivateApiService } from '../linked-private-api.service';

describe('LinkedPrivateApiService', () => {
  let service: LinkedPrivateApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkedPrivateApiService],
    }).compile();

    service = module.get<LinkedPrivateApiService>(LinkedPrivateApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
