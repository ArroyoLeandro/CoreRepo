import { Global, Module } from '@nestjs/common';
import { createDbFromEnv, type Database } from '@repo/db';

export const DATABASE = Symbol('DATABASE');

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: (): Database => {
        const { db } = createDbFromEnv();
        return db;
      },
    },
  ],
  exports: [DATABASE],
})
export class DbModule {}
