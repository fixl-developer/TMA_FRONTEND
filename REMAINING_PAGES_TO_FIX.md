# Remaining Modelling Pages - Dark Theme Status

## ✅ FIXED (6 pages):
1. ✅ Main Dashboard (`page.tsx`)
2. ✅ Audit (`audit/page.tsx`)
3. ✅ Automations (`automations/page.tsx`)
4. ✅ Statements (`finance/statements/page.tsx`)
5. ✅ Castings (`castings/page.tsx`)
6. ✅ Bookings (`bookings/page.tsx`)

## 🔧 NEEDS FIXING (11 pages):

### High Priority:
7. **Contracts** (`contracts/page.tsx`) - White cards
8. **Disputes** (`disputes/page.tsx`) - White cards + white select dropdown
9. **Notifications** (`notifications/page.tsx`) - White cards
10. **Talent** (`talent/page.tsx`) - Needs InteractiveTalentCard theme support

### Finance Pages:
11. **Credits** (`finance/credits/page.tsx`)
12. **Escrows** (`finance/escrows/page.tsx`) - White cards
13. **Invoices** (`finance/invoices/page.tsx`) - White cards
14. **Wallets** (`finance/wallets/page.tsx`) - White cards
15. **Dashboard Finance** (`dashboard/finance/page.tsx`) - White metric cards

### Contract Sub-pages:
16. **Templates** (`contracts/templates/page.tsx`) - White cards
17. **Clauses** (`contracts/clauses/page.tsx`) - White cards

## Components That Need Theme Support:
- ✅ InteractiveCastingCard - FIXED
- ✅ InteractiveBookingCard - FIXED
- 🔧 InteractiveTalentCard - Needs fixing

## Pattern to Apply:
```typescript
import { useColorMode } from "@/shared/context/ColorModeContext"

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
