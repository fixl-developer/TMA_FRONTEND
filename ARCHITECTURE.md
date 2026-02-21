# TalentOS (TMA) Platform Architecture

> **Based on:** docs.md (Product Requirements Document)  
> **Last Updated:** February 13, 2026

---

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         TALENTOS PLATFORM (PaaS)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐               │
│  │   SUPER ADMIN     │  │   TENANT APP     │  │   MOBILE APP      │               │
│  │   (Web)           │  │   (Web)          │  │   (Phase 2)       │               │
│  │   frontend-       │  │   frontend/       │  │   Talent + Brand   │               │
│  │   superadmin/     │  │                  │  │   only             │               │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘               │
│           │                    │                      │                          │
│           └────────────────────┼──────────────────────┘                          │
│                                │                                                 │
│                                ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                        BACKEND (NestJS / Node.js)                            ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            ││
│  │  │ Auth & RBAC │ │ Multi-      │ │ Pageant     │ │ Payments &   │            ││
│  │  │ OAuth+JWT   │ │ Tenancy     │ │ Engine      │ │ Finance      │            ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                │                                                 │
│                                ▼                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐               │
│  │   PostgreSQL      │  │   S3-compatible   │  │   Razorpay /     │               │
│  │   (schema-per-     │  │   Storage         │  │   Stripe         │               │
│  │   tenant)         │  │                  │  │                  │               │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. User Roles & Access Layers

### Platform Level
| Role | Scope | Purpose |
|------|-------|---------|
| **Super Admin** | Platform-wide | Tenant approval, governance, finance, moderation |

### Tenant Level
| Role | Scope | Purpose |
|------|-------|---------|
| **Tenant Owner** | Single tenant | Agency/Organizer control |
| **Staff** | Tenant | Manager, Coordinator, Finance |
| **Talent** | Tenant | Model, Influencer, Artist |
| **Brand / Sponsor** | Tenant | Campaigns, sponsorships |
| **Judge** | Event-specific | Scoring, evaluation |

---

## 3. Core Platform Domains (docs.md §5, §6)

### 3.1 Multi-Tenancy & White Label
- Tenant onboarding (self-serve)
- Subdomain support (`tenant.platform.com`)
- Custom branding (logo, colors)
- Feature toggles per tenant
- Data isolation (schema-per-tenant)

### 3.2 User & Access Control
- Role-Based Access Control (RBAC)
- Permission matrix per module
- Audit logs

### 3.3 Talent Profiles (Talent Graph Core)
- Personal details, stats, categories
- Portfolio (images, videos)
- Verification status
- Availability calendar
- Consent & privacy controls

---

## 4. Modular Apps (Add-On Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODULAR APPS (docs.md §6)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │ PAGEANT ENGINE      │  │ AGENCY & TALENT     │  │ SPONSORSHIP &       │   │
│  │ (Priority Module)   │  │ MANAGEMENT          │  │ BRAND HUB           │   │
│  │ - Process Builder   │  │ - Talent CRM        │  │ - Sponsor profiles  │   │
│  │ - Scoring Engine    │  │ - Contracts & e-sign│  │ - Packages          │   │
│  │ - Templates         │  │ - Booking calendar  │  │ - ROI reports       │   │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │ ACADEMY / TRAINING  │  │ CASTING & AUDITIONS │  │ BOOKINGS & JOBS     │   │
│  │ - Video courses     │  │ - Casting calls     │  │ - Job marketplace   │   │
│  │ - Live workshops    │  │ - Self-tapes        │  │ - Invoicing          │   │
│  │ - Certifications   │  │ - Shortlisting      │  │ - Payouts            │   │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │ INFLUENCER MGMT     │  │ EVENTS PRODUCTION   │  │ PORTFOLIO STUDIO    │   │
│  │ - Media kit         │  │ - Run-of-show       │  │ - Shoot packages    │   │
│  │ - Campaign tracking │  │ - Vendor mgmt       │  │ - Photographer/MUA   │   │
│  │ - Engagement        │  │ - Ticketing         │  │ - Asset delivery    │   │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Pageant Engine Data Model (docs.md §16)

