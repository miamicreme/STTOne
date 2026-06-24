# Southern Tier Operations Command Center

A premium, boardroom-ready internal cockpit for **Southern Tier Telecommunications** —
a multi-state telecom field-construction contractor (Fort Myers HQ; active work in
Ohio, Nevada, and Southwest Florida).

> _Built on Execution. Elevated by Excellence._

This is a **single-page React + TypeScript prototype** built for a live leadership
interview demo. All data is simulated in-memory — there is no backend, no API calls,
and no persistence. Every page is labeled **"Demo data — interview prototype only."**

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run build     # production build → static export in ./out
npm run start     # serve the production build
```

## Tech stack

- **Next.js 14 (App Router) + React 18 + TypeScript** — `output: 'export'`, fully static
- **Tailwind CSS** — deep navy/slate theme, single cyan accent
- **Recharts** — all charts
- **lucide-react** — all icons
- State held entirely in React via a single `useReducer` context (no localStorage).

The entire UI is a client component tree (`src/App.tsx` is `'use client'`); the
App Router shell (`src/app/layout.tsx`, `src/app/page.tsx`) just hosts it.

## The pages

| Page | What it shows |
|---|---|
| **Executive Home** | 6 KPI cards, operational-pulse banner, stacked portfolio-by-region chart, and a live exception drawer. |
| **CEO / Board View** | Board KPIs, a regional risk heat map, a transformation roadmap, an at-risk programs list, and a modeled-impact (ROI) panel. |
| **New Hire Automation** | The signature feature: an animated 8-step onboarding pipeline (Paychex → Integration → PenguinData → Fleet → Audit) with a **failure-variant toggle** that halts at vehicle eligibility and routes the worker to the exception queue. Every run appends to an audit timeline. |
| **Drive Cleanup Center** | File-volume cards, a donut by document domain, a duplicate tracker, a permission-risk panel, and per-domain migration progress bars. |
| **Integration Health** | System status cards (Paychex / PenguinData / QuickBooks / Drive), a live event feed, a live exception taxonomy chart, and a retryable exception queue. |
| **Field Ops / Fleet** | Fleet-health chart, utilization gauge, overdue-maintenance list, and a crew board. |
| **Project Portfolio** | Project table with per-project issues, a phase funnel, and an at-risk panel. |
| **Employee Portal** | Technician identity, today’s assignment schedule, a my-truck card, certifications with expiry status, and a documents checklist. |

## Cross-page reactivity (the part that makes it feel real)

A single app-level state object (`src/state/AppContext.tsx`) is the source of truth.
When the **New Hire Automation** flow runs:

- a **success** appends an audit entry + a live integration event;
- a **failure** additionally pushes a new **exception** into shared state.

Those exceptions immediately propagate to:

- the **Executive Home** exception drawer and the operational-pulse banner count,
- the **Integration Health** exception queue, taxonomy chart, and counters,
- the sidebar badge.

Retrying/resolving an exception anywhere removes it everywhere.

## Guided Tour

The top-bar **Guided Tour** button starts a step-by-step walkthrough: a spotlight
dims the screen, highlights the relevant element, and a bubble explains it in plain
language — navigating across pages (Executive Home → New Hire Automation → Integration
Health → Board View) as it goes. Drive it with Next/Back, the progress dots, the arrow
keys, or `Esc` to exit. The bubble docks as a bottom sheet on phones and anchors to the
highlighted element on larger screens.

## Boardroom Mode

The top-bar **Boardroom Mode** toggle hides the sidebar nav and enlarges KPI cards and
spacing for screen-share / projector legibility.

## Project structure

```
src/
  app/
    layout.tsx             Root layout (fonts, metadata)
    page.tsx               Renders <App/>
  App.tsx                  'use client' shell + in-app routing
  data.ts                  All typed mock data + interfaces
  state/AppContext.tsx     Shared reducer-backed app state
  components/              Reusable: Card, KPICard, StatusBadge,
                           ProgressBar, ExceptionRow, Timeline, Sidebar, TopBar
  pages/                   One file per page
  utils/time.ts            Live timestamp helpers
```

## Deploy (Render static site)

A `render.yaml` blueprint is included. In Render: **New + → Blueprint →**
connect this repo **→ Apply**. It builds with `npm run build` and publishes
the `./out` directory. Build command / publish dir for a manual Static Site:

- Build Command: `npm install && npm run build`
- Publish Directory: `out`

See [`SttoneContext.md`](./SttoneContext.md) for the company research brief that
informs the tone, copy, and simulated figures.
