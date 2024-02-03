import { Test, TestingModule } from '@nestjs/testing';
import { AdminFoodController } from './admin-food.controller';

describe('AdminFoodController', () => {
  let controller: AdminFoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminFoodController],
    }).compile();

    controller = module.get<AdminFoodController>(AdminFoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
