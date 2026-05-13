import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CurrentUser } from 'src/decorators/user.decorator';
import type { RequestWithOptionalUser, SessionUser } from 'src/types';
import { OptionalAuthGuard } from 'src/guards/optional-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  @Post(':userId/follow')
  follow(@CurrentUser() user: SessionUser, @Param('userId') userId: string) {
    return this.userService.follow(user.id, userId);
  }

  @UseGuards(OptionalAuthGuard)
  @SkipThrottle({ short: true })
  @Get(':userId/followers')
  findFollowers(
    @Req() req: RequestWithOptionalUser,
    @Param('userId') userId: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.userService.findFollowers(userId, req.user?.id, cursor, 20);
  }

  @UseGuards(OptionalAuthGuard)
  @SkipThrottle({ short: true })
  @Get(':userId/following')
  findFollowing(
    @Req() req: RequestWithOptionalUser,
    @Param('userId') userId: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.userService.findFollowing(userId, req.user?.id, cursor, 20);
  }

  @UseGuards(OptionalAuthGuard)
  @SkipThrottle({ short: true })
  @Get(':userId')
  getUserInfo(
    @Param('userId') userId: string,
    @Req() req: RequestWithOptionalUser,
  ) {
    return this.userService.getUserInfo(userId, req.user?.id);
  }

  @UseGuards(OptionalAuthGuard)
  @SkipThrottle({ short: true })
  @Get()
  findAll(
    @Req() req: RequestWithOptionalUser,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    return this.userService.findAll(
      search,
      cursor,
      Math.min(parseInt(take ?? '20') || 20, 50),
      req.user?.id,
    );
  }
}
