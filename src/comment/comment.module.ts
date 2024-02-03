import { Module, forwardRef } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './db/comment.schema';
import { CommentRepository } from './db/comment.repository';
import { User, UserSchema } from 'src/user/db/user.schema';
import { Food, FoodSchema } from 'src/food/db/food.schema';
import { FoodModule } from 'src/food/food.module';
import { UserModule } from 'src/user/user.module';

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
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => FoodModule),
  ],
  controllers: [
    CommentController
  ],
  providers: [
    CommentService,
    CommentRepository
  ],
  exports: [CommentService]
})
export class CommentModule { }
