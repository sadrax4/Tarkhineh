import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FoodModule } from './food/food.module';
import { CommentModule } from './comment/comment.module';
import { StorageModule } from './storage/storage.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AdminCommentModule, AdminOrderModule, AdminDiscountCodeModule, AdminFoodModule, AdminPermissionModule, AdminUserModule } from './admin';
import { RepresentationModule } from './representation/representation.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ProfileModule,
    StorageModule,
    FoodModule,
    CommentModule,
    AdminFoodModule,
    AdminUserModule,
    AdminCommentModule,
    AdminPermissionModule,
    PaymentModule,
    CartModule,
    OrderModule,
    AdminDiscountCodeModule,
    AdminOrderModule,
    RepresentationModule,
    HomeModule
  ]
})
export class AppModule { }
