# TalentOS – Overall UI + Seed Data Completion Plan

> **Scope:** UI with seed data only (no backend integration)  
> **Sources:** overall.md (PRD), overall2.md (Domain Model), overall3.md (Platform Structure)  
> **Created:** February 2026

---

## 1. Executive Summary

### 1.1 Research Documents Summary

| Document | Key Content |
|----------|-------------|
| **overall.md** | PRD – Vision, 22 agency types, B1–B10 blueprints, Pageant Engine, Community, Academy, Influencer, Sponsors/Ads, Core OS modules (CRM, Sales, Contracts, Work Mgmt, etc.) |
| **overall2.md** | Domain model, bounded contexts, API catalog, state machines (Identity, Talent, Jobs, Contracts, Ledger, Payments, Escrow, Disputes, Analytics) |
| **overall3.md** | Platform structure, Super Admin, Security, Trust & Safety, STRIDE threat model |

### 1.2 Completion Status (High Level)

| Category | Status | Notes |
|----------|--------|-------|
| **Platform Core (Tenant Admin)** | ~90% | CRM, Sales, Contracts, Projects, Resources, Vendors, Logistics, Comms, Ops Health, Ads, Automation, Franchise, Reports, Support, Finance (invoices, escrows, payouts) |
| **22 Agency Types + B10** | ~85% | 23 tenants in seed; TenantContext/Auth/UI polish pending |
| **Domain Blueprints (B1–B10)** | ~85% | Pageant, Casting, Influencer, Academy, Community, etc. exist |
| **Super Admin** | ~85% | Tenants, Features, Revenue, Trust & Safety, Moderation, etc. |
| **Portal & Mobile** | ~60% | Basic stubs; needs engagement upgrades |
| **Enterprise Engagement** | ~40% | Activity feed, role-based dashboards, sparklines, empty states (see ENTERPRISE-ENGAGEMENT-PLAN.md) |

---

## 2. Platform Scope (from Research)

### 2.1 Platform Modules (overall3.md)

```
Platform
├── Tenant Management (Organizations, Users, Compliance)
├── Talent (Profiles, Portfolios, Contracts, Availability)
├── Casting & Auditions (Castings, Auditions, Shortlists, Offers)
├── Pageants & Events (Events, Judges, Voting, Tickets)
├── Influencers (Discovery, Campaigns, Reporting)
├── Academy (Courses, Mentors, Certifications)
├── Community (Feed, Groups, Moderation)
├── Collaboration (Cross-Tenant Deals, Shared Workflows, Escrow)
├── Payments (Wallets, Escrow, Payouts, Ledger)
├── Campaigns & Ads (Sponsored Listings, Ads, Analytics)
├── Automation (Rules, Workflows, Policies)
├── Analytics (Dashboards, Alerts, Reports)
├── Trust & Safety (Disputes, Moderation, Compliance)
└── Admin & Integrations (APIs, Integrations, Platform Ops)
```

### 2.2 Core OS Modules (overall.md)

- CRM & Relationship Graph
- Sales: Proposals, Quotes, Rate Cards
- Contract Lifecycle + E-Signature
- Work Management (Tasks, Checklists, Run-of-Show)
- Resource & Capacity Planning
- Finance Ops (Billing, AR/AP, Commission Splits)
- Comms (Threads, Approvals, Client Portals)
- Vendors & Procurement
- Logistics (Shipments, Returns)
- Compliance (KYC, Consents, Audit)
- Integrations Hub + Webhooks
- Analytics Warehouse + Attribution

### 2.3 Super Admin (overall3.md)

- Dashboard, Tenants, Users, Features, Revenue, Payments
- Trust & Safety, Moderation, Automation, Security
- Analytics, Integrations, Operations, Data & Legal

### 2.4 22 Agency Types → Blueprints (overall.md)

| # | Agency Type | Blueprints |
|---|-------------|------------|
| 1 | Modeling Agency | B1 |
| 2 | Talent Agency | B1+B2 |
| 3 | Casting Agency | B2 |
| 4 | Production House | B2+B6 |
| 5 | Influencer Agency | B4+B8 |
| 6 | UGC/Content Production | B6+B4 |
| 7 | Social Media Agency | B4+B8 |
| 8 | Pageant Organizer | B3+B8 |
| 9 | Pageant Training | B5+B1 |
| 10 | Acting/Modeling Academy | B5+B1 |
| 11 | Speaker Bureau | B1 |
| 12 | Sports/Esports Agency | B1+B4 |
| 13 | Event Promoter | B1+B6+B4 |
| 14 | Photography Agency | B6 |
| 15 | Styling Agency | B1+B7 |
| 16 | Event Staffing | B7+B1 |
| 17 | Creative Recruitment | B2+B6 |
| 18 | Brand/Sponsor Team | B4 |
| 19 | Media Buying Agency | B4 |
| 20 | Talent Network | B8+B1 |
| 21 | Marketplace/Aggregator | B9 |
| 22 | Holding Company | B10 |

