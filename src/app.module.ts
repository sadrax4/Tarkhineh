import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'libs/database';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FoodModule } from './food/food.module';
import { CommentModule } from './comment/comment.module';
import { StorageModule } from './storage/storage.module';
import { AdminFoodController } from './admin/admin-food/admin-food.controller';
import { AdminFoodService } from './admin/admin-food/admin-food.service';
import { AdminFoodModule } from './admin/admin-food/admin-food.module';
import { AdminUserModule } from './admin/admin-user/admin-user.module';
import { AdminCommentModule } from './admin/admin-comment/admin-comment.module';
import { AdminPermissionModule } from './admin/admin-permission/admin-permission.module';

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
    AdminPermissionModule
  ],
  controllers: [
    AdminFoodController
  ],
  providers: [
    AdminFoodService
  ],
  exports: []
})
export class AppModule { }
