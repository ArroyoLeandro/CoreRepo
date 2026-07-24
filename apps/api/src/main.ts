import { config as loadEnv } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

function loadRootEnv(): void {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../../.env'),
    resolve(__dirname, '../../../../.env'),
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    loadEnv({ path, override: false });
    if (process.env.DATABASE_URL) {
      return;
    }
  }

  if (!process.env.DATABASE_URL) {
    console.error(
      '[api] DATABASE_URL missing. Create a root .env (cp .env.example .env) and restart. Tried:',
      candidates,
    );
  }
}

loadRootEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}
bootstrap();
