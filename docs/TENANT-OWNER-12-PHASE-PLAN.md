# Tenant Owner — 12-Phase Implementation Plan

> **Scope:** Complete Tenant Owner UI + seed data across 12 weeks  
> **Sources:** Audit findings, overall.md, overall2.md, overall3.md, ARCHITECTURE_USER_CREATION_HIERARCHY.md  
> **Created:** February 2026

---

## Overview

| Phase | Week | Focus | Status |
|-------|------|-------|--------|
| 1 | 1 | Core foundation — role labels, display, auth mapping | Done |
| 2 | 2 | Invitation & ownership attribution — seed, invitedBy | Done |
| 3 | 3 | Role assignment — functional save, assignRoleToUser | Done |
| 4 | 4 | Route protection — middleware, capability guards | Done |
| 5 | 5 | Tenant settings editable — organization, branding | Done |
| 6 | 6 | Tenant switcher — ownership indicator, role per tenant | Done |
| 7 | 7 | User status management — suspend/activate | Done |
| 8 | 8 | Audit log viewer — audit.read page | Done |
| 9 | 9 | Capability descriptions — tooltips, constants | Done |
| 10 | 10 | Bulk invitations — bulk invite UI | Done |
| 11 | 11 | Role templates — create from role packs | Done |
| 12 | 12 | Polish — empty states, CTAs, permission testing | Done |

---

## Phase 1 (Week 1): Core Foundation

**Goal:** Tenant Owner role is visible and correctly labeled across the admin UI.

| Task | Details | Status |
|------|---------|--------|
| 1.1 | Add `shared/lib/roles.ts` — `getRoleLabel()` helper | Done |
| 1.2 | TenantAdminShell — dynamic role label (sidebar + header) | Done |
| 1.3 | Admin users page — role column uses `getRoleLabel()` | Done |
| 1.4 | Extend `ROLE_LABELS` for all platform roles (ADMIN, AGENT, etc.) | Done |
| 1.5 | Login page — show role label on demo user cards | Done |

**Deliverables:** Tenant Owner users see "Tenant Owner" instead of "Admin" in shell and user lists.

---

## Phase 2 (Week 2): Invitation & Ownership Attribution

**Goal:** Invitations show who invited whom; seed data supports demo flows.

| Task | Details | Status |
|------|---------|--------|
| 2.1 | `invitationService.inviteUser()` — add `invitedByEmail` param | Done |
| 2.2 | InviteUserModal — pass current user email as inviter | Done |
| 2.3 | invitations.json — add `invitedByEmail`, expand seed (6+ invites) | Done |
| 2.4 | Users page — show "Invited by" in invitation queue | Done |
| 2.5 | tenants.json — add `ownerId` per tenant (optional) | Deferred |

**Deliverables:** Invitation queue shows inviter; new invites record owner.

---

## Phase 3 (Week 3): Role Assignment

**Goal:** Tenant Owner can assign roles to users; changes persist (mock).

| Task | Details | Status |
|------|---------|--------|
| 3.1 | Add `assignRoleToUser(tenantId, userId, roleId)` in userService/adminService | Done |
| 3.2 | UserDetailModal — wire role dropdown to save | Done |
| 3.3 | Persist role assignments (localStorage override or seed override) | Done |
| 3.4 | Users list — reflect updated role after assignment | Done |

**Deliverables:** Role assignment works end-to-end in demo.

---

## Phase 4 (Week 4): Route Protection

**Goal:** Unauthorized users cannot access admin routes; capability-based guards.

| Task | Details | Status |
|------|---------|--------|
| 4.1 | Client-side auth redirect in ConditionalShell — redirect to login | Done |
| 4.2 | Protected routes: /admin, /superadmin, modelling, pageant, etc. | Done |
| 4.3 | Login page — honor returnUrl after successful sign-in | Done |
| 4.4 | /unauthorized page for future capability-based redirects | Done |

**Deliverables:** Protected routes; no direct URL access without auth/capability.

---

## Phase 5 (Week 5): Tenant Settings Editable

**Goal:** Tenant Owner can edit organization name, subdomain, branding.

