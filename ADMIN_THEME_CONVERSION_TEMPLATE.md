# Admin Theme Conversion Template & Guide

## 🎯 Quick Conversion Pattern

### Step 1: Update Imports
```tsx
// ❌ REMOVE these imports:
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { PageLoading } from "@/shared/components/ui/page-loading"
import { EmptyState } from "@/shared/components/ui/empty-state"

// ✅ KEEP these imports:
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"
// ... all other imports stay
```

### Step 2: Replace Page Wrapper
```tsx
// ❌ OLD:
return (
  <AgenciesPage>
    <PageBanner title="Page Title" subtitle="Subtitle" variant="admin" backgroundImage="..." />
    {/* content */}
  </AgenciesPage>
)

// ✅ NEW:
return (
  <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-[1600px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Page Title</h1>
        <p className="mt-2 text-base text-white/60">Subtitle</p>
      </div>
      {/* content */}
    </div>
  </div>
)
```

### Step 3: Convert Cards
```tsx
// ❌ OLD:
<Card className="border-[#E7E5E4]">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>

// ✅ NEW:
<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <h3 className="mb-4 text-lg font-bold text-white">Title</h3>
  {/* content */}
</div>
```

### Step 4: Convert Stat Cards
```tsx
// ❌ OLD:
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Total</CardTitle>
    <Icon className="h-5 w-5 text-amber-600" />
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold text-slate-800">123</p>
  </CardContent>
</Card>

// ✅ NEW:
<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
  <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
  <div className="relative">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">Label</p>
        <p className="mt-1 text-sm text-white/60">Subtitle</p>
      </div>
      <div className="rounded-lg bg-purple-500/10 p-2">
        <Icon className="h-5 w-5 text-purple-400" />
      </div>
    </div>
    <p className="text-3xl font-bold text-white">123</p>
  </div>
</div>
```

### Step 5: Convert Buttons
```tsx
// ❌ OLD:
<Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">
  Action
</Button>

<Button variant="outline" className="border-slate-200 text-slate-800">
  Secondary
</Button>

<Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
  ← Back
</Button>

// ✅ NEW:
<Button className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">
  Action
</Button>

<Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
  Secondary
</Button>

<Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
  ← Back
</Button>
```

### Step 6: Convert List Items
```tsx
// ❌ OLD:
<div className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
      <Icon className="h-5 w-5 text-amber-600" />
    </div>
    <div>
      <p className="font-medium text-slate-800">Title</p>
      <p className="text-xs text-slate-500">Subtitle</p>
    </div>
  </div>
  <span className="text-sm font-semibold text-slate-800">Value</span>
</div>

// ✅ NEW:
<div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
      <Icon className="h-5 w-5 text-amber-400" />
    </div>
    <div>
      <p className="font-medium text-white">Title</p>
      <p className="text-xs text-white/50">Subtitle</p>
    </div>
  </div>
  <span className="text-sm font-semibold text-white">Value</span>
</div>
```

### Step 7: Convert Status Badges
```tsx
// ❌ OLD:
<span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
  Active
</span>

// ✅ NEW:
<span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
  Active
</span>
```

### Step 8: Convert Form Inputs
```tsx
// ❌ OLD:
<input
  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
  placeholder="Enter text"
/>

<select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800">
  <option value="ALL">All</option>
</select>

<textarea className="min-h-[72px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700" />

// ✅ NEW:
<input
  className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
  placeholder="Enter text"
/>

<select className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white backdrop-blur-md">
  <option value="ALL" className="bg-[#1a0b2e] text-white">All</option>
</select>

<textarea className="min-h-[72px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md" />
```

### Step 9: Convert Loading & Empty States
```tsx
// ❌ OLD:
{loading ? (
  <PageLoading message="Loading…" />
) : items.length === 0 ? (
  <EmptyState
    icon={<Icon className="h-6 w-6" />}
    title="No items"
    description="Description here"
  />
) : (
  // content
)}

// ✅ NEW:
{loading ? (
  <p className="py-8 text-center text-white/60">Loading…</p>
) : items.length === 0 ? (
  <div className="py-12 text-center">
    <Icon className="mx-auto mb-3 h-12 w-12 text-white/30" />
    <p className="text-white/60">No items</p>
    <p className="mt-1 text-sm text-white/40">Description here</p>
  </div>
) : (
  // content
)}
```

### Step 10: Convert Charts
```tsx
// ❌ OLD:
<CreativeChartWithToggle
  data={data}
  dataKey="count"
  xAxisKey="month"
  variants={["bar", "line"]}
  height={260}
/>

// ✅ NEW:
<CreativeChartWithToggle
  data={data}
  dataKey="count"
  xAxisKey="month"
  variants={["bar", "line"]}
  height={260}
  theme="dark"  // ← ADD THIS
/>
```

