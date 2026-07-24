import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().min(1),
  });
  const pipe = new ZodValidationPipe(schema);

  it('returns parsed data for a valid body', () => {
    expect(pipe.transform({ name: 'ada' }, { type: 'body' })).toEqual({
      name: 'ada',
    });
  });

  it('rejects a non-conforming body with 4xx', () => {
    expect(() => pipe.transform({ name: '' }, { type: 'body' })).toThrow(
      BadRequestException,
    );
  });
});
