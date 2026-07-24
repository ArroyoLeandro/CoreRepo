import { Global, Module } from '@nestjs/common';
import { DevStubEmailAdapter } from './dev-stub-email.adapter';
import { EMAIL_PORT } from './email.port';

@Global()
@Module({
  providers: [
    {
      provide: EMAIL_PORT,
      useClass: DevStubEmailAdapter,
    },
  ],
  exports: [EMAIL_PORT],
})
export class EmailModule {}
