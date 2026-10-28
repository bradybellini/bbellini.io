// @ts-check
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, passthroughImageService } from 'astro/config';

export default defineConfig({
  site: 'https://bbellini.io',
  // Every page is prerendered; the one on-demand route is /api/weather.
  output: 'static',
  // Standalone: the built entry is its own HTTP server, bound from HOST/PORT
  // in the systemd EnvironmentFile on forge-1. It also serves dist/client, so
  // Caddy proxies every path to it.
  adapter: node({ mode: 'standalone' }),
  // Nothing goes through astro:assets, so the runtime transform endpoint
  // (/_image, sharp) has no work; passthrough turns it off. Left on, any
  // visitor could have the box resize the 13 MB of vibe pictures on demand.
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
