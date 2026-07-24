import { createDbFromEnv, users, appSettings } from '@repo/db';
import {
  resolveSeedConfig,
  runSeed,
} from '../../../../packages/db/src/seed';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import * as argon2 from 'argon2';

process.env.DATABASE_URL ??=
  'postgresql://postgres:postgres@localhost:5432/corerepo';

describe('Seed contract', () => {
  it('requires SEED_ADMIN_PASSWORD and accepts email/name overrides', () => {
    expect(() =>
      resolveSeedConfig({
        DATABASE_URL: 'postgresql://localhost/db',
      }),
    ).toThrow(/SEED_ADMIN_PASSWORD/);

    const cfg = resolveSeedConfig({
      DATABASE_URL: 'postgresql://localhost/db',
      SEED_ADMIN_PASSWORD: 'S3cureAdmin!',
      SEED_ADMIN_EMAIL: 'owner@example.com',
      SEED_ADMIN_NAME: 'Owner',
    });

    expect(cfg).toEqual({
      databaseUrl: 'postgresql://localhost/db',
      email: 'owner@example.com',
      name: 'Owner',
      password: 'S3cureAdmin!',
    });
  });

  it('upserts an admin user and default app settings', async () => {
    const email = `admin-${randomUUID()}@example.com`;
    const password = 'SeedPassw0rd!';

    const result = await runSeed({
      databaseUrl: process.env.DATABASE_URL!,
      email,
      name: 'Seed Admin',
      password,
    });

    expect(result.admin.email).toBe(email);
    expect(result.admin.role).toBe('admin');
    expect(result.settings).toEqual({ locale: 'es', theme: 'light' });

    const { db, sql } = createDbFromEnv();
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      expect(user).toBeDefined();
      expect(user!.role).toBe('admin');
      expect(await argon2.verify(user!.passwordHash, password)).toBe(true);

      const settings = await db.query.appSettings.findFirst({
        where: eq(appSettings.key, 'app'),
      });
      expect(settings?.value).toEqual({ locale: 'es', theme: 'light' });
    } finally {
      await sql.end();
    }
  });
});
