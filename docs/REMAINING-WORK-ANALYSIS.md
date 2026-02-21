# TalentOS – Remaining Work Analysis

> **Sources:** overall.md (PRD), overall2.md (Domain Model), overall3.md (Platform Structure)  
> **Purpose:** Identify major gaps between spec and current UI-only implementation  
> **Created:** February 2026

---

## 1. Executive Summary

The current frontend is **UI-only with seed data**; backend integration is deferred. Several major areas from the research docs are **partially implemented or missing**:

| Area | Spec (overall.md, overall2.md, overall3.md) | Current State | Gap |
|------|---------------------------------------------|---------------|-----|
| **RBAC / Permissions** | Capability model, role bundles, ABAC attributes | Nav filtered by `user.role`; roles page read-only | No capability checks, no permission matrix enforcement |
| **Who Creates What** | Creator/owner on entities, responsible roles per stage | `createdBy` in some seed; no UI enforcement | No creator attribution, no action gating |
| **Identity & Tenancy** | tenant_users, user_roles, invitations, teams | TenantContext + seedUsers; no invitations flow | Invite/accept flow missing |
| **Governance Model** | Tenant Admin vs Superadmin ownership | Partial – both exist but no clear boundary | Operational ownership unclear in UI |
| **Maker-Checker** | Dual approval for payouts, result publishing | Not implemented | No approval workflows |
| **Audit & Non-Repudiation** | Immutable audit logs, signed actions | Audit log page exists; no signing | Audit is display-only, no backend |

---

## 2. RBAC & Permission Model (overall2.md §8)

### 2.1 Spec: Capability Model

**Capabilities** are primitives; **roles** are bundles.

| Capability | Description |
|------------|-------------|
| `tenant.manage_settings` | Tenant settings |
| `users.invite`, `users.assign_roles` | User management |
| `talents.read`, `talents.write`, `talents.delete` | Talent CRUD |
| `jobs.read`, `jobs.write`, `bookings.manage` | Jobs & bookings |
| `contracts.create`, `contracts.send`, `contracts.void` | Contracts |
| `wallet.read`, `ledger.transfer`, `credits.issue` | Finance |
| `escrow.create`, `escrow.release`, `escrow.lock` | Escrow |
| `disputes.raise`, `disputes.decide` | Disputes |
| `automations.manage`, `automations.run.retry` | Automation |
| `audit.read`, `exports.generate` | Audit & exports |

### 2.2 Spec: ABAC Attributes

- `tenant_id` – mandatory on every request
- `team_id` / `pod_id` – team membership
- `resource_owner` – e.g., talent manager assigned
- `risk_tier` – risk level
- `amount_limit` – finance approval thresholds
- `contract_status`, `escrow_status`, `dispute_status` – state-based checks

### 2.3 Current State

- **Roles page** (`/admin/roles`): Shows tenant roles and capabilities from `seedRoles` – **read-only**
- **Nav filtering**: `TenantAdminShell` filters sections by `user.role` (e.g. `roles: ["admin"]`) – **simple role check**
- **No capability checks**: Buttons, create links, etc. are not gated by capability
- **seedRoles**: Only roles for tenant_001 and tenant_002; roles for other tenants missing

### 2.4 Gaps

1. **No UI enforcement**: Any logged-in user can access any route; nav hides sections but direct URL access works
2. **No capability-based gating**: "Create casting", "Release escrow", etc. should check `jobs.write`, `escrow.release`
3. **No permission matrix**: Spec defines role → capability mapping; UI has "Permission matrix" tab but no enforcement
4. **Roles missing for tenants 003–023**: Only tenant_001 and tenant_002 have roles in seed

---

## 3. Who Creates What & Ownership

### 3.1 Spec: Creator Attribution

From overall2.md schema:

- `jobs(id, tenant_id, ..., created_by)`
- `bookings(id, tenant_id, ..., created_at)`
- `contracts(id, tenant_id, ..., created_at)`
- `disputes(id, tenant_id, raised_by, ...)`
- `audit_logs(id, tenant_id, actor_id, action, entity_type, entity_id, ...)`

**Responsible roles per stage** (overall.md §6.1.4):

- Admin, Pageant Director, Judge, Sponsor, Talent – access configurable **per stage**

### 3.2 Current State

- **Seed data**: Some entities have `createdByUserId` (e.g. pageants); many don't
- **UI**: No "Created by" or "Owner" display on list/detail views
- **No action gating**: "Who can create X" is not enforced – all admin users see same actions

### 3.3 Gaps

1. **No creator display**: List/detail pages don't show who created a casting, contract, etc.
2. **No resource ownership**: No "assigned to" or "owner" for jobs, disputes
3. **Stage-specific roles**: Pageant stages have "responsible roles" in spec – not implemented

---

## 4. Identity & Tenancy Management

### 4.1 Spec (overall2.md §4.1)

| Endpoint | Purpose |
|----------|---------|
| `POST /v1/users/invite` | Invite user to tenant |
| `POST /v1/users/accept-invite` | Accept invitation |
| `PATCH /v1/users/:userId/roles` | Assign roles |
| `GET /v1/teams` | List teams |
| `POST /v1/teams` | Create team |
| `POST /v1/teams/:teamId/members` | Add member |
| `GET /v1/policies/capabilities` | List capabilities |
| `GET /v1/policies/roles` | List roles |

**Schema**: `tenant_users`, `user_roles`, `invitations`, `teams`, `team_members`

### 4.2 Current State

- **Users page**: Lists users; can view/edit; role assignment via `UserDetailModal`
- **Teams page**: Exists; team list from seed
- **Invitations**: No invite flow; `invitations.json` exists but no UI to send/accept
- **TenantContext**: `availableTenantIds` from `user.tenantIds`; superadmin sees all

