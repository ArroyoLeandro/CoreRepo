import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { Settings, UpdateSettingsBody } from '@repo/validators';
import { AppModule } from '../../app.module';

process.env.DATABASE_URL ??=
  'postgresql://postgres:postgres@localhost:5432/corerepo';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret-min-32-chars-long!!';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-min-32-chars-long!';
process.env.JWT_ACCESS_TTL ??= '15m';
process.env.JWT_REFRESH_TTL ??= '7d';
process.env.COOKIE_SECURE ??= 'false';

function findSetCookie(
  setCookie: string | string[] | undefined,
  name: string,
): string | undefined {
  const list = Array.isArray(setCookie)
    ? setCookie
    : setCookie
      ? [setCookie]
      : [];
  return list.find((c) => c.startsWith(`${name}=`));
}

function cookiePair(setCookieHeader: string): string {
  return setCookieHeader.split(';')[0];
}

function csrfFromCookie(csrfSetCookie: string): string {
  const pair = cookiePair(csrfSetCookie);
  return decodeURIComponent(pair.slice('csrf_token='.length));
}

async function registerAndLogin(app: INestApplication) {
  const email = `settings-${randomUUID()}@example.com`;
  const password = 'Str0ngPass!';

  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password, name: 'Settings Admin' })
    .expect(201);

  const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  const setCookie = login.headers['set-cookie'];
  const access = findSetCookie(setCookie, 'access_token');
  const refresh = findSetCookie(setCookie, 'refresh_token');
  const csrf = findSetCookie(setCookie, 'csrf_token');
  expect(access).toBeDefined();
  expect(refresh).toBeDefined();
  expect(csrf).toBeDefined();

  return {
    cookies: [cookiePair(access!), cookiePair(refresh!), cookiePair(csrf!)],
    csrfToken: csrfFromCookie(csrf!),
  };
}

describe('Settings PATCH contract', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('PATCH persists theme and locale; subsequent GET returns saved prefs', async () => {
    const session = await registerAndLogin(app);
    const body = UpdateSettingsBody.parse({ locale: 'en', theme: 'dark' });

    const patched = await request(app.getHttpServer())
      .patch('/settings')
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .send(body);

    expect(patched.status).toBe(200);
    const saved = Settings.parse(patched.body);
    expect(saved).toEqual({ locale: 'en', theme: 'dark' });

    const getRes = await request(app.getHttpServer())
      .get('/settings')
      .set('Cookie', session.cookies)
      .expect(200);

    expect(Settings.parse(getRes.body)).toEqual({
      locale: 'en',
      theme: 'dark',
    });
  });

  it('PATCH rejects invalid theme/locale with 4xx', async () => {
    const session = await registerAndLogin(app);

    const invalidTheme = await request(app.getHttpServer())
      .patch('/settings')
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .send({ locale: 'en', theme: 'purple' });

    expect(invalidTheme.status).toBe(400);

    const invalidLocale = await request(app.getHttpServer())
      .patch('/settings')
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .send({ locale: 'fr', theme: 'light' });

    expect(invalidLocale.status).toBe(400);
  });

  it('PATCH can update locale alone while preserving theme', async () => {
    const session = await registerAndLogin(app);

    await request(app.getHttpServer())
      .patch('/settings')
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .send({ locale: 'en', theme: 'dark' })
      .expect(200);

    const partial = UpdateSettingsBody.parse({ locale: 'es' });
    const patched = await request(app.getHttpServer())
      .patch('/settings')
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .send(partial)
      .expect(200);

    expect(Settings.parse(patched.body)).toEqual({
      locale: 'es',
      theme: 'dark',
    });
  });
});
