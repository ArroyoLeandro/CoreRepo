import { config as loadEnv } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

// Monorepo root `.env` (Nest does not load it automatically).
loadEnv({ path: resolve(__dirname, '../../../.env') });

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
