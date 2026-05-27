# WebForm — Form Builder SaaS

A production-style form builder platform (Typeform/Google Forms clone) with form creation, public form filling, response analytics, and API documentation. Built with a Marvel/Spider-Man design system.

## Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS, TipTap editor, shadcn/ui
- **Backend**: Express.js, tRPC v11, Drizzle ORM, Zod
- **Database**: PostgreSQL 16
- **Monorepo**: Turborepo + pnpm workspaces
- **API Docs**: Scalar (OpenAPI 3.0 via trpc-to-openapi)

## Features

- Email/password and Google OAuth authentication
- Create, edit, publish/unpublish and share forms
- 9 field types: short text, long text, email, number, date, dropdown, multi-select, radio, checkbox
- Public and unlisted form visibility modes
- Public explore page for public forms
- Form submission without login (public respondents)
- Response analytics with field breakdowns
- Rate limiting on submission endpoints
- API documentation at `/docs` (protected — must be logged in)

- Pricing page, landing page (Marvel/Spider-Man theme)

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### 1. Clone and install

```bash
git clone <repo-url>
cd form-builder
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — the defaults work for local dev with Docker. To enable Google OAuth, fill in:

```
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Set the authorized redirect URI to `http://localhost:3000/api/auth/google/callback`.

### 4. Run migrations

```bash
pnpm db:migrate
```

### 5. Seed demo data

```bash
pnpm db:seed
```

This creates a demo user and 3 themed sample forms with pre-filled responses.

### 6. Start dev servers

```bash
pnpm dev
```

- **Web app**: http://localhost:3000
- **API**: http://localhost:8080
- **API Docs** (Scalar): http://localhost:3000/docs _(login required)_

## Demo Credentials

After running `pnpm db:seed`:

| Field | Value |
|-------|-------|
| Email | `demo@webform.app` |
| Password | `demo1234` |

The demo account comes with 3 pre-built themed forms and sample submission data (Spider-Man Fan Quiz, Startup Pitch Evaluator, Anime Preferences Survey).

## Project Structure

```
form-builder/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   └── api/          # Express backend (port 8080)
├── packages/
│   ├── database/     # Drizzle schema, migrations, seed
│   ├── services/     # Business logic (Auth, Form, Field, Submission)
│   ├── trpc/         # tRPC router, procedures, context
│   ├── logger/       # Structured logger (pino)
│   └── ui/           # Shared UI components (shadcn)
```

## API Documentation

Full API reference is available at `/docs` (requires login). Built with Scalar + trpc-to-openapi.

### Key endpoints (via tRPC)

| Procedure | Description |
|-----------|-------------|
| `auth.me` | Get current user |
| `auth.getSupportedProviders` | List OAuth providers |
| `form.list` | List creator's forms |
| `form.getPublic` | List public forms (no auth) |
| `form.getBySlug` | Get form for public filling (no auth) |
| `form.create` | Create a new form |
| `form.publish` / `form.unpublish` | Toggle form visibility |
| `field.create` | Add a field to a form |
| `field.update` | Update field config |
| `field.delete` | Remove a field |
| `field.reorder` | Reorder fields |
| `submission.submit` | Submit a form response (no auth, rate-limited) |
| `submission.getByFormId` | Get responses for a form |
| `submission.getAnalytics` | Get analytics for a form |

### REST endpoints (auth)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Register with email + password |
| `POST` | `/api/auth/login` | Login with email + password |
| `POST` | `/api/auth/logout` | Clear session |
| `GET` | `/api/auth/google` | Start Google OAuth |
| `GET` | `/api/auth/google/callback` | Google OAuth callback |

## Database Scripts

```bash
pnpm db:generate   # Generate migration from schema changes
pnpm db:migrate    # Apply pending migrations
pnpm db:seed       # Seed demo data
pnpm db:studio     # Open Drizzle Studio (DB GUI)
```

## Deployment

The app is designed to run as two separate services (Next.js + Express). Recommended:

1. Deploy Express API to Railway, Render, or Fly.io
2. Deploy Next.js to Vercel or the same platform
3. Set `API_INTERNAL_URL` in Next.js env to point to the API service
4. Provision a managed PostgreSQL instance (Neon, Supabase, Railway)
5. Run migrations against production DB: `DATABASE_URL=<prod_url> pnpm db:migrate`
6. Seed initial data: `DATABASE_URL=<prod_url> pnpm db:seed`
