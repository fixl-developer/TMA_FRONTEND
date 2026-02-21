# Admin Pages Redesign - Complete Implementation Guide

## ✅ Completed Pages (5/130)

1. ✅ `/admin` - Dashboard
2. ✅ `/admin/users` - Users & Roles  
3. ✅ `/admin/roles` - Roles & Capabilities
4. ✅ `/admin/organization` - Organization
5. ✅ `/admin/settings` - Tenant Settings

## 🎨 Design System Components

All components are in: `frontend/shared/components/layout/AdminPageWrapper.tsx`

### Available Components:

1. **AdminPageWrapper** - Main wrapper with purple gradient background
2. **AdminCard** - Glassmorphism card with backdrop blur
3. **AdminSectionHeader** - Page title with subtitle and action button
4. **AdminStatCard** - Metric card with icon, value, trend
5. **AdminTable** - Table with dark theme
6. **AdminTableRow** - Table row with hover effect
7. **AdminButton** - Button with variants (primary, secondary, ghost, danger)
8. **AdminBadge** - Status badge (success, warning, danger, info, default)
9. **AdminEmptyState** - Empty state with icon and action

### Color Palette:

```typescript
Background: "bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c]"
Primary Accent: "#d4ff00" (neon yellow)
Card Background: "bg-white/5 border-white/10 backdrop-blur-md"
Text: "text-white" (primary), "text-white/70" (secondary), "text-white/50" (muted)
```

## 📋 Page Templates

### Template 1: List Page (Users, Teams, Talent, etc.)

```tsx
"use client"

import { useEffect, useState } from "react"
import { Icon1, Icon2 } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

export default function PageName() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch data
    fetchData().then(setData).finally(() => setLoading(false))
  }, [])

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Page Title"
        subtitle="Page description"
        action={<AdminButton>Action</AdminButton>}
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Stat 1" value={data.length} icon={Icon1} color="purple" />
        <AdminStatCard title="Stat 2" value="123" icon={Icon2} color="blue" />
      </div>

      {/* Table */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Data Table</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}
          </div>
        ) : data.length === 0 ? (
          <AdminEmptyState icon={Icon1} title="No data" description="Add items to get started" />
        ) : (
          <AdminTable headers={["Column 1", "Column 2", "Actions"]}>
            {data.map(item => (
              <AdminTableRow key={item.id}>
                <td className="px-6 py-4 text-white">{item.name}</td>
                <td className="px-6 py-4"><AdminBadge variant="success">{item.status}</AdminBadge></td>
                <td className="px-6 py-4"><AdminButton size="sm" variant="ghost">View</AdminButton></td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
```

### Template 2: Detail/Settings Page

```tsx
"use client"

import { Icon1, Icon2 } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
} from "@/shared/components/layout/AdminPageWrapper"

export default function SettingsPage() {
  return (
    <AdminPageWrapper>
      <AdminSectionHeader title="Settings" subtitle="Configure your settings" />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Status" value="Active" icon={Icon1} color="green" />
      </div>

      {/* Settings Sections */}
      <AdminCard className="mb-6">
        <h3 className="mb-6 text-lg font-bold text-white">Section Title</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Icon1 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Label</p>
              <p className="mt-1 text-white">Value</p>
            </div>
          </div>
        </div>
      </AdminCard>
    </AdminPageWrapper>
  )
}
```

### Template 3: Dashboard/Analytics Page

