import { Module } from '@nestjs/common';
import { AdminOrderController } from './admin-order.controller';
import { AdminOrderService } from './admin-order.service';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [AdminOrderController],
  providers: [AdminOrderService]
})
export class AdminOrderModule { }
