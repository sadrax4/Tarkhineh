import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './db/order.schema';
import { OrderRepository } from './db/order.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema
      }
    ]),
    forwardRef(() => UserModule)
  ],
  providers: [
    OrderService,
    OrderRepository
  ],
  exports: [
    OrderService
  ]
})
export class OrderModule { }
