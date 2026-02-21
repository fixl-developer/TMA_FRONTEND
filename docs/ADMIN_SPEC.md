# Tenant Admin – Specification

> **Scope:** Tenant-level administration. Used by Tenant Owner and Staff with admin roles.
> **Phase:** After Superadmin is complete.

## Tenant Admin vs Super Admin

| Aspect | Super Admin | Tenant Admin |
|--------|-------------|--------------|
| Scope | Platform-wide | Single tenant |
| User | Platform operator | Tenant Owner, Staff |
| APIs | `/v1/super/*` | `/v1/admin/*` (tenant-scoped) |

---

## Tenant Admin Structure (from overall2.md, overall3.md)

```
Tenant Admin (Platform section - tenant-scoped)
│
├── Tenant Management
│   ├── Organizations
│   ├── Users & Roles
│   └── Compliance
│
├── Talent
│   ├── Profiles
│   ├── Portfolios
│   ├── Contracts
│   └── Availability
│
├── Casting & Auditions
│   ├── Castings
│   ├── Auditions
│   ├── Shortlists
│   └── Offers
│
├── Pageants & Events
│   ├── Events
│   ├── Judges
│   ├── Voting
│   └── Tickets
│
├── Influencers
│   ├── Discovery
│   ├── Campaigns
│   └── Reporting
│
├── Academy
│   ├── Courses
│   ├── Mentors
│   └── Certifications
│
├── Community
│   ├── Feed
│   ├── Groups
│   ├── Moderation
│   └── Loyalty
│
├── Payments
│   ├── Wallets
│   ├── Escrow
│   ├── Payouts
│   └── Ledger
│
├── Analytics
│   ├── Dashboards
│   ├── Alerts
│   └── Reports
│
├── Trust & Safety
│   ├── Disputes
│   ├── Moderation
│   └── Compliance
│
└── Admin & Integrations
    ├── APIs
    ├── Integrations
    └── Platform Ops (tenant view)
```

---

## Tenant Admin API Endpoints (from overall2.md)

### Tenant Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/admin/settings` | Tenant settings |
| PATCH | `/v1/admin/settings` | Update tenant settings |
| GET | `/v1/admin/limits` | Tenant limits |
| PATCH | `/v1/admin/limits` | Update limits |
| GET | `/v1/admin/risk` | Tenant risk view |
| POST | `/v1/admin/credits/issue` | Issue credits (tenant-scoped) |

---

## Implementation Checklist

### Tenant Management
- [ ] Organization profile (name, branding, subdomain)
- [ ] Users & roles (invite, assign roles, remove)
- [ ] Compliance (consent, retention per tenant)

### Talent
- [ ] Talent profiles (CRUD, verification)
- [ ] Portfolios (assets, approval)
- [ ] Contracts (templates, send, void)
- [ ] Availability (calendar, holds)

### Casting & Auditions
- [ ] Castings (create, publish, close)
- [ ] Auditions (schedule, submissions)
- [ ] Shortlists (bulk actions)
- [ ] Offers (create, confirm)

### Pageants & Events
- [ ] Events (create, stages, process builder)
- [ ] Judges (assign, scoring)
- [ ] Voting (if applicable)
- [ ] Tickets (if applicable)

### Influencers
- [ ] Discovery (search, filters)
- [ ] Campaigns (create, track)
- [ ] Reporting (deliverables, engagement)

### Academy
- [ ] Courses (create, publish)
- [ ] Mentors (assign)
- [ ] Certifications (issue, track)

### Community
- [ ] Feed (moderation queue)
- [ ] Groups (create, moderate)
- [ ] Moderation (content review)
- [ ] Loyalty (tiers, rewards)

### Payments
- [ ] Wallets (tenant wallet view)
- [ ] Escrow (tenant escrow status)
- [ ] Payouts (request, approve)
- [ ] Ledger (entries, statements)

### Trust & Safety
- [ ] Disputes (tenant disputes)
- [ ] Moderation (content actions)
- [ ] Compliance (tenant config)

### Integrations
- [ ] APIs (tenant API keys)
- [ ] Integrations (webhooks, partners)

---

## Tenant-Level Analytics Events

From overall2.md:

| Event | Description |
|-------|-------------|
| TENANT_REVENUE_RECORDED | Tenant income |
| TENANT_PAYOUT_COMPLETED | Successful payout |
| TALENT_ONBOARDED | Talent approved |
| EVENT_PUBLISHED | Event/pageant live |
| USER_INVITED | User invited |
| ROLE_ASSIGNED | Role granted |
| CONTENT_APPROVED | Content moderation |
| CONTENT_REJECTED | Moderation reject |
| PAYMENT_RECEIVED | Incoming payment |
| PAYOUT_REQUESTED | Withdrawal initiated |
| PAYOUT_APPROVED | Payout approved |
| REFUND_PROCESSED | Refund issued |
