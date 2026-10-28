// @ts-check
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, passthroughImageService } from 'astro/config';
import { loadEnv } from 'vite';

// Dev reads .env here explicitly: /api/weather reads process.env, and
// relying on the launcher to populate it is fragile (bun's node shim for a
// package bin does not, Astro's dev daemon does, an IDE runner may not).
// Real environment variables win; in production there is no .env and
// systemd's EnvironmentFile provides everything.
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
for (const [key, value] of Object.entries(fileEnv)) {
  process.env[key] ??= value;
}

export default defineConfig({
  site: 'https://bbellini.io',
  // Every page is prerendered; the one on-demand route is /api/weather.
  output: 'static',
  // Standalone: the built entry is its own HTTP server, bound from HOST/PORT
  // in the systemd EnvironmentFile on forge-1. It also serves dist/client, so
  // Caddy proxies every path to it.
  adapter: node({ mode: 'standalone' }),
  // Nothing goes through astro:assets, so the runtime transform endpoint
  // (/_image) has no work. Passthrough takes sharp out of it: with sharp, any
  // visitor could have the box resize the 13 MB of vibe pictures on demand.
  // The route itself stays in the manifest as a file reader; Caddy answers
  // 404 for it (forge/caddy/sites/bbellini-io.caddy).
  image: { service: passthroughImageService() },
  security: {
    // Behind Caddy and the tunnel the socket is plain HTTP on loopback;
    // without this the adapter ignores X-Forwarded-Proto and X-Forwarded-For.
    // Trusting the headers only for the published hosts is what keeps a
    // forged Host from doing the same.
    allowedDomains: [
      { hostname: 'bbellini.io', protocol: 'https' },
      { hostname: 'www.bbellini.io', protocol: 'https' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
