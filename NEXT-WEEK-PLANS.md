# TalentOS – Next Week Plans (Weeks 13–24)

> **Scope:** Extends the 12-Week Plan. Based on overall.md (PRD), overall2.md (Domain Model), overall3.md (Platform Structure).
> **Approach:** UI-only with seed data (no backend integration).
> **Updated:** February 2026

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| `overall.md` | PRD – Pageant Engine, Community, Academy, Influencer, 22 agency types |
| `overall2.md` | Domain model, bounded contexts, API catalog, state machines |
| `overall3.md` | Platform structure, Super Admin, security, Trust & Safety |
| `12-WEEK-PLAN.md` | Completed Phases 1–12 (foundation) |

---

## Phases Overview (Weeks 13–24)

| Phase | Week | Focus | Key Deliverables |
|-------|------|-------|------------------|
| **13** | 13 | ~~Backend Integration~~ | ⏸️ Deferred (UI-only) |
| **14** | 14 | Pageant Engine (v1) | Process Builder, stages, registrations |
| **15** | 15 | Pageant Scoring & Results | Judge scoring, result publishing, embargo |
| **16** | 16 | Community & Moderation | Feed, groups, moderation queue |
| **17** | 17 | Academy & Learning | Courses, cohorts, certificates |
| **18** | 18 | Influencer & Campaigns | Discovery, campaigns, deliverables |
| **19** | 19 | Super Admin Expansion | Features, Revenue, Trust & Safety |
| **20** | 20 | Advanced Dashboards | KPI dashboards, analytics, exports |
| **21** | 21 | Security & Compliance | MFA, audit hardening, DPDP/GDPR |
| **22** | 22 | Payments & PSP | Razorpay/Stripe, webhooks, reconciliation |
| **23** | 23 | Multi-Agency Types | B1–B10 blueprints, 22 agency seed |
| **24** | 24 | Polish & Launch Prep | Performance, a11y, docs, runbooks |

---

## Phase 13 (Week 13): Backend Integration

**Domain:** API layer, Auth

**API Client Swap**
- [ ] Replace mock services with `apiClient` when `NEXT_PUBLIC_USE_MOCK_API=false`
- [ ] Service adapters: `authService`, `talentsService`, `jobsService`, `bookingService`, etc.
- [ ] Error handling: map API errors to UI toasts
- [ ] Request IDs / correlation IDs in headers

**Auth Flow**
- [ ] Real login: `POST /v1/auth/login` → JWT + refresh
- [ ] Token storage, refresh rotation
- [ ] `GET /v1/auth/me` for session
- [ ] Logout, forgot/reset password (if backend ready)

**Tenant Context**
- [ ] `X-Tenant-Id` header from `useTenant()`
- [ ] Tenant switch: `POST /v1/tenants/:id/switch` (scoped token)

**Seed Data**
- [ ] Keep seed for dev/demo when mock=true
- [ ] Env-based switch documented

**Deliverable:** Frontend talks to real backend; mock fallback for local dev.

---

## Phase 14 (Week 14): Pageant Engine (v1)

**Domain:** Pageants & Events (overall.md §6.1, overall2.md B3)

**Process Builder**
- [ ] Stages list (drag-and-drop)
- [ ] Stage config: entry/exit criteria, visibility, responsible roles
- [ ] Actions per stage: media upload, form, payment, judge scoring
- [ ] Save/version process definition

**Registrations**
- [ ] Registration form (dynamic from process)
- [ ] Eligibility checks
- [ ] Payment collection (placeholder or real)
- [ ] Registrations list + detail

**Seed Data**
- [ ] `pageant_processes.json` – stage definitions
- [ ] `pageant_registrations.json` – sample registrations

**API (overall2.md)**
- `GET/POST /v1/pageants` (or equivalent)
- `GET/POST /v1/pageants/:id/stages`
- `GET/POST /v1/pageants/:id/registrations`

**Deliverable:** Pageant Process Builder UI, registration flow.

---

## Phase 15 (Week 15): Pageant Scoring & Results

**Domain:** Pageants (overall.md §6.1, overall3.md §7)

**Judge Scoring**
- [ ] Judge dashboard: assigned participants, score entry
- [ ] Scoring form (criteria from process)
- [ ] Submit scores (idempotent)
- [ ] Append-only score logs (audit)

**Results**
- [ ] Result embargo / publish controls
- [ ] Multi-approver publish (maker-checker)
- [ ] Results view (public/participant)
- [ ] Export (CSV/PDF)

