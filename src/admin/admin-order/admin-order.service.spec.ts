import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrderService } from './admin-order.service';

describe('AdminOrderService', () => {
  let service: AdminOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOrderService],
    }).compile();

    service = module.get<AdminOrderService>(AdminOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
