# TalentOS — Phases 16–30 Implementation Plan

> **Scope:** Next 15 phases after Phase 15 (Content Showcasing)  
> **Context:** UI-only, seed/mock data. Backend integration in later phases.  
> **Created:** February 16, 2026

---

## Current State (Phases 1–15 Done)

| Phase | Module | Status |
|-------|--------|--------|
| 1–5 | Super Admin | ✅ |
| 6–7 | Tenant Admin | ✅ |
| 8–10 | Agency Shells (Modelling, Pageant, Talent Mgmt, Academy, Influencer) | ✅ |
| 11 | Auth & Onboarding | ✅ |
| 12 | Pageant Engine (Builder, Scoring, Rules, Preview) | ✅ |
| 13 | Pageant Live & Analytics | ✅ |
| 14 | Payments & Finance | ✅ |
| 15 | Content Showcasing & Social Media | ✅ |

---

## Phases 16–30 Overview

| Phase | Name | Focus | Est. Effort |
|-------|------|-------|-------------|
| **16** | Sponsored Ads & Monetization | Ad campaign wizard, creatives, targeting, approvals, performance | 1 week |
| **17** | Loyalty, Rewards & Discounts | Rewards dashboard, earn/redeem, tiers, discount codes | 1 week |
| **18** | Academy Deep Dive | Course player, assessments, live sessions, certificates, trainer tools | 1 week |
| **19** | Collaboration Engine | Collab hub, wizard, contracts, revenue splits | 1 week |
| **20** | Bookings & Jobs | Job marketplace, booking flow, negotiation, calendar | 1 week |
| **21** | Mobile Responsive & Polish | Responsive audit, touch targets, loading/error/empty states | 1 week |
| **22** | UI Polish & Accessibility | Skeleton loaders, ARIA, keyboard nav, contrast | 0.5 week |
| **23** | Dark Mode & Theme System | Theme switcher, dark palette, consistent tokens | 0.5 week |
| **24** | API Integration Foundation | Auth API, base client, error handling, env config | 1 week |
| **25** | Pageant & Content APIs | Replace pageant/content seed with API calls | 1 week |
| **26** | Finance & Wallet APIs | Replace finance seed with API calls | 1 week |
| **27** | Real-time & WebSockets | Live pageant updates, notifications | 1 week |
| **28** | Advanced Analytics & Reporting | Dashboards, exports, charts, filters | 1 week |
| **29** | Notifications & Communications | In-app, email, SMS placeholders, preferences | 0.5 week |
| **30** | Scale, i18n & Final QA | Performance, i18n setup, cross-browser, docs | 1 week |

---

## Phase 16: Sponsored Ads & Monetization

**Goal:** Complete ad platform UI for brands and tenants.

### Pages
| Route | Purpose |
|-------|---------|
| `/admin/ads/create` | Ad campaign wizard (objective, targeting, creative, budget) |
| `/admin/ads/[id]/creatives` | Creative library, multi-format, A/B setup |
| `/admin/ads/[id]/targeting` | Audience builder, geography, demographics |
| `/admin/ads/[id]/budget` | Budget allocation, spending pace, caps |
| `/admin/ads/approvals` | Pending ads queue, approve/reject |
| `/admin/ads/[id]/performance` | KPIs, timeline, placement breakdown |

### Components
- `CampaignWizardStepper`, `TargetingMap`, `AudienceBuilder`
- `CreativePreview`, `BudgetAllocator`, `ApprovalChecklist`, `PerformanceChart`

### Seed Data
- `adCampaigns.json`, `adCreatives.json`, `adTargeting.json`, `adPerformance.json`

### Dependencies
- TenantAdminShell (Content section) — add Ads section

---

## Phase 17: Loyalty, Rewards & Discounts

**Goal:** Gamification and retention system UI.

### Pages
| Route | Purpose |
|-------|---------|
| `/rewards` | Rewards dashboard (tiers, credits, milestones) |
| `/rewards/earn` | Activity checklist, referral program |
| `/rewards/redeem` | Redemption catalog, credits checkout |
| `/rewards/tiers` | Tier comparison, benefits, progress |
| `/admin/finance/discounts` | Discount codes list, create, usage |
| `/rewards/activity` | Activity timeline, credit transactions |

