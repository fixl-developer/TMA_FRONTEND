# Super Admin – Full Specification

> **Source:** overall3.md, overall2.md (Admin & Superadmin section)

## Current State (frontend-superadmin)

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/` | Exists |
| Pageants | `/pageants` | Exists |
| Talent Showcase | `/talent-showcase` | Exists |
| Tenants | `/tenants` | Exists |
| Finance | `/finance` | Exists |
| Governance | `/governance` | Exists |
| Search | `/search` | Exists |

---

## Full Super Admin Structure (from overall3.md)

```
Super Admin
│
├── Dashboard
│
├── Tenants
│   ├── Lifecycle
│   ├── Configuration
│   └── Risk
│
├── Users
│   ├── Identity
│   ├── Roles
│   └── Abuse
│
├── Features
│   ├── Flags
│   ├── Rollouts
│   └── Config
│
├── Revenue
│   ├── Billing
│   ├── Fees
│   └── Reports
│
├── Payments
│   ├── Wallets
│   ├── Escrow
│   └── Risk
│
├── Trust & Safety
│   ├── Disputes
│   ├── Enforcement
│   └── Appeals
│
├── Moderation
│   ├── Content Review
│   ├── Takedowns
│   └── Audit
│
├── Automation
│   ├── Workflows
│   ├── Policies
│   └── Controls
│
├── Security
│   ├── Threats
│   ├── Compliance
│   └── Incidents
│
├── Analytics
│   ├── Dashboards
│   ├── Alerts
│   └── Insights
│
├── Integrations
│   ├── APIs
│   ├── Webhooks
│   └── Partners
│
├── Operations
│   ├── Infra
│   ├── Deployments
│   └── Maintenance
│
└── Data & Legal
    ├── Privacy
    ├── Retention
    └── Legal Hold
```

---

## Super Admin API Endpoints (from overall2.md)

### Superadmin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/super/tenants` | List all tenants |
| PATCH | `/v1/super/tenants/:tenantId` | Enable/disable/risk flags |
| GET | `/v1/super/audit` | Platform audit logs |
| GET | `/v1/super/support/cases` | Support cases (optional v1 stub) |

---

## Implementation Checklist

### Section: Dashboard
- [ ] Platform KPIs (tenants, GMV, active users)
- [ ] Recent activity feed
- [ ] SLO / health widgets
- [ ] Quick actions

### Section: Tenants
- [ ] **Lifecycle** – Create, activate, suspend, terminate
- [ ] **Configuration** – Plan, limits, feature flags per tenant
- [ ] **Risk** – Risk flags, fraud signals, holds
- [ ] List/filter tenants
- [ ] Tenant detail view

### Section: Users
- [ ] **Identity** – Cross-tenant user lookup
- [ ] **Roles** – Platform-level role assignment
- [ ] **Abuse** – Suspend, ban, appeal handling

### Section: Features
- [ ] **Flags** – Feature flag management
- [ ] **Rollouts** – Gradual rollout config
- [ ] **Config** – Global/platform config

### Section: Revenue
- [ ] **Billing** – Subscription management
- [ ] **Fees** – Platform fee config
- [ ] **Reports** – Revenue reports, exports

### Section: Payments
- [ ] **Wallets** – Platform wallet overview
- [ ] **Escrow** – Escrow status, holds
- [ ] **Risk** – Payment risk flags

### Section: Trust & Safety
- [ ] **Disputes** – Cross-tenant dispute queue
- [ ] **Enforcement** – Actions, suspensions
- [ ] **Appeals** – Appeal workflow

### Section: Moderation
- [ ] **Content Review** – Queue, actions
- [ ] **Takedowns** – Takedown requests
- [ ] **Audit** – Moderation audit trail

### Section: Automation
- [ ] **Workflows** – Platform automations
- [ ] **Policies** – Policy config
- [ ] **Controls** – Guardrails, limits

### Section: Security
- [ ] **Threats** – Threat dashboard
- [ ] **Compliance** – SOC 2, ISO mapping
- [ ] **Incidents** – P0/P1 incident view

### Section: Analytics
- [ ] **Dashboards** – Platform analytics
- [ ] **Alerts** – Alert config, thresholds
- [ ] **Insights** – Reports, exports

### Section: Integrations
- [ ] **APIs** – API keys, usage
- [ ] **Webhooks** – Webhook config
- [ ] **Partners** – Partner integrations

### Section: Operations
- [ ] **Infra** – Health, deployments
- [ ] **Deployments** – Release management
- [ ] **Maintenance** – Maintenance windows

### Section: Data & Legal
- [ ] **Privacy** – DSR, consent
- [ ] **Retention** – Retention policies
- [ ] **Legal Hold** – Legal hold management

---

## Platform Analytics Events (Super Admin Dashboards)

From overall2.md – Platform-Level Dashboard Analytics:

| Event | Description |
|-------|-------------|
| TENANT_CREATED | New tenant onboarding |
| TENANT_ACTIVATED | Tenant goes live |
| TENANT_SUSPENDED | Tenant disabled |
| SUBSCRIPTION_STARTED | Paid plan started |
| SUBSCRIPTION_UPGRADED | Plan upgrade |
| PLATFORM_REVENUE_RECORDED | Platform-level revenue |
| FEATURE_FLAG_TOGGLED | Feature enabled/disabled |
| INCIDENT_REPORTED | Platform incident |
| GMV_RECORDED | Gross transaction |
| PLATFORM_FEE_COLLECTED | Platform commission |
| FRAUD_SIGNAL_RAISED | Fraud flag |
| USER_SUSPENDED_PLATFORM | User suspended globally |
