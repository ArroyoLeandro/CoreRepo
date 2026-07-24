import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [DbModule, EmailModule, AuthModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

