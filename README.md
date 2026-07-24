# BankAgent — Agentic AI for Payments, Operations & Compliance

An enterprise AI-assisted platform for a bank's Payments, Operations, and Compliance functions. Consolidates 11 use cases into a single web application, each powered by the Anthropic Claude API with human-in-the-loop review.

> **Storage note:** This build uses **in-memory storage** so it deploys with zero infrastructure — no database required. Data resets on server restart. When you're ready to make it persistent, swap `lib/store.ts` for Prisma + Postgres.

## Modules

| Code | Module | Status |
| ---- | ------ | ------ |
| UC-01 | SOP Deviation Identification | ✅ Live (reference implementation) |
| UC-02 | Anomaly Detection | 📋 Planned |
| UC-03 | Decisioning | 📋 Planned |
| UC-04 | Customer Onboarding & Account Setup | 📋 Planned |
| UC-05 | Field Visit Report Analyser | 📋 Planned |
| UC-06 | Process Analytics & TAT | 📋 Planned |
| UC-07 | Branch Operations Analytics | 📋 Planned |
| UC-08 | Incident Investigation | 📋 Planned |
| UC-09 | Regulatory Companion | 📋 Planned |
| UC-10 | Compliance Planning | 📋 Planned |
| UC-11 | Case Investigation & Reporting | 📋 Planned |

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Lucide icons
- Anthropic Claude API (`@anthropic-ai/sdk`)
- Zod for validation
- In-memory store (drop-in replacement for a DB, for demo purposes)

## Local development

```bash
npm install
cp .env.example .env         # then set ANTHROPIC_API_KEY
npm run dev
```

Runs on http://localhost:3000

## Deploy to Render

1. Push this repo to GitHub (already done)
2. Render dashboard → **New → Blueprint** → select the repo
3. Render reads `render.yaml` and creates the web service (no DB needed)
4. When prompted, set `ANTHROPIC_API_KEY` to your key from https://console.anthropic.com
5. First deploy takes ~3 minutes

## Project structure

```
├── app/
│   ├── (app)/            # App shell with sidebar
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   └── uc-01-.../    # One folder per use case
│   └── api/              # API routes
├── components/
│   ├── shell/            # Sidebar, topbar, page header
│   └── ui/
├── lib/
│   ├── ai/claude.ts      # Central Claude wrapper
│   ├── store.ts          # In-memory data store
│   └── utils/api.ts      # API response envelope
├── modules/
│   └── uc-01-sop-deviation/  # Per-use-case server logic
└── render.yaml
```

## Adding a new use case

1. Create `modules/uc-XX-slug/` with `prompts.ts` + `service.ts`
2. Add API routes under `app/api/ucXX/...`
3. Create UI page under `app/(app)/uc-XX-slug/page.tsx`
4. Use UC-01 as the reference

## Switching to a real database later

Replace `lib/store.ts` calls with Prisma. The store exposes an intentionally small interface (`Applications`, `Deviations`, `AICallLog`) so the swap touches only that file and `lib/ai/claude.ts`.

## License

Confidential — internal use only.
