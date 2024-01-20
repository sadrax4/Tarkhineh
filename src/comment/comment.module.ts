import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './db/comment.schema';
import { CommentRepository } from './db/comment.repository';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/db/user.repository';
import { User, UserSchema } from 'src/user/db/user.schema';
import { FoodService } from 'src/food/food.service';
import { FoodRepository } from 'src/food/db/food.repository';
import { Food, FoodSchema } from 'src/food/db/food.schema';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Food.name,
        schema: FoodSchema
      }
    ])
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    UserService,
    UserRepository,
    FoodService,
    FoodRepository,
    StorageService
  ]
})
export class CommentModule { }
