import { Injectable } from '@nestjs/common';
import { HealthResponse } from '@repo/validators';

@Injectable()
export class HealthService {
  getHealth() {
    return HealthResponse.parse({
      status: 'ok',
      service: 'api',
    });
  }
}
