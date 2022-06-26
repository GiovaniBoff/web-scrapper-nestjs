import { Test, TestingModule } from '@nestjs/testing';
import { LinkedPrivateApiController } from '../linked-private-api.controller';

describe('LinkedPrivateApiController', () => {
  let controller: LinkedPrivateApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkedPrivateApiController],
    }).compile();

    controller = module.get<LinkedPrivateApiController>(LinkedPrivateApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
