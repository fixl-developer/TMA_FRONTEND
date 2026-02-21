# TalentOS — Next 12 Phases Plan (Phases 25–36)

> **Scope:** Phases 25–36 (next 12 phases after Phase 24)  
> **Source:** overall.md (PRD, Main Architecture, Agency OS, Domain Blueprints)  
> **Note:** overall2.md and overall3.md were not found in workspace; plan derived from overall.md  
> **Created:** February 17, 2026

---

## Current State (Phases 1–24 Done)

| Phase | Module | Status |
|-------|--------|--------|
| 1–12 | Super Admin, Tenant Admin, Agency Shells, Auth, Pageant Engine | ✅ |
| 13–24 | Pageant Live, Community, Academy, Influencer, Super Admin, Dashboards, Security, Payments, Multi-Agency, Polish | ✅ |

---

## Phases 25–36 Overview

| Phase | Name | Focus | Est. Effort |
|-------|------|-------|-------------|
| **25** | CRM & Relationship Graph | Leads, Accounts, Contacts, Activities, Segments | 1.5 weeks |
| **26** | Proposals, Quotes & Rate Cards | Deal packaging, templates, client acceptance | 1 week |
| **27** | Contract Lifecycle (CLM) + E-Signature | Templates, clauses, obligations, e-sign flow | 1.5 weeks |
| **28** | Work Management & Run-of-Show | Tasks, checklists, project plans, event runbooks | 1 week |
| **29** | Resource & Capacity Planning | Availability, conflicts, utilization, assignments | 1 week |
| **30** | Vendor & Procurement | Vendors, RFQs, POs, goods receipt, scorecards | 1 week |
| **31** | Logistics & Kits | Shipments, tracking, product seeding, returns | 0.5 week |
| **32** | Client Portal & Communications | Threads, approvals, redacted views, notifications | 1 week |
| **33** | WES & Ops Health Dashboard | Workflow Execution Score, bottlenecks, recommendations | 1 week |
| **34** | Sponsored Ads & Measurement | Ad campaigns, creatives, targeting, ROI attribution | 1 week |
| **35** | Campaign Builder & Automation Rules | No-code campaign engine, triggers, policy packs | 1.5 weeks |
| **36** | Mobile App & Franchise Foundation | Mobile shell, franchise/branch cloning, i18n | 1.5 weeks |
| **37** | Reporting & Integrations | Cross-module reports, webhooks, API keys, audit log | 1 week |
| **38** | Support & Help Center | Tenant support cases, help center, FAQ | 0.5 week |
| **39** | Escrow & Payout Flows | Escrow accounts, status, settlement | 0.5 week |

---

## Phase 39: Escrow & Payout Flows

**Goal:** Tenant escrow accounts UI (contract/booking escrows).

**Source:** overall.md § Escrow, § Payments

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/finance/escrows` | Escrow list (CREATED, FUNDED, LOCKED, RELEASED, DISPUTED) |

### Seed Data

- Uses existing: escrows.json

---

## Phase 38: Support & Help Center

**Goal:** Tenant support cases, help center, FAQ.

**Source:** overall.md § Support, § Help

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/support` | Support cases list (tenant-scoped) |
| `/admin/support/new` | Create new support case |
| `/admin/help` | Help center, FAQ, quick links |

### Seed Data

- Uses existing: support_cases.json

---

## Phase 37: Reporting & Integrations

**Goal:** Cross-module reporting, tenant webhooks/API keys, audit log viewer.

