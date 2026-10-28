import { describe, expect, test } from 'bun:test';
import { validateOrigin } from './security';

const check = (headers: Record<string, string>) =>
  validateOrigin(new Request('https://bbellini.io/api/weather?zip=10001', { headers }));

describe('validateOrigin', () => {
  test('accepts the published hosts and the local servers by Origin', () => {
    expect(check({ origin: 'https://bbellini.io' })).toBe(true);
    expect(check({ origin: 'https://www.bbellini.io' })).toBe(true);
    expect(check({ origin: 'http://localhost:4321' })).toBe(true);
    expect(check({ origin: 'http://127.0.0.1:4015' })).toBe(true);
  });

  test('accepts a Referer from a page on the site, by its exact origin', () => {
    expect(check({ referer: 'https://bbellini.io/startpages/prime' })).toBe(true);
    expect(check({ referer: 'http://localhost:4321/' })).toBe(true);
  });

  test('accepts a request that sends neither header', () => {
    expect(check({})).toBe(true);
  });

  test('rejects a foreign Origin, including the old workers.dev host', () => {
    expect(check({ origin: 'https://evil.example' })).toBe(false);
    expect(check({ origin: 'https://bbellini-io.bbellini.workers.dev' })).toBe(false);
    expect(check({ origin: 'null' })).toBe(false);
  });

  test('rejects a foreign Origin even with a Referer from the site', () => {
    expect(check({ origin: 'https://evil.example', referer: 'https://bbellini.io/' })).toBe(false);
  });

  test('rejects a Referer whose host merely starts with the site', () => {
    expect(check({ referer: 'https://bbellini.io.evil.example/' })).toBe(false);
    expect(check({ referer: 'https://bbellini.io@evil.example/' })).toBe(false);
    expect(check({ referer: 'http://localhost:43210/' })).toBe(false);
  });

  test('rejects a Referer that is not a URL', () => {
    expect(check({ referer: 'bbellini.io' })).toBe(false);
  });
});