---

## 3. Current vs Target (UI + Seed Data)

### 3.1 What Exists (Phases 14–39 Done)

- **Seed data:** 200+ JSON files across frontend, frontend-admin, frontend-superadmin
- **Tenants:** 23 tenants (22 agency types + B10 holding)
- **Pages:** Admin (CRM, Sales, Contracts, Projects, Resources, Vendors, Logistics, Comms, Ops Health, Ads, Automation, Franchise, Reports, Support, Finance), Pageant, Academy, Influencer, Community, Modelling, Portal, Mobile
- **Super Admin:** Tenants, Features, Revenue, Trust & Safety, Moderation, etc.

### 3.2 Gaps to Complete

| Gap | Source | Priority |
|-----|--------|----------|
| TenantContext/Auth for 22 tenants | 22-AGENCY-TYPES-COMPLETION-PLAN Phase 5 | High |
| TypeScript types (AGENCY_TYPE, BLUEPRINT) | 22-AGENCY-TYPES-COMPLETION-PLAN Phase 6 | High |
| Tenant switcher (search, agency type badge) | 22-AGENCY-TYPES-COMPLETION-PLAN Phase 7 | Medium |
| Super Admin tenants: agency type, blueprints, B10 sub-tenants | 22-AGENCY-TYPES-COMPLETION-PLAN Phase 7 | Medium |
| Supporting seed for new tenants (talents, castings, etc.) | 22-AGENCY-TYPES-COMPLETION-PLAN Phase 4 | Medium |
| sub_tenant_links.json for B10 | 22-AGENCY-TYPES-COMPLETION-PLAN Phase 2 | Low |
| Portal & Mobile engagement upgrades | ENTERPRISE-ENGAGEMENT-PLAN | Medium |
| Activity feed, role-based dashboards, sparklines | ENTERPRISE-ENGAGEMENT-PLAN | Medium |
| Empty state CTAs, skeleton loaders | ENTERPRISE-ENGAGEMENT-PLAN | Low |

---

## 4. Phased Plan (UI + Seed Data Only)

### Phase A: 22 Agency Types Completion (1–2 days)

**Goal:** Fully operational 22 agency types with correct tenant resolution and UI.

| Task | Details | Status |
|------|---------|--------|
| A1. TenantContext & Auth | Derive `availableTenantIds` from `user.tenantIds`; add demo users for new tenants | Done |
| A2. TypeScript types | AGENCY_TYPE enum, BLUEPRINT enum, `parentTenantId` on Tenant | Done |
| A3. sub_tenant_links.json | B10 → sub-tenant links (tenant_023 → tenant_001, tenant_004, tenant_006) | Done |
| A4. Supporting seed | 1–2 talents/castings/bookings per representative tenant | Done |
| A5. Tenant switcher | Search/filter when >10 tenants; agency type badge | Done |
| A6. Super Admin tenants | agencyType, blueprints columns; B10 sub-tenant expand | Done |

**Deliverables:** All 22 agency types usable; B10 shows sub-tenants; tenant switcher works for 23 tenants.

---

### Phase B: Seed Data Enrichment (1–2 days)

**Goal:** Ensure every major module has representative seed data across tenant types.

| Task | Details | Status |
|------|---------|--------|
| B1. Talents | 1–2 per B1/B2/B5 tenant; skip B4-only brands | Done |
| B2. Castings | 1–2 for casting/production tenants | Done |
| B3. Bookings | 1 per B1 tenant | Done |
| B4. Contracts | 1 per agency with contracts | Done |
| B5. Campaigns | 1 per B4 tenant | Done |
| B6. Courses | 1 per B5 tenant | Done |
| B7. Wallets | 1 per tenant | Done |
| B8. Teams | 1 per tenant | Done |

**Deliverables:** No empty states for core entities when switching tenants.

---

### Phase C: Portal & Mobile Polish (1 day)

**Goal:** Portal and Mobile feel complete with seed data.

| Task | Details | Status |
|------|---------|--------|
| C1. Portal dashboard | Welcome, pending approvals count, recent threads, quick links | Done |
| C2. Mobile dashboard | Greeting, next booking, pending approval, wallet balance | Done |
| C3. Seed for portal | approvals.json, threads with messages | Done |

**Deliverables:** Portal and Mobile dashboards show meaningful data.

---

### Phase D: Enterprise Engagement (1–2 days)

