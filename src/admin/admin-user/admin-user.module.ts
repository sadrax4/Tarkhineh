import { ForwardReference, Module, forwardRef } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminUserController } from './admin-user.controller';
import { BlackListRepository } from './db/blackLIst.repository';
import { BlackList, BlackListSchema } from './db/blackList.schema';
import { CommentModule } from 'src/comment/comment.module';
import { StorageModule } from 'src/storage/storage.module';
import { UserModule } from 'src/user/user.module';
import { FoodModule } from 'src/food/food.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    forwardRef(() => UserModule),
    FoodModule,
    StorageModule,
    CommentModule,
    MongooseModule.forFeature([{
      name: BlackList.name,
      schema: BlackListSchema
    }]),
    AdminUserModule
  ],
  controllers: [AdminUserController],
  providers: [
    AdminUserService,
    BlackListRepository
  ],
  exports: [
    AdminUserService
  ]
})
export class AdminUserModule {

}
