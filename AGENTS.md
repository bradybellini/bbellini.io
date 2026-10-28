# Agent Instructions

## Build/Development Commands
- `bun install` - Install dependencies (bun is the package manager; `bun.lock` is committed)
- `bun run dev` - Start development server
- `bun run build` - Build for production (`dist/server/entry.mjs` + `dist/client`)
- `bun run preview` - Run the built standalone server (reads `HOST`/`PORT`, see `.env.example`)
- `bun run check` - Typecheck, test and build
- `bun run deploy` - Push `main` and release it on forge-1 (`forge/bin/release bbellini-io <sha>`)
- `bun run astro` - Run Astro CLI commands

## Project Overview
**Framework**: Astro with TypeScript and Tailwind CSS, `@astrojs/node` in standalone mode
**Hosting**: forge-1 as `pi-site@bbellini-io` on port 4015 behind Caddy and the Cloudflare Tunnel (the `forge` repo holds the Caddy block, port registry and Gatus checks). Every page is prerendered; the one on-demand route is `/api/weather`, which reads `TOMORROW_API_KEY` from the unit's env file (`~/.config/pi-sites/bbellini-io.env` on the box)
**Styling**: Terminal-themed design with custom pixel fonts and CSS custom properties

## Code Conventions
- Component files: PascalCase.astro
- Types: PascalCase interfaces
- Imports: Relative paths for local files
- Props: Interface definitions in Astro frontmatter
- Components: Use slots for content injection

# Design Principles & Rules

## Typography Hierarchy
- **font-sharp-alt**: Body text & UI elements, non-CTA buttons, text-[8px], links (hover color-accent + underline)
- **font-sharp**: Navigation links, CTA buttons, icons, text-[8px], hover color-accent
- **font-eagle**: All headings/titles, color-accent, uppercase, text-xs (largest text size)

## Typography Rules
- **Default text size**: text-[8px] for all text unless specified otherwise
- **Terminal window text**: ALL CAPS using font-sharp-alt with normal text color
- **Links**: text-accent color, underlined on hover
- **Bold text replacement**: Use font-sharp instead of bold font-sharp-alt
- **Navigation links**: font-sharp, default text color, hover to accent color
- **List bullets**: Use dollar sign ($) instead of bullet points in all lists

## Button States & Styling
- **CTA buttons**: 
  - Default: Solid background
  - Hover: Outlined/border only
  - Use an Icon (left side of text)
- **Non-CTA buttons**: 
  - Default: Outlined/border only (color-accent)
  - Hover: Solid background using accent color, text-primary
- **Button text**: font-sharp for CTA buttons, font-sharp-alt for non-CTA buttons

## Heading Standards
- **Main headings**: font-eagle, uppercase, text-xs, color-accent
- **Subheadings**: font-sharp-alt, text-xs, text-accent (for second headings within terminal windows)
- **Hierarchy**: Use font-eagle text-xs as the largest text size for main headings

## Icon Usage
- **Icons**: Use https://teenyicons.com/ for icons
- **Icon size**: Use h-4 w-4 for icons