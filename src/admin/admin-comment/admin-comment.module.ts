import { Module } from '@nestjs/common';
import { AdminCommentService } from './admin-comment.service';
import { AdminCommentController } from './admin-comment.controller';

@Module({
  providers: [AdminCommentService],
  controllers: [AdminCommentController]
})
export class AdminCommentModule {}