### 4.3 Gaps

1. **No invite flow**: "Invite user" button exists but no `/admin/users/invite` or accept flow
2. **No team member management**: No add/remove members from teams
3. **User–role mapping**: Users have `role` in AuthContext; seedUsers have `tenantIds` but no explicit role per tenant

---

## 5. Governance Model (overall2.md §8.3)

### 5.1 Spec

| Level | Owns |
|-------|------|
| **Tenant Admin** | Templates, limits, roles, finance approvals (tenant-scoped) |
| **Superadmin** | Tenant enable/disable, global risk flags, abuse enforcement, system-wide incident response |

### 5.2 Current State

- **Tenant Admin**: Full nav; settings, limits, roles, finance – all present
- **Super Admin**: Tenants, Users, Features, Revenue, Payments, Trust & Safety, Moderation, Automation, Security, Analytics, Integrations, Operations, Data & Legal
- **Boundary**: Not enforced – Super Admin can suspend tenants (mock); Tenant Admin cannot

### 5.3 Gaps

1. **No operational runbook**: Who does what when (e.g. dispute escalation) not documented in UI
2. **Risk flags**: Super Admin has risk view; Tenant Admin has `/admin/risk` – alignment unclear

---

## 6. Maker-Checker & Dual Approval (overall3.md)

### 6.1 Spec

- **Payouts**: Maker-checker approval
- **Result publishing**: Director + auditor approval
- **Finance release**: `amount <= user.amount_limit` or multi-approval workflow

### 6.2 Current State

- **Escrow release**: Single button; no approval flow
- **Payouts**: List page; no approval workflow
- **Pageant results**: No publish approval UI

### 6.3 Gaps

1. **No approval workflows**: All actions are single-step
2. **No "pending approval" state**: No queue of items awaiting second approver

---

## 7. Audit & Non-Repudiation (overall2.md, overall3.md)

### 7.1 Spec

- **Audit logs**: Append-only, immutable
- **Signed admin actions**: Timestamped role context
- **Request IDs + trace IDs**: For disputed API calls

### 7.2 Current State

- **Audit log page**: `/admin/audit-log` – displays tenant activity log

- **No audit on actions**: Creating a casting, releasing escrow, etc. don't write to audit (seed/mock only)

### 7.3 Gaps

1. **Audit is display-only**: No real audit trail from user actions
2. **No signing**: No cryptographic signing of sensitive actions

---

## 8. Security & Compliance (overall3.md)

### 8.1 Spec

- **MFA**: Optional for admins; recommended for privileged roles
- **Step-up auth**: For high-risk actions (payouts)
- **MFA for judges**: Judge-specific MFA for scoring
- **Child safety**: Guardian consent, restricted actions

### 8.2 Current State

- **Auth**: Demo login with email/password; no MFA
- **No step-up**: No additional auth for sensitive actions

### 8.3 Gaps

1. **No MFA**: Not implemented
2. **No step-up auth**: Payouts, escrow release don't trigger re-auth

---

## 9. Prioritized Remaining Work (UI-First)

### Phase 1: RBAC & Permissions (UI)

| Task | Effort | Description |
|------|--------|-------------|
| Capability gate UI | Medium | Add `useCapability(cap)` hook; hide/disable buttons when user lacks capability |
| Permission matrix | Low | Show role → capability matrix (read-only; data from seed) |
| Roles for all tenants | Low | Extend seedRoles for tenants 003–023 |
| Creator display | Low | Add "Created by" to list/detail views where seed has `createdBy` |

### Phase 2: Identity & Invitations

| Task | Effort | Description |
|------|--------|-------------|
| Invite flow UI | Medium | Invite form → send (mock) → invitation record; accept page (mock) |
| Team member management | Low | Add/remove members from teams |
| User–role per tenant | Medium | `user.roles` or `tenant_user_roles` – user can have different roles per tenant |

### Phase 3: Maker-Checker (UI)

| Task | Effort | Description |
|------|--------|-------------|
| Payout approval queue | Medium | "Pending approval" list; approve/reject flow (mock) |
| Escrow release approval | Low | Two-step: request → approve (mock) |
| Result publish approval | Low | Pageant results: publish request → approver (mock) |

### Phase 4: Audit & Compliance

| Task | Effort | Description |
|------|--------|-------------|
| Audit on mock actions | Low | When user performs action (mock), append to audit log seed |
| Audit filters | Low | Filter by actor, action, entity type, date |

### Phase 5: Backend Integration (Deferred)

- All of the above assume **mock/seed**. When backend is ready:
  - Replace mock services with API client
  - Real RBAC enforcement server-side
  - Real audit logs from backend
  - Real MFA, step-up auth

---

## 10. Summary Table

| Category | Spec | Current | Priority |
|-----------|------|---------|----------|
| RBAC capability checks | Full | ✅ useCapability, CapabilityGate, and critical action gating (users/invitations/casting/payouts/contracts/escrows/results/invoices/projects+tasks+checklists/pageant builder) | High |
| Who creates what | Creator on entities | ✅ getCreatorName, key detail pages incl. castings, bookings, contracts, projects, vendors, invoices, talent, escrows, pageant builder | Medium |
| Invitations | Full flow | ✅ Invite + Accept page, localStorage | Medium |
| Maker-checker | Payouts, results | ✅ Payout review->approve and results publish review->approve (mock) | Medium |
| Roles for tenants | All tenants | ✅ seedRoles extended 003–023 | Low |
| Audit trail | Immutable, signed | Display only | Low |
| MFA / Step-up | Recommended | Missing | Low (backend) |

---

*Document Version: 1.1 | Remaining Work Analysis | Feb 2026*
