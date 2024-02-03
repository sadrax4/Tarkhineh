import { Test, TestingModule } from '@nestjs/testing';
import { AdminFoodService } from './admin-food.service';

describe('AdminFoodService', () => {
  let service: AdminFoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminFoodService],
    }).compile();

    service = module.get<AdminFoodService>(AdminFoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
