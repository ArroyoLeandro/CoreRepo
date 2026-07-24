import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { users, type Database } from '@repo/db';
import type {
  CreateUserBody,
  UpdateUserBody,
  User,
  UsersList,
} from '@repo/validators';
import * as argon2 from 'argon2';
import { and, eq, isNull } from 'drizzle-orm';
import { DATABASE } from '../../db/db.module';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async list(): Promise<UsersList> {
    const rows = await this.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(isNull(users.deletedAt));

    return { users: rows };
  }

  async getById(id: string): Promise<User> {
    const row = await this.db.query.users.findFirst({
      where: and(eq(users.id, id), isNull(users.deletedAt)),
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    if (!row) {
      throw new NotFoundException('User not found');
    }
    return row;
  }

  async create(body: CreateUserBody): Promise<User> {
    const existing = await this.db.query.users.findFirst({
      where: eq(users.email, body.email.toLowerCase()),
    });
    if (existing && !existing.deletedAt) {
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
        role: body.role,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    return created;
  }

  async update(id: string, body: UpdateUserBody): Promise<User> {
    const existing = await this.db.query.users.findFirst({
      where: and(eq(users.id, id), isNull(users.deletedAt)),
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (body.email && body.email.toLowerCase() !== existing.email) {
      const conflict = await this.db.query.users.findFirst({
        where: eq(users.email, body.email.toLowerCase()),
      });
      if (conflict && conflict.id !== id && !conflict.deletedAt) {
        throw new ConflictException('Email already registered');
      }
    }

    const patch: {
      email?: string;
      name?: string;
      role?: 'admin' | 'user';
      passwordHash?: string;
      updatedAt: Date;
    } = { updatedAt: new Date() };

    if (body.email !== undefined) {
      patch.email = body.email.toLowerCase();
    }
    if (body.name !== undefined) {
      patch.name = body.name;
    }
    if (body.role !== undefined) {
      patch.role = body.role;
    }
    if (body.password !== undefined) {
      patch.passwordHash = await argon2.hash(body.password, {
        type: argon2.argon2id,
      });
    }

    const [updated] = await this.db
      .update(users)
      .set(patch)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    return updated;
  }

  async softDelete(id: string): Promise<{ ok: true }> {
    const existing = await this.db.query.users.findFirst({
      where: and(eq(users.id, id), isNull(users.deletedAt)),
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.db
      .update(users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));

    return { ok: true };
  }
}
