import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { EMAIL_PORT, type EmailPort } from '../email/email.port';

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

function isHttpOnly(cookie: string): boolean {
  return /;\s*HttpOnly/i.test(cookie);
}

describe('Auth contract', () => {
  let app: INestApplication;
  let emailPort: EmailPort;
  const sent: Array<{ to: string; subject: string; text: string }> = [];

  beforeEach(async () => {
    sent.length = 0;
    emailPort = {
      async send(input) {
        sent.push(input);
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EMAIL_PORT)
      .useValue(emailPort)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('register then login sets httpOnly access and refresh cookies', async () => {
    const email = `user-${randomUUID()}@example.com`;
    const password = 'Str0ngPass!';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'Ada Lovelace' })
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
    expect(isHttpOnly(access!)).toBe(true);
    expect(isHttpOnly(refresh!)).toBe(true);
    expect(isHttpOnly(csrf!)).toBe(false);

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', [access!.split(';')[0], refresh!.split(';')[0]])
      .expect(200);

    expect(me.body).toMatchObject({
      email,
      name: 'Ada Lovelace',
      role: 'user',
    });
    expect(me.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('rejects invalid login with 4xx', async () => {
    const email = `nouser-${randomUUID()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'wrong-password' });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it('forgot-password invokes EmailPort for a registered email', async () => {
    const email = `forgot-${randomUUID()}@example.com`;
    const password = 'Str0ngPass!';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'Grace Hopper' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email })
      .expect(200);

    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe(email);
    expect(sent[0].subject.toLowerCase()).toMatch(/reset|password/);
    expect(sent[0].text.length).toBeGreaterThan(0);
  });

  it('rejects mutating auth routes without matching CSRF header', async () => {
    const email = `csrf-${randomUUID()}@example.com`;
    const password = 'Str0ngPass!';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'CSRF User' })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const setCookie = login.headers['set-cookie'];
    const access = findSetCookie(setCookie, 'access_token')!.split(';')[0];
    const refresh = findSetCookie(setCookie, 'refresh_token')!.split(';')[0];
    const csrfRaw = findSetCookie(setCookie, 'csrf_token')!;
    const csrfValue = csrfRaw.split(';')[0].slice('csrf_token='.length);

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', [access, refresh, csrfRaw.split(';')[0]])
      .expect(403);

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', [access, refresh, csrfRaw.split(';')[0]])
      .set('X-CSRF-Token', csrfValue)
      .expect(200);
  });

  it('rotates refresh session and keeps /auth/me working', async () => {
    const email = `refresh-${randomUUID()}@example.com`;
    const password = 'Str0ngPass!';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'Refresh User' })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const setCookie = login.headers['set-cookie'];
    const access = findSetCookie(setCookie, 'access_token')!.split(';')[0];
    const refresh = findSetCookie(setCookie, 'refresh_token')!.split(';')[0];
    const csrfRaw = findSetCookie(setCookie, 'csrf_token')!;
    const csrfValue = csrfRaw.split(';')[0].slice('csrf_token='.length);

    const refreshed = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [access, refresh, csrfRaw.split(';')[0]])
      .set('X-CSRF-Token', csrfValue)
      .expect(200);

    const newAccess = findSetCookie(
      refreshed.headers['set-cookie'],
      'access_token',
    )!.split(';')[0];
    const newRefresh = findSetCookie(
      refreshed.headers['set-cookie'],
      'refresh_token',
    )!.split(';')[0];
    const newCsrfRaw = findSetCookie(
      refreshed.headers['set-cookie'],
      'csrf_token',
    )!;
    const newCsrfValue = newCsrfRaw
      .split(';')[0]
      .slice('csrf_token='.length);

    expect(newRefresh).not.toBe(refresh);

    // Old refresh session must be revoked after rotation.
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [access, refresh, csrfRaw.split(';')[0]])
      .set('X-CSRF-Token', csrfValue)
      .expect(401);

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', [newAccess])
      .expect(200);

    expect(me.body.email).toBe(email);

    // New refresh still works with rotated CSRF.
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [newAccess, newRefresh, newCsrfRaw.split(';')[0]])
      .set('X-CSRF-Token', newCsrfValue)
      .expect(200);
  });
});


