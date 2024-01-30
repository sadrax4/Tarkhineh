import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { FoodRepository } from './db/food.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from './db/food.schema';
import { CommentModule } from 'src/comment/comment.module';
import { UserModule } from 'src/user/user.module';
import { StorageModule } from 'src/storage/storage.module';
import { User, UserSchema } from 'src/user/db/user.schema';
import { Comment, CommentSchema } from 'src/comment/db/comment.schema';

@Module({
  imports: [
    StorageModule,
    UserModule,
    forwardRef(() => CommentModule),
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
  providers: [
    FoodService,
    FoodRepository
  ],
  controllers: [FoodController],
  exports: [FoodService]
})
export class FoodModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      
  }
 }
