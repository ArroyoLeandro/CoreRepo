import { Injectable, Logger } from '@nestjs/common';
import type { EmailMessage, EmailPort } from './email.port';

/**
 * Dev stub — logs to console only. Never opens network sockets.
 */
@Injectable()
export class DevStubEmailAdapter implements EmailPort {
  private readonly logger = new Logger(DevStubEmailAdapter.name);

  async send(input: EmailMessage): Promise<void> {
    this.logger.log(
      `[DEV STUB EMAIL] to=${input.to} subject=${input.subject} text=${input.text}`,
    );
  }
}