**Goal:** Platform feels alive and role-aware (from ENTERPRISE-ENGAGEMENT-PLAN).

| Task | Details | Status |
|------|---------|--------|
| D1. Global activity feed | "Recent activity" stream (5–10 items from seed) | Done |
| D2. "Your focus" widget | Top 3–5 items needing action | Done |
| D3. Sparklines in metric cards | 7-day trend (mock from seed) | Done |
| D4. Empty state CTAs | "Create your first X" with illustration | Done |
| D5. Skeleton loaders | Replace "Loading…" with skeletons | Done |

**Deliverables:** Dashboards feel engaging; empty states guide users.

---

### Phase E: Blueprint-Specific UI Gaps (1 day)

**Goal:** Ensure each blueprint has at least one representative UI path.

| Blueprint | Check | Status |
|-----------|-------|--------|
| B1 | Roster, Booking, Portfolio, Escrow | Done |
| B2 | Casting calls, Shortlist, Client viewer room | Done |
| B3 | Season builder, Judges, Results | Done |
| B4 | Deal rooms, Deliverables, Content approvals | Done |
| B5 | Courses, Cohorts, Certificates | Done |
| B6 | Projects, Tasks, Run-of-show | Done |
| B7 | Shift rosters, Check-ins | Done |
| B8 | Community, Moderation | Done |
| B9 | Vendor onboarding, Listings | Done |
| B10 | Sub-tenants, Policy packs | Sub-tenants in Phase A |

**Deliverables:** B7 shift roster UI (if missing); B9 marketplace listing UI (if stub).

---

### Phase F: Super Admin & Compliance Polish (0.5 day)

**Goal:** Super Admin fully aligned with overall3.md structure.

| Task | Details | Status |
|------|---------|--------|
| F1. Super Admin nav | Match overall3.md (Dashboard, Tenants, Users, Features, Revenue, Payments, Trust & Safety, Moderation, Automation, Security, Analytics, Integrations, Operations, Data & Legal) | Done |
| F2. Data & Legal | Privacy, Retention, Legal Hold pages (if missing) | Done |

**Deliverables:** Super Admin structure matches research.

---

## 5. Execution Order & Estimates

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| **A** – 22 Agency Types | 1–2 days | None |
| **B** – Seed Enrichment | 1–2 days | A |
| **C** – Portal & Mobile | 1 day | B |
| **D** – Enterprise Engagement | 1–2 days | B |
| **E** – Blueprint Gaps | 1 day | A |
| **F** – Super Admin Polish | 0.5 day | A |

**Total:** ~6–8.5 days

---

## 6. Validation Checklist

- [ ] All 22 agency types present; B10 has sub-tenants
- [ ] Tenant switcher works for 23 tenants (search/filter)
- [ ] Super Admin tenants show agencyType, blueprints, B10 children
- [ ] No broken tenantId references in seed
- [ ] Portal shows approvals, threads
- [ ] Mobile shows bookings, wallet
- [ ] Activity feed visible on admin dashboard
- [ ] Empty states have CTAs
- [ ] B7 (shift roster) and B9 (marketplace) have representative UI

---

## 7. Major Remaining Work (from overall.md, overall2.md, overall3.md)

See **[docs/REMAINING-WORK-ANALYSIS.md](docs/REMAINING-WORK-ANALYSIS.md)** for full analysis.

| Area | Spec | Current | Priority |
|------|------|---------|----------|
| **RBAC / Permissions** | Capability model, role bundles, ABAC | Capability gating expanded on critical actions (users/invitations, casting, payouts, contracts, escrows, results publish, invoices, project/task/checklist views, pageant builder controls); full ABAC still pending | High |
| **Who Creates What** | Creator/owner on entities | Implemented in key detail flows (casting, booking, contract, project, vendor, invoice, talent, escrow, pageant builder) with attribution panels; broader rollout pending | Medium |
| **Invitations** | Invite + accept flow | Implemented in UI/seed (invite modal, queue, copy link, resend/cancel, accept page) | Medium |
| **Maker-Checker** | Dual approval for payouts, results | Implemented in UI/seed for blueprint approvals, payout review->approval, and pageant result publish review->approval | Medium |
| **Audit & Non-Repudiation** | Immutable audit, signed actions | Enhanced UI audit logs and export; immutable backend signing still pending | Low |
| **Governance Model** | Tenant Admin vs Superadmin ownership | Improved with role simulation and policy packs; deeper ownership model pending | Low |

---

## 8. Out of Scope (This Plan)

- Backend integration (Phase 13 deferred)
- Real API calls
- Real-time features (WebSockets)
- Payment gateway integration
- E-signature provider integration

---

*Document Version: 1.0 | Overall UI + Seed Data Plan | Feb 2026*
