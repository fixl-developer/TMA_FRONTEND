# Agent Handoff – Quick Start

> **When switching agents:** New agents should follow this checklist to get context quickly.

## ⚠️ Development Mode: UI Only

- **We build UI only.** Backend is developed separately by backend team.
- **Use seed/mock data** for all pages. No real API calls yet.
- **Integration later.** When backend is ready, we swap mock data for API calls.
- **Don't worry about:** Auth tokens, API contracts, backend implementation.

## 1. Read These Files (in order)

| # | File | Purpose |
|---|------|---------|
| 1 | `docs/PROJECT_CONTEXT.md` | High-level overview, modules, conventions |
| 2 | `docs/IMPLEMENTATION_PLAN.md` | Current phase, execution order |
| 2b | `docs/12_WEEK_PLAN.md` | 12-phase weekly roadmap |
| 2c | `docs/TENANT-OWNER-12-PHASE-PLAN.md` | Tenant Owner UI + seed (roles, invitations, audit, etc.) |
| 3 | Phase-specific spec | SUPERADMIN_SPEC / ADMIN_SPEC / AGENCY_SPEC |

## 2. Source Documents (Reference Only)

| File | Content |
|------|---------|
| `overall.md` | Full PRD – product vision, modules, roadmap |
| `overall2.md` | Domain model, backend architecture, API catalog |
| `overall3.md` | STRIDE threat model, Super Admin structure |

## 3. Unified Frontend

**Single app:** `frontend/` – all roles in one app with demo login.

### Demo login credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Super Admin | superadmin@talentos.io | demo123 | `/superadmin` |
| Tenant Admin | admin@talentos.io | demo123 | `/admin` |
| Modelling Agency | modelling@talentos.io | demo123 | `/modelling` |
| Pageant Organizer | pageant@talentos.io | demo123 | `/pageant` |
| Talent Management | talent-mgmt@talentos.io | demo123 | `/talent-mgmt` |
| Academy | academy@talentos.io | demo123 | `/academy` |
| Influencer Agency | influencer@talentos.io | demo123 | `/influencer` |

### Route structure

- `/` – Redirects to `/login` or role dashboard
- `/login` – Login page with demo credentials, Forgot password link
- `/signup` – Signup landing (Tenant vs Talent)
- `/signup/tenant` – Multi-step tenant signup
- `/signup/talent` – Multi-step talent signup
- `/forgot-password` – Forgot password (email input)
- `/reset-password` – Reset password (new password form)
- `/onboarding/tenant` – Tenant onboarding wizard
- `/onboarding/talent` – Talent onboarding wizard
- `/onboarding/progress` – Onboarding progress checklist
- `/superadmin/*` – Super Admin (dashboard, tenants, users, finance, pageants, talent-showcase, features, governance, operations, integrations, search)
- `/admin/*` – Tenant Admin (organization, users, talent, castings, events, etc.)
- `/modelling/*` – Modelling Agency (talent, castings, bookings, contracts)
- `/pageant/*` – Pageant Organizer (process, registration, judges, sponsors, results)
- `/talent-mgmt/*` – Talent Management (talent, contracts, ledger, calendar)
- `/academy/*` – Academy (courses, mentors, certifications, progress)
- `/influencer/*` – Influencer Agency (campaigns, deliverables, media kits, reporting)
- `/tenant/*` – Tenant app (existing tenant routes)

## 4. Execution Order (Do Not Skip)

```
1. Superadmin   ✓ DONE (Phases 1–5)
2. Tenant Admin ✓ DONE (Phases 6–7)
3. 5 Agency     ✓ DONE
   - Modelling Agency ✓ DONE (Phase 8)
   - Pageant Organizer ✓ DONE (Phase 9)
   - Talent Mgmt ✓ DONE (Phase 10)
   - Academy ✓ DONE (Phase 10)
   - Influencer ✓ DONE (Phase 10)
4. Auth & Onboarding ✓ DONE (Phase 11)
   - Tenant/Talent signup (multi-step)
   - Forgot password, Reset password
   - Onboarding wizard (tenant, talent, progress)
5. Pageant Engine ✓ DONE (Phase 12)
   - Template Library
   - Process Builder canvas (stages, config panel)
   - Scoring configuration
   - Rule builder
   - Preview & simulation
6. Pageant Live & Analytics ✓ DONE (Phase 13)
   - Live dashboard (funnel, participants)
   - Judge scoring interface
   - Participant journey view
   - Pageant analytics
7. Payments & Finance ✓ DONE (Phase 14)
   - Wallet dashboard (cash, credits)
   - Transaction history (filter, export)
   - Payment checkout flow
   - Payout management
   - Invoices
8. Next (Content, Mobile, API, etc.)
```

## 5. Key Conventions

- **Multi-tenant:** Every request has `tenant_id`; Super Admin may operate across tenants
- **RBAC:** Capabilities + roles; check `RequireCapability` decorator
- **API base:** `/v1/` for tenant-scoped, `/v1/super/` for Super Admin
- **Auth:** Demo only – `AuthContext` stores user in localStorage
- **Tenant Owner:** Role labels, invitations, role assignment, settings, audit log, bulk invite, role templates, permission test — see `docs/TENANT-OWNER-12-PHASE-PLAN.md`

## 6. Tech Stack

- **Frontend:** Next.js, React, TypeScript – single `frontend/` app
- **UI:** Custom components in `shared/components/`
- **Data:** Seed/mock data (JSON) – no backend calls yet

## 7. Where to Start Coding

- **Unified app:** `frontend/app/`
- **Super Admin:** `frontend/app/superadmin/` (dashboard, tenants, users, finance, pageants, etc.)
- **Layout/shells:** `frontend/shared/components/layout/` (ConditionalShell, SuperAdminShell, TenantAdminShell, ModellingShell, PageantShell)
- **Auth:** `frontend/shared/context/AuthContext.tsx`
- **Seed data:** `frontend/data/seed/`

## 8. Run the app

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. Root `/` redirects to `/login`. On login/signup, **click any demo credential** to auto-fill the form, then Sign in. Use **Logout** in the header to switch accounts.
