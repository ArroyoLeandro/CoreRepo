import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { CSRF_COOKIE } from './auth-cookies';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const cookieToken = req.cookies?.[CSRF_COOKIE] as string | undefined;
    const headerToken = req.header('x-csrf-token');

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      throw new ForbiddenException('CSRF token mismatch');
    }

    return true;
  }
}