## 🎨 Color Reference

### Background Colors:
```tsx
// Main gradient
bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c]

// Card backgrounds
bg-white/5          // Base card
bg-white/10         // Hover state
bg-white/20         // Active/selected state
```

### Border Colors:
```tsx
border-white/10     // Default border
border-white/20     // Hover border
border-white/30     // Active border
```

### Text Colors:
```tsx
text-white          // Primary headings (100%)
text-white/80       // Secondary text (80%)
text-white/60       // Subtitles (60%)
text-white/50       // Muted text (50%)
text-white/40       // Very muted (40%)
text-white/30       // Disabled (30%)
```

### Accent Colors:
```tsx
// Primary accent (Yellow/Lime)
bg-[#d4ff00]        // Background
text-[#d4ff00]      // Text
hover:bg-[#b8e600]  // Hover

// Success (Emerald)
bg-emerald-500/10   // Background
text-emerald-400    // Text
text-emerald-300    // On dark

// Error (Rose)
bg-rose-500/10      // Background
text-rose-400       // Text
text-rose-300       // On dark

// Warning (Amber)
bg-amber-500/10     // Background
text-amber-400      // Text
text-amber-300      // On dark

// Info (Blue)
bg-blue-500/10      // Background
text-blue-400       // Text
text-blue-300       // On dark

// Purple
bg-purple-500/10    // Background
text-purple-400     // Text

// Pink
bg-pink-500/10      // Background
text-pink-400       // Text
```

### Gradient Blobs (Decorative):
```tsx
// Purple-Pink
<div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />

// Yellow-Orange
<div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />

// Blue-Cyan
<div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />

// Emerald-Green
<div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
```

## 📋 Complete Example

### Before (Light Theme):
```tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getData } from "@/shared/services/dataService"
import { Icon } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function ExamplePage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getData().then(setData).finally(() => setLoading(false))
  }, [])

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
            ← Back
          </Button>
        </Link>
        <PageBanner 
          title="Example Page" 
          subtitle="Description here" 
          variant="admin" 
          backgroundImage="https://images.unsplash.com/photo-xxx"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Data List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : (
            <div className="space-y-3">
              {data.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                      <Icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-200 text-slate-800">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
```

### After (Dark Theme):
```tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getData } from "@/shared/services/dataService"
import { Icon } from "lucide-react"

export default function ExamplePage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getData().then(setData).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              ← Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Example Page</h1>
            <p className="mt-2 text-base text-white/60">Description here</p>
          </div>
        </div>
        
        {/* Content Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-bold text-white">Data List</h3>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : (
            <div className="space-y-3">
              {data.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <Icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-white/50">{item.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

## ⚡ Quick Find & Replace

Use these regex patterns in your editor:

1. **Remove PageBanner import:**
   - Find: `import { PageBanner } from "@/shared/components/ui/PageBanner"\n`
   - Replace: `` (empty)

2. **Remove AgenciesPage import:**
   - Find: `import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"\n`
   - Replace: `` (empty)

3. **Replace text colors:**
   - Find: `text-slate-800`
   - Replace: `text-white`
   
   - Find: `text-slate-500`
   - Replace: `text-white/60`
   
   - Find: `text-slate-400`
   - Replace: `text-white/50`

4. **Replace background colors:**
   - Find: `bg-white`
   - Replace: `bg-white/5`
   
   - Find: `border-slate-200`
   - Replace: `border-white/20`

## 🚨 Common Pitfalls

1. **Don't forget backdrop-blur-md** on cards
2. **Add theme="dark"** to all charts
3. **Update select option backgrounds** to `bg-[#1a0b2e]`
4. **Replace all hardcoded light colors** (amber-100 → amber-500/10)
5. **Update hover states** to use white/opacity
6. **Check icon colors** (text-amber-600 → text-amber-400)
7. **Update badge backgrounds** (bg-emerald-100 → bg-emerald-500/20)

## ✅ Testing Checklist

After converting each page:
- [ ] Page loads without errors
- [ ] All text is readable
- [ ] Cards have glassmorphism effect
- [ ] Buttons work and have correct colors
- [ ] Hover states work properly
- [ ] Loading states display correctly
- [ ] Empty states display correctly
- [ ] Forms are usable
- [ ] Charts render with dark theme
- [ ] No white flashes or light backgrounds

## 📝 Notes

- Pages using `AdminPageWrapper` are already themed - skip those
- Focus on pages with `PageBanner` and `AgenciesPage`
- Keep the same structure, just update styling
- Maintain all functionality - only change appearance
- Test in browser after each conversion

Good luck! 🚀
