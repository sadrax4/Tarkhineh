import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UserModule } from 'src/user/user.module';
import { OrderModule } from 'src/order/order.module';
import { AdminDiscountCodeModule } from 'src/admin';

@Module({
  imports: [
    UserModule,
    OrderModule,
    AdminDiscountCodeModule
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule { }
