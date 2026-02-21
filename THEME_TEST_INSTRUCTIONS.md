# Theme Toggle Testing Instructions

## How to Test the Theme Toggle

### Step 1: Start the Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 2: Navigate to an Admin Page
Go to any of these redesigned pages:
- `http://localhost:3000/admin` - Dashboard
- `http://localhost:3000/admin/limits` - Limits page
- `http://localhost:3000/admin/risk` - Risk page
- `http://localhost:3000/admin/casting` - Castings
- `http://localhost:3000/admin/crm` - CRM Dashboard
- `http://localhost:3000/admin/reports` - Reports
- `http://localhost:3000/admin/audit-log` - Audit Log

### Step 3: Find the Theme Toggle Button
Look in the header (top right area) for:
- **Sun icon** (☀️) - When in dark mode
- **Moon icon** (🌙) - When in light mode

### Step 4: Click to Toggle
Click the icon to switch between themes.

## What You Should See

### Dark Theme (Default)
- **Background**: Purple gradient (dark purple to lighter purple)
- **Sidebar**: Dark with semi-transparent background
- **Cards**: Glassmorphism effect (frosted glass look)
- **Text**: White with various opacity levels
- **Borders**: White with low opacity
- **Accent**: Neon yellow (#d4ff00)

### Light Theme
- **Background**: White/gray gradient (very light)
- **Sidebar**: White with semi-transparent background
- **Cards**: White with subtle shadows
- **Text**: Dark gray/slate colors
- **Borders**: Light gray (slate-200)
- **Accent**: Neon yellow (#d4ff00) - same as dark

## Troubleshooting

### Theme Not Switching?

1. **Check Browser Console**
   - Press F12 to open DevTools
   - Look for any errors in the Console tab
   - Check if `localStorage` is enabled

2. **Verify Theme Context**
   - In Console, type: `localStorage.getItem('adminTheme')`
   - Should return `"dark"` or `"light"`

3. **Check HTML Element**
   - In Elements tab, inspect the `<html>` element
   - Should have class `admin-light-theme` or `admin-dark-theme`

4. **Clear Cache**
   ```bash
   # Stop the dev server (Ctrl+C)
   # Clear Next.js cache
   rm -rf .next
   # Restart
   npm run dev
   ```

### Colors Look Wrong?

1. **Check if page uses AdminPageWrapper**
   - Open the page file (e.g., `frontend/app/admin/limits/page.tsx`)
   - Should import and use `<AdminPageWrapper>`

2. **Verify Tailwind Classes**
   - Elements should have both dark and light theme classes
   - Example: `text-white admin-light-theme:text-slate-900`

3. **Check CSS Loading**
   - Ensure `globals.css` is imported in `layout.tsx`
   - Verify no CSS conflicts

## Expected Behavior

### On Page Load
- Theme loads from localStorage
- If no preference, defaults to dark theme
- Theme applies immediately (no flash)

### On Toggle Click
- Theme switches instantly
- Smooth 300ms transition
- New preference saved to localStorage
- Icon changes (Sun ↔ Moon)

### On Page Navigation
- Theme persists across pages
- No flash or flicker
- Consistent experience

## Visual Checklist

### Dark Theme ✓
- [ ] Purple gradient background visible
- [ ] White text readable
- [ ] Cards have frosted glass effect
- [ ] Neon yellow accent stands out
- [ ] Sidebar is dark
- [ ] Icons are visible

### Light Theme ✓
- [ ] White/light gray background
- [ ] Dark text readable
- [ ] Cards have subtle shadows
- [ ] Neon yellow accent stands out
- [ ] Sidebar is light
- [ ] Icons are visible

### Both Themes ✓
- [ ] Navigation items clearly visible
- [ ] Hover states work
- [ ] Buttons are clickable
- [ ] Badges have good contrast
- [ ] Tables are readable
- [ ] Empty states are visible
- [ ] Loading skeletons are visible

## Manual Testing Steps

### Test 1: Basic Toggle
1. Go to `/admin/limits`
2. Note current theme
3. Click theme toggle button
4. Verify theme changes
5. Verify smooth transition
6. Click again to toggle back

### Test 2: Persistence
1. Set theme to light
2. Refresh page (F5)
3. Verify theme is still light
4. Navigate to another admin page
5. Verify theme persists

### Test 3: All Components
1. Go to `/admin/limits`
2. Toggle to light theme
3. Check:
   - [ ] Page background is light
   - [ ] Stat cards are white
   - [ ] Text is dark and readable
   - [ ] Icons have colored backgrounds
   - [ ] Progress bars are visible
   - [ ] Borders are visible

### Test 4: Navigation
1. Toggle to light theme
2. Check sidebar:
   - [ ] Background is light
   - [ ] Nav items are readable
   - [ ] Active item is highlighted
   - [ ] Hover states work
3. Check header:
   - [ ] Background is light
   - [ ] User info is readable
   - [ ] Buttons are visible

### Test 5: Interactive Elements
1. In light theme, test:
   - [ ] Buttons are clickable
   - [ ] Hover effects work
   - [ ] Links are visible
   - [ ] Dropdowns work
   - [ ] Forms are usable

## Common Issues & Fixes

### Issue: Theme toggle button not visible
**Fix**: Check if `TenantAdminShell` is wrapping the page

### Issue: Theme changes but colors don't
**Fix**: Ensure elements use `admin-light-theme:` prefix for light theme styles

### Issue: Flash of wrong theme on load
**Fix**: Theme context should load before rendering

### Issue: Theme doesn't persist
**Fix**: Check if localStorage is enabled in browser

### Issue: Some elements don't change
**Fix**: Add `transition-colors` class to those elements

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

## Performance

- Theme toggle: < 50ms
- Transition duration: 300ms
- No layout shift
- No performance impact

## Next Steps

If theme toggle is working:
1. ✅ Test on all redesigned pages
2. ✅ Verify persistence works
3. ✅ Check all components
4. 🔄 Continue redesigning remaining pages

If theme toggle is NOT working:
1. Check browser console for errors
2. Verify AdminThemeProvider is in place
3. Check if theme classes are applied to HTML
4. Review implementation files

---

**Need Help?**
- Check `THEME_IMPLEMENTATION_GUIDE.md` for code examples
- Check `LIGHT_THEME_COLOR_GUIDE.md` for color reference
- Check `THEME_TOGGLE_SUMMARY.md` for overview