```
Pageant
  ├── Stage (id, pageant_id, name, order, type, visibility_rules)
  │     ├── Action (id, stage_id, type, config)
  │     ├── Rule (id, stage_id, condition, outcome)
  │     └── Transition (from_stage_id, to_stage_id, trigger)
  ├── ScoringProfile (id, pageant_id, method, normalization)
  │     └── Criterion (id, scoring_profile_id, weight)
  ├── JudgeAssignment (judge_id, stage_id)
  └── ParticipantStageState (participant_id, stage_id, status)
```

---

## 6. Unified Platform ER Domains (docs.md §20)

| Domain | Core Entities |
|--------|----------------|
| **Tenant & Governance** | Tenant, TenantUser, Role, Permission |
| **Talent & Content** | TalentProfile, ContentPost, ContentAsset, ContentRights, ContentAnalytics |
| **Pageants & Events** | Pageant, Stage, Action, Rule, Transition, ParticipantStageState, ScoringProfile, Criterion |
| **Brands & Ads** | Brand, SponsoredCampaign, AdPlacement, AdApproval |
| **Commerce & Finance** | Transaction, Payout, CommissionRule, Invoice |
| **Community** | CommunityGroup, CommunityPost, ModerationLog |

---

## 7. Frontend Application Structure (Current)

```
TMA-frontend/
├── frontend/                    # Tenant/User Web App
│   ├── app/
│   │   ├── page.tsx             # Tenant Dashboard
│   │   ├── tenant/
│   │   │   ├── pageants/        # Pageants list + process viewer
│   │   │   ├── talent/          # Talent CRM
│   │   │   ├── events/          # Events pipeline
│   │   │   ├── campaigns/       # Campaign management
│   │   │   ├── brands/          # Brand partners
│   │   │   ├── academy/         # Academy/Training
│   │   │   ├── influencers/     # Influencer management
│   │   │   ├── collaborations/   # Cross-tenant collaboration
│   │   │   ├── search/          # Global search
│   │   │   └── settings/        # Tenant settings + branding
│   │   └── layout.tsx
│   ├── shared/
│   │   ├── components/          # UI, charts, process-builder, search
│   │   ├── services/            # Mock services (seed data)
│   │   ├── lib/types/           # TypeScript types
│   │   └── hooks/
│   ├── tenant/                  # Feature-specific modals
│   │   ├── pageants/modals/
│   │   ├── events/modals/
│   │   ├── campaigns/modals/
│   │   ├── brands/modals/
│   │   ├── talent/modals/
│   │   ├── academy/modals/
│   │   ├── influencers/modals/
│   │   └── collaborations/modals/
│   ├── data/seed/               # JSON seed data
│   └── store/                   # Redux (auth, tenant)
│
└── frontend-superadmin/         # Super Admin Web App
    ├── app/
    │   ├── page.tsx             # Control tower dashboard
    │   ├── pageants/            # Pageants console
    │   ├── tenants/             # Tenants management
    │   ├── talent-showcase/     # Talent showcase
    │   ├── finance/             # Finance & Wallets
    │   ├── governance/           # Governance & Moderation
    │   └── search/              # Global search
    ├── shared/
    │   ├── components/
    │   ├── services/
    │   └── lib/types/
    └── data/seed/
```

---

## 8. Tech Stack (docs.md §10)

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **State** | Redux Toolkit (auth, tenant) |
| **Forms** | React Hook Form + Zod |
| **Backend** | Node.js (NestJS) |
| **Database** | PostgreSQL |
| **Storage** | S3-compatible |
| **Auth** | OAuth + JWT |
| **Payments** | Razorpay (India) → Stripe (Global) |
| **Hosting** | AWS / GCP |

---

## 9. Key Flows (docs.md §21)

1. Agency signs up → sets branding  
2. Creates a customizable pageant  
3. Talents register & submit content  
4. Judges score via blind scoring  
5. Event generates showcases  
6. Content published to social media  
7. Brands sponsor showcases  
8. Talent gets booked  
9. Payments & commissions auto-settled  

---

## 10. Phase Roadmap (docs.md §12)

| Phase | Timeline | Focus |
|-------|----------|-------|
| **Phase 1** | 0–6 months | Core + Custom Pageant Engine |
