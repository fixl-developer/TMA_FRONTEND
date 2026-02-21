# TalentOS — Enterprise Engagement & Launch Plan

> **Scope:** All dashboards and pages (excluding Super Admin)  
> **Goal:** Make the platform more engaging, "happening," and enterprise-ready for launch  
> **Created:** February 2026

---

## 1. Current State Analysis

### 1.1 Areas & Dashboards (Non-SuperAdmin)

| Area | Route | Current Experience |
|------|-------|-------------------|
| **Admin** | `/admin` | Hero carousel, 4 key metrics, 2 charts (bookings, job status), admin metrics, 3 featured cards, 20+ quick-action buttons |
| **Modelling** | `/modelling` | Hero carousel, 4 metrics, featured castings grid, revenue chart, upcoming bookings, talent highlights |
| **Talent Mgmt** | `/talent-mgmt` | Hero carousel, 4 metrics (talent, contracts, wallet, transactions), 3 featured cards |
| **Influencer** | `/influencer` | Hero carousel, 4 metrics (campaigns, budget, deliverables, media kits), 3 featured cards |
| **Academy** | `/academy/courses` | Page banner, search/filter, course grid (no dedicated dashboard) |
| **Pageant** | `/pageant/live` | Simple list of live pageants |
| **Portal** | `/portal` | 3 cards (approvals, threads, documents), redacted-view notice |
| **Mobile** | `/mobile` | 4 icon cards (bookings, content, wallet, admin), minimal copy |

### 1.2 List Pages (Sample)

- **Admin:** Projects, CRM, Vendors, Resources, Logistics, Comms, Ops Health, Ads, Automation, Franchise, Reports, Integrations, Support, Finance (invoices, escrows, payouts), etc.
- **Pattern:** PageBanner → metrics cards → list/table. Many use `Card` + `EmptyState`. Quick actions often flat buttons.

### 1.3 Gaps & Pain Points

| Issue | Impact |
|-------|--------|
| **Static feel** | No real-time cues, live activity, or "pulse" |
| **Information overload** | Admin dashboard has 20+ quick-action buttons; no prioritization |
| **Weak personalization** | Same layout for all users; no role-based "what matters to you" |
| **Thin Portal & Mobile** | Client portal and mobile feel like stubs |
| **No celebration moments** | No milestones, achievements, or gamification |
| **Charts are basic** | Bar/pie only; no sparklines, trends, or comparisons |
| **Empty states are generic** | "No X yet" with no guidance or next steps |
| **No activity feed** | No "what's happening" stream across the platform |
| **Banner fatigue** | Same PageBanner pattern everywhere; no variety |

---

## 2. Enterprise Engagement Pillars

### Pillar A: **Live Pulse & Activity**

**Idea:** Make the platform feel alive.

| Initiative | Description | Priority |
|------------|-------------|----------|
| **Global activity feed** | "Recent activity" stream: "Priya signed contract", "New casting opened", "Invoice paid". Show last 5–10 items. | High |
| **Live indicators** | Green dot / "Live" badge on Ops Health, pageant live, casting deadlines. | Medium |
| **Real-time counts** | Pending approvals, open castings, unread threads – update without full refresh (or optimistic UI). | High |
| **Notification center** | Bell icon with dropdown: pending approvals, mentions, deadlines. | High |

### Pillar B: **Smart Prioritization & Personalization**

**Idea:** Show what matters to *this* user, not everything.

| Initiative | Description | Priority |
|------------|-------------|----------|
| **Role-based dashboard** | Admin sees ops health + revenue; Talent Mgmt sees upcoming contracts; Influencer sees deliverable deadlines. | High |
| **"Your focus" widget** | Top 3–5 items needing action: "2 contracts to sign", "1 approval pending", "3 quotes expiring". | High |
| **Collapsible quick actions** | Group by category (Talent, Finance, Ops) with "Show more". Reduce cognitive load. | Medium |
| **Recently visited** | Quick links to last 5 pages. | Low |

### Pillar C: **Celebration & Progress**

**Idea:** Acknowledge wins and progress.

