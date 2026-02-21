/**
 * Role-based dashboard configuration: color palettes, hero videos, and theme.
 * Each role gets its own visual identity.
 */

export type RoleKey = "modelling" | "admin" | "pageant" | "talent-mgmt" | "academy" | "influencer"

export interface HeroSlideConfig {
  id: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  gradient?: string
  videoUrl?: string
  /** Fallback/poster image when video fails or is loading */
  imageUrl?: string
}

export interface PageTheme {
  /** Main page background (matches sidebar palette) */
  bg: string
  /** Card/section background */
  contentBg: string
  /** Borders */
  border: string
  /** Primary text */
  text: string
  /** Muted text */
  textMuted: string
  /** Accent (links, buttons, highlights) */
  accent: string
  accentHover: string
  /** Link hover / outline button hover bg */
  hover: string
}

export interface RoleDashboardConfig {
  role: RoleKey
  /** Primary accent (buttons, borders, links) */
  accent: string
  accentHover: string
  /** Sidebar theme */
  sidebar: {
    bg: string
    border: string
    accent: string
    accentLight: string
    hover: string
    text: string
    textMuted: string
  }
  /** Page theme – same palette as sidebar for consistency across agency/talent dashboards */
  page: PageTheme
  /** Hero carousel gradient names */
  heroGradients: Record<string, string>
  /** Hero slides with role-specific content and videos */
  heroSlides: HeroSlideConfig[]
  /** Metric card variants (gold, coral, teal, emerald, violet, indigo) */
  metricVariants: [string, string, string, string]
  /** Images for metric cards on hover */
  metricImages: Record<string, string>
  /** Videos for featured/casting cards */
  cardVideos?: Record<string, string>
}

// Verified Pexels video URLs (direct mp4, known working)
const VIDEOS = {
  fashion: "https://videos.pexels.com/video-files/35080398/14861091_2560_1440_30fps.mp4",
  beauty: "https://videos.pexels.com/video-files/3997798/3997798-hd_1920_1080_25fps.mp4",
  editorial: "https://videos.pexels.com/video-files/3130284/3130284-hd_1920_1080_25fps.mp4",
  business: "https://videos.pexels.com/video-files/12886090/12886090-hd_1920_1080_30fps.mp4",
  pageant: "https://videos.pexels.com/video-files/34232464/14507863_2560_1440_30fps.mp4",
  academy: "https://videos.pexels.com/video-files/36079899/15301338_1080_1920_30fps.mp4",
  influencer: "https://videos.pexels.com/video-files/35080398/14861091_2560_1440_30fps.mp4",
}

