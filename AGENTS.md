# Repository Guidelines

## Project Structure & Module Organization
- `src/app` holds Next.js 15 route handlers, layouts, and page-level logic. Keep UI stories close to their routes, and colocate route-specific metadata in the same folder.
- `src/components` exposes reusable React components; prefer PascalCase component directories with an `index.tsx` entry. Utilities that support multiple components live in `src/lib`.
- The Sanity studio lives in `sanity/` (`schemas/`, `desk/`, `env.ts`). Any schema additions should be mirrored with GROQ helpers under `src/sanity`.
- Static assets belong in `public/`. Reusable scripts (e.g., seeding) live in `scripts/`; invoke them with `pnpm exec node scripts/<file>.js`.
- The `dist/` directory is build output—never edit it manually.

## Build, Test, and Development Commands
- `pnpm dev`: start the Next.js dev server at `http://localhost:3000`.
- `pnpm build`: generate a production build and sanity-check for type issues.
- `pnpm start`: run the production server locally from the last build.
- `pnpm lint`: run ESLint with the `next/core-web-vitals` ruleset; fix lint before opening a PR.
- `pnpm sanity`: launch the Sanity Studio at `http://localhost:3333` for content authors.

## Coding Style & Naming Conventions
- TypeScript is required. Use 2-space indentation and favor explicit return types in shared utilities.
- React components, hooks, and context providers use PascalCase (`ProductCard.tsx`, `useCart.ts`); helper functions use camelCase.
- Tailwind v4 utility classes are encouraged for layout, with Styled Components reserved for complex stateful styling—keep theme tokens centralized under `src/lib`.
- Run `pnpm lint --fix` before committing, and avoid committing generated files or `.tsbuildinfo`.

## Testing Guidelines
- Automated testing is not yet wired in; new features should include either Jest/Testing Library unit tests (place under `src/__tests__/Component.test.tsx`) or documented manual QA notes in the PR description.
- When adding a testing stack, prefer pnpm-managed tooling and align filenames with `*.test.ts` or `*.test.tsx` so future runners can glob consistently.
- Exercise Sanity-related changes through the Studio and application UI; capture the scenarios you validated.

## Commit & Pull Request Guidelines
- Follow conventional commits (`feat:`, `fix:`, `chore:`) in the imperative mood, mirroring the existing history.
- Scope PRs narrowly, link relevant Linear/Jira issues, and attach before/after screenshots or screen recordings for UI impact.
- Ensure CI-critical commands (`pnpm lint`, relevant scripts/tests) pass locally. Document any follow-up tasks or known gaps in the PR body.
