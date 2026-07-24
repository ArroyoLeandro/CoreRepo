import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { Settings, User, UsersList } from '@repo/validators';

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

async function registerAndLogin(
  app: INestApplication,
  overrides?: { email?: string; name?: string },
) {
  const email = overrides?.email ?? `admin-${randomUUID()}@example.com`;
  const password = 'Str0ngPass!';
  const name = overrides?.name ?? 'Admin User';

  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password, name })
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
    email,
    password,
    cookies: [cookiePair(access!), cookiePair(refresh!), cookiePair(csrf!)],
    csrfToken: csrfFromCookie(csrf!),
  };
}

describe('Users and settings admin contract', () => {
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

  it('denies unauthenticated access to admin users and settings routes', async () => {
    const list = await request(app.getHttpServer()).get('/users');
    expect(list.status).toBe(401);

    const create = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: `x-${randomUUID()}@example.com`,
        password: 'Str0ngPass!',
        name: 'No Auth',
      });
    expect(create.status).toBe(401);

    const settings = await request(app.getHttpServer()).get('/settings');
    expect(settings.status).toBe(401);
  });

  it('settings GET returns defaults (or DB) for authenticated session', async () => {
    const session = await registerAndLogin(app);

    const response = await request(app.getHttpServer())
      .get('/settings')
      .set('Cookie', session.cookies)
      .expect(200);

    const parsed = Settings.parse(response.body);
    expect(parsed.locale).toBe('es');
    expect(parsed.theme).toBe('light');
  });

  it('authenticated users CRUD: create, list, update, soft-delete', async () => {
    const session = await registerAndLogin(app);
    const targetEmail = `crud-${randomUUID()}@example.com`;

    const createdRes = await request(app.getHttpServer())
      .post('/users')
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .send({
        email: targetEmail,
        password: 'Str0ngPass!',
        name: 'CRUD Target',
        role: 'user',
      })
      .expect(201);

    const created = User.parse(createdRes.body);
    expect(created).toMatchObject({
      email: targetEmail,
      name: 'CRUD Target',
      role: 'user',
    });

    const listRes = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', session.cookies)
      .expect(200);

    const list = UsersList.parse(listRes.body);
    expect(list.users.some((u) => u.id === created.id)).toBe(true);

    const updatedRes = await request(app.getHttpServer())
      .patch(`/users/${created.id}`)
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .send({ name: 'CRUD Updated' })
      .expect(200);

    const updated = User.parse(updatedRes.body);
    expect(updated.name).toBe('CRUD Updated');

    await request(app.getHttpServer())
      .delete(`/users/${created.id}`)
      .set('Cookie', session.cookies)
      .set('X-CSRF-Token', session.csrfToken)
      .expect(200);

    const afterDelete = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', session.cookies)
      .expect(200);

    const afterList = UsersList.parse(afterDelete.body);
    expect(afterList.users.some((u) => u.id === created.id)).toBe(false);
  });
});
