import { Test, TestingModule } from '@nestjs/testing';
import { RepresentationService } from './representation.service';

describe('RepresentationService', () => {
  let service: RepresentationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepresentationService],
    }).compile();

    service = module.get<RepresentationService>(RepresentationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
