import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CurrentUser } from 'src/decorators/user.decorator';
import type { RequestWithOptionalUser, SessionUser } from 'src/types';
import { OptionalAuthGuard } from 'src/guards/optional-auth.guard';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
      Math.min(parseInt(take ?? '5') || 20, 50),
      req.user?.id,
    );
  }

@UseGuards(AuthGuard)
@Throttle({ short: { limit: 5, ttl: 60000 } })
@Patch('me/username')
updateUsername(@CurrentUser() user: SessionUser, @Body() dto: UpdateUsernameDto) {
  return this.userService.updateUsername(user.id, dto.username);
}

@UseGuards(AuthGuard)
@Throttle({ short: { limit: 5, ttl: 60000 } })
@Patch('me/email')
updateEmail(@CurrentUser() user: SessionUser, @Body() dto: UpdateEmailDto) {
  return this.userService.updateEmail(user.id, dto.email);
}

@UseGuards(AuthGuard)
@Throttle({ short: { limit: 5, ttl: 60000 } })
@Patch('me/password')
updatePassword(@CurrentUser() user: SessionUser, @Body() dto: UpdatePasswordDto) {
  return this.userService.updatePassword(user.id, dto.currentPassword, dto.newPassword);
}

@UseGuards(AuthGuard)
@Throttle({ short: { limit: 10, ttl: 60000 } })
@Post('me/avatar')
@UseInterceptors(FileInterceptor('file'))
uploadAvatar(
  @CurrentUser() user: SessionUser,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.userService.uploadAvatar(user.id, file);
}

@UseGuards(AuthGuard)
@Throttle({ short: { limit: 10, ttl: 60000 } })
@Delete('me/avatar')
removeAvatar(@CurrentUser() user: SessionUser) {
  return this.userService.removeAvatar(user.id);
}
}