| Initiative | Description | Priority |
|------------|-------------|----------|
| **Milestone toasts** | "10th contract signed!", "First pageant live!" – subtle celebration. | Medium |
| **Progress rings** | e.g. "Pipeline: 60% to target", "WES: 78 → goal 85". | Medium |
| **Achievement badges** | "First casting closed", "100 talents onboarded" – optional gamification. | Low |
| **Revenue / target** | "₹4.2L of ₹5L monthly target" with progress bar. | High |

### Pillar D: **Richer Visuals & Micro-Interactions**

**Idea:** Polish that feels premium.

| Initiative | Description | Priority |
|------------|-------------|----------|
| **Sparklines** | Tiny trend lines in metric cards (e.g. last 7 days). | High |
| **Hover previews** | Hover on casting → quick preview; hover on talent → avatar + status. | Medium |
| **Skeleton loaders** | Replace "Loading…" with skeleton cards/charts. | High |
| **Animated counters** | Numbers count up on load. | Low |
| **Chart variety** | Area charts for revenue, funnel for pipeline, gauge for WES. | High |
| **Empty state CTAs** | "Create your first casting" with illustration + step-by-step. | High |

### Pillar E: **Portal & Mobile Upgrade**

**Idea:** Client and mobile experiences that match enterprise expectations.

| Initiative | Description | Priority |
|------------|-------------|----------|
| **Portal dashboard** | Welcome + pending approvals count + recent threads + quick links. | High |
| **Mobile dashboard** | Greeting by name, "Next booking", "Pending approval", wallet balance. | High |
| **Mobile notifications** | Push-ready (PWA) for approvals and messages. | Medium |
| **Portal branding** | Client sees tenant logo, colors; feels white-label. | High |

### Pillar F: **Onboarding & Guidance**

**Idea:** Help new users get value fast.

| Initiative | Description | Priority |
|------------|-------------|----------|
| **First-time checklist** | "Add talent", "Create casting", "Send first quote" – progress checklist. | High |
| **Contextual tips** | Tooltips or small banners: "Tip: Use rate cards for faster quotes." | Medium |
| **Academy dashboard** | Dedicated dashboard: "Continue learning", "Your progress", "Recommended courses". | High |
| **Pageant hub** | Central pageant dashboard: live events, upcoming, past results. | High |

---

## 3. Page-by-Page Recommendations

### 3.1 Admin Dashboard (`/admin`)

| Change | Effort | Impact |
|--------|--------|--------|
| Add "Your focus" widget (top 5 actions) | Medium | High |
| Add activity feed (last 10 events) | Medium | High |
| Replace flat quick actions with grouped/collapsible | Medium | Medium |
| Add sparklines to metric cards | Low | High |
| Add WES / Ops Health summary card | Low | High |
| Skeleton loaders for metrics | Low | Medium |

### 3.2 Modelling Dashboard (`/modelling`)

| Change | Effort | Impact |
|--------|--------|--------|
| Add "Needs your attention" (shortlist decisions, contract sign-offs) | Medium | High |
| Revenue vs target progress bar | Low | High |
| Upcoming bookings with countdown | Low | Medium |
| Talent spotlight with recent bookings | Low | Medium |

### 3.3 Talent Mgmt Dashboard (`/talent-mgmt`)

| Change | Effort | Impact |
|--------|--------|--------|
| Add "Contracts awaiting signature" | Low | High |
| Ledger balance + recent transactions | Low | High |
| Calendar preview (next 7 days) | Medium | Medium |
| Activity feed (contracts signed, talent added) | Medium | High |

### 3.4 Influencer Dashboard (`/influencer`)

| Change | Effort | Impact |
|--------|--------|--------|
| Deliverable deadlines widget | Low | High |
| Campaign performance sparklines | Medium | High |
| "Pending brand approval" count | Low | High |
| Media kit usage stats | Low | Medium |

### 3.5 Academy

| Change | Effort | Impact |
|--------|--------|--------|
| **Create `/academy` dashboard** | Medium | High |
| "Continue learning" (last course + progress) | Medium | High |
| "Your progress" (certificates, completions) | Medium | High |
| Recommended courses | Low | Medium |

### 3.6 Pageant

| Change | Effort | Impact |
|--------|--------|--------|
| **Create `/pageant` hub dashboard** | Medium | High |
| Live events with "LIVE" badge | Low | High |
| Upcoming pageants countdown | Low | Medium |
| Recent results | Low | Medium |

