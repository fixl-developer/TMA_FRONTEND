# TalentOS — User Creation & Ownership Hierarchy Architecture

> **Who creates what?** Detailed architecture of user roles and entity creation flows.  
> **Based on:** docs.md (PRD)  
> **Last Updated:** February 13, 2026

---

## 1. Hierarchy Overview

```
                    ┌─────────────────────────────────────┐
                    │         SUPER ADMIN (Platform)        │
                    │  • Creates & approves Tenants        │
                    │  • Platform-wide governance          │
                    └──────────────────┬──────────────────┘
                                       │ creates / approves
                                       ▼
                    ┌─────────────────────────────────────┐
                    │           TENANT (Organization)      │
                    │  Agency / Pageant Org / Brand / etc.  │
                    │  • Has one Tenant Owner               │
                    └──────────────────┬──────────────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   TENANT OWNER      │    │   STAFF             │    │   EXTERNAL ROLES     │
│   (Agency/Org head) │    │   (Manager,         │    │   Talent, Brand,      │
│   Creates:          │    │   Coordinator,      │    │   Judge               │
│   • Staff           │    │   Finance)         │    │   (Invited/Onboarded) │
│   • Pageants        │    │   Creates:          │    │                       │
│   • Brands          │    │   • Events          │    │                       │
│   • Collaborations  │    │   • Campaigns       │    │                       │
│   • Courses         │    │   • Casting calls   │    │                       │
│   • Influencers     │    │   • Assigns Judges  │    │                       │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

---

## 2. Super Admin — Creation & Control

| Super Admin Creates | Description | Approval Flow |
|---------------------|-------------|---------------|
| **Tenant** | New organization (Agency, Pageant Org, Brand, Academy) | Self-serve signup → Super Admin approves/suspends |
| **Regional Moderators** | Platform-level moderators | Super Admin appoints |
| **Global Rules & Policies** | Community rules, code of conduct | Super Admin defines |
| **Feature Toggles** | Per-tenant feature enable/disable | Super Admin configures |

### Super Admin Does NOT Create
- Pageants, Events, Campaigns (tenant-scoped)
- Talent profiles (tenant or self-registration)
- Brands (tenant-scoped)

---

## 3. Tenant — Creation & Lifecycle

| Created By | Entity | Notes |
|------------|--------|-------|
| **Super Admin** | Tenant (approval only) | Tenant signs up self-serve; Super Admin approves |
| **Platform** | Tenant (auto) | On signup, Tenant account created with Tenant Owner |

### Tenant Signup Flow (docs.md §15.2)
1. **Pre-Onboarding:** User sees rules, benefits
2. **Signup (Day 0):** Tenant account created, branding setup, community access = read-only
3. **Activation (Days 1–14):** Complete profile, add first talent/event, onboarding webinar
4. **Participation (Days 15–45):** Posting unlocked after verification
5. **Trust (45+ Days):** Badges, roundtables, advisory

---

## 4. Tenant Owner — Creates What

| Tenant Owner Creates | Description | Scope |
|---------------------|-------------|-------|
| **Staff** | Manager, Coordinator, Finance | Within tenant |
| **Pageant** | Process definition, stages, scoring | Tenant-scoped |
| **Brand** | Brand partner record | Tenant-owned or shared |
| **Collaboration** | Invites another tenant to collaborate | Tenant A ↔ Tenant B |
| **Course** | Academy course (if Academy module) | Tenant-scoped |
| **Influencer** | Invites influencer to join agency | Tenant-scoped |
| **Branding** | Logo, colors, subdomain | Tenant-scoped |
| **Roles & Permissions** | Custom roles per tenant | Tenant-scoped |

### Tenant Owner Assigns
- Staff to roles (Manager, Coordinator, Finance)
- Judges to pageant stages (or delegates to Staff)

---

## 5. Staff — Creates What

| Staff Creates | Description | Who Can Do It |
|---------------|-------------|---------------|
| **Event** | Workshop, audition, showcase, bootcamp | Manager, Coordinator |
| **Campaign** | Sponsored campaign, brand collaboration | Manager, Coordinator |
| **Casting Call** | Role listing, self-tape submission | Manager, Coordinator |
| **Judge Assignment** | Assigns Judge to stage | Manager, Pageant Director |
| **Talent** | Onboards talent (invite or add) | Manager, Coordinator |
| **Content Approval** | Approves/rejects talent showcase content | Coordinator |
| **Course** | Academy course (if permitted) | Manager, Trainer |
| **Training Session** | Live/offline session | Trainer, Coordinator |
| **Collaboration** | Invites partner tenant (if permitted) | Manager, Tenant Owner |

### Staff Permissions (by Role)
- **Manager:** Full access to tenant operations
- **Coordinator:** Events, campaigns, talent, content
- **Finance:** Invoicing, payouts, reconciliation (read/write financial)

---

## 6. Talent — Creates What (Self)

| Talent Creates | Description | Who |
|----------------|-------------|-----|
| **Talent Profile** | Self-registration (or invited by agency) | Talent |
| **Registration** | Registers for pageant/event | Talent |
| **Content Post** | Uploads portfolio, reels, videos | Talent |
| **Application** | Applies to casting call, job | Talent |
| **Course Enrollment** | Enrolls in academy course | Talent |
| **Booking** | Accepts/declines booking (if invited) | Talent |

### Talent Cannot Create
- Pageants, Events, Campaigns
- Other tenants
- Brands (unless Brand role)

---

## 7. Brand / Sponsor — Creates What

| Brand Creates | Description | Approval |
|---------------|-------------|----------|
| **Campaign** | Sponsored campaign, ad draft | Tenant approval mandatory |
| **Sponsorship Package** | Sponsorship deal with tenant | Tenant negotiates |
| **Ad Creative** | Campaign creative (draft) | Tenant + Platform compliance |
| **Collaboration** | Invites tenant for campaign | Tenant accepts |

### Brand Flow
- Brand **drafts** campaign → Tenant **approves** → Platform **compliance review** → Launch

---

## 8. Judge — Creates What

| Judge Creates | Description | Scope |
|---------------|-------------|-------|
| **Score** | Scores participant in stage | Event-specific |
| **Evaluation** | Submits evaluation/feedback | Stage-specific |

### Judge Cannot Create
- Pageants, Events, Stages
- Assignments (Judge is **assigned by** Tenant/Staff)

---

## 9. Entity Creation Matrix

| Entity | Created By | Approved By | Scope |
|--------|------------|-------------|-------|
| **Tenant** | Self (signup) | Super Admin | Platform |
| **Tenant Owner** | Auto on signup | — | Tenant |
| **Staff** | Tenant Owner | Tenant Owner | Tenant |
| **Pageant** | Tenant Owner | — | Tenant |
| **Stage** | Tenant Owner / Staff | — | Pageant |
| **Event** | Staff | Tenant Owner (optional) | Tenant |
| **Campaign** | Staff / Brand | Tenant (mandatory) | Tenant |
| **Brand** | Tenant Owner / Staff | — | Tenant |
| **Talent** | Talent (self) / Staff (invite) | Tenant (if invited) | Tenant |
| **Influencer** | Staff (invite) | Influencer (accepts) | Tenant |
| **Judge** | Staff (assign) | — | Event/Stage |
| **Collaboration** | Tenant Owner / Staff | Partner Tenant | Cross-tenant |
| **Course** | Tenant Owner / Staff | Tenant (optional) | Tenant |
| **Content Post** | Talent | Tenant (default ON) | Tenant |
| **Ad Campaign** | Brand / Tenant | Tenant + Platform | Tenant |

---

## 10. Approval Flows (Who Approves What)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPROVAL HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TENANT SIGNUP          →  Super Admin approves / suspends                    │
│  STAFF ADD              →  Tenant Owner (implicit)                          │
│  PAGEANT PUBLISH        →  Tenant Owner / Staff (no platform approval)     │
│  CAMPAIGN LAUNCH        →  Tenant (mandatory) + Platform compliance          │
│  AD CREATIVE             →  Tenant + Platform compliance review              │
│  CONTENT SHOWCASE        →  Tenant (default ON)                               │
│  COLLABORATION           →  Partner Tenant accepts                            │
│  INFLUENCER ONBOARD      →  Influencer accepts invite                        │
│  TALENT (invited)        →  Talent accepts invite                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Data Isolation (Who Sees What)

| Role | Sees |
|------|------|
| **Super Admin** | All tenants, all pageants, platform finance, governance, moderation |
| **Tenant Owner** | Own tenant only: pageants, events, campaigns, brands, talent, staff |
| **Staff** | Own tenant, per-role permissions (e.g. Finance sees wallets) |
| **Talent** | Own profile, pageants/events they registered for, own content |
| **Brand** | Own campaigns, tenant campaigns they're linked to |
| **Judge** | Assigned stages only, participant scores (blind scoring) |

---

## 12. Summary Diagram

```
SUPER ADMIN
    │
    ├── Approves Tenant
    │
TENANT (Organization)
    │
    ├── Tenant Owner
    │       ├── Creates Staff
    │       ├── Creates Pageant
    │       ├── Creates Brand
    │       ├── Creates Collaboration (invite)
    │       ├── Creates Course
    │       └── Invites Influencer
    │
    ├── Staff
    │       ├── Creates Event
    │       ├── Creates Campaign
    │       ├── Creates Casting Call
    │       ├── Assigns Judge
    │       ├── Invites/Onboards Talent
    │       └── Approves Content
    │
    ├── Talent (self or invited)
    │       ├── Creates Profile (self)
    │       ├── Registers for Pageant/Event
    │       ├── Creates Content Post
    │       └── Applies to Casting/Job
    │
    ├── Brand
    │       ├── Drafts Campaign
    │       ├── Creates Ad Creative
    │       └── Invites Collaboration
    │
    └── Judge (assigned by Staff)
            └── Creates Score / Evaluation
```
