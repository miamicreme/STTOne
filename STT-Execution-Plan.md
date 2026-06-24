# Lead Systems Architect & Data Integrator — Execution Plan
### Southern Tier Telecommunications · first 90 days

---

## Operating thesis

The fastest, lowest-risk path is **not** a rip-and-replace. Keep Paychex, PenguinData, and QuickBooks as the systems of record and put **one thin, governed integration layer** between them that validates, maps, de-dupes, and audits every change. Anything it can't resolve becomes a **visible exception routed to a human — never a silent failure** — and **ingest-time guards** keep the data clean so crews and office staff can't re-clutter it. A full custom platform gets built only if it beats the integration on ROI over the engagement horizon — a deliberate, measured call, not the default.

**Source-of-truth model:** Paychex owns *People* · PenguinData owns *Operations* · QuickBooks owns *Finance* · Google Drive is *Documents* (legacy → staged & governed).

---

## At a glance — 30 / 60 / 90

| Milestone | Outcome | Headline deliverables |
|---|---|---|
| **Day 30** | Backbone live + first visible win | Current-state map, quantified leakage baseline, staging/audit layer, **first production pipeline (worker sync / new-hire) with exception routing**, integration-health dashboard |
| **Day 60** | The three systems talk reliably | Full Paychex ↔ PenguinData ↔ QuickBooks pipelines (webhook/event/scheduled, idempotent), onboarding automation end-to-end, job-cost sync, exception taxonomy + workflows |
| **Day 90** | Clean by design, runs without me | Drive legacy migrated/archived, governance guards on every ingest path, payroll/ops ring-fenced, full runbooks + handoff |

---

## Phase plan

### Phase 0 — Discovery & Baseline (Days 1–10)
**Objective:** Replace assumptions with a documented current state and a quantified baseline.
- Inventory every system, account, and integration; map the *actual* hire → fleet → billing lifecycle as it runs today, including the workarounds.
- Pull API/webhook capabilities for Paychex, PenguinData, and QuickBooks — confirm what's possible natively vs. what needs middleware.
- Read-only scan of the Google Drive estate: volume, types, duplicates, ownership, and exposed/over-shared sensitive docs.
- Interview ops/dispatch, payroll/HR, finance, and field leads; capture every "random spreadsheet."
- Quantify the **leakage baseline** with real numbers (duplicate/payroll rework, billing holds, admin hours, Drive drag).

**Deliverables:** current-state architecture map · integration capability matrix · Drive audit report · baseline leakage figure + KPI targets · ranked backlog.
**Exit criteria:** signed-off source-of-truth model and a prioritized roadmap.

### Phase 1 — Foundation & First Win (Days 7–30)
**Objective:** Stand up the integration backbone and ship one win leadership can see.
- Stand up the **staging / audit datastore** — schema, audit log, exception table (the "thin layer").
- Lock the source-of-truth model in code and policy.
- Ship the first pipeline end-to-end: **Paychex → PenguinData worker sync / new-hire onboarding** with field validation and exception routing.
- Stand up **integration-health monitoring** (status, event feed, exception queue).

**Deliverables:** live staging/audit layer · first production pipeline with exception queue · health dashboard · weekly executive update format.
**Exit criteria:** one pipeline in production with zero silent failures and a measurable improvement on that flow.

### Phase 2 — Core Integration (Days 30–60)
**Objective:** Connect the three systems with reliable, idempotent pipelines.
- Build and maintain Paychex ↔ PenguinData ↔ QuickBooks pipelines (webhook, event, scheduled) with **idempotency, retries, and audit trails**.
- Complete **onboarding automation**: a hire in Paychex auto-triggers account creation, fleet assignment, and profile sync in PenguinData.
- **Job-cost sync** PenguinData → QuickBooks; daily **payroll reconciliation**.
- Expand the exception taxonomy and resolution workflows.

**Deliverables:** full pipeline catalog in production · reconciliation reports · per-pipeline runbook.
**Exit criteria:** sync-health target hit · exception MTTR target hit · billing holds trending down.

