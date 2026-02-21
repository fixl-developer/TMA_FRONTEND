# Quick Conversion Cheat Sheet

## 🎯 3-Step Quick Convert

### 1️⃣ Replace Wrapper (30 seconds)
```tsx
// OLD → NEW
<AgenciesPage>          →  <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
                              <div className="mx-auto max-w-[1600px]">

<PageBanner title="X"   →  <div className="mb-8">
  subtitle="Y"               <h1 className="text-4xl font-bold text-white">X</h1>
  variant="admin" />         <p className="mt-2 text-base text-white/60">Y</p>
                            </div>

</AgenciesPage>         →  </div></div>
```

### 2️⃣ Replace Cards (20 seconds)
```tsx
// OLD → NEW
<Card>                  →  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <CardHeader>
    <CardTitle>X</CardTitle>  →  <h3 className="mb-4 text-lg font-bold text-white">X</h3>
  </CardHeader>
  <CardContent>         →  {/* content directly */}
    {content}
  </CardContent>
</Card>                 →  </div>
```

### 3️⃣ Find & Replace Colors (10 seconds)
```
text-slate-800  → text-white
text-slate-500  → text-white/60
text-slate-400  → text-white/50
bg-white        → bg-white/5
border-slate-   → border-white/
bg-amber-100    → bg-amber-500/10
text-amber-600  → text-amber-400
```

## 🎨 Copy-Paste Components

### Stat Card with Gradient Blob
```tsx
<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
  <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
  <div className="relative">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">LABEL</p>
        <p className="mt-1 text-sm text-white/60">Subtitle</p>
      </div>
      <div className="rounded-lg bg-purple-500/10 p-2">
        <Icon className="h-5 w-5 text-purple-400" />
      </div>
    </div>
    <p className="text-3xl font-bold text-white">VALUE</p>
  </div>
</div>
```

### Simple Card
```tsx
<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <h3 className="mb-4 text-lg font-bold text-white">Title</h3>
  {/* content */}
</div>
```

### List Item
```tsx
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

### Primary Button
```tsx
<Button className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">
  Action
</Button>
```

### Secondary Button
```tsx
<Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
  Action
</Button>
```

### Back Button
```tsx
<Link href="/admin">
  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
    ← Back
  </Button>
</Link>
```

### Status Badge
```tsx
{/* Success */}
<span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
  Active
</span>

{/* Warning */}
<span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">
  Pending
</span>

{/* Error */}
<span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-medium text-rose-300">
  Failed
</span>
```

### Input Field
```tsx
<input
  className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
  placeholder="Enter text"
/>
```

### Select Dropdown
```tsx
<select className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white backdrop-blur-md">
  <option value="1" className="bg-[#1a0b2e] text-white">Option 1</option>
  <option value="2" className="bg-[#1a0b2e] text-white">Option 2</option>
</select>
```

### Loading State
```tsx
{loading ? (
  <p className="py-8 text-center text-white/60">Loading…</p>
) : (
  // content
)}
```

### Empty State
```tsx
<div className="py-12 text-center">
  <Icon className="mx-auto mb-3 h-12 w-12 text-white/30" />
  <p className="text-white/60">No items found</p>
  <p className="mt-1 text-sm text-white/40">Description here</p>
</div>
```

## 🎨 Color Palette Quick Reference

```tsx
// Backgrounds
bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c]  // Main
bg-white/5                                                      // Card
bg-white/10                                                     // Hover

// Borders
border-white/10                                                 // Default
border-white/20                                                 // Hover

// Text
text-white                                                      // Heading
text-white/60                                                   // Subtitle
text-white/50                                                   // Muted

// Accents
bg-[#d4ff00]                                                    // Primary
text-emerald-400                                                // Success
text-rose-400                                                   // Error
text-amber-400                                                  // Warning
text-purple-400                                                 // Purple
text-blue-400                                                   // Blue
```

## ⚡ VS Code Shortcuts

1. Open file
2. `Ctrl+H` (Find & Replace)
3. Paste old pattern → new pattern
4. `Ctrl+Alt+Enter` (Replace all)
5. Save & test

## 📋 Priority Order

1. **High Traffic** (do first):
   - Dashboard pages
   - List pages
   - Analytics pages

2. **Medium Priority**:
   - Detail pages
   - Form pages
   - Settings pages

3. **Low Priority** (do last):
   - Rarely used pages
   - Admin-only pages

## ⏱️ Time Estimates

- Simple list page: 5 min
- Page with forms: 10 min
- Complex dashboard: 15 min
- Page with charts: 12 min

## ✅ Quick Test

After converting:
1. Refresh page
2. Check text readable? ✓
3. Check buttons work? ✓
4. Check hover effects? ✓
5. Done! Move to next page

## 🚀 Batch Processing

Convert 5-10 similar pages at once:
1. Open all files
2. Do find/replace across all
3. Fix unique elements per file
4. Test all together

---

**Pro Tip**: Start with the easiest pages to build momentum! 💪