**Seed Data**
- [ ] `pageant_scores.json`
- [ ] `pageant_results.json`

**Deliverable:** Judge scoring UI, result publishing with approval.

---

## Phase 16 (Week 16): Community & Moderation

**Domain:** Community (overall.md §15, overall3.md Platform)

**Feed & Groups**
- [ ] Feed list (posts, comments)
- [ ] Create post (text, media)
- [ ] Groups list + detail
- [ ] Join/leave group
- [ ] Moderation queue (reported content)

**Moderation**
- [ ] Content review queue
- [ ] Approve / reject / takedown actions
- [ ] Moderation audit trail
- [ ] Appeal flow (stub)

**Seed Data**
- [ ] `community_posts.json` (exists)
- [ ] `groups.json` (exists)
- [ ] `abuse_reports.json` (exists)

**API (overall2.md)**
- `GET/POST /v1/community/posts`
- `GET/POST /v1/community/groups`
- `GET/PATCH /v1/moderation/reports`

**Deliverable:** Community feed, groups, moderation UI.

---

## Phase 17 (Week 17): Academy & Learning

**Domain:** Academy (overall.md §6.4, B5 blueprint)

**Courses**
- [ ] Courses list + detail
- [ ] Lessons, assessments
- [ ] Enrollments, progress
- [ ] Certificates (issued on completion)

**Cohorts**
- [ ] Cohort management
- [ ] Attendance tracking
- [ ] Mentor assignment

**Seed Data**
- [ ] `courses.json` (exists)
- [ ] `lessons.json`, `enrollments.json`, `certificates.json` (exist)

**API**
- `GET /v1/courses`, `GET /v1/courses/:id`
- `GET/POST /v1/enrollments`
- `GET /v1/certificates`

**Deliverable:** Academy courses, enrollments, certificates UI.

---

## Phase 18 (Week 18): Influencer & Campaigns

**Domain:** Influencers (overall.md §6.7, B4 blueprint)

**Discovery**
- [ ] Creator roster / discovery
- [ ] Media kits
- [ ] Filters (niche, reach, rate)

**Campaigns**
- [ ] Campaign list + detail
- [ ] Deal rooms (brand ↔ creator)
- [ ] Deliverables tracker
- [ ] Content approvals
- [ ] Reporting (basic)

**Seed Data**
- [ ] `campaigns.json` (exists)
- [ ] `ad_campaigns.json`, `ad_creatives.json` (exist)

**Deliverable:** Influencer discovery, campaign management, deliverables UI.

---

## Phase 19 (Week 19): Super Admin Expansion

**Domain:** Admin & Governance (overall3.md Super Admin)

**Features**
- [ ] Feature flags list
- [ ] Rollouts (tenant/percentage)
- [ ] Config overrides

**Revenue**
- [ ] Billing overview
- [ ] Fees, revenue reports
- [ ] Tenant billing status

**Trust & Safety**
- [ ] Disputes (platform view)
- [ ] Enforcement actions
- [ ] Appeals list
- [ ] Support cases (stub)

**Moderation**
- [ ] Content review (platform-wide)
- [ ] Takedowns
- [ ] Audit log (platform)

**Seed Data**
- [ ] `feature_flags.json`, `rollouts.json` (exist)
- [ ] `revenue_reports.json` (exists)

**Deliverable:** Super Admin Features, Revenue, Trust & Safety, Moderation UIs.

---

## Phase 20 (Week 20): Advanced Dashboards

**Domain:** Analytics & Audit (overall2.md §4.11)

**Dashboards**
- [ ] `GET /v1/dashboards/overview` – KPIs, charts
- [ ] `GET /v1/dashboards/jobs` – funnel, status
- [ ] `GET /v1/dashboards/finance` – wallet, escrow, payouts
- [ ] Super Admin dashboard – tenants, revenue, incidents

**Analytics**
- [ ] `GET /v1/audit-logs` – tenant + platform
- [ ] `GET /v1/events` – analytics events (admin)
- [ ] Export (CSV, date range)

**Charts**
- [ ] Revenue over time
- [ ] Bookings funnel
- [ ] Talent growth
- [ ] Dispute rate

**Deliverable:** Rich dashboards, analytics views, exports.

---

## Phase 21 (Week 21): Security & Compliance

**Domain:** Security (overall3.md STRIDE, Enterprise Security)