export const ROLE_DASHBOARD_CONFIG: Record<RoleKey, RoleDashboardConfig> = {
  modelling: {
    role: "modelling",
    accent: "#fbbf24",
    accentHover: "#f59e0b",
    sidebar: { bg: "#0a0a0a", border: "#1a1a1a", accent: "#fbbf24", accentLight: "#1a1a1a", hover: "#1a1a1a", text: "#fafafa", textMuted: "#a3a3a3" },
    page: { bg: "#0a0a0a", contentBg: "#171717", border: "#262626", text: "#fafafa", textMuted: "#a3a3a3", accent: "#fbbf24", accentHover: "#f59e0b", hover: "#262626" },
    heroGradients: {
      gold: "from-[#E4A853] via-[#B8860B] to-[#9A7209]",
      coral: "from-[#E07C5C] via-[#B8860B] to-[#9A7209]",
      teal: "from-[#0D9488] via-[#B8860B] to-[#9A7209]",
    },
    heroSlides: [
      { id: "m1", title: "Summer Fashion Campaign 2024", subtitle: "Luxury Fashion House · Open casting. Seeking female models, 5'8\"+, age 18-28.", ctaLabel: "View Casting", ctaHref: "/modelling/castings", gradient: "gold", videoUrl: VIDEOS.fashion, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80" },
      { id: "m2", title: "New Client Win: Beauty Cosmetics", subtitle: "Lipstick launch campaign. Half-day beauty shoot. Makeup artist provided.", ctaLabel: "View Details", ctaHref: "/modelling/castings", gradient: "coral", videoUrl: VIDEOS.beauty, imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80" },
      { id: "m3", title: "Featured Talent: Priya Sharma", subtitle: "Booked for Spring Lookbook 2024. Confirmed · Contract signed.", ctaLabel: "View Talent", ctaHref: "/modelling/talent", gradient: "teal", videoUrl: VIDEOS.editorial, imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=80" },
    ],
    metricVariants: ["gold", "coral", "teal", "emerald"],
    metricImages: {
      talent: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      castings: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      bookings: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&q=80",
      confirmed: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80",
    },
    cardVideos: { FASHION: VIDEOS.fashion, BEAUTY: VIDEOS.beauty, EDITORIAL: VIDEOS.editorial },
  },

  admin: {
    role: "admin",
    accent: "#7C3AED",
    accentHover: "#6D28D9",
    sidebar: { bg: "#EDE9FE", border: "#DDD6FE", accent: "#7C3AED", accentLight: "#EDE9FE", hover: "#E9E5FF", text: "#1C1917", textMuted: "#57534E" },
    page: { bg: "#F5F3FF", contentBg: "#FFFFFF", border: "#DDD6FE", text: "#1C1917", textMuted: "#57534E", accent: "#7C3AED", accentHover: "#6D28D9", hover: "#EDE9FE" },
    heroGradients: {
      violet: "from-[#A78BFA] via-[#7C3AED] to-[#6D28D9]",
      indigo: "from-[#818CF8] via-[#6366F1] to-[#4F46E5]",
      slate: "from-[#94A3B8] via-[#64748B] to-[#475569]",
    },
    heroSlides: [
      { id: "a1", title: "Command Centre", subtitle: "Your talent empire at a glance. Users, roles, compliance, wallet.", ctaLabel: "Users", ctaHref: "/admin/users", gradient: "violet", videoUrl: VIDEOS.business, imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80" },
      { id: "a2", title: "Organization Settings", subtitle: "Branding, limits, and tenant configuration.", ctaLabel: "Configure", ctaHref: "/admin/organization", gradient: "indigo", videoUrl: VIDEOS.business, imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" },
      { id: "a3", title: "Wallet & Finance", subtitle: "Balance, payouts, invoices. All in one place.", ctaLabel: "View Wallet", ctaHref: "/admin/wallet", gradient: "slate", videoUrl: VIDEOS.business, imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80" },
    ],
    metricVariants: ["gold", "violet", "emerald", "teal"],
    metricImages: {
      users: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
      roles: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
      compliance: "https://images.unsplash.com/photo-1450101499163-c8848c71ca15?w=400&q=80",
      wallet: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
    },
  },

  pageant: {
    role: "pageant",
    accent: "#DB2777",
    accentHover: "#BE185D",
    sidebar: { bg: "#FCE7F3", border: "#FBCFE8", accent: "#DB2777", accentLight: "#FCE7F3", hover: "#FDF2F8", text: "#1C1917", textMuted: "#57534E" },
    page: { bg: "#FDF2F8", contentBg: "#FFFFFF", border: "#FBCFE8", text: "#1C1917", textMuted: "#57534E", accent: "#DB2777", accentHover: "#BE185D", hover: "#FCE7F3" },
    heroGradients: {
      pink: "from-[#F472B6] via-[#DB2777] to-[#BE185D]",
      rose: "from-[#FB7185] via-[#F43F5E] to-[#E11D48]",
      fuchsia: "from-[#E879F9] via-[#D946EF] to-[#C026D3]",
    },
    heroSlides: [
      { id: "p1", title: "Pageant Organizer", subtitle: "Process builder, registration, judges, sponsors.", ctaLabel: "Process", ctaHref: "/pageant/process", gradient: "pink", videoUrl: VIDEOS.pageant, imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" },
      { id: "p2", title: "Live Dashboard", subtitle: "Real-time funnel and participants.", ctaLabel: "Go Live", ctaHref: "/pageant/live", gradient: "rose", videoUrl: VIDEOS.pageant, imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1200&q=80" },
      { id: "p3", title: "Templates & Judges", subtitle: "Beauty, Fashion, Talent Hunt. Manage scoring.", ctaLabel: "Templates", ctaHref: "/pageant/templates", gradient: "fuchsia", videoUrl: VIDEOS.pageant, imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80" },
    ],
    metricVariants: ["coral", "violet", "emerald", "indigo"],
    metricImages: {
      stages: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
      registrations: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
      judges: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80",
      templates: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    },
  },

  "talent-mgmt": {
    role: "talent-mgmt",
    accent: "#0D9488",
    accentHover: "#0F766E",
    sidebar: { bg: "#CCFBF1", border: "#99F6E4", accent: "#0D9488", accentLight: "#CCFBF1", hover: "#E6FFFA", text: "#1C1917", textMuted: "#57534E" },
    page: { bg: "#F0FDFA", contentBg: "#FFFFFF", border: "#99F6E4", text: "#1C1917", textMuted: "#57534E", accent: "#0D9488", accentHover: "#0F766E", hover: "#CCFBF1" },
    heroGradients: {
      teal: "from-[#2DD4BF] via-[#0D9488] to-[#0F766E]",
      cyan: "from-[#22D3EE] via-[#06B6D4] to-[#0891B2]",
      emerald: "from-[#34D399] via-[#10B981] to-[#059669]",
    },
    heroSlides: [
      { id: "t1", title: "Talent Management", subtitle: "CRM, contracts, commissions, and availability.", ctaLabel: "Talent CRM", ctaHref: "/talent-mgmt/talent", gradient: "teal", videoUrl: VIDEOS.editorial, imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=80" },
      { id: "t2", title: "Contracts & E-Sign", subtitle: "Templates, e-sign flow, and compliance.", ctaLabel: "Contracts", ctaHref: "/talent-mgmt/contracts", gradient: "cyan", videoUrl: VIDEOS.business, imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80" },
      { id: "t3", title: "Calendar & Ledger", subtitle: "Availability, holds, wallet, transactions.", ctaLabel: "Calendar", ctaHref: "/talent-mgmt/calendar", gradient: "emerald", videoUrl: VIDEOS.editorial, imageUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1200&q=80" },
    ],
    metricVariants: ["teal", "coral", "gold", "emerald"],
    metricImages: {
      talent: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
      contracts: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
      wallet: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
      transactions: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    },
  },

  academy: {
    role: "academy",
    accent: "#2563EB",
    accentHover: "#1D4ED8",
    sidebar: { bg: "#DBEAFE", border: "#BFDBFE", accent: "#2563EB", accentLight: "#DBEAFE", hover: "#EFF6FF", text: "#1C1917", textMuted: "#57534E" },
    page: { bg: "#EFF6FF", contentBg: "#FFFFFF", border: "#BFDBFE", text: "#1C1917", textMuted: "#57534E", accent: "#2563EB", accentHover: "#1D4ED8", hover: "#DBEAFE" },
    heroGradients: {
      blue: "from-[#60A5FA] via-[#2563EB] to-[#1D4ED8]",
      indigo: "from-[#818CF8] via-[#6366F1] to-[#4F46E5]",
      sky: "from-[#38BDF8] via-[#0EA5E9] to-[#0284C7]",
    },
    heroSlides: [
      { id: "ac1", title: "Academy", subtitle: "Courses, mentors, certifications, progress.", ctaLabel: "Courses", ctaHref: "/academy/courses", gradient: "blue", videoUrl: VIDEOS.academy, imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" },
      { id: "ac2", title: "My Learning", subtitle: "Your enrolled courses and progress.", ctaLabel: "Continue", ctaHref: "/academy/my-learning", gradient: "indigo", videoUrl: VIDEOS.academy, imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80" },
      { id: "ac3", title: "Sessions & Mentors", subtitle: "Live workshops and mentor sessions.", ctaLabel: "Schedule", ctaHref: "/academy/sessions", gradient: "sky", videoUrl: VIDEOS.academy, imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80" },
    ],
    metricVariants: ["indigo", "teal", "coral", "emerald"],
    metricImages: {
      courses: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
      enrolled: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
      mentors: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
      certifications: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80",
    },
  },

  influencer: {
    role: "influencer",
    accent: "#EC4899",
    accentHover: "#DB2777",
    sidebar: { bg: "#FCE7F3", border: "#FBCFE8", accent: "#EC4899", accentLight: "#FCE7F3", hover: "#FDF2F8", text: "#1C1917", textMuted: "#57534E" },
    page: { bg: "#FDF2F8", contentBg: "#FFFFFF", border: "#FBCFE8", text: "#1C1917", textMuted: "#57534E", accent: "#EC4899", accentHover: "#DB2777", hover: "#FCE7F3" },
    heroGradients: {
      pink: "from-[#F472B6] via-[#EC4899] to-[#DB2777]",
      orange: "from-[#FB923C] via-[#F97316] to-[#EA580C]",
      amber: "from-[#FBBF24] via-[#F59E0B] to-[#D97706]",
    },
    heroSlides: [
      { id: "i1", title: "Influencer Agency", subtitle: "Campaigns, deliverables, media kits, reporting.", ctaLabel: "Campaigns", ctaHref: "/influencer/campaigns", gradient: "pink", videoUrl: VIDEOS.influencer, imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80" },
      { id: "i2", title: "Deliverables", subtitle: "Content submissions and approvals.", ctaLabel: "Manage", ctaHref: "/influencer/deliverables", gradient: "orange", videoUrl: VIDEOS.influencer, imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa16f50?w=1200&q=80" },
      { id: "i3", title: "Reporting & Analytics", subtitle: "Insights and performance metrics.", ctaLabel: "View", ctaHref: "/influencer/reporting", gradient: "amber", videoUrl: VIDEOS.influencer, imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" },
    ],
    metricVariants: ["coral", "gold", "violet", "teal"],
    metricImages: {
      campaigns: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
      budget: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
      deliverables: "https://images.unsplash.com/photo-1611162616305-c69b3fa16f50?w=400&q=80",
      mediaKits: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    },
  },
}

/** Get HeroCarousel gradient map for a role (extends default gold/coral/teal) */
export function getHeroGradientsForRole(role: RoleKey): Record<string, string> {
  const base = {
    gold: "from-[#E4A853] via-[#B8860B] to-[#9A7209]",
    coral: "from-[#E07C5C] via-[#B8860B] to-[#9A7209]",
    teal: "from-[#0D9488] via-[#B8860B] to-[#9A7209]",
  }
  const cfg = ROLE_DASHBOARD_CONFIG[role]
  return { ...base, ...cfg.heroGradients }
}
