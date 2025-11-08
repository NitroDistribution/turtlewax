# Turtlewax Copilot Guide

## Architecture & Routing

- Next.js 15 App Router drives the site under `src/app`; `src/app/layout.tsx` wires shared fonts and defaults the `<html lang>` to the `defaultLocale` from `src/lib/i18n.ts`.
- Public pages live in `src/app/(site)/[locale]/*`; every route is locale-prefixed and validated via `isLocale`, so keep URLs as `/:locale/...` and reuse the locale-aware layout in `src/app/(site)/[locale]/layout.tsx`.
- Next 15 passes `params` as a Promise (`HomePage` in `src/app/(site)/[locale]/page.tsx`), so always `await params` inside server components and return `notFound()` for invalid locales.
- Use `generateStaticParams` from `src/app/(site)/[locale]/layout.tsx` when adding new locale-bound routes so ISR builds both `az` and `ru` versions.

## Data & CMS Integration

- Sanity queries live in `src/sanity/queries.ts`; each query accepts a `Locale` and uses `coalesce(select(...), fallback)` to pick Azerbaijani or Russian fields, so include new locales in both the GROQ and schema.
- Fetch data with async server components (`SectionHero`, `SectionFeaturesProducts`) and pass Sanity image URLs through `?auto=format` so the CDN optimizes them.
- `src/sanity/client.ts` draws its config from `sanity/env.ts`, which looks up env vars with graceful fallbacks; provide `SANITY_API_READ_TOKEN` for draft data, otherwise the client defaults to the published perspective.
- Product navigation expects slugs: `ProductCard` in `src/components/shared/product-card.tsx` links to `/products/${slug}`, so ensure Sanity slugs match the app routes.

## UI & Styling

- Tailwind CSS 4 is globally imported in `src/app/globals.css`; utility classes like `.section`, `.container`, and `.heading-*` are defined there—reuse them for consistent spacing and typography.
- Base UI primitives (e.g., `Button` in `src/components/ui/button.tsx`) wrap Radix Slot and `class-variance-authority`; prefer these over raw HTML buttons to inherit shared variants.
- Keep components server-rendered unless interactivity is required; add `"use client"` only when necessary (e.g., `LangSwitcher` relies on `usePathname`).
- When adding media, favor `next/image` as in `ProductCard` to retain automatic optimization and hover animations already styled with Tailwind transitions.

## Code Conventions & Helpers

- TypeScript path aliases map `@/*` to `src/`, `@components/*` to `src/components/`, and `@sanity/*` to `sanity/`; import using these aliases to avoid brittle relative paths.
- The `cn` helper in `src/lib/utils.ts` merges Tailwind classes; use it for conditional class assemblies instead of string concatenation.
- Localization helpers (`locales`, `isLocale`, `getLocaleFromParams`) live in `src/lib/i18n.ts`; call them before rendering locale-specific UI or when constructing links.
- Update Sanity schemas in `sanity/schemas/*.ts`, export them from `sanity/schemas/index.ts`, add desk items in `sanity/desk/structure.ts`, and mirror types in `src/sanity/types.ts` to keep the CMS and frontend aligned.

## Local Workflows

- Use pnpm (`pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`)—other package managers are not supported by project tooling.
- Run `pnpm sanity` to start the embedded Studio at `/studio`; this shares the same dataset configured in `sanity/env.ts`.
- Environment vars belong in `.env.local`; at minimum set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and read/write tokens when seeding or editing content.
- Lint before committing; ESLint config lives in `eslint.config.mjs` and ignores build artifacts, so unignored files must pass `pnpm lint`.

## Legacy Data & Scripts

- The `old-html-site/` directory holds the legacy PHP/HTML storefront; scripts in `scripts/seed-categories.js` and `scripts/seed-products.js` parse those files and upsert Sanity documents.
- Seeding scripts require `SANITY_STUDIO_WRITE_TOKEN` and load `.env`/`.env.local` automatically—inspect console warnings for missing legacy assets during runs.
- `scripts/remove-legacy-path.js` removes deprecated `legacyPath` fields after migration; run it post-seed to clean documents.
- Keep the legacy directory read-only—treat it as a data source for parsing rather than something to modernize within this repo.
