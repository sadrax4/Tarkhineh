import { Test, TestingModule } from '@nestjs/testing';
import { RepresentationController } from './representation.controller';

describe('RepresentationController', () => {
  let controller: RepresentationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepresentationController],
    }).compile();

    controller = module.get<RepresentationController>(RepresentationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
