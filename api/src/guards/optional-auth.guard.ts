import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithOptionalUser } from 'src/types';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithOptionalUser>();
    const sessionId = (request.cookies as Record<string, string>).sessionId;

    if (!sessionId) return true;

    try {
      const user = await this.authService.validateSession(sessionId);
      request.user = user;
    } catch {
      return true;
    }

    return true;
  }
}