### Phase 3 — Legacy Migration (Days 45–80, overlapping)
**Objective:** Drain the decade-old Google Drive "junk drawer" into the governed architecture.
- Classify legacy files (HR, fleet, projects); **dedupe**; map into PenguinData's HR/Fleet modules or a secure archive.
- Migrate "random" local spreadsheets into the centralized system and **decommission them**.
- Remediate exposed / over-shared sensitive documents.

**Deliverables:** migration tracker · archive with retention policy · duplicate-reduction report · decommission list.
**Exit criteria:** legacy-migration target met · duplicates reduced to target · no link-public finance/PII documents remaining.

### Phase 4 — Governance & Hardening (Days 60–90)
**Objective:** Keep the system clean by design.
- Activate **ingest-time guards**: required-field validation, dedupe-on-write, schema/format enforcement, source-of-truth lock.
- **Ring-fence** Paychex/payroll and field-ops data; least-privilege access; complete audit trails.
- Publish data-entry standards so crews and office staff can't re-clutter the system.

**Deliverables:** governance ruleset live · security & compliance doc · data-entry standards.
**Exit criteria:** guards active on all ingest paths · re-clutter rate ≈ 0 · security review passed.

### Phase 5 — Handoff & Continuity (Day 90+)
**Objective:** Make it run without me.
- Runbooks, architecture docs, alerting ownership, and knowledge-transfer sessions.
- A forward roadmap for the next wave of enhancements.

**Deliverables:** full runbook/doc set · monitoring & alerting · KT sessions · forward roadmap.
**Exit criteria:** ops can run and resolve issues without the architect, documented end-to-end.

---

## Build-vs-buy decision gate

The JD invites a custom alternative — here's the discipline around it. **Default to integrating the existing stack** (lowest risk, fastest ROI). Build custom middleware or a platform only when *one* of these is true, and only with leadership sign-off on a one-page ROI case:

1. A required flow is genuinely **impossible natively** across Paychex/PenguinData/QuickBooks.
2. Integration cost **exceeds build + maintenance** over the engagement horizon.
3. Vendor limits or lock-in **block the roadmap**.

This protects budget and timeline and signals that effort goes where it returns — not into gold-plating.

---

## Success metrics (baseline → target)

| Metric | Why it matters | Direction |
|---|---|---|
| Preventable leakage recovered | The dollar case (~$214K/yr modeled) | ↑ toward target |
| Admin hours reclaimed / month | Labor is the dominant cost | ↑ (~126 hrs modeled) |
| Sync health % | Reliability of the ecosystem | → 99%+ |
| Exception MTTR | Nothing sits broken silently | ↓ |
| Duplicate records resolved | Cleanliness of the data | ↓ from backlog |
| On-time billing % / billing holds | Cash and revenue leakage | ↑ / ↓ |
| % legacy Drive migrated or archived | Junk-drawer drained | ↑ |
| Re-clutter rate (post-guard) | Does it *stay* clean | → 0 |

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| PenguinData API limits / capability gaps | Validate in Phase 0; fall back to the staging layer + middleware |
| Payroll/PII sensitivity | Ring-fence, least-privilege, no PII in logs, full audit trail |
| Data quality worse than expected | Staging + exception queue absorb it; phase the migration |
| Field-crew adoption / change resistance | Make the right way the easy way — simple entry, guards, short training, comms |
| Scope creep on a contract | Scope guardrails + decision gate + weekly executive alignment |
| Single-threaded delivery (solo) | Documentation-as-I-go and runbooks so nothing is bus-factor-1 |

---

## What I need from Southern Tier (Week 1)

- Read/sandbox access (or API credentials) for **Paychex, PenguinData, and QuickBooks**.
- A **read-only Google Drive** admin/audit grant to start.
- One **executive sponsor** and one **operations point of contact**.
- The known list of "random spreadsheets" and the pain points that hurt most.

---

## Scope guardrails

**In scope:** the integration backbone, the three-system pipelines, Drive triage and migration, governance guards, monitoring/health, and documentation.
**Out of scope** (unless ROI-justified and approved): full custom-platform replacement, net-new tooling beyond the integration layer, and data domains outside operations/people/finance.

---

*Prepared by Kohron Burton · 18+ years enterprise systems & integration · modern TypeScript / Supabase delivery stack.*
