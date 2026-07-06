<p align="center">
  <img src="./Southern-Tier-Logo.webp" alt="Southern Tier Telecommunications" width="440">
</p>

<h1 align="center">Operations Command Center</h1>

<p align="center"><em>A working executive prototype and 90-day operating-model proposal for Southern Tier Telecommunications</em></p>

<p align="center"><strong>Business first. Governed data. Measured automation.</strong></p>

---

## Executive summary

Southern Tier already has useful systems of record: **Paychex** for people, **PenguinData** for operations, **QuickBooks** for finance, and **Google Drive** as the legacy document source. The opportunity is not to replace those tools. The opportunity is to understand how the business actually works, define ownership, add one governed layer between the systems, and make exceptions visible before they become payroll, billing, field, or reporting risk.

This repository contains two things:

1. A **working executive prototype** that demonstrates the proposed operating model.
2. A **90-day execution plan** for discovery, governance, early wins, reporting readiness, Power BI readiness, automation, and AI readiness.

The modeled baseline shows **~$214,000/year in preventable leakage** across onboarding/data-entry admin, billing leakage, payroll rework, and Drive sprawl. These numbers are illustrative and should be validated in week one.

---

## The core message

> **Keep the systems of record. Add one governed layer between them. Make nothing fail silently.**

- Paychex remains the source of truth for people, workers, onboarding, and payroll.
- PenguinData remains the source of truth for operations, dispatch, fleet, and work activity.
- QuickBooks remains the source of truth for finance, invoicing, job-cost, and payables.
- Google Drive becomes a governed legacy document source, not a junk drawer.
- The command center makes mismatches visible, assigned, auditable, and recoverable.

---

## Main demo path

The current executive story is intentionally tight:

| Step | Page | What it proves |
|---|---|---|
| 1 | **Executive Brief** | The business case, modeled leakage, and why the work matters. |
| 2 | **Discovery Map** | Kohron starts by learning the business, operators, workflows, and breakpoints. |
| 3 | **Operating Model** | STT keeps Paychex, PenguinData, QuickBooks, and Drive; one governed layer controls handoffs. |
| 4 | **Exception Command Center** | Bad data becomes owned work before it becomes business risk. |
| 5 | **90-Day Plan** | The first phase is concrete: discover, govern, stabilize, and prepare the implementation path. |

The older full demo modules are still available in the archive link for deeper review, but the main navigation stays focused for leadership.

---

## First 90 days

| Phase | Focus | Deliverable |
|---|---|---|
| **Days 1–30** | Discover and baseline | Current-state map, risk/opportunity list, workflow breakpoints, first quick-win recommendations. |
| **Days 31–60** | Govern and stabilize | Source-of-truth rules, validation checks, exception categories, approval paths, and first governed workflow prototype. |
| **Days 61–90** | Visibility and implementation path | Future-state integration plan, executive dashboard definitions, security/access requirements, and implementation roadmap. |

---

## Success measures

| Metric | Target direction |
|---|---|
| Preventable leakage recovered | Up toward validated baseline |
| Duplicate entry and manual rework | Down |
| Exception visibility | Up |
| Exception resolution time | Down |
| Payroll / job-cost sync confidence | Up |
| Reporting and Power BI readiness | Up |
| Data re-clutter rate | Toward zero |

---

## What I need to begin

- Read-only or sandbox access first.
- Time with leadership, HR, operations, dispatch, finance, project leads, and field users.
- One executive sponsor and one access/approval contact.
- Company-managed equipment and accounts for secure, auditable work.

---

## Running the prototype

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm test         # Node test runner
```

**Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Recharts, local mock data, self-hosted fonts, static export for Render.

---

## Real vs. simulated

| Real, working software | Simulated for the demo |
|---|---|
| UI, state model, guided tour, command palette, page navigation, reducer tests, and cross-page exception behavior | Records, workers, files, events, projects, and all financial figures |
| Operating model: source-of-truth domains, governed layer, exception routing, audit-style flow | Live Paychex / PenguinData / QuickBooks API connections |
| Static deployable Next.js prototype | Production data, credentials, and real system writes |

The purpose is to make the operating model tangible before touching live systems.

---

<p align="center"><em>Prepared by <strong>Kohron Burton</strong> — enterprise systems, integration, product architecture, and executive-ready delivery.</em></p>