### Components
- `TierBadge`, `ProgressRing`, `RewardCard`, `RedemptionCatalog`
- `DiscountCodeGenerator`, `ActivityTimeline`, `MilestoneCard`

### Seed Data
- `rewards.json`, `loyaltyTiers.json`, `discountCodes.json`, `activityLogs.json`

### Dependencies
- TenantAdminShell — add Rewards/Finance discounts
- New `RewardsShell` or integrate into TenantShell

---

## Phase 18: Academy Deep Dive

**Goal:** Full learning management system UI.

### Pages
| Route | Purpose |
|-------|---------|
| `/academy/courses` | Course catalog (filter, search, enrollment) |
| `/academy/courses/[id]` | Course detail, curriculum, trainer, reviews |
| `/academy/courses/[id]/learn` | Video player, lessons, progress, notes |
| `/academy/courses/[id]/assessment` | Quiz, video submission, timer |
| `/academy/sessions` | Live sessions calendar, join, recordings |
| `/academy/my-learning` | Enrolled courses, progress, certificates |
| `/academy/trainer` | Trainer dashboard (courses, students, grading) |
| `/academy/certificates` | Certificate gallery, viewer, share |

### Components
- `CourseCard`, `VideoPlayer`, `LessonSidebar`, `ProgressBar`
- `QuizInterface`, `CertificateTemplate`, `SessionCard`, `TrainerAnalytics`

### Seed Data
- Expand `courses.json`, add `lessons.json`, `assessments.json`, `certificates.json`, `sessions.json`

### Dependencies
- AcademyShell (Phase 10) — extend with new routes

---

## Phase 19: Collaboration Engine

**Goal:** Multi-tenant collaboration workflows.

### Pages
| Route | Purpose |
|-------|---------|
| `/admin/collaborations` | Collaboration hub, active, pending, create |
| `/admin/collaborations/create` | Wizard: type, partner, scope, permissions, revenue split |
| `/admin/collaborations/[id]` | Overview, resources, activity, contract |
| `/admin/collaborations/templates` | Contract template library |
| `/admin/collaborations/[id]/splits` | Revenue split config, settlements |

### Components
- `CollaborationCard`, `PartnerSelector`, `ScopeBuilder`
- `SplitConfigurator`, `ContractViewer`

### Seed Data
- `collaborations.json`, `contracts.json`, `revenueSplits.json`

### Dependencies
- TenantAdminShell — add Collaborations section

---

## Phase 20: Bookings & Jobs

**Goal:** Job marketplace and booking management.

### Pages
| Route | Purpose |
|-------|---------|
| `/admin/bookings` | Job listings, talent browser, calendar |
| `/admin/bookings/create` | Booking creation flow |
| `/admin/bookings/[id]` | Booking detail, deliverables, milestones |
| `/modelling/bookings` | Modelling agency bookings (extend) |

### Components
- `BookingCard`, `NegotiationPanel`, `JobListingCard`
- `CalendarView`, `DeliverablesChecklist`

### Seed Data
- Expand `bookings.json`, add `jobListings.json`

### Dependencies
- TenantAdminShell, ModellingShell

---

## Phase 21: Mobile Responsive & Polish

**Goal:** Ensure all pages work well on mobile.

### Tasks
- Audit all pages for responsive breakpoints
- Fix layout issues (overflow, stacking, spacing)
- Optimize touch targets (min 44px)
- Mobile navigation (hamburger, bottom nav where needed)
- Responsive charts (Recharts responsive)
- Swipe gestures for carousels (optional)

### Deliverables
- Responsive checklist per module
- Mobile viewport testing notes

---

## Phase 22: UI Polish & Accessibility

**Goal:** Loading, error, empty states; a11y basics.

### Components
- `LoadingSpinner` (sizes), `ErrorBoundary`, `EmptyState`
- `SkeletonLoader`, `GuidedTour` (optional)

### Tasks
- Add loading states to all async actions
- Add error states with retry
- Add empty states with illustrations/CTAs
- ARIA labels, focus indicators, keyboard nav
- Color contrast checks (WCAG AA)

