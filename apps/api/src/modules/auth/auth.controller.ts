import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ForgotPasswordBody,
  LoginBody,
  RegisterBody,
  ResetPasswordBody,
  User,
} from '@repo/validators';
import type { Request, Response } from 'express';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  ACCESS_COOKIE,
  clearAuthCookies,
  REFRESH_COOKIE,
  setAuthCookies,
} from './auth-cookies';
import { AuthService } from './auth.service';
import { CsrfGuard } from './csrf.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterBody)) body: RegisterBody,
  ): Promise<User> {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ZodValidationPipe(LoginBody)) body: LoginBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const session = await this.authService.login(body);
    setAuthCookies(res, session);
    return session.user;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(CsrfGuard)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true }> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    await this.authService.logout(refreshToken);
    clearAuthCookies(res);
    return { ok: true };
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(CsrfGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    const session = await this.authService.refresh(refreshToken);
    setAuthCookies(res, session);
    return session.user;
  }

  @Get('me')
  async me(@Req() req: Request): Promise<User> {
    const accessToken = req.cookies?.[ACCESS_COOKIE] as string | undefined;
    return this.authService.me(accessToken);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordBody)) body: ForgotPasswordBody,
  ): Promise<{ ok: true }> {
    await this.authService.forgotPassword(body);
    return { ok: true };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordBody)) body: ResetPasswordBody,
  ): Promise<{ ok: true }> {
    await this.authService.resetPassword(body);
    return { ok: true };
  }
}
