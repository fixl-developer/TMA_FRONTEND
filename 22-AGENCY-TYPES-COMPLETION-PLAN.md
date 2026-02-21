# 22 Agency Types & B1–B10 Blueprints – Completion Plan

> **Source:** overall.md (lines 3731–4113) – Agency Type → Blueprint matrix  
> **Current state:** 5 tenants in seed data  
> **Target:** 22 agency types with correct blueprints, B10 holding structure  
> **Updated:** February 2026

---

## Reference: 22 Agency Types → Blueprint Mapping (overall.md)

| # | Agency Type | Blueprints | Key Modules |
|---|-------------|------------|-------------|
| 1 | Modeling Agency | B1, (B8 optional) | Roster, Booking, Portfolio, Escrow |
| 2 | Talent Agency (actors/performers) | B1 + B2 | Roster, Casting, Auditions, Deals |
| 3 | Casting Agency / Casting Director Office | B2 | Casting calls, Shortlist, Auditions |
| 4 | Production House / Studio | B2 + B6 | Casting, Projects, Vendor, Milestones |
| 5 | Influencer Management Agency | B4, (B8 optional) | Deal rooms, Deliverables, Content approvals |
| 6 | UGC / Content Production Agency | B6 + B4 | Brief→production→deliver, Asset library |
| 7 | Social Media / Growth Marketing Agency | B4 + B8 | Campaigns, Content calendar, Community |
| 8 | Pageant Organizer / Pageant Agency | B3 + B8 + (B4 optional) | Season builder, Judges, Results |
| 9 | Pageant Training/Grooming Agency | B5 + (B1 optional) | Courses, Cohorts, Certificates |
| 10 | Acting/Modeling Academy / Institute | B5 + (B1 optional) | Courses, Assessments, Certificates |
| 11 | Speaker Bureau / Public Figure Booking | B1 | Booking, Itinerary, Contracts |
| 12 | Sports / Esports Talent Agency | B1 + B4 | Deals, Appearances, Deliverables |
| 13 | Event/Concert/Festival Promoter | B1 + B6 + B4 | Event ops, Booking, Sponsor placements |
| 14 | Photography/Videography Agency | B6 | Booking, Shoot schedules, Asset delivery |
| 15 | Styling/Makeup/Wardrobe Agency | B1 + (B7 optional) | Service packages, Booking calendar |
| 16 | Event Staffing Agency | B7 + (B1 optional) | Shift rosters, Check-ins, Payroll |
| 17 | Creative Recruitment Agency | B2 + (B6 optional) | Listings, Applications, Shortlist |
| 18 | Brand / Sponsor Team (as tenant) | B4 | Campaign manager, Deal rooms, Approvals |
| 19 | Media Buying / Ad Agency | B4 | Campaigns, Reporting, Billing |
| 20 | Talent Network / Community Operator | B8 + (B1 optional) | Communities, Discovery, Rewards |
| 21 | Marketplace / Aggregator | B9 | Vendor onboarding, Listings, Escrow |
| 22 | Holding Company (multi-agency group) | B10 + underlying | Sub-tenants, Policy packs, Consolidated |

---

## Current vs Target State

| Metric | Current | Target |
|--------|---------|--------|
| Tenants | 5 | 22 (+ 1 B10 parent = 23 total) |
| Agency types covered | 4 | 22 |
| B10 sub-tenant structure | ❌ | ✅ |
| Users per tenant | 1–3 | 1–2 per tenant (minimal) |

---

## Implementation Phases

### Phase 1: Expand tenants.json (22 Agency Types)

**File:** `frontend/data/seed/tenants.json`

**Tasks:**
- [x] Add 17 new tenant records (keep existing 5, add 17 more)
- [x] Map each to correct `agencyType` and `blueprints` per matrix above
- [x] Use consistent schema: `_id`, `type`, `agencyType`, `blueprints`, `name`, `slug`, `status`, `timezone`, `countryCode`, `settings.branding`
- [x] Ensure unique slugs (e.g., `elite-models`, `spotlight-talent`, `metro-casting`)

**Tenant type mapping for `type` field:**
- AGENCY → Modeling, Talent, Casting, Production, Influencer, UGC, Social Media, Speaker Bureau, Sports, Photography, Styling, Event Staffing, Creative Recruitment, Talent Network
- PAGEANT_ORG → Pageant Organizer, Pageant Training
- ACADEMY → Acting/Modeling Academy
- EVENT_ORG → Event Promoter
- BRAND → Brand/Sponsor Team, Media Buying
- MARKETPLACE → Marketplace/Aggregator
- HOLDING → Holding Company (B10)

