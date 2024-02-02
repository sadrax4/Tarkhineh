import { Module } from '@nestjs/common';
import { FoodModule } from 'src/food/food.module';
import { StorageModule } from 'src/storage/storage.module';
import { CommentModule } from 'src/comment/comment.module';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    UserModule,
    FoodModule,
    StorageModule,
    CommentModule
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
