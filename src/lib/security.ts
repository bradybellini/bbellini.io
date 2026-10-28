/**
 * Whether a request to /api/weather comes from one of this site's own pages.
 * The published hosts, `astro dev` (4321) and the standalone server run from
 * `bun run preview` (4015, the port forge-1 uses) are allowed.
 */
const allowedOrigins = new Set([
  'https://bbellini.io',
  'https://www.bbellini.io',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
  'http://localhost:4015',
  'http://127.0.0.1:4015',
]);

/** The origin a URL names, or null when it is not a URL at all. */
function originOf(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // A browser sends Origin on a cross-origin request, so when it is present
  // it decides on its own: a foreign origin never falls through to Referer.
  if (origin !== null) {
    return allowedOrigins.has(origin);
  }
  if (referer !== null) {
    const refererOrigin = originOf(referer);
    return refererOrigin !== null && allowedOrigins.has(refererOrigin);
  }
  // Neither header: a same-origin navigation, or a client that sends none.
  return true;
}

/**
 * Creates a 403 Forbidden response for unauthorized requests
 */
export function createForbiddenResponse(): Response {
  return new Response(
    JSON.stringify({ error: 'Forbidden: Invalid origin' }), 
    { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
