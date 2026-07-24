import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UpdateSettingsBody, type Settings } from '@repo/validators';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { CsrfGuard } from '../auth/csrf.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async get(): Promise<Settings> {
    return this.settingsService.get();
  }

  @Patch()
  @UseGuards(CsrfGuard)
  async update(
    @Body(new ZodValidationPipe(UpdateSettingsBody)) body: UpdateSettingsBody,
  ): Promise<Settings> {
    return this.settingsService.update(body);
  }
}
