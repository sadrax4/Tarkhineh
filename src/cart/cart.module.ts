import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserModule } from 'src/user/user.module';
import { FoodModule } from 'src/food/food.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminDiscountCodeModule } from 'src/admin/admin-discount-code/admin-discount-code.module';

@Module({
  imports: [
    UserModule,
    FoodModule,
    AuthModule,
    AdminDiscountCodeModule
  ],
  providers: [
    CartService
  ],
  controllers: [
    CartController
  ]
})
export class CartModule { }
