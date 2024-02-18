import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrderController } from './admin-order.controller';

describe('AdminOrderController', () => {
  let controller: AdminOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOrderController],
    }).compile();

    controller = module.get<AdminOrderController>(AdminOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