---

## Phase 23: Dark Mode & Theme System

**Goal:** Consistent theming, dark mode support.

### Tasks
- Define CSS variables for light/dark
- Theme switcher in header/settings
- Apply dark palette across shells
- Persist theme preference (localStorage)

### Components
- `ThemeSwitcher`

---

## Phase 24: API Integration Foundation

**Goal:** Prepare for backend; replace auth with real API.

### Tasks
- Create `apiClient` (fetch wrapper, base URL, headers)
- Auth: login, signup, forgot-password API calls
- Store tokens, refresh logic (mock or real)
- Error handling (401, 403, 500)
- Environment config (NEXT_PUBLIC_API_URL)

### Note
- Keep seed fallback for development without backend

---

## Phase 25: Pageant & Content APIs

**Goal:** Replace pageant and content seed with API calls.

### Tasks
- Pageant CRUD, templates, builder, live, analytics APIs
- Content posts, upload, approval, analytics APIs
- React Query or SWR for caching
- Optimistic updates where appropriate

---

## Phase 26: Finance & Wallet APIs

**Goal:** Replace finance seed with API calls.

### Tasks
- Wallet, transactions, checkout, payouts, invoices APIs
- Payment gateway integration (Stripe/Razorpay placeholders)

---

## Phase 27: Real-time & WebSockets

**Goal:** Live updates for pageants and notifications.

### Tasks
- WebSocket client setup
- Live pageant participant flow updates
- In-app notification toasts
- Reconnection logic

---

## Phase 28: Advanced Analytics & Reporting

**Goal:** Rich dashboards, exports, filters.

### Tasks
- Super Admin analytics (revenue, tenants, pageants)
- Tenant analytics (content, ads, academy)
- Export to CSV/PDF
- Date range filters, comparison views

---

## Phase 29: Notifications & Communications

**Goal:** Notification preferences and communication UI.

### Tasks
- Notification preferences page
- Email/SMS toggle placeholders
- In-app notification center (bell icon)
- Notification list with mark-as-read

---

## Phase 30: Scale, i18n & Final QA

**Goal:** Production readiness.

### Tasks
- Performance: image optimization, lazy loading, code splitting
- i18n: next-intl or similar, locale switcher
- Cross-browser testing
- Documentation: component docs, setup guide
- Demo flows, guided tours

---

## Execution Order & Dependencies

```
Phase 16 (Ads)     ──┐
Phase 17 (Rewards) ──┼──► Phase 21 (Mobile) ──► Phase 22 (A11y) ──► Phase 23 (Dark)
Phase 18 (Academy) ─┤
Phase 19 (Collab)  ─┤
Phase 20 (Bookings)┘

Phase 24 (API Foundation) ──► Phase 25 (Pageant/Content APIs) ──► Phase 26 (Finance APIs)
                                    │
                                    └──► Phase 27 (Real-time)

Phase 28 (Analytics) ──► Phase 29 (Notifications) ──► Phase 30 (Scale & QA)
```

---

## Summary Table

| Phase | Module | Pages | Key Components | Seed Files |
|-------|--------|-------|----------------|------------|
| 16 | Sponsored Ads | 6 | 7 | 4 |
| 17 | Loyalty & Rewards | 6 | 7 | 4 |
| 18 | Academy Deep | 8 | 8 | 5 |
| 19 | Collaborations | 5 | 5 | 3 |
| 20 | Bookings | 4 | 5 | 2 |
| 21 | Mobile | 0 | — | 0 |
| 22 | UI Polish | 0 | 5 | 0 |
| 23 | Dark Mode | 0 | 1 | 0 |
| 24–30 | Integration & Scale | varies | varies | 0 |

---

## Notes

- **Phases 16–20:** Pure UI, seed data (aligns with AGENT_HANDOFF: UI only)
- **Phases 21–23:** Polish and UX improvements
- **Phases 24–27:** Backend integration (requires backend team)
- **Phases 28–30:** Advanced features and production readiness

When starting a phase, create a todo list, implement pages/components, add seed data, and update shells/navigation as needed.
