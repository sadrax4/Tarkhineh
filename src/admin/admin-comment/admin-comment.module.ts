import { Module } from '@nestjs/common';
import { AdminCommentService } from './admin-comment.service';
import { AdminCommentController } from './admin-comment.controller';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    CommentModule
  ],
  providers: [AdminCommentService],
  controllers: [AdminCommentController]
})
export class AdminCommentModule { }
