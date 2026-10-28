// @ts-check
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://bbellini.io',
  // Every page is prerendered; the weather widget talks to Open-Meteo from
  // the browser, so there is no on-demand route. The adapter's standalone
  // server is still what serves the built files on forge-1.
  output: 'static',
  // Standalone: the built entry is its own HTTP server, bound from HOST/PORT
  // in the systemd EnvironmentFile on forge-1. It also serves dist/client, so
  // Caddy proxies every path to it.
  adapter: node({ mode: 'standalone' }),
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
