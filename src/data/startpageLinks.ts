export interface Link {
  name: string;
  url: string;
}

const mediaLinks: Link[] = [
  { name: "HBOMax", url: "https://www.hbomax.com/" },
  { name: "Peacock", url: "https://www.peacocktv.com/" },
  { name: "Paramount+", url: "https://www.paramountplus.com/" },
  { name: "Disney+", url: "https://www.disneyplus.com/" },
  { name: "Apple TV+", url: "https://tv.apple.com/" },
  { name: "Hulu", url: "https://hulu.com" },
  { name: "Netflix", url: "https://netflix.com" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Twitch", url: "https://twitch.tv" }
];

const newsLinks: Link[] = [
  { name: "WSJ", url: "https://wsj.com" },
  { name: "WaPo", url: "https://www.washingtonpost.com/" },
  { name: "NYT", url: "https://www.nytimes.com/" },
  { name: "Hacker News", url: "https://news.ycombinator.com/" },
  { name: "Techmeme", url: "https://techmeme.com" },
  { name: "Mediagazer", url: "https://www.mediagazer.com/" },
  { name: "Memeorandum", url: "https://www.memeorandum.com/" }
];

export const primeLinkData = {
  media: mediaLinks,
  social: [
    { name: "X", url: "https://x.com" },
    { name: "LinkedIn", url: "https://linkedin.com" },
    { name: "Are.na", url: "https://are.na" },
    { name: "Pinterest", url: "https://pinterest.com" }
  ],
  news: newsLinks,
  tech: [
    { name: "Hetzner Console", url: "https://console.hetzner.cloud/" },
    { name: "Cloudflare", url: "https://dash.cloudflare.com/" },
    { name: "Github", url: "https://github.com/" },
    { name: "Hover", url: "https://hover.com" },
    { name: "Park.io", url: "https://park.io/" }
  ],
  ai: [
    { name: "ChatGPT", url: "https://chatgpt.com/" },
    { name: "Claude", url: "https://claude.ai/" },
    { name: "Openrouter", url: "https://openrouter.ai/" },
    { name: "Claude Console", url: "https://console.anthropic.com/dashboard" },
    { name: "AMP Code", url: "https://ampcode.com/" }
  ],
  finance: [
    { name: "Mercury", url: "https://app.mercury.com/" },
    { name: "Schwab", url: "https://www.schwab.com/" },
    { name: "E*TRADE", url: "https://us.etrade.com/home" },
    { name: "Robinhood", url: "https://robinhood.com/us/en/" }
  ],
  personal: [
    { name: "ME", url: "https://bradybellini.com" },
    { name: "Space Index", url: "https://spaceindex.io" },
    { name: "Space Index Admin", url: "https://admin.spaceindex.io" },
    { name: "Proton", url: "https://mail.proton.me/" },
    { name: "Raindrop.io", url: "https://app.raindrop.io/" },
    { name: "Planetary Industries", url: "https://planetaryindustries.io/" }
  ],
  other: [
    { name: "Unsplash", url: "https://unsplash.com/" },
    { name: "Wayback Machine", url: "https://wayback-api.archive.org/" }
  ],
  documentation: [
    { name: "Astro Docs", url: "https://astro.build/" },
    { name: "Tailwind Docs", url: "https://tailwindcss.com/docs" },
    { name: "Svelte Docs", url: "https://svelte.dev/docs" },
    { name: "Go Docs", url: "https://golang.org/doc/" },
    { name: "Anthropic Docs", url: "https://docs.anthropic.com/" }
  ],
  ecommerce: [
    { name: "Amazon", url: "https://www.amazon.com/" },
    { name: "Etsy", url: "https://www.etsy.com/" },
    { name: "Costco", url: "https://www.costco.com/" }
  ]
};

export const altLinkData = {
  media: mediaLinks,
  social: [
    { name: "X", url: "https://x.com" }
  ],
  news: newsLinks
};
