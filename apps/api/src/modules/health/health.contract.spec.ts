import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HealthResponse } from '@repo/validators';
import { HealthModule } from './health.module';

describe('Health contract', () => {
  describe('HealthResponse schema', () => {
    it('parses a valid health payload', () => {
      const result = HealthResponse.parse({
        status: 'ok',
        service: 'api',
      });

      expect(result).toEqual({ status: 'ok', service: 'api' });
    });

    it('rejects an invalid health payload', () => {
      expect(() =>
        HealthResponse.parse({ status: 'down', service: 'api' }),
      ).toThrow();
    });
  });

  describe('GET /health', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [HealthModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    it('returns a body that conforms to HealthResponse', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const parsed = HealthResponse.parse(response.body);
      expect(parsed.status).toBe('ok');
      expect(parsed.service).toBe('api');
    });
  });
});
