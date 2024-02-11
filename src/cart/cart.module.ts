import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule
  ],
  providers: [
    CartService
  ],
  controllers: [
    CartController
  ]
})
export class CartModule { }
