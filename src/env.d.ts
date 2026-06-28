/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />
/// <reference types="@cloudflare/workers-types/latest" />

declare namespace Cloudflare {
  interface Env {
    TOMORROW_API_KEY?: string;
  }
}
