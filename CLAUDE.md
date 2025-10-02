# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.4 application using React 19, TypeScript, and Tailwind CSS v4. The project uses the App Router architecture with Turbopack for fast development builds.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

Development server runs on http://localhost:3000

## Architecture

### Project Structure

- **`src/app/`** - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist fonts configuration
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles with Tailwind directives
- **`public/`** - Static assets
- **`@/*`** - Path alias mapping to `./src/*` (configured in tsconfig.json)

### Key Technologies

- **Next.js App Router** - File-based routing system in `src/app/`
- **Turbopack** - Fast bundler enabled for both dev and build
- **Tailwind CSS v4** - Utility-first CSS with PostCSS integration
- **TypeScript** - Strict mode enabled, ES2017 target
- **Geist Fonts** - Default sans and mono fonts loaded via `next/font/google`

### Configuration Notes

- ESLint uses Next.js core-web-vitals and TypeScript configs
- Path aliases configured: `@/*` maps to `src/*`
- TypeScript strict mode enabled
- Turbopack enabled for dev and build commands
