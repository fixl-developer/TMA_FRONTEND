/**
 * Chart constants – AGENCIES_DESIGN_SPEC only
 * All charts must use this palette and spacing.
 */

/** Docs palette – Base + Accent */
export const CHART_PALETTE = {
  gold: "#B8860B",       // accent-primary
  goldHover: "#9A7209",  // accent-primary-hover
  mustard: "#E4A853",   // accent-secondary
  softGold: "#FEF3C7",  // accent-soft
  teal: "#0D9488",      // accent-teal
  coral: "#E07C5C",     // accent-coral
  border: "#E7E5E4",
  text: "#1C1917",
  textSecondary: "#57534E",
  textMuted: "#78716C",
  surface: "#FAFAF9",
  grid: "#E7E5E4",
} as const

/** Palette as array for multi-segment charts */
export const CHART_COLORS: readonly string[] = [
  CHART_PALETTE.gold,
  CHART_PALETTE.mustard,
  CHART_PALETTE.teal,
  CHART_PALETTE.coral,
  CHART_PALETTE.softGold,
  CHART_PALETTE.goldHover,
]

/** Enterprise-friendly categorical palette (higher contrast + calmer tones) */
export const CHART_COLORS_ENTERPRISE: readonly string[] = [
  "#1D4ED8", // blue
  "#0F766E", // teal
  "#B45309", // amber
  "#7C3AED", // violet
  "#BE123C", // rose
  "#4B5563", // slate
]

/** Chart margins – proper X/Y axis spacing per docs */
export const CHART_MARGIN = {
  top: 20,
  right: 24,
  left: 36,
  bottom: 28,
} as const

/** Horizontal chart (Y-axis categories) – more left space for labels */
export const CHART_MARGIN_HORIZONTAL = {
  top: 20,
  right: 28,
  left: 88,
  bottom: 28,
} as const

export const CHART_AXIS_TICK = {
  fill: CHART_PALETTE.textSecondary,
  fontSize: 11,
} as const

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: `1px solid ${CHART_PALETTE.border}`,
  borderRadius: "10px",
  boxShadow: "0 8px 20px rgba(2, 6, 23, 0.08)",
  padding: "8px 10px",
} as const
