import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import type { RequestWithOptionalUser, SessionUser } from 'src/types';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { VoteDto } from 'src/post/dto/vote.dto';
import { OptionalAuthGuard } from 'src/guards/optional-auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('comments')
export class CommentActionsController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(OptionalAuthGuard)
  @SkipThrottle({ short: true })
  @Get(':commentId/replies')
  findReplies(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithOptionalUser,
    @Query('cursor') cursor?: string,
  ) {
    return this.commentService.findReplies(commentId, req.user?.id, cursor);
  }

  @UseGuards(AuthGuard)
  @SkipThrottle({ short: true })
  @Patch(':commentId')
  update(
    @CurrentUser() user: SessionUser,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(user.id, commentId, updateCommentDto);
  }

  @UseGuards(AuthGuard)
  @SkipThrottle({ short: true })
  @Delete(':commentId')
  remove(
    @CurrentUser() user: SessionUser,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.remove(user.id, commentId);
  }

  @UseGuards(AuthGuard)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  @Post(':commentId/vote')
  vote(
    @CurrentUser() user: SessionUser,
    @Param('commentId') commentId: string,
    @Body() voteDto: VoteDto,
  ) {
    return this.commentService.vote(user.id, commentId, voteDto);
  }
}
