import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CsrfGuard } from './csrf.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CsrfGuard, AuthGuard],
  exports: [AuthService, AuthGuard, CsrfGuard],
})
export class AuthModule {}
