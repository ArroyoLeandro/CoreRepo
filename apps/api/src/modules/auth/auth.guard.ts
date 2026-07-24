import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ACCESS_COOKIE } from './auth-cookies';
import { AuthService } from './auth.service';

export type AuthedRequest = Request & {
  user?: Awaited<ReturnType<AuthService['me']>>;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const accessToken = req.cookies?.[ACCESS_COOKIE] as string | undefined;

    try {
      req.user = await this.authService.me(accessToken);
      return true;
    } catch {
      throw new UnauthorizedException('Authentication required');
    }
  }
}