| Task | Details | Status |
|------|---------|--------|
| 5.1 | Settings page — edit form for org name, subdomain | Done |
| 5.2 | Branding — primary color picker + edit | Done |
| 5.3 | adminSettingsService — updateAdminSettings, localStorage override | Done |
| 5.4 | CapabilityGate tenant.manage_settings on Edit buttons | Done |

**Deliverables:** Editable tenant settings with mock persistence.

---

## Phase 6 (Week 6): Tenant Switcher Enhancement

**Goal:** Tenant switcher shows ownership status; role per tenant if different.

| Task | Details | Status |
|------|---------|--------|
| 6.1 | TenantSwitcher — Crown badge for Owner tenants | Done |
| 6.2 | Show role per tenant (Owner, Admin, Agent) from staff.json | Done |
| 6.3 | Search/filter when >10 tenants (already present) | Done |

**Deliverables:** Clear ownership indication in switcher.

---

## Phase 7 (Week 7): User Status Management

**Goal:** Tenant Owner can suspend/activate users (with capability check).

| Task | Details | Status |
|------|---------|--------|
| 7.1 | adminService — `suspendUser()`, `activateUser()` | Done |
| 7.2 | Users page — suspend/activate buttons in Actions column | Done |
| 7.3 | Capability gate `users.assign_roles` on status actions | Done |
| 7.4 | Prevent self-suspend; localStorage status overrides | Done |

**Deliverables:** Suspend/activate users from Users page.

---

## Phase 8 (Week 8): Audit Log Viewer

**Goal:** Tenant Owner sees audit log for their tenant (`audit.read`).

| Task | Details | Status |
|------|---------|--------|
| 8.1 | Audit log page — list entries, filter by action/actor | Done |
| 8.2 | Seed — expanded platform_audit_logs (tenant-scoped) | Done |
| 8.3 | Capability gate — `audit.read` | Done |
| 8.4 | Export CSV (functional) | Done |

**Deliverables:** Functional audit log page with seed data.

---

## Phase 9 (Week 9): Capability Descriptions

**Goal:** Capabilities have human-readable names and descriptions.

| Task | Details | Status |
|------|---------|--------|
| 9.1 | `shared/lib/constants/capabilities.ts` — metadata (name, description, category) | Done |
| 9.2 | Roles page — tooltips for capabilities | Done |
| 9.3 | Permission matrix — show descriptions | Done |

**Deliverables:** Capabilities understandable in UI.

---

## Phase 10 (Week 10): Bulk Invitations

**Goal:** Tenant Owner can invite multiple users at once.

| Task | Details | Status |
|------|---------|--------|
| 10.1 | Bulk invite modal — CSV/text paste or multi-row form | Done |
| 10.2 | invitationService — `inviteUsersBulk()` | Done |
| 10.3 | Users page — "Bulk invite" button | Done |

**Deliverables:** Bulk invite flow with mock persistence.

---

## Phase 11 (Week 11): Role Templates

**Goal:** Create roles from role packs; pre-populate capabilities.

| Task | Details | Status |
|------|---------|--------|
| 11.1 | Roles page — "Create from template" using role_packs | Done |
| 11.2 | Role editor modal — create custom role | Done |
| 11.3 | Capability picker — multi-select with categories | Done |

**Deliverables:** Create roles from templates.

---

## Phase 12 (Week 12): Polish

**Goal:** Empty states, CTAs, permission testing; final UX pass.

| Task | Details | Status |
|------|---------|--------|
| 12.1 | Empty state CTAs — "Invite your first user", etc. | Done |
| 12.2 | Skeleton loaders — replace "Loading…" where missing | Done |
| 12.3 | Permission testing tool — simulate role, show allowed actions | Done |
| 12.4 | Documentation — update AGENT_HANDOFF / PROJECT_CONTEXT | Done |

**Deliverables:** Polished Tenant Owner experience.

---

## Execution Order

Phases are sequential; each builds on the previous. Dependencies:

- Phase 3 depends on Phase 1 (role labels)
- Phase 4 can start after Phase 1
- Phase 5–6 can run in parallel after Phase 4
- Phases 7–12 are largely independent after Phase 4

---

*Document Version: 1.0 | Tenant Owner 12-Phase Plan | Feb 2026*
