import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import type { RequestWithOptionalUser, SessionUser } from 'src/types';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(registerDto);
    const sessionId = await this.authService.createSession(user.id);

    this.setSessionCookie(res, sessionId);

    return { message: 'success' };
  }

  @SkipThrottle({ short: true })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginDto);
    const sessionId = await this.authService.createSession(user.id);

    this.setSessionCookie(res, sessionId);

    return { message: 'success' };
  }

  @UseGuards(AuthGuard)
  @SkipThrottle({ short: true })
  @Post('logout')
  async logout(
    @Req() req: RequestWithOptionalUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = (req.cookies as Record<string, string>).sessionId;

    if (sessionId) {
      await this.authService.deleteSession(sessionId);
    }

    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      domain:
        process.env.NODE_ENV === 'production' ? '.orbit-dev.cv' : undefined,
    });

    return { message: 'success' };
  }

  @UseGuards(AuthGuard)
  @SkipThrottle({ short: true })
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: SessionUser) {
    return { user };
  }

  private setSessionCookie(res: Response, sessionId: string) {
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      domain:
        process.env.NODE_ENV === 'production' ? '.orbit-dev.cv' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