**MFA**
- [ ] MFA setup flow (TOTP)
- [ ] Step-up MFA for privileged actions
- [ ] Recovery codes

**Audit Hardening**
- [ ] Immutable audit log display
- [ ] Signed actions, timestamps
- [ ] Export for compliance

**Privacy**
- [ ] Consent tracking UI
- [ ] Data subject rights (access, delete) – request flow
- [ ] DPDP / GDPR readiness (config, retention)

**Deliverable:** MFA, audit hardening, privacy request UI.

---

## Phase 22 (Week 22): Payments & PSP

**Domain:** Payments (overall2.md §4.6, §6)

**PSP Integration**
- [ ] Razorpay or Stripe – payment session creation
- [ ] Checkout redirect / embedded
- [ ] Webhook verification (backend)
- [ ] Payment events list (admin)

**Reconciliation**
- [ ] Reconciliation view (manual/admin)
- [ ] Webhook event log
- [ ] Idempotency handling

**Invoices**
- [ ] Real `POST /v1/invoices/:id/pay` → PSP session
- [ ] Payment status sync
- [ ] Receipts

**Deliverable:** Real payment flow, webhook handling, reconciliation UI.

---

## Phase 23 (Week 23): Multi-Agency Types

**Domain:** 22 Agency Types (overall.md §3731)

**Blueprints**
- [ ] B1–B10 blueprint config per tenant
- [ ] Role packs (OWN, ADM, OPS, etc.)
- [ ] Module toggles per blueprint

**Seed Expansion**
- [ ] 22 agency types in `tenants.json`
- [ ] B1–B10 default configs
- [ ] Role permission matrix UI

**Agency-Specific UIs**
- [ ] Pageant org: season builder, judges
- [ ] Influencer agency: campaigns, deliverables
- [ ] Academy: courses, cohorts
- [ ] Casting agency: client viewer room (stub)

**Deliverable:** Blueprint-driven config, 22 agency seed, role matrix.

---

## Phase 24 (Week 24): Polish & Launch Prep

**Domain:** Operations, UX

**Performance**
- [ ] Code splitting, lazy load
- [ ] Image optimization
- [ ] Bundle analysis

**Accessibility**
- [ ] Keyboard nav pass
- [ ] ARIA labels, focus management
- [ ] Screen reader testing

**Documentation**
- [ ] API contract (updated)
- [ ] Runbooks (incident, deploy)
- [ ] User guides (stub)

**Observability**
- [ ] Sentry / error tracking
- [ ] Analytics events (optional)
- [ ] Health check UI

**Deliverable:** Production-ready UI, docs, runbooks.

---

## Dashboard Reference (overall2.md §4.11)

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/dashboards/overview` | KPIs, jobs, revenue, talents |
| `GET /v1/dashboards/jobs` | Funnel, status breakdown |
| `GET /v1/dashboards/finance` | Wallet, escrow, payouts |
| `GET /v1/audit-logs` | Tenant/platform audit |
| `GET /v1/events` | Analytics events (admin) |

---

## Super Admin Structure (overall3.md)

| Area | Key Screens |
|------|-------------|
| Dashboard | Overview KPIs |
| Tenants | Lifecycle, config, risk |
| Users | Identity, roles, abuse |
| Features | Flags, rollouts, config |
| Revenue | Billing, fees, reports |
| Payments | Wallets, escrow, risk |
| Trust & Safety | Disputes, enforcement, appeals |
| Moderation | Content review, takedowns, audit |
| Security | Threats, compliance, incidents |
| Analytics | Dashboards, alerts, insights |
| Integrations | APIs, webhooks, partners |
| Operations | Infra, deployments, maintenance |
| Data & Legal | Privacy, retention, legal hold |

---

## State Machines (overall2.md §5.2)

| Entity | States |
|--------|--------|
| Escrow | created → funded → locked → releasable → released \| disputed → resolved |
| Dispute | opened → evidence → review → decision_pending → decided → closed |
| Contract | draft → sent → partially_signed → signed \| void |

---

## Next Steps

1. **Start with Phase 14:** Pageant Engine (UI + seed data, no backend).
2. **Weeks 14–15:** Pageant Engine is a differentiator; align with overall.md §6.1.
3. **Weeks 16–18:** Community, Academy, Influencer – pick based on target customer.
4. **Weeks 19–20:** Super Admin + dashboards – operational maturity.
5. **Weeks 21–24:** Security, payments, polish – launch readiness.