**Source:** overall.md § Reporting, § Integrations, § Audit logs

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/reports` | Cross-module report summary (bookings, quotes, contracts, revenue) |
| `/admin/integrations` | Webhooks, API keys (tenant-scoped) |
| `/admin/audit-log` | Tenant activity log (immutable) |

### Components

- `ReportSummaryCard`, `WebhookCard`, `ApiKeyCard`, `AuditLogRow`

### Seed Data

- Uses existing: webhooks, apiKeys, platform_audit_logs; aggregates from bookings, quotes, contracts, invoices, registrations

---

## Phase 25: CRM & Relationship Graph

**Goal:** Lead-to-account pipeline, relationship graph, activity tracking.

**Source:** overall.md § Module 1 — CRM & Relationship Graph (Leads → Clients → Partners)

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/crm/leads` | Lead list, qualification, convert to account |
| `/admin/crm/accounts` | Account list (Brand/Client/Partner), detail |
| `/admin/crm/accounts/[id]` | Account detail, contacts, activities, linked objects |
| `/admin/crm/contacts` | Contact list, link to accounts |
| `/admin/crm/activities` | Calls, emails, meetings log |
| `/admin/crm/segments` | Segment builder (tags, budget, category) |

### Components

- `LeadCard`, `AccountCard`, `ContactCard`, `ActivityTimeline`
- `RelationshipGraph`, `SegmentBuilder`, `RiskFlagBadge`

### Seed Data

- `leads.json`, `accounts.json`, `contacts.json`, `activities.json`, `segments.json`

### Dependencies

- TenantAdminShell — add CRM section
- Link accounts to: bookings, campaigns, castings, projects, invoices

---

## Phase 26: Proposals, Quotes & Rate Cards

**Goal:** Turn demand into structured offers; deal packaging with deliverables, usage rights, pricing.

**Source:** overall.md § Module 2 — Proposals, Quotes, Rate Cards & Deal Packaging

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/sales/quotes` | Quote list, create from template |
| `/admin/sales/rate-cards` | Rate card library (day rate, usage, bundles) |
| `/admin/sales/quotes/create` | Wizard: template, line items, approvals |
| `/admin/sales/quotes/[id]` | Quote detail, send to client, accept/revise |
| `/admin/sales/templates` | Quote templates (Model day rate, UGC bundle, etc.) |

### Components

- `QuoteWizard`, `RateCardSelector`, `DeliverableSpecEditor`
- `ClientAcceptanceFlow`, `UsageRightTermEditor`

### Seed Data

- `rate_cards.json`, `quote_templates.json`, `quotes.json`

### Dependencies

- CRM (Phase 25) — link quotes to accounts
- Auto-generate: contract draft + escrow milestones + invoice schedule (stub)

---

## Phase 27: Contract Lifecycle (CLM) + E-Signature

**Goal:** Clause templates, approvals, versioning, obligations, e-sign flow.

**Source:** overall.md § Module 3 — Contract Lifecycle Management + E-Signature

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/contracts` | Contract list, status, obligations |
| `/admin/contracts/create` | From template + quote, clause library |
| `/admin/contracts/[id]` | Contract detail, versions, redlines |
| `/admin/contracts/[id]/sign` | E-signature flow (placeholder) |
| `/admin/contracts/templates` | Clause library, template builder |
| `/admin/contracts/obligations` | Obligations tracker (deliverables, renewals) |

### Components

- `ContractViewer`, `ClauseLibrary`, `RedlineRevision`
- `SignaturePacket`, `ObligationTracker`, `RenewalReminder`

### Seed Data

- `contracts.json`, `clause_library.json`, `contract_templates.json`, `obligations.json`

### Dependencies

- Quotes (Phase 26) — contract from quote
- overall.md § Contract templates T1–T8 (Modeling, Casting, Pageant, Influencer, Academy, Production, Staffing, Community)

---

## Phase 28: Work Management & Run-of-Show

**Goal:** Tasks, checklists, project plans, event runbooks for production/pageant/staffing.

