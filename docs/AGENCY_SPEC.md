# 5 Agency Types – Specification

> **Scope:** Tenant-facing apps for each tenant type.
> **Phase:** After Tenant Admin is complete.

## The 5 Agency Types (Target Customers)

| # | Type | Primary Use Case |
|---|------|------------------|
| 1 | Modelling Agency | Talent CRM, bookings, portfolios, castings |
| 2 | Pageant Organizer | Events, stages, scoring, sponsors, registrations |
| 3 | Talent Management Company | CRM, contracts, commissions, availability |
| 4 | Academy & Grooming Institute | Courses, mentors, certifications, progress |
| 5 | Influencer Management Agency | Campaigns, deliverables, media kits, reporting |

---

## 1. Modelling Agency

**Focus:** Talent representation, castings, bookings.

### Core Features
- Talent profiles & portfolios
- Casting calls (create, publish, shortlist)
- Bookings & call sheets
- Contract management & e-sign
- Commission rules
- Booking calendar
- Performance tracking

### Key Modules
- Talent CRM
- Jobs / Casting / Bookings
- Contracts & E-Signature
- Payments & Escrow

---

## 2. Pageant Organizer

**Focus:** Pageant events, stages, scoring, sponsors.

### Core Features
- Pageant Process Builder (stages, actions, rules)
- Registration & payments
- Judge assignment & scoring
- Sponsor integration
- Result publishing
- Reusable templates (Beauty, Kids, Talent Hunt, Reality)

### Key Modules
- Pageant Engine
- Talent (contestants)
- Payments (registration fees)
- Sponsored Ads (optional)

---

## 3. Talent Management Company

**Focus:** Full talent lifecycle, contracts, commissions.

### Core Features
- Talent CRM & pipelines
- Contract templates & e-sign
- Commission rules
- Availability calendar
- Performance tracking
- Payout management

### Key Modules
- Talent CRM
- Contracts & E-Signature
- Ledger / Wallet
- Payments

---

## 4. Academy & Grooming Institute

**Focus:** Training, courses, certifications.

### Core Features
- Video course hosting
- Live workshop scheduling
- Mentor assignment
- Certifications
- Progress tracking
- Talent pipeline (graduates)

### Key Modules
- Academy (courses, mentors)
- Talent (students)
- Certifications
- Community (optional)

---

## 5. Influencer Management Agency

**Focus:** Campaigns, deliverables, brand deals.

### Core Features
- Media kit generator
- Campaign tracking
- Deliverables dashboard
- Engagement reporting (manual/API)
- Brand collaboration workflow
- Content approval

### Key Modules
- Influencer Management
- Talent Showcase
- Sponsored Campaigns
- Content / Social integration

---

## Shared Across All 5

- **Identity & Tenancy** – Login, roles, invitations
- **Talent Profiles** – Base profile (adapted per type)
- **Payments** – Wallets, escrow, payouts
- **Notifications** – In-app, email
- **Analytics** – Dashboards per tenant type

---

## Implementation Order (Suggested)

1. **Modelling Agency** – Core talent + casting + bookings (foundation)
2. **Pageant Organizer** – Pageant engine (differentiator)
3. **Talent Management** – Extends Modelling with contracts/commissions
4. **Academy** – Courses, certifications (new domain)
5. **Influencer Agency** – Campaigns, deliverables (extends talent)

---

## Frontend Structure Options

**Option A:** Single tenant app with role/type-based views
```
frontend-tenant/
  app/
    modelling/
    pageant/
    talent-mgmt/
    academy/
    influencer/
```

**Option B:** Separate app per type (if UX diverges significantly)
```
frontend-modelling/
frontend-pageant/
frontend-talent-mgmt/
frontend-academy/
frontend-influencer/
```

**Recommendation:** Start with Option A (unified tenant app) for shared components and consistency.
