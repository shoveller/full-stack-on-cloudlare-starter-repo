# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack monorepo built on Cloudflare infrastructure, consisting of:
- **user-application**: React SPA with TanStack Router, tRPC, and shadcn/ui
- **data-service**: Cloudflare Worker service (currently minimal)
- **@repo/data-ops**: Shared package for database operations, schemas, and authentication

## Architecture

### Monorepo Structure
The project uses pnpm workspaces with three main packages:
- `apps/user-application` - Frontend application
- `apps/data-service` - Backend Worker service
- `packages/data-ops` - Shared data layer

### User Application
- **Frontend**: React 19 with Vite 7, TanStack Router v1, TanStack Query
- **Backend**: Cloudflare Worker with tRPC (worker/index.ts handles all requests)
- **Routing**: File-based routing via TanStack Router (routes defined in src/routes/)
- **Data Fetching**: tRPC client configured in src/router.tsx, proxied through /trpc endpoint
- **UI Components**: shadcn/ui components (Radix UI primitives + Tailwind)
- **Authentication**: better-auth with Stripe integration
- **Styling**: Tailwind CSS v4 with custom theme support

### Data Operations Package
- **Database**: Drizzle ORM with Cloudflare D1 (SQLite)
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Exports**: Database helpers, Zod schemas, Durable Object helpers, and auth configuration
- Database initialization pattern: call `initDatabase()` with D1 binding, then use `getDb()`

### tRPC Architecture
- Router defined in apps/user-application/worker/trpc/router.ts
- Current routers: links, evaluations
- Context creation in worker/trpc/context.ts provides env and worker context
- Frontend uses createTRPCOptionsProxy for type-safe queries

## Development Commands

### Root Level
```bash
# Build shared package (required before first run)
pnpm build-package

# Run frontend in development mode
pnpm dev-frontend

# Run data service in development mode
pnpm dev-data-service
```

### User Application (apps/user-application)
```bash
# Development server on port 3000
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Deploy to Cloudflare
pnpm deploy

# Generate Cloudflare types
pnpm cf-typegen
```

### Data Service (apps/data-service)
```bash
# Development with remote bindings
pnpm dev

# Deploy to Cloudflare
pnpm deploy

# Run tests with Vitest
pnpm test

# Generate Cloudflare types
pnpm cf-typegen
```

### Data Operations Package (packages/data-ops)
```bash
# Build the package (required after schema changes)
pnpm build

# Pull schema from remote D1 database
pnpm pull

# Generate migration files
pnpm generate

# Apply migrations
pnpm migrate

# Open Drizzle Studio
pnpm studio

# Generate better-auth schema
pnpm better-auth-generate
```

## Key Patterns

### Adding a New tRPC Route
1. Create router file in apps/user-application/worker/trpc/routers/
2. Export router using tRPC instance from worker/trpc/trpc-instance.ts
3. Add to appRouter in worker/trpc/router.ts
4. Frontend types automatically update via type inference

### Database Schema Changes
1. Modify schema in packages/data-ops/src/
2. Run `pnpm generate` to create migration
3. Run `pnpm migrate` to apply migration
4. Run `pnpm build` to rebuild package
5. Restart applications to use updated schema

### Cloudflare Configuration
- Both applications use wrangler.jsonc for configuration
- Compatibility date: 2025-06-17
- Node.js compatibility enabled on data-service
- User application uses SPA mode with ASSETS binding
- Observability enabled for both services

### Environment Variables for Data Operations
Drizzle Kit requires these environment variables for remote D1 operations:
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_DATABASE_ID
- CLOUDFLARE_D1_TOKEN

## Testing
- User application: Vitest with React Testing Library and jsdom
- Data service: Vitest with @cloudflare/vitest-pool-workers
- Run tests from individual app directories using `pnpm test`