**Source:** overall.md § Module 4 — Work Management: Tasks, Checklists, Run-of-Show

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/projects` | Project list, create from template |
| `/admin/projects/[id]` | Project detail, tasks, dependencies |
| `/admin/projects/[id]/tasks` | Task list, assignees, due dates |
| `/admin/events/[id]/run-of-show` | Event runbook, checklists, issue log |
| `/admin/projects/[id]/checklists` | Checklist templates, completion gates |

### Components

- `ProjectPlanView`, `TaskBoard`, `ChecklistEditor`
- `RunOfShowTimeline`, `IssueLog`, `DependencyGraph`

### Seed Data

- `projects.json`, `tasks.json`, `checklists.json`, `run_of_show.json`

### Dependencies

- Pageant/Event modules — link run-of-show to events
- Completion gates unlock payouts / results publish (stub)

---

## Phase 29: Resource & Capacity Planning

**Goal:** Avoid double-booking, plan utilization, allocate talent/crew/trainer hours.

**Source:** overall.md § Module 5 — Resource & Capacity Planning

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/resources` | Resource list (Talent, Crew, Trainer, Staff) |
| `/admin/resources/availability` | Availability blocks, conflicts |
| `/admin/resources/assignments` | Assignment list, conflict detection |
| `/admin/resources/utilization` | Utilization dashboards, forecasting |
| `/admin/resources/conflicts` | Conflict resolution queue |

### Components

- `AvailabilityCalendar`, `ConflictAlert`, `UtilizationChart`
- `AssignmentCard`, `CapacityChecker`

### Seed Data

- `resources.json`, `availability_blocks.json`, `assignments.json`, `conflicts.json`

### Dependencies

- B1 (Roster), B7 (Staffing) — availability/shifts
- Demand from: booking, campaign, project, shift, cohort

---

## Phase 30: Vendor & Procurement

**Goal:** Vendor onboarding, RFQs, POs, deliverable acceptance, vendor payments.

**Source:** overall.md § Module 7 — Vendor & Procurement; Vendor Pack (VND-01..10)

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/vendors` | Vendor list, onboarding, verification |
| `/admin/vendors/[id]` | Vendor detail, contracts, scorecard |
| `/admin/procurement/rfqs` | RFQ list, create from project/event |
| `/admin/procurement/pos` | Purchase orders, approval, acceptance |
| `/admin/procurement/receipts` | Goods receipt, vendor invoice payable gate |

### Components

- `VendorCard`, `RFQWizard`, `BidComparison`
- `POApprovalFlow`, `GoodsReceiptForm`, `VendorScorecard`

### Seed Data

- `vendors.json`, `rfqs.json`, `purchase_orders.json`, `vendor_scorecards.json`

### Dependencies

- Work Management (Phase 28) — RFQ from project plan
- Policy: VND-01 verification gate, VND-07 goods receipt before payment

---

## Phase 31: Logistics & Kits

**Goal:** Track shipments, product seeding (influencer), kits, returns.

**Source:** overall.md § Module 8 — Logistics: Shipping / Kits / Wardrobe / Gear

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/logistics/shipments` | Shipment list, create kit |
| `/admin/logistics/shipments/[id]` | Tracking, status, link to content/deliverables |
| `/admin/logistics/returns` | Return authorizations |
| `/admin/logistics/inventory` | Optional inventory items |

### Components

- `ShipmentCard`, `TrackingTimeline`, `KitBuilder`
- `ReturnAuthorizationForm`

### Seed Data

- `shipments.json`, `packages.json`, `tracking_events.json`

### Dependencies

- Influencer (Phase 18) — creator seeding workflow
- Link shipment to content/deliverables + ROI reporting

---

## Phase 32: Client Portal & Communications

**Goal:** Thread per workspace object, approvals, redacted client views, notifications.