**Suggested new tenant IDs & names:**

| ID | Name | agencyType | blueprints |
|----|------|------------|------------|
| tenant_006 | Spotlight Talent Agency | TALENT_AGENCY | ["B1","B2"] |
| tenant_007 | Metro Casting Directors | CASTING_AGENCY | ["B2"] |
| tenant_008 | Studio Nine Productions | PRODUCTION_HOUSE | ["B2","B6"] |
| tenant_009 | CreatorVerse Influencers | INFLUENCER_AGENCY | ["B4","B8"] |
| tenant_010 | Pixel Perfect UGC | UGC_PRODUCTION | ["B6","B4"] |
| tenant_011 | Social Buzz Marketing | SOCIAL_MARKETING_AGENCY | ["B4","B8"] |
| tenant_012 | Crown Grooming Academy | PAGEANT_TRAINING | ["B5","B1"] |
| tenant_013 | National Acting Institute | ACTING_ACADEMY | ["B5","B1"] |
| tenant_014 | Keynote Speakers Bureau | SPEAKER_BUREAU | ["B1"] |
| tenant_015 | Pro Sports Talent Co | SPORTS_AGENCY | ["B1","B4"] |
| tenant_016 | Lens & Frame Studios | PHOTOGRAPHY_AGENCY | ["B6"] |
| tenant_017 | Glam Squad Styling | STYLING_AGENCY | ["B1","B7"] |
| tenant_018 | EventForce Staffing | EVENT_STAFFING_AGENCY | ["B7","B1"] |
| tenant_019 | Creative Recruit Pro | CREATIVE_RECRUITMENT | ["B2","B6"] |
| tenant_020 | AdVantage Media | MEDIA_BUYING_AGENCY | ["B4"] |
| tenant_021 | Talent Connect Network | TALENT_NETWORK | ["B8","B1"] |
| tenant_022 | GigHub Marketplace | MARKETPLACE_AGGREGATOR | ["B9"] |
| tenant_023 | TalentOS Holdings | HOLDING_COMPANY | ["B10"] |

---

### Phase 2: B10 Holding Company & Sub-Tenant Links

**New file:** `frontend/data/seed/sub_tenant_links.json` (optional – can be in tenants)

