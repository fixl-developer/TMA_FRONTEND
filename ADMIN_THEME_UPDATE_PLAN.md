# Admin Theme Update Plan

## Status: Analytics Page Complete ✅

### Completed Pages:
1. ✅ `frontend/app/admin/page.tsx` - Main dashboard (Purple gradient glassmorphism)
2. ✅ `frontend/app/admin/dashboards/analytics/page.tsx` - Analytics dashboard

### Theme Pattern (Purple Gradient Glassmorphism):

```tsx
// Remove:
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

// Layout wrapper:
<div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
  <div className="mx-auto max-w-[1600px]">
    {/* Content */}
  </div>
</div>

// Header (replaces PageBanner):
<div className="mb-8">
  <h1 className="text-4xl font-bold text-white">Title</h1>
  <p className="mt-2 text-base text-white/60">Subtitle</p>
</div>

// Stat Cards:
<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
  <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
  <div className="relative">
    {/* Content */}
  </div>
</div>

// Chart Cards:
<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <div className="mb-4 flex items-center gap-2">
    <div className="rounded-lg bg-[#d4ff00]/10 p-2">
      <Icon className="h-5 w-5 text-[#d4ff00]" />
    </div>
    <h3 className="text-lg font-bold text-white">Title</h3>
  </div>
  {/* Chart with theme="dark" */}
</div>
```

### Remaining Admin Pages to Update:

#### High Priority (Dashboard/Analytics Pages):
- [ ] `frontend/app/admin/dashboards/operations/page.tsx`
- [ ] `frontend/app/admin/dashboards/finance/page.tsx`
- [ ] `frontend/app/admin/dashboards/talent/page.tsx`

#### Finance Module:
- [ ] `frontend/app/admin/finance/escrows/page.tsx`
- [ ] `frontend/app/admin/finance/payouts/page.tsx`
- [ ] `frontend/app/admin/finance/discounts/page.tsx`
- [ ] `frontend/app/admin/finance/invoices/page.tsx`

#### Wallet & Payments:
- [ ] `frontend/app/admin/wallet/transactions/page.tsx`
- [ ] `frontend/app/admin/payments/checkout/page.tsx`

#### Rewards:
- [ ] `frontend/app/admin/rewards/tiers/page.tsx`
- [ ] `frontend/app/admin/rewards/redeem/page.tsx`
- [ ] `frontend/app/admin/rewards/earn/page.tsx`
- [ ] `frontend/app/admin/rewards/activity/page.tsx`

#### Content:
- [ ] `frontend/app/admin/content/upload/page.tsx`
- [ ] `frontend/app/admin/content/analytics/page.tsx`
- [ ] `frontend/app/admin/content/pending/page.tsx`

#### Automation:
- [ ] `frontend/app/admin/automation/rules/page.tsx`
- [ ] `frontend/app/admin/automation/sla/page.tsx`
- [ ] `frontend/app/admin/automation/policy-packs/page.tsx`
- [ ] `frontend/app/admin/automation/logs/page.tsx`
- [ ] `frontend/app/admin/automation/campaigns/page.tsx`

#### Ads:
- [ ] `frontend/app/admin/ads/create/page.tsx`
- [ ] `frontend/app/admin/ads/attribution/page.tsx`
- [ ] `frontend/app/admin/ads/approvals/page.tsx`

#### Collaboration & Community:
- [ ] `frontend/app/admin/collaboration/page.tsx`
- [ ] `frontend/app/admin/collaboration/initiate/page.tsx`
- [ ] `frontend/app/admin/community/groups/page.tsx`

#### Franchise:
- [ ] `frontend/app/admin/franchise/page.tsx`
- [ ] `frontend/app/admin/franchise/[branchId]/page.tsx`

#### Integrations:
- [ ] `frontend/app/admin/integrations/page.tsx`

### Color Palette:

```tsx
// Background gradient
from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c]

// Text colors
text-white                    // Primary headings
text-white/60                 // Subtitles
text-white/50                 // Muted text

// Card backgrounds
bg-white/5                    // Base card
bg-white/10                   // Hover state
border-white/10               // Border
border-white/20               // Hover border

// Accent colors
#d4ff00                       // Yellow/lime (primary accent)
#10b981 / emerald-400         // Success/green
#ef4444 / rose-400            // Error/red
#a855f7 / purple-400          // Purple accent
#3b82f6 / blue-400            // Blue accent
#ec4899 / pink-400            // Pink accent

// Gradient blobs (decorative)
from-purple-400/20 to-pink-400/20
from-[#d4ff00]/20 to-[#b8e600]/20
from-blue-400/20 to-cyan-400/20
```

### Chart Theme:
All charts should use `theme="dark"` prop for proper visibility on dark background.

### Next Steps:
1. Update high-priority dashboard pages first
2. Then finance/wallet modules
3. Then remaining admin pages
4. Test all pages for visual consistency
5. Ensure all charts render properly with dark theme

### Estimated Time:
- ~5-10 minutes per page
- Total: ~40-50 pages
- Estimated: 4-6 hours total
