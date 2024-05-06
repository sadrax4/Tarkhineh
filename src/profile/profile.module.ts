import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/db/user.schema';
import { StorageModule } from 'src/storage/storage.module';
import { UserModule } from 'src/user/user.module';
import { FoodModule } from 'src/food/food.module';
import { AddressSwaggerMiddleware } from '@app/common';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    StorageModule,
    FoodModule,
    forwardRef(() => OrderModule),
    forwardRef(() => UserModule)
  ],
  controllers: [
    ProfileController
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddressSwaggerMiddleware)
      .forRoutes(
        'profile/address'
      );
  }
}
