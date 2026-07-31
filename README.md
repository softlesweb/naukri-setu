# NaukriSetu

A responsive portal for government job notifications, results, admit cards,
answer keys, admissions, scholarships, and related updates.

## Requirements

- Node.js 22.13 or newer
- pnpm

## Local development

```bash
nvm use 22
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm dev          # Start the development server
pnpm build        # Create and validate a production build
pnpm start        # Run the production build locally
pnpm lint         # Run code-quality checks
pnpm test         # Run automated tests
```

## Access and publishing

The public website is read-only and requires no visitor account. Administrators
create, review, and publish content in Sanity Studio; there is no custom login,
account database, public admin form, or Supabase dependency in this application.

Copy `.env.example` to `.env.local`, add the Sanity project ID, and run:

```bash
pnpm studio
```

The same literal project ID and dataset are configured under both
`NEXT_PUBLIC_SANITY_*` for Next.js and `SANITY_STUDIO_*` for Sanity Studio.

Sanity Studio handles administrator access. For a private dataset, the public
application reads through its server using `SANITY_API_READ_TOKEN` with Sanity's
Viewer role. This token must never use a `NEXT_PUBLIC_` or `SANITY_STUDIO_`
prefix. A write token is only used locally by the sample-data seeder:

```bash
pnpm seed
```

## Project structure

- `app/portal.tsx` — main interactive portal
- `app/page.tsx` — home route
- `app/layout.tsx` — root layout and metadata
- `app/styles/` — formatted global, component, typography, and responsive styles
- `sanity/schemaTypes/` — administrator content schemas
- `sanity/lib/` — public projections and derived breadcrumbs
- `public/` — static assets and social preview
- `tests/` — architecture and product-shell checks

## Architecture

The project uses standard Next.js and React without Vinext, Vite, Wrangler,
Cloudflare Workers, D1, Drizzle, Supabase, Tailwind, or a custom authentication
service. Sanity is the only content backend and administrator publishing
interface.

## Current status

The public React frontend is connected directly to Sanity. Homepage cards,
section archives, paths, metadata, and complete detail pages are generated from
published Sanity documents; there is no local notification catalog or fallback
dummy content.