**Source:** overall.md § Module 9 — Communications & Client Portal

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/comms` | Thread list, filter by object type |
| `/admin/comms/[objectType]/[objectId]` | Thread, messages, attachments, decision log |
| `/portal` | Client portal entry (redacted, role-scoped) |
| `/portal/approvals` | Pending approvals queue |
| `/admin/settings/notifications` | Notification preferences, digest, priority routing |

### Components

- `ThreadView`, `MessageComposer`, `ApprovalCard`
- `ClientPortalShell`, `RedactedView`, `DecisionLog`

### Seed Data

- `threads.json`, `messages.json`, `approvals.json`

### Dependencies

- Workspace objects: booking, casting, deal, project, event
- Policy: PRV-01 redaction profile for client viewers

---

## Phase 33: WES & Ops Health Dashboard

**Goal:** Workflow Execution Score, bottleneck heatmap, recommendations engine.

**Source:** overall.md § WES (Workflow Execution Score), Pillars A–G, Dashboards

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/ops-health` | Overall WES, breakdown by pillar |
| `/admin/ops-health/bottlenecks` | Top bottlenecks, stage time ratios |
| `/admin/ops-health/cashflow` | CCC trend, overdue invoices |
| `/admin/ops-health/disputes` | Dispute rate, resolution time |
| `/admin/ops-health/utilization` | Resource utilization, conflicts |
| `/admin/ops-health/recommendations` | Weekly “Do these 3 things” |

### Components

- `WESScoreCard`, `PillarBreakdown`, `BottleneckHeatmap`
- `CCCChart`, `RecommendationCard`, `UtilizationWidget`

### Seed Data

- `tenant_metric_snapshots.json`, `sla_clocks.json`, `approval_metrics.json`

### Dependencies

- All modules with status, owner, last_activity_at
- SLAClock, Approval, Finance events, Dispute tables (schema)

---

## Phase 34: Sponsored Ads & Measurement

**Goal:** Ad campaign wizard, creatives, targeting, approvals, ROI attribution.

**Source:** overall.md § Sponsored Ads (15A), Module 12 — Measurement & Attribution

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/ads/create` | Ad campaign wizard (objective, targeting, creative, budget) |
| `/admin/ads/[id]/creatives` | Creative library, multi-format, A/B |
| `/admin/ads/[id]/targeting` | Audience builder, geography, demographics |
| `/admin/ads/[id]/budget` | Budget allocation, spending pace, caps |
| `/admin/ads/approvals` | Pending ads queue |
| `/admin/ads/[id]/performance` | KPIs, timeline, placement breakdown, ROI |
| `/admin/ads/attribution` | Tracking links, UTM, spend → outcomes |

### Components

- `CampaignWizardStepper`, `TargetingMap`, `AudienceBuilder`
- `CreativePreview`, `BudgetAllocator`, `PerformanceChart`, `AttributionReport`

### Seed Data

- `ad_campaigns.json`, `ad_creatives.json`, `ad_targeting.json`, `ad_performance.json`

### Dependencies

- TenantAdminShell — add Ads section
- Escrow, revenue splits (stub per overall.md)

---

## Phase 35: Campaign Builder & Automation Rules

**Goal:** No-code campaign engine, triggers, conditions, actions, policy packs.

**Source:** overall.md § Campaign Launch Engine (24), Policy Packs (OPS, APR, FIN, CHG, PRV, DSP, STF, PGI, CST, VND)

### Pages

| Route | Purpose |
|-------|---------|
| `/admin/automation/campaigns` | Campaign list, create |
| `/admin/automation/campaigns/create` | Wizard: stages, actions, targeting |
| `/admin/automation/rules` | Rule list (triggers, conditions, actions) |
| `/admin/automation/policy-packs` | Policy pack toggles (OPS, APR, FIN, etc.) |
| `/admin/automation/sla` | SLA clocks, escalation rules |
| `/admin/automation/logs` | Automation execution log |

### Components

- `CampaignBuilder`, `StageEditor`, `ActionPicker`
- `TriggerConditionBuilder`, `PolicyPackCard`, `SLAConfigurator`

### Seed Data

- `campaigns.json`, `automation_rules.json`, `policy_packs.json`, `sla_configs.json`

### Dependencies

- Event streams (object_type, action, before, after)
- Policy packs: OPS-01..12, APR-01..22, FIN-01..11, CHG-01..06, PRV-01..06, DSP-01..06, STF-01..04, PGI-01..04, CST-01..12, VND-01..10

---

## Phase 36: Mobile App & Franchise Foundation

**Goal:** Mobile shell (Phase 2 in PRD), franchise/branch cloning, i18n setup.

**Source:** overall.md § Deployment Scope (Mobile App Phase 2), § 28.3 Franchise & Multi-Branch Event Ops

### Pages / Deliverables

| Area | Purpose |
|------|---------|
| Mobile shell | React Native or PWA shell for Talent + Brand roles |
| `/mobile` or PWA routes | Talent dashboard, bookings, content, wallet (mobile-optimized) |
| `/admin/franchise` | Branch list, clone from template, local customization limits |
| `/admin/franchise/[branchId]` | Branch config, policy lock, global reporting |
| i18n | next-intl or similar, locale switcher, EN + HI (India) |
| Responsive audit | All admin pages mobile-friendly |

### Components

- `MobileShell`, `BranchCloner`, `PolicyLockEditor`
- `LocaleSwitcher`, `MobileNav`

### Seed Data

- `branches.json`, `franchise_templates.json`

### Dependencies

- Pageant/Event — branch cloning
- Central policy lock, local customization limits

---

## Execution Order & Dependencies

```
Phase 25 (CRM) ──────┬──► Phase 26 (Quotes) ──► Phase 27 (CLM)
                    │
