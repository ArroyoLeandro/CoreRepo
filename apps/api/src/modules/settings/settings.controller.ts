import { Controller, Get, UseGuards } from '@nestjs/common';
import type { Settings } from '@repo/validators';
import { AuthGuard } from '../auth/auth.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async get(): Promise<Settings> {
    return this.settingsService.get();
  }
}