### 3.7 Portal (`/portal`)

| Change | Effort | Impact |
|--------|--------|--------|
| Welcome message + tenant branding | Low | High |
| Pending approvals count + list | Low | High |
| Recent threads preview | Low | High |
| Documents/contracts quick access | Low | Medium |
| Remove or soften "redacted view" notice | Low | Medium |

### 3.8 Mobile (`/mobile`)

| Change | Effort | Impact |
|--------|--------|--------|
| Personalized greeting | Low | High |
| "Next booking" or "Pending approval" | Medium | High |
| Wallet balance prominent | Low | High |
| Swipeable cards for quick actions | Medium | Medium |
| Pull-to-refresh | Low | Medium |

### 3.9 List Pages (Projects, CRM, Vendors, etc.)

| Change | Effort | Impact |
|--------|--------|--------|
| Consistent search + filter + sort | Medium | High |
| Bulk actions (select multiple, export) | Medium | Medium |
| Richer empty states with illustrations | Low | High |
| Inline quick actions (e.g. approve from list) | Medium | High |
| Sticky table headers on scroll | Low | Medium |

---

## 4. Implementation Phases (Suggested)

### Phase 1: Quick Wins (1–2 weeks)

- Skeleton loaders across dashboards
- Sparklines in admin/metric cards
- "Your focus" / "Needs attention" widget on admin + modelling
- Portal: welcome + pending approvals count
- Mobile: greeting + wallet balance
- Empty state illustrations + clear CTAs

### Phase 2: Activity & Personalization (2–3 weeks)

- Global activity feed component
- Role-based dashboard variants
- Notification center (bell dropdown)
- Recently visited links
- Academy dashboard (`/academy`)
- Pageant hub (`/pageant`)

### Phase 3: Polish & Delight (2 weeks)

- Progress rings / target bars
- Milestone toasts
- Chart upgrades (area, funnel, gauge)
- Hover previews
- Animated counters
- Grouped/collapsible quick actions

### Phase 4: Mobile & Portal Deep Dive (2 weeks)

- Mobile: "Next booking", "Pending approval", swipeable cards
- Portal: full dashboard, branding, threads preview
- PWA push-ready notifications
- Mobile pull-to-refresh

---

## 5. Design Principles for Enterprise

1. **Clarity over clutter** — Fewer, clearer actions; progressive disclosure.
2. **Data tells a story** — Charts and metrics should answer "So what?"
3. **Responsive to feedback** — Loading states, errors, empty states all feel intentional.
4. **Brand consistency** — Tenant logo, colors, and tone throughout.
5. **Accessibility** — WCAG 2.1 AA; keyboard nav; screen reader support.
6. **Performance** — Fast initial load; lazy-load below-fold content.

---

## 6. Discussion Points

1. **Priority order:** Which pillar (A–F) should we tackle first?
2. **Activity feed:** Real-time (WebSocket) vs. polling vs. on page load?
3. **Gamification:** How far do we go with badges/milestones?
4. **Mobile:** PWA-only or also consider React Native later?
5. **Portal:** Single client view or role-based (Brand vs. Talent vs. Judge)?
6. **Budget/target:** Do we have revenue targets in seed data to drive progress bars?

---

## 7. Summary

| Priority | Initiative | Area | Effort |
|----------|------------|------|--------|
| P0 | "Your focus" / needs-attention widget | Admin, Modelling | Medium |
| P0 | Activity feed | All dashboards | Medium |
| P0 | Skeleton loaders | All | Low |
| P0 | Sparklines in metric cards | Admin, Modelling | Low |
| P0 | Portal dashboard upgrade | Portal | Medium |
| P0 | Mobile dashboard upgrade | Mobile | Medium |
| P1 | Academy dashboard | Academy | Medium |
| P1 | Pageant hub | Pageant | Medium |
| P1 | Notification center | All | Medium |
| P1 | Richer empty states | All list pages | Low |
| P2 | Progress/target bars | Admin, Modelling | Low |
| P2 | Chart upgrades | Analytics, Ops Health | Medium |
| P2 | Grouped quick actions | Admin | Medium |

---

*This plan is for discussion. Adjust priorities and scope based on launch timeline and team capacity.*
