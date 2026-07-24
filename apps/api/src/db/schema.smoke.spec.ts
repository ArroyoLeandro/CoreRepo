import { getTableColumns, getTableName } from 'drizzle-orm';
import {
  appSettings,
  passwordResetTokens,
  refreshSessions,
  users,
} from '@repo/db';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('DB schema / migrate smoke', () => {
  it('exports auth-ready tables with expected names', () => {
    expect(getTableName(users)).toBe('users');
    expect(getTableName(refreshSessions)).toBe('refresh_sessions');
    expect(getTableName(passwordResetTokens)).toBe('password_reset_tokens');
    expect(getTableName(appSettings)).toBe('app_settings');
  });

  it('defines required columns on users and app_settings', () => {
    const userCols = getTableColumns(users);
    expect(userCols).toMatchObject({
      id: expect.anything(),
      email: expect.anything(),
      passwordHash: expect.anything(),
      name: expect.anything(),
      role: expect.anything(),
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
      deletedAt: expect.anything(),
    });

    const settingsCols = getTableColumns(appSettings);
    expect(settingsCols).toMatchObject({
      key: expect.anything(),
      value: expect.anything(),
      updatedAt: expect.anything(),
    });
  });

  it('ships drizzle migrations that create all four tables', () => {
    const migrationsDir = join(
      __dirname,
      '../../../../packages/db/drizzle',
    );
    const sqlFiles = readdirSync(migrationsDir).filter((f) =>
      f.endsWith('.sql'),
    );
    expect(sqlFiles.length).toBeGreaterThan(0);

    const sql = sqlFiles
      .map((f) => readFileSync(join(migrationsDir, f), 'utf8'))
      .join('\n');

    expect(sql).toMatch(/CREATE TABLE.*"users"/i);
    expect(sql).toMatch(/CREATE TABLE.*"refresh_sessions"/i);
    expect(sql).toMatch(/CREATE TABLE.*"password_reset_tokens"/i);
    expect(sql).toMatch(/CREATE TABLE.*"app_settings"/i);
  });
});
