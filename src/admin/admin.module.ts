import { Module, forwardRef } from '@nestjs/common';
import { FoodModule } from 'src/food/food.module';
import { StorageModule } from 'src/storage/storage.module';
import { CommentModule } from 'src/comment/comment.module';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlackList, BlackListSchema } from './db/blackList.schema';
import { BlackListRepository } from './db/blackLIst.repository';

@Module({
  imports: [
    forwardRef(() => UserModule),
    FoodModule,
    StorageModule,
    CommentModule,
    MongooseModule.forFeature([{
      name: BlackList.name,
      schema: BlackListSchema
    }])
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    BlackListRepository
  ],
  exports: [
    AdminService
  ]
})
export class AdminModule { }
