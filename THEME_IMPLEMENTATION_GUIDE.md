# Theme Implementation Guide for Admin Pages

## Quick Reference: Adding Theme Support

### Text Colors
```tsx
// Headings & Primary Text
className="text-white admin-light-theme:text-slate-900"

// Secondary Text (descriptions, labels)
className="text-white/70 admin-light-theme:text-slate-600"

// Muted Text (timestamps, metadata)
className="text-white/50 admin-light-theme:text-slate-500"

// Disabled/Placeholder Text
className="text-white/40 admin-light-theme:text-slate-400"
```

### Background Colors
```tsx
// Card/Container Backgrounds
className="bg-white/5 admin-light-theme:bg-white"

// Hover States
className="hover:bg-white/10 admin-light-theme:hover:bg-slate-50"

// Skeleton Loaders
className="bg-white/5 admin-light-theme:bg-slate-100"

// Progress Bars Background
className="bg-white/10 admin-light-theme:bg-slate-200"
```

### Border Colors
```tsx
// Default Borders
className="border-white/10 admin-light-theme:border-slate-200"

// Hover Borders
className="hover:border-white/20 admin-light-theme:hover:border-slate-300"

// Active/Focus Borders
className="border-white/30 admin-light-theme:border-slate-400"
```

### Icon Colors
```tsx
// Purple Icons
className="bg-purple-500/10 text-purple-400 admin-light-theme:bg-purple-100 admin-light-theme:text-purple-600"

// Blue Icons
className="bg-blue-500/10 text-blue-400 admin-light-theme:bg-blue-100 admin-light-theme:text-blue-600"

// Green Icons
className="bg-emerald-500/10 text-emerald-400 admin-light-theme:bg-emerald-100 admin-light-theme:text-emerald-600"

// Yellow Icons
className="bg-yellow-500/10 text-yellow-400 admin-light-theme:bg-yellow-100 admin-light-theme:text-yellow-600"

// Pink/Rose Icons
className="bg-pink-500/10 text-pink-400 admin-light-theme:bg-pink-100 admin-light-theme:text-pink-600"
```

### Shadow Effects
```tsx
// Card Shadows (light theme only)
className="admin-light-theme:shadow-sm admin-light-theme:hover:shadow-md"

// Button Shadows (both themes)
className="shadow-lg shadow-[#d4ff00]/30"
```

## Complete Examples

### Example 1: Custom Card with Content
```tsx
<div className={cn(
  "rounded-xl border p-4 backdrop-blur-sm transition-all",
  // Dark theme
  "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
  // Light theme
  "admin-light-theme:border-slate-200 admin-light-theme:bg-white",
  "admin-light-theme:shadow-sm admin-light-theme:hover:shadow-md admin-light-theme:hover:border-slate-300"
)}>
  <h3 className="text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
    Title
  </h3>
  <p className="mt-2 text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">
    Description text
  </p>
</div>
```

### Example 2: List Item with Icon
```tsx
<div className={cn(
  "flex items-center gap-3 rounded-lg border p-3 transition-all",
  "border-white/10 bg-white/5 hover:bg-white/10",
  "admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:bg-slate-50"
)}>
  <div className={cn(
    "rounded-lg p-2 transition-colors",
    "bg-purple-500/10 text-purple-400",
    "admin-light-theme:bg-purple-100 admin-light-theme:text-purple-600"
  )}>
    <Icon className="h-5 w-5" />
  </div>
  <div className="flex-1">
    <p className="font-medium text-white admin-light-theme:text-slate-900 transition-colors">
      Item Name
    </p>
    <p className="text-xs text-white/50 admin-light-theme:text-slate-500 transition-colors">
      Metadata
    </p>
  </div>
</div>
```

### Example 3: Progress Bar
```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-sm text-white/70 admin-light-theme:text-slate-600 transition-colors">
      Progress
    </span>
    <span className="text-sm font-semibold text-white admin-light-theme:text-slate-900 transition-colors">
      75%
    </span>
  </div>
  <div className="h-2 overflow-hidden rounded-full bg-white/10 admin-light-theme:bg-slate-200 transition-colors">
    <div 
      className="h-full bg-[#d4ff00] transition-all"
      style={{ width: '75%' }}
    />
  </div>
</div>
```

### Example 4: Status Badge
```tsx
<span className={cn(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
  status === "active" 
    ? "bg-emerald-500/20 text-emerald-400 admin-light-theme:bg-emerald-100 admin-light-theme:text-emerald-700"
    : "bg-slate-500/20 text-slate-400 admin-light-theme:bg-slate-100 admin-light-theme:text-slate-700"
)}>
  {status}
</span>
```

### Example 5: Skeleton Loader
```tsx
{loading ? (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div 
        key={i} 
        className="h-16 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors"
      />
    ))}
  </div>
) : (
  // Actual content
)}
```

