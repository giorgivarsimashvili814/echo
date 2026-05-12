import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CommentActionsController } from './comment-actions.controller';

@Module({
  imports: [AuthModule],
  controllers: [CommentController, CommentActionsController],
  providers: [CommentService],
})
export class CommentModule {}