Phase 28 (Work Mgmt) ┼──► Phase 29 (Resource) ──► Phase 30 (Vendor) ──► Phase 31 (Logistics)
                    │
                    └──► Phase 32 (Client Portal)

Phase 33 (WES) ────── Depends on: 25–32 (metrics from all modules)

Phase 34 (Ads) ────── Standalone (can parallel with 33)

Phase 35 (Automation) ─ Depends on: event streams, policy packs

Phase 36 (Mobile/Franchise) ─ Can start after 32 (needs stable shells)
```

---

## Summary Table

| Phase | Module | Key Entities | Seed Files |
|-------|--------|--------------|------------|
| 25 | CRM | Lead, Account, Contact, Activity, Segment | 5 |
| 26 | Proposals | Quote, RateCard, DeliverableSpec | 3 |
| 27 | CLM | Contract, Clause, Obligation, SignaturePacket | 4 |
| 28 | Work Mgmt | ProjectPlan, Task, Checklist, RunOfShow | 4 |
| 29 | Resource | Resource, AvailabilityBlock, Assignment | 4 |
| 30 | Vendor | Vendor, RFQ, PO, GoodsReceipt | 4 |
| 31 | Logistics | Shipment, Package, TrackingEvent | 3 |
| 32 | Comms | Thread, Message, Approval | 3 |
| 33 | WES | TenantMetricSnapshot, SLAClock | 3 |
| 34 | Ads | AdCampaign, Creative, Targeting | 4 |
| 35 | Automation | Campaign, Rule, PolicyPack | 4 |
| 36 | Mobile/Franchise | Branch, Locale | 2 |

---

## Alignment with overall.md

| overall.md Section | Phases |
|--------------------|--------|
| Module 1 — CRM & Relationship Graph | 25 |
| Module 2 — Proposals, Quotes, Rate Cards | 26 |
| Module 3 — CLM + E-Signature | 27 |
| Module 4 — Work Management | 28 |
| Module 5 — Resource & Capacity | 29 |
| Module 7 — Vendor & Procurement | 30 |
| Module 8 — Logistics | 31 |
| Module 9 — Client Portal & Comms | 32 |
| WES & Ops Health | 33 |
| Sponsored Ads (15A) | 34 |
| Campaign Engine (24), Policy Packs | 35 |
| Mobile App (Phase 2), Franchise (28.3) | 36 |

---

## Notes

- **UI-first:** Phases 25–36 assume UI + seed data; backend integration in later phases.
- **overall2.md / overall3.md:** Not found; plan based solely on overall.md. If those files become available, extend plan with domain model, API catalog, security details.
- **Commission plans:** overall.md § Commission Plan Templates (C1–C4) can be wired in Phase 27 (CLM) or Phase 22 (Payments) extension.
- **22 Agency Types + B1–B10:** Already in Phase 23; Phases 25–36 add the Agency OS modules that support all blueprints.
