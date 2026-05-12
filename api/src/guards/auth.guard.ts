import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithOptionalUser } from 'src/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithOptionalUser>();
    const sessionId = (request.cookies as Record<string, string>).sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const user = await this.authService.validateSession(sessionId);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
