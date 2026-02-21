# Remaining Pages Needing Dark Theme Support

## Progress: 4/21 Complete (19%)

### ✅ COMPLETED (4 pages):
1. ✅ `frontend/app/modelling/disputes/[id]/page.tsx`
2. ✅ `frontend/app/modelling/finance/invoices/[id]/page.tsx`
3. ✅ `frontend/app/modelling/dashboard/jobs/page.tsx`
4. ✅ `frontend/app/modelling/finance/wallets/[id]/page.tsx`

### 🔄 HIGH PRIORITY - Detail Pages (7 remaining):
5. `frontend/app/modelling/talent/[id]/page.tsx` - Complex (images, tags, availability)
6. `frontend/app/modelling/castings/[id]/page.tsx` - Complex (submissions, holds)
7. `frontend/app/modelling/bookings/[id]/page.tsx` - Complex (call sheets, stages)
8. `frontend/app/modelling/contracts/[id]/page.tsx` - Complex (signers, status)
9. `frontend/app/modelling/finance/escrows/[id]/page.tsx` - Medium complexity
10. `frontend/app/modelling/finance/statements/[id]/page.tsx` - Simple
11. `frontend/app/modelling/contracts/templates/[id]/page.tsx` - Medium complexity
12. `frontend/app/modelling/automations/[id]/page.tsx` - Medium complexity

### ⏳ PENDING - New/Edit Pages (Medium Priority - 8 pages):
13. `frontend/app/modelling/talent/new/page.tsx`
14. `frontend/app/modelling/talent/[id]/edit/page.tsx`
15. `frontend/app/modelling/castings/new/page.tsx`
16. `frontend/app/modelling/castings/[id]/edit/page.tsx`
17. `frontend/app/modelling/bookings/new/page.tsx`
18. `frontend/app/modelling/contracts/new/page.tsx`
19. `frontend/app/modelling/finance/invoices/new/page.tsx`
20. `frontend/app/modelling/automations/new/page.tsx`
21. `frontend/app/modelling/automations/[id]/edit/page.tsx`

## Standard Pattern to Apply:

### Step 1: Update Imports
```typescript
// Remove:
import { PageBanner } from "@/shared/components/ui/PageBanner"

// Add:
import { useColorMode } from "@/shared/context/ColorModeContext"
```

### Step 2: Add Theme Setup (after other hooks)
```typescript
const { mode } = useColorMode()
const isDark = mode === "dark"
const theme = {
  cardBg: isDark ? "#171717" : "#ffffff",
  border: isDark ? "#262626" : "#E7E5E4",
  text: isDark ? "#fafafa" : "#1C1917",
  textSecondary: isDark ? "#a3a3a3" : "#57534E",
  inputBg: isDark ? "#0a0a0a" : "#ffffff",
}
```

### Step 3: Replace PageBanner
```typescript
// Replace:
<PageBanner title="Title" subtitle="Subtitle" variant="modelling" />

// With:
<div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
  <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Title</h1>
  <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Subtitle</p>
</div>
```

### Step 4: Update All Hardcoded Colors
- `className="border-[#E7E5E4]"` → `className="border" style={{ borderColor: theme.border }}`
- `className="bg-white"` → `style={{ backgroundColor: theme.cardBg }}`
- `className="text-[#1C1917]"` → `style={{ color: theme.text }}`
- `className="text-[#57534E]"` → `style={{ color: theme.textSecondary }}`
- Input/textarea/select → add `style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}`
- Loading states → `style={{ color: theme.textSecondary }}`
- Empty states background → `style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}`

### Step 5: Update Card Components
```typescript
<Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
  <CardHeader>
    <CardTitle style={{ color: theme.text }}>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

## Quick Reference - Common Replacements:
1. Cards: Add `style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}`
2. Titles: Add `style={{ color: theme.text }}`
3. Labels/descriptions: Add `style={{ color: theme.textSecondary }}`
4. Inputs: Add `style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}`
5. Buttons with outline: Add `style={{ borderColor: theme.border }}`
6. Back links: Change `text-[#57534E] hover:text-[#1C1917]` to `hover:opacity-80" style={{ color: theme.textSecondary }}`

## Testing Checklist (for each page):
- [ ] Page loads in light mode
- [ ] Page loads in dark mode
- [ ] All text is readable
- [ ] All cards have proper backgrounds
- [ ] All borders are visible
- [ ] Form inputs work in both modes
- [ ] No white flashes when switching themes
- [ ] Loading states respect theme
- [ ] Empty states respect theme
- [ ] Modals/dialogs respect theme

## Estimated Time per Page:
- Simple detail page: 5-10 minutes
- Complex page with forms: 10-15 minutes
- Total remaining: ~3-4 hours of work
