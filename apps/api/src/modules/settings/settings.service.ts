import { Inject, Injectable } from '@nestjs/common';
import { appSettings, type Database } from '@repo/db';
import {
  DEFAULT_SETTINGS,
  Settings,
  type UpdateSettingsBody,
} from '@repo/validators';
import { eq } from 'drizzle-orm';
import { DATABASE } from '../../db/db.module';

const SETTINGS_KEY = 'app';

@Injectable()
export class SettingsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async get(): Promise<Settings> {
    const row = await this.db.query.appSettings.findFirst({
      where: eq(appSettings.key, SETTINGS_KEY),
    });

    if (!row) {
      return DEFAULT_SETTINGS;
    }

    const parsed = Settings.safeParse(row.value);
    if (!parsed.success) {
      return DEFAULT_SETTINGS;
    }

    return parsed.data;
  }

  async update(body: UpdateSettingsBody): Promise<Settings> {
    const current = await this.get();
    const next: Settings = {
      locale: body.locale ?? current.locale,
      theme: body.theme ?? current.theme,
    };

    await this.db
      .insert(appSettings)
      .values({
        key: SETTINGS_KEY,
        value: next,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value: next,
          updatedAt: new Date(),
        },
      });

    return next;
  }
}
