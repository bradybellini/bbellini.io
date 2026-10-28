import { describe, expect, test } from 'bun:test';
import { validateOrigin } from './security';

const request = (headers: Record<string, string>) =>
  new Request('https://bbellini.io/api/weather?zip=10001', { headers });

describe('validateOrigin', () => {
  test('accepts the published hosts by Origin', () => {
    expect(validateOrigin(request({ origin: 'https://bbellini.io' }))).toBe(true);
    expect(validateOrigin(request({ origin: 'https://www.bbellini.io' }))).toBe(true);
  });

  test('accepts a Referer from a page on the site', () => {
    expect(validateOrigin(request({ referer: 'https://bbellini.io/startpages/prime' }))).toBe(true);
  });

  test('accepts a request that sends neither header', () => {
    expect(validateOrigin(request({}))).toBe(true);
  });

  test('rejects a foreign origin, including the old workers.dev host', () => {
    expect(validateOrigin(request({ origin: 'https://evil.example' }))).toBe(false);
    expect(validateOrigin(request({ origin: 'https://bbellini-io.bbellini.workers.dev' }))).toBe(false);
    expect(validateOrigin(request({ referer: 'https://bbellini-io.bbellini.workers.dev/' }))).toBe(false);
  });

  test('rejects a referer that only contains the host', () => {
    expect(validateOrigin(request({ referer: 'https://evil.example/?u=https://bbellini.io' }))).toBe(false);
  });
});
