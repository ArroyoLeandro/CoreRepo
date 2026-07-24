import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CsrfGuard } from './csrf.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CsrfGuard],
  exports: [AuthService],
})
export class AuthModule {}
