/**
 * Validates that the request comes from an allowed origin
 * Checks both Origin and Referer headers for security
 */
export function validateOrigin(request: Request): boolean {
  const allowedOrigins = [
    'https://bbellini.io',
    'https://www.bbellini.io',
    'http://localhost:4321',  // Astro dev server
    'http://127.0.0.1:4321'   // Alternative localhost
  ];

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Check origin header first (more reliable)
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  // Fallback to referer header
  if (referer && allowedOrigins.some(allowed => referer.startsWith(allowed))) {
    return true;
  }

  // Allow same-origin requests (when origin header is missing)
  if (!origin && !referer) {
    // This is likely a same-origin request
    return true;
  }

  return false;
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
