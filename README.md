# BankAgent — Agentic AI for Payments, Operations & Compliance

An enterprise AI-assisted platform for a bank's Payments, Operations, and Compliance functions. Consolidates 11 use cases into a single web application, each powered by the Anthropic Claude API with human-in-the-loop review.

## Status

| Module | Code | Status |
| ------ | ---- | ------ |
| SOP Deviation Identification | UC-01 | ✅ Implemented (reference) |
| Anomaly Detection | UC-02 | 📋 Planned |
| Decisioning | UC-03 | 📋 Planned |
| Customer Onboarding & Account Setup | UC-04 | 📋 Planned |
| Field Visit Report Analyser | UC-05 | 📋 Planned |
| Process Analytics & TAT | UC-06 | 📋 Planned |
| Branch Operations Analytics | UC-07 | 📋 Planned |
| Incident Investigation | UC-08 | 📋 Planned |
| Regulatory Companion | UC-09 | 📋 Planned |
| Compliance Planning | UC-10 | 📋 Planned |
| Case Investigation & Reporting | UC-11 | 📋 Planned |

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + Lucide icons
- **Data:** PostgreSQL + Prisma ORM
- **AI:** Anthropic Claude API (`@anthropic-ai/sdk`)
- **Validation:** Zod

## Local development

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
# Edit .env and set DATABASE_URL and ANTHROPIC_API_KEY

# 3. Initialise DB
npx prisma db push

# 4. Run
npm run dev
```

App runs on http://localhost:3000

## Deployment (Render)

The repo includes `render.yaml` for one-click deployment via [Render Blueprints](https://render.com/docs/blueprint-spec).

1. In Render, choose **New → Blueprint** and point it at this repository.
2. Render will provision:
   - The web service (Next.js)
   - A PostgreSQL database (`ai-bank-db`)
3. Set the `ANTHROPIC_API_KEY` environment variable in the Render dashboard (it is marked `sync: false` so it must be entered manually).
4. First deploy runs migrations and starts the app.

## Project structure

```
├── app/
│   ├── (app)/            # Authenticated app shell
│   │   ├── layout.tsx    # Sidebar + topbar
│   │   ├── dashboard/
│   │   └── uc-01-.../    # One folder per use case
│   └── api/              # API routes
├── components/
│   ├── shell/            # Sidebar, topbar, page header, planned-module
│   └── ui/               # Shared UI primitives
├── lib/
│   ├── ai/claude.ts      # Central Claude wrapper (with audit logging)
│   ├── db/prisma.ts
│   └── utils/api.ts      # API response envelope helpers
├── modules/
│   └── uc-01-sop-deviation/  # Server-side logic per use case
├── prisma/
│   └── schema.prisma
└── render.yaml
```

## How to add a new use case

1. Add DB models to `prisma/schema.prisma`, then `npx prisma db push`
2. Create the module folder under `modules/uc-XX-slug/` with `prompts.ts` and `service.ts`
3. Add API routes under `app/api/ucXX/...`
4. Create the UI page under `app/(app)/uc-XX-slug/page.tsx`
5. UC-01 is the canonical reference — copy its structure

## Design conventions

- **API envelope:** `{ success, data, error, meta }` — use helpers in `lib/utils/api.ts`
- **Claude calls:** always via `callClaude()` in `lib/ai/claude.ts` — this handles audit logging
- **Colours:** `brand-*` scale in Tailwind, blue enterprise-banking palette
- **Every AI decision is reviewable, editable, and audited**

## License

Confidential — internal use only.
