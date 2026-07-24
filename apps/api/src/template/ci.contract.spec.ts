import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = join(__dirname, '../../../../');
const workflowPath = join(repoRoot, '.github/workflows/ci.yml');

describe('CI workflow contract', () => {
  it('ships a GitHub Actions workflow at .github/workflows/ci.yml', () => {
    expect(existsSync(workflowPath)).toBe(true);
  });

  it('installs with pnpm, builds packages, and runs api Jest', () => {
    const yaml = readFileSync(workflowPath, 'utf8');

    expect(yaml).toMatch(/pnpm\s+install/i);
    expect(yaml).toMatch(/turbo\s+run\s+build|pnpm\s+.*build/i);
    expect(yaml).toMatch(/filter[= ].*api.*test|pnpm\s+--filter\s+api\s+test/i);
  });

  it('provides Postgres for DATABASE_URL-backed Jest', () => {
    const yaml = readFileSync(workflowPath, 'utf8');

    expect(yaml).toMatch(/postgres/i);
    expect(yaml).toMatch(/DATABASE_URL/i);
  });
});
