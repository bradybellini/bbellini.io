# Agent Instructions

## Build/Development Commands
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production  
- `pnpm run preview` - Preview production build
- `pnpm astro` - Run Astro CLI commands

## Project Overview
**Framework**: Astro with TypeScript, Tailwind CSS, and Cloudflare deployment
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