### Example 6: Interactive Button (Custom)
```tsx
<button className={cn(
  "rounded-lg px-4 py-2 font-semibold transition-all",
  // Primary style
  "bg-[#d4ff00] text-black hover:bg-[#b8e600] shadow-lg shadow-[#d4ff00]/30",
  // OR Secondary style
  "bg-white/10 text-white hover:bg-white/20 border border-white/20",
  "admin-light-theme:bg-slate-100 admin-light-theme:text-slate-700",
  "admin-light-theme:hover:bg-slate-200 admin-light-theme:border-slate-300"
)}>
  Click Me
</button>
```

### Example 7: Table Cell
```tsx
<td className="px-6 py-4">
  <span className="text-white admin-light-theme:text-slate-900 transition-colors">
    Cell Content
  </span>
</td>
```

### Example 8: Empty State Icon
```tsx
<div className={cn(
  "mb-4 rounded-full p-6 transition-colors",
  "bg-white/5",
  "admin-light-theme:bg-slate-100"
)}>
  <Icon className={cn(
    "h-12 w-12 transition-colors",
    "text-white/30",
    "admin-light-theme:text-slate-400"
  )} />
</div>
```

## Common Patterns

### Pattern 1: Card with Hover Effect
```tsx
<div className={cn(
  "rounded-2xl border p-6 backdrop-blur-md transition-all cursor-pointer",
  "border-white/10 bg-white/5",
  "hover:border-white/20 hover:bg-white/10",
  "admin-light-theme:border-slate-200 admin-light-theme:bg-white",
  "admin-light-theme:shadow-sm admin-light-theme:hover:shadow-md",
  "admin-light-theme:hover:border-slate-300"
)}>
  {/* Content */}
</div>
```

### Pattern 2: Section with Title
```tsx
<div className="space-y-4">
  <h3 className="text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
    Section Title
  </h3>
  <p className="text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">
    Section description
  </p>
  {/* Content */}
</div>
```

### Pattern 3: Metric Display
```tsx
<div>
  <p className="text-xs font-medium uppercase tracking-wide text-white/50 admin-light-theme:text-slate-500 transition-colors">
    Label
  </p>
  <p className="mt-1 text-3xl font-bold text-white admin-light-theme:text-slate-900 transition-colors">
    1,234
  </p>
  <p className="mt-1 text-sm text-emerald-400 admin-light-theme:text-emerald-600 transition-colors">
    ↑ +12%
  </p>
</div>
```

## Important Rules

### 1. Always Add Transition
Add `transition-colors` to elements that change color between themes:
```tsx
className="text-white admin-light-theme:text-slate-900 transition-colors"
```

### 2. Use Proper Contrast
- Light theme text should be dark (slate-900, slate-700, slate-600)
- Dark theme text should be light (white, white/70, white/50)

### 3. Maintain Hierarchy
```
Primary:   slate-900 / white
Secondary: slate-600 / white-70
Muted:     slate-500 / white-50
Disabled:  slate-400 / white-40
```

### 4. Icon Backgrounds
Always provide both background and text color:
```tsx
className="bg-purple-500/10 text-purple-400 admin-light-theme:bg-purple-100 admin-light-theme:text-purple-600"
```

### 5. Shadows in Light Theme Only
```tsx
className="admin-light-theme:shadow-sm admin-light-theme:hover:shadow-md"
```

## Testing Checklist

When adding theme support to a page:

- [ ] All text is readable in both themes
- [ ] Icons have proper colors in both themes
- [ ] Borders are visible in both themes
- [ ] Hover states work in both themes
- [ ] Loading skeletons are visible in both themes
- [ ] Progress bars are visible in both themes
- [ ] Badges have proper contrast in both themes
- [ ] Empty states are visible in both themes
- [ ] Transitions are smooth (300ms)
- [ ] No hardcoded dark theme colors remain

## Quick Fix Script

To quickly add theme support to existing elements:

1. Find all `text-white` → Add `admin-light-theme:text-slate-900`
2. Find all `text-white/70` → Add `admin-light-theme:text-slate-600`
3. Find all `text-white/50` → Add `admin-light-theme:text-slate-500`
4. Find all `bg-white/5` → Add `admin-light-theme:bg-white`
5. Find all `border-white/10` → Add `admin-light-theme:border-slate-200`
6. Add `transition-colors` to all color-changing elements

## Need Help?

Refer to:
- `LIGHT_THEME_COLOR_GUIDE.md` - Complete color reference
- `AdminPageWrapper.tsx` - Component examples
- `TenantAdminShell.tsx` - Shell/navigation examples

---

**Remember**: The neon yellow accent (#d4ff00) stays the same in both themes!
