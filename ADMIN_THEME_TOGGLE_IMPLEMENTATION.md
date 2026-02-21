# Admin Theme Toggle Implementation

## Overview
Added dark/light theme toggle functionality to the admin dashboard with smooth transitions and persistent theme selection.

## Features Implemented

### 1. Theme Context (`AdminThemeContext.tsx`)
- Created a React context to manage theme state globally
- Stores theme preference in localStorage
- Provides `theme`, `toggleTheme()`, and `setTheme()` functions
- Automatically applies theme classes to document root

### 2. Theme Toggle Button
- Added Sun/Moon icon toggle button in the header
- Located next to notifications and search icons
- Smooth icon transition on theme change
- Accessible with proper ARIA labels

### 3. Theme-Aware Components

#### AdminPageWrapper
- **Dark Theme**: Purple gradient (`from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c]`)
- **Light Theme**: White/gray gradient (`from-slate-50 via-white to-slate-100`)
- Smooth 300ms transition between themes

#### AdminCard
- **Dark Theme**: Glassmorphism with `bg-white/5 border-white/10`
- **Light Theme**: White background with `bg-white border-slate-200 shadow-sm`
- Hover states adapt to theme

#### AdminSectionHeader
- **Dark Theme**: White text (`text-white`)
- **Light Theme**: Dark text (`text-slate-900`)
- Subtitle adapts opacity based on theme

#### TenantAdminShell (Sidebar & Header)
- **Sidebar Background**:
  - Dark: `rgba(0, 0, 0, 0.3)` with purple gradient
  - Light: `rgba(255, 255, 255, 0.8)` with white gradient
- **Navigation Items**:
  - Dark: White text with opacity variations
  - Light: Slate text with hover states
- **Header**:
  - Dark: `bg-black/20 border-white/10`
  - Light: `bg-white/80 border-slate-200`

### 4. CSS Classes
Added utility classes in `globals.css`:
- `.admin-light-theme` - Applied when light mode is active
- `.admin-dark-theme` - Applied when dark mode is active
- Smooth transitions for all theme-related properties

## Usage

### For Users
1. Click the Sun/Moon icon in the header to toggle theme
2. Theme preference is saved automatically
3. Theme persists across page reloads

### For Developers

#### Using the Theme Context
```tsx
import { useAdminTheme } from "@/shared/context/AdminThemeContext"

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useAdminTheme()
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}
```

#### Creating Theme-Aware Components
```tsx
<div className={cn(
  "rounded-lg p-4",
  // Dark theme styles
  "bg-white/5 text-white",
  // Light theme styles
  "admin-light-theme:bg-white admin-light-theme:text-slate-900"
)}>
  Content
</div>
```

## Design Tokens

### Dark Theme (Default)
- **Background**: Purple gradient (#1a0b2e → #3d1f47 → #6b2d5c)
- **Primary Accent**: Neon yellow (#d4ff00)
- **Cards**: White/5 opacity with 10% border
- **Text**: White with varying opacity (100%, 70%, 50%)
- **Glassmorphism**: backdrop-blur-md

### Light Theme
- **Background**: White/gray gradient (slate-50 → white → slate-100)
- **Primary Accent**: Neon yellow (#d4ff00) - unchanged
- **Cards**: White with slate-200 border and shadow
- **Text**: Slate-900 with varying shades (900, 600, 500)
- **Clean Design**: Subtle shadows instead of glassmorphism

## Files Modified

### New Files
1. `frontend/shared/context/AdminThemeContext.tsx` - Theme context provider
2. `ADMIN_THEME_TOGGLE_IMPLEMENTATION.md` - This documentation

### Modified Files
1. `frontend/shared/components/layout/TenantAdminShell.tsx`
   - Added theme toggle button
   - Made sidebar and header theme-aware
   - Wrapped with AdminThemeProvider

2. `frontend/shared/components/layout/AdminPageWrapper.tsx`
   - Added light theme support to all components
   - Updated AdminPageWrapper, AdminCard, AdminSectionHeader

3. `frontend/app/globals.css`
   - Added theme utility classes
   - Added smooth transition styles

## Benefits

1. **User Choice**: Users can choose their preferred theme
2. **Accessibility**: Better readability in different lighting conditions
3. **Modern UX**: Smooth transitions and persistent preferences
4. **Consistent Design**: Both themes maintain the design language
5. **Easy Extension**: Simple to add theme support to new components

## Next Steps

To add theme support to remaining admin pages:

1. Ensure pages use `AdminPageWrapper` component
2. Use theme-aware utility classes for custom elements
3. Test both themes for readability and contrast
4. Add theme-specific adjustments where needed

## Example: Converting a Page to Support Themes

```tsx
// Before
<div className="bg-white/5 text-white">
  <h1 className="text-white">Title</h1>
  <p className="text-white/60">Description</p>
</div>

// After
<div className={cn(
  "bg-white/5 text-white",
  "admin-light-theme:bg-white admin-light-theme:text-slate-900"
)}>
  <h1 className={cn(
    "text-white",
    "admin-light-theme:text-slate-900"
  )}>Title</h1>
  <p className={cn(
    "text-white/60",
    "admin-light-theme:text-slate-600"
  )}>Description</p>
</div>
```

## Testing Checklist

- [x] Theme toggle button appears in header
- [x] Theme persists across page reloads
- [x] Smooth transitions between themes
- [x] Sidebar adapts to theme
- [x] Header adapts to theme
- [x] Cards adapt to theme
- [x] Text remains readable in both themes
- [x] Neon yellow accent works in both themes
- [x] Navigation items adapt to theme
- [x] Hover states work in both themes

---

**Status**: ✅ Complete
**Theme Toggle**: Fully functional with smooth transitions
**Coverage**: All redesigned admin pages (23/130) support both themes