```tsx
"use client"

import { useEffect, useState } from "react"
import { Icon1, Icon2, Icon3, Icon4 } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
} from "@/shared/components/layout/AdminPageWrapper"
import { CreativeChartWithToggle } from "@/shared/components/charts/CreativeChartWithToggle"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats().then(setStats).finally(() => setLoading(false))
  }, [])

  return (
    <AdminPageWrapper>
      <AdminSectionHeader title="Dashboard" subtitle="Overview and analytics" />

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Metric 1" value="123" icon={Icon1} color="purple" trend="up" trendValue="+12%" />
        <AdminStatCard title="Metric 2" value="456" icon={Icon2} color="blue" trend="up" trendValue="+8%" />
        <AdminStatCard title="Metric 3" value="789" icon={Icon3} color="green" />
        <AdminStatCard title="Metric 4" value="321" icon={Icon4} color="yellow" />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h3 className="mb-4 text-lg font-bold text-white">Chart 1</h3>
          {!loading && stats?.chartData && (
            <CreativeChartWithToggle
              data={stats.chartData}
              dataKey="value"
              xAxisKey="label"
              variants={["bar", "line", "area"]}
              height={260}
              theme="dark"
            />
          )}
        </AdminCard>
      </div>
    </AdminPageWrapper>
  )
}
```

## 🔄 Batch Conversion Script

To convert remaining pages, follow this pattern:

### Step 1: Replace imports
```tsx
// OLD
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

// NEW
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  // ... other components
} from "@/shared/components/layout/AdminPageWrapper"
```

### Step 2: Replace wrapper
```tsx
// OLD
<AgenciesPage>
  <PageBanner title="..." subtitle="..." variant="admin" />
  <section className="mt-8">
    <Card>...</Card>
  </section>
</AgenciesPage>

// NEW
<AdminPageWrapper>
  <AdminSectionHeader title="..." subtitle="..." />
  <AdminCard>...</AdminCard>
</AdminPageWrapper>
```

### Step 3: Update components
- `<Card>` → `<AdminCard>`
- `<Button>` → `<AdminButton>`
- `<Badge>` → `<AdminBadge>`
- Add stats cards at top
- Update colors to white/purple theme

## 📊 Remaining Pages by Category

### High Priority (Next 20 pages)
1. `/admin/teams` - Teams
2. `/admin/talent` - Talent
3. `/admin/wallet` - Wallet
4. `/admin/security` - Security
5. `/admin/limits` - Limits
6. `/admin/risk` - Risk
7. `/admin/casting` - Castings
8. `/admin/crm` - CRM Dashboard
9. `/admin/crm/leads` - Leads
10. `/admin/crm/accounts` - Accounts
11. `/admin/finance/invoices` - Invoices
12. `/admin/finance/payments` - Payments
13. `/admin/content/pending` - Content Approvals
14. `/admin/content/upload` - Upload Content
15. `/admin/ads` - Ad Campaigns
16. `/admin/automation/campaigns` - Automation
17. `/admin/ops-health` - Ops Health
18. `/admin/reports` - Reports
19. `/admin/audit-log` - Audit Log
20. `/admin/compliance` - Compliance

### Medium Priority (Next 30 pages)
- Projects, Resources, Contracts, Sales, etc.

### Lower Priority (Remaining 80+ pages)
- Detail pages, sub-pages, specialized features

## 🚀 Quick Conversion Checklist

For each page:
- [ ] Replace imports with AdminPageWrapper components
- [ ] Change `<AgenciesPage>` to `<AdminPageWrapper>`
- [ ] Remove `<PageBanner>`, add `<AdminSectionHeader>`
- [ ] Add 4 stat cards at top (if applicable)
- [ ] Replace `<Card>` with `<AdminCard>`
- [ ] Update all colors to white/purple theme
- [ ] Replace buttons with `<AdminButton>`
- [ ] Replace badges with `<AdminBadge>`
- [ ] Test for errors

## 💡 Tips

1. **Reuse patterns**: Most list pages follow Template 1
2. **Stats are optional**: Not all pages need stat cards
3. **Keep functionality**: Only change UI, preserve all logic
4. **Test incrementally**: Check each page after conversion
5. **Use diagnostics**: Run `getDiagnostics` to catch errors

## 📝 Status Tracking

Update `ADMIN_PAGES_REDESIGN_PROGRESS.md` as you complete pages.

---

**Next Steps:**
1. Apply templates to high-priority pages
2. Test each batch
3. Continue with medium priority
4. Complete remaining pages
