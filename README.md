<p align="center">
  <img src="./Southern-Tier-Logo.webp" alt="Southern Tier Telecommunications" width="440">
</p>

<h1 align="center">Operations Command Center</h1>

<p align="center"><em>A working prototype and integration proposal for Southern Tier Telecommunications</em></p>

<p align="center"><strong>Built on Execution. Elevated by Excellence.</strong></p>

---

## Executive summary

Southern Tier runs on three strong systems — **Paychex, PenguinData, and QuickBooks** — and a decade of operational history. Today those systems don't talk to each other, and much of that history sits unstructured in Google Drive. The result is manual onboarding, duplicated work, delayed billing, and an estimated **~$214,000 a year in preventable leakage**.

This repository contains two things:

1. A **working prototype** — the Operations Command Center — that demonstrates the proposed operating model end to end.
2. A **90-day plan** to deliver it against your live systems.

The proposal is straightforward: keep your systems of record, connect them with one governed integration layer, automate the work done by hand today, and put guardrails in place so the data stays clean. *(The prototype uses simulated data, anchored to Southern Tier's real footprint, to make the model tangible.)*

---

## The challenge today

- A decade of HR, fleet, and project files accumulated loosely in Google Drive — a "junk drawer" that's hard to search, duplicate-heavy, and inconsistently secured.
- Paychex, PenguinData, and QuickBooks operate in silos; data is re-keyed by hand between them.
- Onboarding a new hire is manual and error-prone — and nothing reliably stops a non-compliant hire from slipping through.
- Failures are silent. Mismatches and missing fields surface late, as billing holds or payroll rework.
- Nothing prevents staff and crews from re-cluttering the system over time.

---

## The opportunity

Closing those gaps is worth an estimated **~$214K per year**, modeled across four areas:

| Area | Modeled annual value | Driver |
|---|---|---|
| Onboarding & data-entry admin | **~$72K** | ~126 admin hours / month reclaimed |
| Billing leakage | **~$82K** | Held and mis-coded work across programs |
| Payroll rework & overpayment | **~$38K** | Duplicate / mismatched worker records |
| Drive sprawl | **~$22K** | Duplicate files + permission cleanup |

Beyond the dollars: **faster onboarding, reliable billing, clean and searchable records, and real-time executive visibility.**

---

## The approach

> **Keep the systems of record. Add one governed layer between them. Make nothing fail silently.**

- **One source of truth per domain.** Paychex owns *People*. PenguinData owns *Operations*. QuickBooks owns *Finance*. Google Drive becomes governed *Documents*.
- **A thin integration layer** validates, maps, de-duplicates, and audits every change between systems — no rip-and-replace.
- **Exceptions, not silent failures.** Anything the system can't resolve is routed to a person, visibly.
- **Guards at the point of entry** keep the data clean by design, so it can't re-clutter.

A full custom platform is built only where it clearly beats integration on return — a deliberate decision, not the default.

---

## What the prototype demonstrates

| Capability | The benefit it proves |
|---|---|
| **Executive & Board view** | One screen for KPIs, regional risk, and modeled ROI |
| **Integration Architecture** | The full data-flow blueprint and source-of-truth model |
| **Automated onboarding** | A new hire in Paychex provisions accounts, fleet, and profile automatically — and a non-compliant hire is stopped *before* dispatch |
| **Integration health** | Live system status, a flowing event feed, and a retryable exception queue |
| **Drive cleanup** | A decade of files classified, de-duplicated, and de-risked |
| **Field ops & fleet** | Fleet health, utilization, and maintenance at a glance |
| **Project portfolio** | Program health and at-risk work across every region |

The prototype also ships with a **self-running guided tour** — open the link and it walks the full story in about 40 seconds, including the onboarding pipeline catching a non-compliant hire in real time. A **Boardroom Mode** enlarges everything for screen-share or projector.

---

## Timeline — 30 / 60 / 90

| Milestone | Outcome |
|---|---|
| **Day 30** | Integration backbone live; first automated pipeline in production with exception routing; current-state map and quantified baseline complete |
| **Day 60** | Paychex, PenguinData, and QuickBooks connected with reliable, audited pipelines; onboarding fully automated; job-cost and payroll sync running |
| **Day 90** | Legacy Drive migrated or archived; governance guards on every entry path; payroll and operations ring-fenced; full documentation and handoff |

---

## The plan

- **Phase 0 — Discovery & baseline** *(Days 1–10):* document the current state, confirm API capabilities, audit the Drive estate, and quantify the real leakage figure.
- **Phase 1 — Foundation & first win** *(Days 7–30):* stand up the staging / audit layer and ship the first automated pipeline with exception routing.
- **Phase 2 — Core integration** *(Days 30–60):* connect all three systems with idempotent, audited pipelines; complete onboarding automation.
- **Phase 3 — Legacy migration** *(Days 45–80):* classify, de-duplicate, and migrate or archive the Drive backlog; retire stray spreadsheets.
- **Phase 4 — Governance & hardening** *(Days 60–90):* activate ingest guards, ring-fence sensitive data, and publish data standards.
- **Phase 5 — Handoff** *(Day 90+):* runbooks, monitoring, knowledge transfer, and a forward roadmap.

> The full breakdown — activities, deliverables, and exit criteria per phase — is in **[STT-Execution-Plan.md](./STT-Execution-Plan.md)**.

---

## How success is measured

| Metric | Target direction |
|---|---|
| Preventable leakage recovered | ↑ toward the modeled ~$214K |
| Admin hours reclaimed / month | ↑ (~126 modeled) |
| Cross-system sync health | → 99%+ |
| Exception resolution time | ↓ |
| Duplicate records | ↓ |
| On-time billing | ↑ |
| Legacy Drive migrated / archived | ↑ |
| Data re-clutter rate | → 0 |

---

## What I need to begin (Week 1)

- Read or sandbox access (or API credentials) for Paychex, PenguinData, and QuickBooks.
- A read-only Google Drive audit grant.
- One executive sponsor and one operations point of contact.

---

## Appendix — running the prototype

Working software, not slideware. To run it locally:

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

**Stack:** Next.js 14 (App Router, static export) · React 18 · TypeScript · Tailwind CSS · Recharts. No backend and no persistence — all data is simulated in memory, and every screen is labeled *"Demo data — interview prototype only."* Fonts are self-hosted, so the build has no external dependencies; it deploys to any static host (a Render blueprint is included).

---

<p align="center"><em>Prepared by <strong>Kohron Burton</strong> — 18+ years in enterprise systems and integration, delivering on a modern TypeScript / Supabase stack.</em></p>