**Structure:**
```json
[
  {
    "groupId": "tenant_023",
    "subTenantId": "tenant_001",
    "linkedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "groupId": "tenant_023",
    "subTenantId": "tenant_004",
    "linkedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

**Tasks:**
- [x] Add `parentTenantId` (optional) to tenant schema for B10 children
- [x] Or create `sub_tenant_links.json` for GroupTenant → SubTenant relationships
- [x] Link 2–3 existing agencies (e.g., tenant_001, tenant_004) under tenant_023

---

### Phase 3: Users for New Tenants

**File:** `frontend/data/seed/users.json`

**Tasks:**
- [x] Add 1 owner/admin user per new tenant (17 new users)
- [x] Map `tenantIds` to new tenant IDs
- [x] Add demo login credentials to AuthContext (e.g., `owner@spotlight-talent.com` / demo123)
- [x] Super Admin should see all 23 tenants

**User schema:** `_id`, `email`, `name`, `status`, `role`, `tenantIds`, `lastLoginAt`, `createdAt`

---

### Phase 4: Supporting Seed Data for New Tenants

**Files to update:** Distribute existing + minimal new records across tenants

| File | Strategy |
|------|----------|
| `talents.json` | Add 1–2 talents per new tenant (B1/B2/B5 tenants); skip for B4-only brands |
| `castings.json` | Add 1–2 castings for tenant_006, tenant_007, tenant_008 |
| `bookings.json` | Add 1 booking for a few B1 tenants |
| `contracts.json` | Add 1 contract for tenant_001, tenant_004, tenant_009 |
| `campaigns.json` | Add 1 campaign for tenant_009, tenant_018 (B4) |
| `courses.json` | Add 1 course for tenant_012, tenant_013 (B5) |
| `pageants.json` | Keep tenant_002; add 1 for tenant_008 if pageant events |
| `wallets.json` | Add 1 wallet per tenant |
| `invoices.json` | Add 1–2 invoices for finance tenants |
| `teams.json` | Add 1 team per new tenant |
| `roles.json` | Ensure roles support all blueprint default roles |

**Minimal approach:** Add 1–2 records per entity type for 3–5 representative tenants to avoid bloat. Other tenants can show empty states.

---

### Phase 5: Update TenantContext & Auth

**File:** `frontend/shared/context/TenantContext.tsx`

**Tasks:**
- [ ] Update `ROLE_DEFAULT_TENANT` to include new roles if needed (e.g., `casting`, `academy`, `staffing`)
- [ ] For non-superadmin: derive `availableTenantIds` from `user.tenantIds` (from users.json) instead of hardcoded role→tenant map
- [ ] Ensure tenant switcher handles 22+ tenants (search/filter if dropdown is long)

**File:** `frontend/shared/context/AuthContext.tsx`

**Tasks:**
- [ ] Add demo users for new tenant owners (e.g., `owner006@spotlight-talent.com`)
- [ ] Map `tenantIds` from users.json so each user sees only their tenants

---

### Phase 6: TypeScript Types & Agency Type Enum

**File:** `frontend/shared/lib/types/tenants.ts`

**Tasks:**
- [ ] Add `AGENCY_TYPE` enum with all 22 values
- [ ] Add `BLUEPRINT` enum: B1–B10
- [ ] Extend `Tenant` type: `parentTenantId?: string` for B10 children
- [ ] Add `agencyType` as union of enum values

**New file (optional):** `frontend/shared/lib/constants/agencyBlueprints.ts`

```ts
export const AGENCY_TYPE_BLUEPRINT_MAP: Record<string, string[]> = {
  MODELING_AGENCY: ["B1", "B8"],
  TALENT_AGENCY: ["B1", "B2"],
  CASTING_AGENCY: ["B2"],
  // ... all 22
}
```

---

### Phase 7: UI Updates

**Tenant switcher:**
- [ ] Add search/filter when >10 tenants
- [ ] Show agency type badge (e.g., "Modeling", "Pageant") in dropdown
- [ ] Group by type (optional)

**Super Admin tenants list:**
- [ ] Show `agencyType` and `blueprints` columns
- [ ] Filter by agency type
- [ ] B10: show sub-tenant count, expand to list children

**Tenant detail/settings:**
- [ ] Display blueprints as read-only badges
- [ ] B10: show "Sub-tenants" section with links

---

## Execution Order

| Step | Phase | Effort | Dependencies |
|------|-------|--------|--------------|
| 1 | Phase 1: tenants.json | 1–2 hrs | None |
| 2 | Phase 6: Types | 30 min | Phase 1 |
| 3 | Phase 3: users.json | 1 hr | Phase 1 |
| 4 | Phase 5: TenantContext/Auth | 1 hr | Phase 3 |
| 5 | Phase 2: B10 structure | 30 min | Phase 1 |
| 6 | Phase 4: Supporting data | 2–3 hrs | Phase 1 |
| 7 | Phase 7: UI | 1–2 hrs | All above |

**Total estimate:** 7–10 hours

---

## Validation Checklist

- [ ] All 22 agency types present in tenants.json
- [ ] Each tenant has correct `blueprints` array per overall.md matrix
- [ ] B10 tenant (tenant_023) exists with `blueprints: ["B10"]`
- [ ] At least 2 sub-tenants linked under B10
- [ ] Every tenant has ≥1 user in users.json
- [ ] Super Admin can switch to all tenants
- [ ] Tenant switcher works for users with multiple tenants
- [ ] No broken references (tenantId in talents, castings, etc.)
- [ ] Types align with seed data

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `frontend/data/seed/tenants.json` | Modify – add 17 tenants, 1 B10 |
| `frontend/data/seed/users.json` | Modify – add 17+ users |
| `frontend/data/seed/sub_tenant_links.json` | Create (optional) |
| `frontend/shared/lib/types/tenants.ts` | Modify – enums, parentTenantId |
| `frontend/shared/lib/constants/agencyBlueprints.ts` | Create (optional) |
| `frontend/shared/context/TenantContext.tsx` | Modify – tenant resolution |
| `frontend/shared/context/AuthContext.tsx` | Modify – demo users |
| `frontend/data/seed/talents.json` | Modify – add for new tenants |
| `frontend/data/seed/castings.json` | Modify – add for new tenants |
| `frontend/data/seed/teams.json` | Modify – add for new tenants |
| `frontend/data/seed/wallets.json` | Modify – add for new tenants |
| Tenant switcher component | Modify – search/filter |
| Super Admin tenants page | Modify – agency type, B10 view |

---

## Integration with 12-WEEK-PLAN

This plan extends **Phase 1 (Seed Data)** and **Phase 11 (Superadmin)** of the 12-WEEK-PLAN:

- **12-WEEK Phase 1:** "tenants.json – sample tenants (agencies, pageant orgs)" → now explicitly 22 types
- **12-WEEK Phase 11:** Superadmin tenants list → add agency type, blueprints, B10 sub-tenant view

---

*Document Version: 1.0 | 22 Agency Types Completion | Feb 2026*
