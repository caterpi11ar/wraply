# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wraply is an AI-powered WeChat red envelope cover generator built with Next.js. Users can create personalized red envelope designs through image uploads, text descriptions, style selection, and parameter customization.

## Commands

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Run production server
pnpm lint         # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm

## Architecture

- `app/` - Next.js App Router pages and layouts
- `public/` - Static assets
- Uses CSS custom properties for theming with dark mode support via `prefers-color-scheme`

## Code Style

This project follows Anthony Fu's preferences:
- pnpm for package management
- TypeScript with strict mode
- ESM modules (`"type": "module"`)
- ESLint for linting (no Prettier)
