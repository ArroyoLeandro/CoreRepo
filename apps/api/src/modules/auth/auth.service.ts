import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  passwordResetTokens,
  refreshSessions,
  users,
  type Database,
} from '@repo/db';
import type {
  ForgotPasswordBody,
  LoginBody,
  RegisterBody,
  User,
} from '@repo/validators';
import * as argon2 from 'argon2';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { and, eq, isNull } from 'drizzle-orm';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { DATABASE } from '../../db/db.module';
import { EMAIL_PORT, type EmailPort } from '../email/email.port';

type AccessPayload = {
  sub: string;
  email: string;
  role: 'admin' | 'user';
};

type IssuedTokens = {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  user: User;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function ttlToMs(ttl: string): number {
  const match = /^(\d+)([smhd])$/.exec(ttl);
  if (!match) {
    throw new Error(`Invalid TTL: ${ttl}`);
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return amount * multipliers[unit];
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    @Inject(EMAIL_PORT) private readonly email: EmailPort,
  ) {}

  async register(body: RegisterBody): Promise<User> {
    const existing = await this.db.query.users.findFirst({
      where: eq(users.email, body.email.toLowerCase()),
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(body.password, {
      type: argon2.argon2id,
    });

    const [created] = await this.db
      .insert(users)
      .values({
        email: body.email.toLowerCase(),
        passwordHash,
        name: body.name,
        role: 'user',
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    return created;
  }

  async login(body: LoginBody): Promise<IssuedTokens> {
    const user = await this.db.query.users.findFirst({
      where: and(
        eq(users.email, body.email.toLowerCase()),
        isNull(users.deletedAt),
      ),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, body.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }
    const tokenHash = hashToken(refreshToken);
    await this.db
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(eq(refreshSessions.tokenHash, tokenHash));
  }

  async refresh(refreshToken: string | undefined): Promise<IssuedTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(
        refreshToken,
        requireEnv('JWT_REFRESH_SECRET'),
      ) as jwt.JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    const session = await this.db.query.refreshSessions.findFirst({
      where: and(
        eq(refreshSessions.tokenHash, tokenHash),
        isNull(refreshSessions.revokedAt),
      ),
    });

    if (!session || session.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh session expired');
    }

    await this.db
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(eq(refreshSessions.id, session.id));

    const user = await this.db.query.users.findFirst({
      where: and(eq(users.id, session.userId), isNull(users.deletedAt)),
    });
    if (!user || user.id !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh session');
    }

    return this.issueSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async me(accessToken: string | undefined): Promise<User> {
    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    let payload: AccessPayload;
    try {
      payload = jwt.verify(
        accessToken,
        requireEnv('JWT_ACCESS_SECRET'),
      ) as AccessPayload;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.db.query.users.findFirst({
      where: and(eq(users.id, payload.sub), isNull(users.deletedAt)),
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async forgotPassword(body: ForgotPasswordBody): Promise<void> {
    const user = await this.db.query.users.findFirst({
      where: and(
        eq(users.email, body.email.toLowerCase()),
        isNull(users.deletedAt),
      ),
    });

    // Always succeed to avoid email enumeration; only email when user exists.
    if (!user) {
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt,
    });

    await this.email.send({
      to: user.email,
      subject: 'Password reset',
      text: `Use this reset token to reset your password: ${rawToken}`,
    });
  }

  private async issueSession(user: User): Promise<IssuedTokens> {
    const accessTtl = process.env.JWT_ACCESS_TTL ?? '15m';
    const refreshTtl = process.env.JWT_REFRESH_TTL ?? '7d';

    const accessOptions: SignOptions = { expiresIn: accessTtl as SignOptions['expiresIn'] };
    const refreshOptions: SignOptions = {
      expiresIn: refreshTtl as SignOptions['expiresIn'],
    };

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      } satisfies AccessPayload,
      requireEnv('JWT_ACCESS_SECRET'),
      accessOptions,
    );

    const refreshToken = jwt.sign(
      { sub: user.id, jti: randomUUID() },
      requireEnv('JWT_REFRESH_SECRET'),
      refreshOptions,
    );

    await this.db.insert(refreshSessions).values({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + ttlToMs(refreshTtl)),
    });

    return {
      accessToken,
      refreshToken,
      csrfToken: randomBytes(32).toString('hex'),
      user,
    };
  }
}
