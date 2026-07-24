import {
  Global,
  Inject,
  Injectable,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { createDbFromEnv, type Database } from '@repo/db';

export const DATABASE = Symbol('DATABASE');

type DbBundle = ReturnType<typeof createDbFromEnv>;

const DB_BUNDLE = Symbol('DB_BUNDLE');

@Injectable()
class DbShutdownHook implements OnModuleDestroy {
  constructor(@Inject(DB_BUNDLE) private readonly bundle: DbBundle) {}

  async onModuleDestroy(): Promise<void> {
    await this.bundle.sql.end({ timeout: 5 });
  }
}

@Global()
@Module({
  providers: [
    {
      provide: DB_BUNDLE,
      useFactory: (): DbBundle => createDbFromEnv(),
    },
    {
      provide: DATABASE,
      inject: [DB_BUNDLE],
      useFactory: (bundle: DbBundle): Database => bundle.db,
    },
    DbShutdownHook,
  ],
  exports: [DATABASE],
})
export class DbModule {}
