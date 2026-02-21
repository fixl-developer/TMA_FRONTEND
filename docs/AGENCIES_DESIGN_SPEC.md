# Agencies Theme – Design Specification

> **Persona:** Modelling Agencies, Talent Managers, Creative Studios  
> **Feel:** Premium creative studio – Warm Cream base + Bold Accent highlights  
> **Priority:** First implementation

---

## 1. Color Palette

### Base (Warm Cream / Champagne)

| Token | Hex | Usage |
|-------|-----|-------|
| `--sidebar-bg` | `#FAF8F5` | Sidebar background |
| `--sidebar-bg-hover` | `#F5F0E8` | Sidebar item hover |
| `--main-bg` | `#FFFFFF` | Main content area |
| `--surface` | `#FAFAF9` | Card backgrounds, elevated surfaces |
| `--border` | `#E7E5E4` | Borders, dividers |
| `--text-primary` | `#1C1917` | Primary text |
| `--text-secondary` | `#57534E` | Secondary text |
| `--text-muted` | `#78716C` | Muted text, placeholders |

### Accent (Bold – Active & Highlights)

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | `#B8860B` | Gold – active nav, primary buttons, key CTAs |
| `--accent-primary-hover` | `#9A7209` | Gold hover state |
| `--accent-secondary` | `#E4A853` | Mustard – secondary highlights, badges |
| `--accent-soft` | `#FEF3C7` | Soft gold – active item background, highlights |

### Optional Accent Variants (for cards, tags)

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-coral` | `#E07C5C` | Coral – alerts, featured items |
| `--accent-teal` | `#0D9488` | Teal – success, completed states |

---

## 2. Sidebar

### Structure

```
┌─────────────────────────┐
│  [Logo / Brand]          │  ← Warm cream #FAF8F5
├─────────────────────────┤
│  ● Dashboard             │  ← Active: accent-soft bg + accent-primary text
│  ○ Talent                │  ← Default: text-secondary
│  ○ Castings              │
│  ○ Bookings              │
│  ○ Contracts             │
│  ○ ...                   │
├─────────────────────────┤
│  [Subtle pattern/icon]   │  ← Optional: soft decorative element
└─────────────────────────┘
```

### Specs

| Property | Value |
|----------|-------|
| Background | `#FAF8F5` |
| Width | 260px (collapsed: 72px) |
| Item padding | 12px 16px |
| Item border-radius | 8px |
| Active state | `background: #FEF3C7`, `color: #B8860B`, `font-weight: 600` |
| Hover state | `background: #F5F0E8` |
| Icon + label | 20px icon, 14px label |
| Divider | `#E7E5E4` 1px |

---

## 3. Cards

### Card Types

| Type | Background | Border | Image usage |
|------|------------|--------|-------------|
| **Project card** | `#FFFFFF` | `#E7E5E4` | Thumbnail top (16:9 or 1:1) |
| **Talent card** | `#FFFFFF` | `#E7E5E4` | Headshot (circular or rounded) |
| **Metric card** | `#FAF8F5` | none | Icon only (accent color) |
| **Action card** | Gradient or accent | none | Small icon top-left |

### Project Card (with thumbnail)

```
┌────────────────────────────┐
│  [Project thumbnail]       │  ← 16:9 or 1:1, rounded top
├────────────────────────────┤
│  Project Name              │
│  Client · Status            │
│  [View →]                   │  ← Accent on hover
└────────────────────────────┘
```

### Talent Card (with headshot)

```
┌────────────────────────────┐
│  [○]  Talent Name          │  ← Circular headshot 48px
│       Category · Status    │
│       [View Profile]       │
└────────────────────────────┘
```

### Metric / Action Card

```
┌────────────────────────────┐
│  [icon]              [→]   │  ← Icon in accent-primary
│  Label                     │
│  1,234                     │  ← Bold number
│  Subtext                   │
└────────────────────────────┘
```

---

## 4. Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Sidebar brand | Satoshi / General Sans | 18px | 700 |
| Sidebar nav | Inter / Geist | 14px | 500 (600 active) |
| Page title | Satoshi / General Sans | 24px | 700 |
| Card title | Inter / Geist | 16px | 600 |
| Body | Inter / Geist | 14px | 400 |
| Caption | Inter / Geist | 12px | 400 |

---

## 5. Spacing & Layout

| Token | Value |
|-------|-------|
| Sidebar padding | 24px |
| Main content padding | 32px |
| Card padding | 20px |
| Card gap | 24px |
| Border radius (cards) | 12px |
| Border radius (buttons) | 8px |

---

## 6. Component States

| State | Sidebar item | Button | Card |
|-------|--------------|--------|------|
| Default | text-secondary | bg-accent-primary | border subtle |
| Hover | bg-sidebar-hover | bg-accent-primary-hover | border accent-soft |
| Active | bg-accent-soft, text-accent | - | - |
| Focus | ring 2px accent | ring 2px accent | - |

---

## 7. CSS Variables (Tailwind / CSS)

```css
:root[data-theme="agencies"] {
  /* Base */
  --agencies-sidebar-bg: #FAF8F5;
  --agencies-sidebar-hover: #F5F0E8;
  --agencies-main-bg: #FFFFFF;
  --agencies-surface: #FAFAF9;
  --agencies-border: #E7E5E4;
  --agencies-text: #1C1917;
  --agencies-text-secondary: #57534E;
  --agencies-text-muted: #78716C;

  /* Accent */
  --agencies-accent: #B8860B;
  --agencies-accent-hover: #9A7209;
  --agencies-accent-soft: #FEF3C7;
  --agencies-accent-mustard: #E4A853;
}
```

---

## 8. Implementation Checklist

- [x] Add `data-theme="agencies"` to Agencies shell/layout
- [x] Create Agencies-specific sidebar (warm cream + gold accent active)
- [ ] Apply card styles (project thumbnails, talent headshots) – future enhancement
- [x] Add accent colors to buttons, badges, active states
- [x] Ensure all Agency routes use this theme (modelling, pageant, talent-mgmt, academy, influencer)

---

**Last Updated:** February 2026
