# TalentOS – Project Context (Agent Handoff)

> **Purpose:** Read this first when joining the project. Provides high-level context from `overall.md`, `overall2.md`, and `overall3.md`.

## Development Scope: UI Only

| What We Do | What We Don't Do |
|------------|------------------|
| Build all UI/frontend | Implement backend APIs |
| Use seed/mock data | Call real APIs (until integration phase) |
| Match specs from docs | Worry about auth, DB, server logic |
| Prepare for later integration | Block on backend |

**Backend** is built by a separate team. We integrate when ready.

## 1. What Is TalentOS?

**TalentOS** is a **multi-tenant, white-label PaaS platform** for the talent industry.

- **Positioning:** "Shopify + CRM + Booking + Pageant Engine for the Talent Industry"
- **Initial Market:** India
- **Tech Stack:** React/Next.js (frontend), Node.js/NestJS (backend), PostgreSQL, S3-compatible storage

## 2. Target Customers (Tenants)

| # | Tenant Type | Description |
|---|-------------|-------------|
| 1 | Modelling Agencies | Talent management, bookings, portfolios |
| 2 | Pageant Organizers | Events, stages, scoring, sponsors |
| 3 | Talent Management Companies | CRM, contracts, commissions |
| 4 | Academies & Grooming Institutes | Courses, mentors, certifications |
| 5 | Influencer Management Agencies | Campaigns, deliverables, media kits |

## 3. User Roles

| Level | Role | Scope |
|-------|------|-------|
| Platform | Super Admin | Platform-wide governance, tenants, features, finance |
| Tenant | Tenant Owner | Agency/organizer owner |
| Tenant | Staff | Manager, Coordinator, Finance |
| Tenant | Talent | Model, Influencer, Artist |
| Tenant | Brand / Sponsor | External brands |
| Tenant | Judge | Event-specific |

## 4. Core Platform Modules (from overall2.md)

- **Identity & Tenancy** – Tenants, users, RBAC, invitations
- **Talent CRM** – Profiles, portfolios, availability, rate cards
- **Jobs / Casting / Bookings** – Job briefs, submissions, holds, call sheets
- **Contracts & E-Signature** – Templates, clauses, signing workflow
- **Finance Ledger / Wallet / Credits** – Double-entry ledger, balances
- **Payments** – PSP (Stripe/Razorpay), invoices, webhooks
- **Escrow** – Per-job escrow, state machine, disputes
- **Disputes** – Lifecycle, evidence, arbitration
- **Notifications** – In-app, email, SMS, preferences
- **Automation Orchestrator** – Trigger/condition/action workflows
- **Analytics & Audit** – Audit logs, dashboards, exports
- **Admin & Governance** – Tenant admin + Superadmin

## 5. Frontend Structure (Current)

```
TMA-frontend/
├── frontend-superadmin/     # Super Admin app (Next.js)
│   ├── app/
│   │   ├── page.tsx         # Dashboard
│   │   ├── pageants/
│   │   ├── talent-showcase/
│   │   ├── tenants/
│   │   ├── finance/
│   │   ├── governance/
│   │   └── search/
│   └── shared/
├── overall.md              # Full PRD (product requirements)
├── overall2.md             # Domain model, backend, API, escrow, security
├── overall3.md             # STRIDE, security whitepaper, Super Admin structure
└── docs/                   # Context files for agents
```

## 6. Key Conventions

- **Multi-tenancy:** `tenant_id` on every request; strict isolation
- **RBAC + ABAC:** Capabilities + attributes (tenant, team, risk, amount)
- **Escrow:** State machine – CREATED → ESCROW_FUNDED → IN_PROGRESS → DELIVERY_SUBMITTED → DELIVERY_APPROVED → SETTLED (or IN_DISPUTE)
- **Audit:** Append-only logs for sensitive actions
- **API:** REST JSON, `/v1/{resource}`, cursor pagination

## 7. Related Docs

| File | Content |
|------|---------|
| `docs/IMPLEMENTATION_PLAN.md` | Execution order and phases |
| `docs/SUPERADMIN_SPEC.md` | Super Admin scope and checklist |
| `docs/ADMIN_SPEC.md` | Tenant Admin scope |
| `docs/AGENCY_SPEC.md` | 5 agency types scope |
| `docs/AGENT_HANDOFF.md` | Instructions for new agents |
| `docs/TENANT-OWNER-12-PHASE-PLAN.md` | Tenant Owner 12-phase plan (roles, invitations, audit, bulk invite, role templates) |
