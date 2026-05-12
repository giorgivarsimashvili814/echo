import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { RequestWithOptionalUser, SessionUser } from 'src/types';
import { OptionalAuthGuard } from 'src/guards/optional-auth.guard';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @CurrentUser() user: SessionUser,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(user.id, postId, createCommentDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get()
  findAll(
    @Param('postId') postId: string,
    @Req() req: RequestWithOptionalUser,
    @Query('cursor') cursor?: string,
  ) {
    return this.commentService.findAll(postId, req.user?.id, cursor);
  }
}
