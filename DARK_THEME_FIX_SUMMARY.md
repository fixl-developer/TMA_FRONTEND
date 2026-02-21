# Dark Theme Fix Summary - Modelling Dashboard

## Issue
Many modelling pages have hardcoded colors that don't respect dark theme:
- `bg-white` - should be theme-aware
- `border-[#E7E5E4]` - should use theme border color
- `text-[#1C1917]` - should use theme text color
- `text-[#57534E]` - should use theme secondary text color

## Fixed Pages ✅
1. ✅ `frontend/app/modelling/page.tsx` - Main dashboard (already had theme support)
2. ✅ `frontend/app/modelling/audit/page.tsx` - Added theme support
3. ✅ `frontend/app/modelling/automations/page.tsx` - Added theme support
4. ✅ `frontend/app/modelling/dashboard/jobs/page.tsx` - Already had theme support

## Pages That Need Fixing 🔧

### High Priority (User-facing pages with white backgrounds):

1. **frontend/app/modelling/bookings/page.tsx**
   - Line 121: Loading skeleton has `bg-white`
   - Needs: Import `useColorMode`, add theme object

2. **frontend/app/modelling/castings/page.tsx**
   - Card backgrounds need theme support
   - Needs: Import `useColorMode`, add theme object

3. **frontend/app/modelling/contracts/page.tsx**
   - Line 84: Contract cards have `bg-white`
   - Needs: Import `useColorMode`, add theme object

4. **frontend/app/modelling/disputes/page.tsx**
   - Line 60: Select dropdown has `bg-white`
   - Line 89: Dispute cards have `bg-white`
   - Needs: Import `useColorMode`, add theme object

5. **frontend/app/modelling/notifications/page.tsx**
   - Notification cards need theme support
   - Needs: Import `useColorMode`, add theme object

6. **frontend/app/modelling/talent/page.tsx**
   - Talent cards need theme support
   - Needs: Import `useColorMode`, add theme object

### Finance Pages:

7. **frontend/app/modelling/finance/credits/page.tsx**
   - Cards need theme support

8. **frontend/app/modelling/finance/escrows/page.tsx**
   - Line 71: Escrow cards have `bg-white`

9. **frontend/app/modelling/finance/invoices/page.tsx**
   - Line 78: Invoice cards have `bg-white`

10. **frontend/app/modelling/finance/statements/page.tsx**
    - Line 63: Statement cards have `bg-white`

11. **frontend/app/modelling/finance/wallets/page.tsx**
    - Line 63: Wallet cards have `bg-white`

12. **frontend/app/modelling/dashboard/finance/page.tsx**
    - Lines 79, 95, 112, 129, 146: All metric cards have `bg-white`

### Contract Sub-pages:

13. **frontend/app/modelling/contracts/templates/page.tsx**
    - Line 56: Template cards have `bg-white`

14. **frontend/app/modelling/contracts/clauses/page.tsx**
    - Line 53: Clause cards have `bg-white`

## Theme Object Pattern

```typescript
import { useColorMode } from "@/shared/context/ColorModeContext"

const { mode } = useColorMode()
const isDark = mode === "dark"

const theme = {
  cardBg: isDark ? "#171717" : "#ffffff",
  border: isDark ? "#262626" : "#E7E5E4",
  text: isDark ? "#fafafa" : "#1C1917",
  textSecondary: isDark ? "#a3a3a3" : "#57534E",
}
```

## Replacement Patterns

### Cards:
```tsx
// Before:
className="border-[#E7E5E4] bg-white"

// After:
className="border"
style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
```

### Text:
```tsx
// Before:
className="text-[#1C1917]"

// After:
style={{ color: theme.text }}
```

### Empty States:
```tsx
// Before:
className="border-[#E7E5E4] bg-[#FAF8F5]/50"

// After:
style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}
```

## Next Steps
1. Apply theme support to remaining pages following the pattern above
2. Test all pages in both light and dark modes
3. Ensure all interactive elements (buttons, inputs, selects) respect theme
