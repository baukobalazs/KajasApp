# KajApp — Copilot Instructions

## Project Overview
KajApp is a personal nutrition tracking web application built as a university project.
Hungarian UI language throughout the entire application.

## Tech Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **MUI (Material UI v6)**
- **Drizzle ORM** + **Neon PostgreSQL**
- **NextAuth v4** — credentials-based authentication
- **SWR** — data fetching and caching
- **Zod v4** — validation
- **OpenFoodFacts API** — food database

## Critical Breaking Changes (always apply these)
- MUI Grid v6: use `item` with `xs`/`sm`/`md`/`lg` props (do not use `size`)
- Next.js 15: `params` and `searchParams` are Promise-wrapped → always `await params`
- Zod v4: use `.issues` not `.errors`
- Always use `pnpm`, never `npm` or `yarn`

## Project Structure
- `app/(app)/` — protected pages (auth required)
- `app/(auth)/` — login, register pages
- `app/api/` — API routes
- `components/` — React components
- `db/` — Drizzle schema and config
- `lib/hooks/` — SWR hooks (useApi.ts)

## Coding Conventions
- All UI text in Hungarian
- MUI components for all UI elements
- Controlled inputs use local string state + onBlur pattern to avoid backspace issues
- API routes use `getServerSession` for auth checks
- `'use client'` directive on all interactive components