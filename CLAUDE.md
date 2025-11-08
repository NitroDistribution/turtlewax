# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Turtlewax** is a modern full-stack headless CMS website built with Next.js 15 (React 19) and Sanity as the content management backend. The site supports multiple languages (Azerbaijani and Russian) and features a product catalog with categories, featured products, and rich content sections.

**Tech Stack:**
- Frontend: Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, styled-components
- CMS: Sanity (headless CMS with cloud backend)
- Icons: Lucide React
- UI Framework: shadcn UI (component library), Radix UI primitives
- Package Manager: pnpm (required, not npm)

## Common Commands

```bash
# Development
pnpm dev              # Start Next.js dev server (http://localhost:3000)
pnpm sanity           # Start Sanity Studio CMS (http://localhost:3333/studio)

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
```

## Project Structure

### Directory Organization

```
src/
├── app/              # Next.js App Router pages & layouts
│   ├── (site)/       # Public website pages
│   │   └── [locale]/ # Dynamic locale routes (az, ru)
│   └── (sanity)/     # CMS routes (/studio)
├── components/       # React components
│   ├── layout/       # Header, Footer
│   ├── pages/        # Page sections (Hero, Products, Categories)
│   ├── shared/       # Reusable components (ProductCard, LangSwitcher)
│   └── ui/           # Base UI components
├── lib/              # Utilities (i18n config, cn() helper)
└── sanity/           # CMS client & queries
    ├── client.ts     # Sanity client configuration
    ├── queries.ts    # GROQ queries & data fetching functions
    └── types.ts      # TypeScript types for Sanity data

sanity/               # Sanity studio configuration & schemas
├── schemas/          # Content type definitions (Product, Category, Hero)
└── desk/             # Custom desk structure for content organization
```

## High-Level Architecture

### Data Flow

```
User Browser (localhost:3000)
         ↓
    Next.js Server Components
         ↓
  Sanity Client (GROQ queries)
         ↓
   Sanity Cloud API (c5fppl0v/production)
         ↓
    Content Documents (Products, Categories, Hero)
```

### Key Patterns

1. **Server-Side Rendering:** All pages use async server components for data fetching
   - Data fetched via `getHeroSection()`, `getFeaturedProducts()`, `getCategories()` etc.
   - Located in `src/sanity/queries.ts`

2. **Multilingual Content:** Queries parameterized with locale (az/ru)
   - Routes: `/:locale/*` where locale is required
   - GROQ uses `coalesce()` for fallback field selection: az > ru > default
   - Handled by `lib/i18n.ts` config

3. **Client vs Server Components:**
   - Server components by default (automatic)
   - `"use client"` only for interactive features: `LangSwitcher`, image hover effects
   - Optimizes bundle size and improves performance

4. **URL-Safe Slugs:** Pattern is `^[a-z0-9\-/]+$` (lowercase, dashes, no spaces)
   - Used in ProductCard navigation and SEO-friendly URLs

### Content Management (Sanity)

**Sanity Configuration:**
- Project ID: `c5fppl0v`
- Dataset: `production`
- Studio URL: `/studio` (embedded at `/app/(sanity)/studio/[[...tool]]/`)
- API Version: `2025-01-01`

**Document Types:**
- **Products** - Individual product entries with multilingual fields, images, prices, sizes
- **Categories** - Product categories with descriptions
- **Hero Section** - Homepage hero content (singleton document)

**Credentials:** Stored in `.env.local` (never commit)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN` (draft mode access)
- `SANITY_STUDIO_WRITE_TOKEN` (content editing)

## Development Workflow

### Adding a New Page

1. Create page file: `src/app/(site)/[locale]/page-name/page.tsx`
2. Fetch data from Sanity in async server component
3. Create section components in `src/components/pages/page-name/`
4. Add links in Header/Footer navigation

### Creating a New Content Type (Sanity Schema)

1. Create schema file: `sanity/schemas/new-type.ts`
2. Define document structure with multilingual fields (titleAz, titleRu, descriptionAz, descriptionRu)
3. Export schema in `sanity/schemas/index.ts`
4. Add to desk structure: `sanity/desk/structure.ts`
5. Create GROQ query in `src/sanity/queries.ts`
6. Create TypeScript type in `src/sanity/types.ts`

### Fetching Data in Components

```typescript
// Always async server components
import { getHeroSection } from '@sanity/queries';

export const SectionHero = async ({ locale }: { locale: string }) => {
  const data = await getHeroSection(locale);
  // Render component with data
};
```

### Styling

- **Layout/Spacing/Colors:** Use Tailwind CSS classes
- **Custom Utilities:** Defined in `src/app/globals.css`
  - `.section` - Responsive section padding (16px mobile, 20-24px desktop)
  - `.container` - Max-width wrapper (7xl)
  - `.heading-1` through `.heading-6` - Responsive typography
- **Responsive Design:** Mobile-first approach (sm, md, lg breakpoints)
- **CSS Variables:** Colors defined in globals.css for theming (primary: #00833e)

### Image Optimization

- Use Next.js `Image` component from `next/image`
- Images from Sanity CDN are automatically optimized
- Remote pattern already configured in `next.config.ts` for `cdn.sanity.io`

## Important Files & Path Aliases

**TypeScript Paths (tsconfig.json):**
- `@/*` → `src/`
- `@components/*` → `src/components/`
- `@lib/*` → `src/lib/`
- `@sanity/*` → `sanity/` (schemas, config)

**Key Configuration Files:**
- `tsconfig.json` - Path aliases, TypeScript settings
- `next.config.ts` - Image optimization (Sanity CDN)
- `sanity.config.ts` - Sanity studio configuration
- `globals.css` - Tailwind, custom utilities, design tokens
- `components.json` - shadcn UI configuration

## Supported Locales

- **az** (Azerbaijani) - Default
- **ru** (Russian)
- Routes are locale-required: `/:locale/*`
- Invalid locales trigger `notFound()`

## Recent Changes

The project is actively developing product display features:
- Featured products section with grid layout
- ProductCard component with image hover effects, price/size display
- Responsive product galleries

## Testing & Linting

```bash
pnpm lint             # Check for linting errors
```

Currently, no test runner is configured. Consider adding Jest/Vitest for unit tests if needed.

## Deployment

The application is configured for Vercel deployment with:
- Image optimization via Next.js
- Server-side rendering for SEO
- Environment variables managed in Vercel dashboard
- Sanity content automatically published to production dataset
