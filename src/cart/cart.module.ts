import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserModule } from 'src/user/user.module';
import { FoodModule } from 'src/food/food.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UserModule,
    FoodModule,
    AuthModule
  ],
  providers: [
    CartService
  ],
  controllers: [
    CartController
  ]
})
export class CartModule { }
