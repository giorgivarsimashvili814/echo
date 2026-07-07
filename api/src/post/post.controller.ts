import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import type { RequestWithOptionalUser, SessionUser } from 'src/types';
import { VoteDto } from './dto/vote.dto';
import { OptionalAuthGuard } from 'src/guards/optional-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @CurrentUser() user: SessionUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(user.id, createPostDto);
  }

  @UseGuards(OptionalAuthGuard)
  @SkipThrottle({ short: true })
  @Get()
  findAll(
    @Req() req: RequestWithOptionalUser,
    @Query('cursor') cursor?: string,
    @Query('userId') filterUserId?: string,
    @Query('take') take?: string,
  ) {
    return this.postService.findAll(
      req.user?.id,
      filterUserId,
      cursor,
      Math.min(parseInt(take ?? '5') || 5, 20),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @SkipThrottle({ short: true })
  @Get(':postId')
  findOne(
    @Req() req: RequestWithOptionalUser,
    @Param('postId') postId: string,
  ) {
    return this.postService.findOne(postId, req.user?.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':postId')
  update(
    @CurrentUser() user: SessionUser,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(user.id, postId, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @SkipThrottle({ short: true })
  @Delete(':postId')
  remove(@CurrentUser() user: SessionUser, @Param('postId') postId: string) {
    return this.postService.remove(user.id, postId);
  }

  @UseGuards(AuthGuard)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  @Post(':postId/vote')
  vote(
    @CurrentUser() user: SessionUser,
    @Param('postId') postId: string,
    @Body() voteDto: VoteDto,
  ) {
    return this.postService.vote(user.id, postId, voteDto);
  }

  @UseGuards(AuthGuard)
@Post(':id/images')
@UseInterceptors(FileInterceptor('file'))
addImage(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('No file provided');
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type');
  }

  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new BadRequestException('File too large (max 5MB)');
  }

  return this.postService.addImage(id, file);
}
}
