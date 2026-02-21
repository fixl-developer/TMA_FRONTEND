"use client"

import { cn } from "@/shared/lib/utils"
import { useColorMode } from "@/shared/context/ColorModeContext"

interface PageBannerProps {
  title: string
  subtitle?: string
  variant?: "default" | "talent" | "castings" | "process" | "sponsors" | "modelling" | "influencer" | "academy" | "pageant" | "admin" | "talent-mgmt"
  /** Optional background image URL – fills right side with image */
  backgroundImage?: string
  /** Optional background video URL – autoplay, muted, loop */
  backgroundVideo?: string
  /** Render media background (disabled by default for cleaner text-only headers) */
  showMedia?: boolean
  className?: string
}

/** Dark variants (legacy) */
const darkVariantStyles: Record<string, string> = {
  default: "from-slate-900 via-slate-800 to-slate-900 bg-gradient-to-br",
  talent: "from-amber-950/90 via-slate-900 to-rose-950/80 bg-gradient-to-br",
  castings: "from-sky-950/90 via-slate-900 to-indigo-950/80 bg-gradient-to-br",
  process: "from-violet-950/90 via-slate-900 to-fuchsia-950/80 bg-gradient-to-br",
  sponsors: "from-emerald-950/90 via-slate-900 to-teal-950/80 bg-gradient-to-br",
}

/** Light variants – agencies theme (warm cream + gold) for all non-SuperAdmin */
const lightVariantStyles: Record<string, string> = {
  modelling: "bg-[#FAF8F5] border border-[#E7E5E4] border-l-4 border-l-[#B8860B] shadow-sm",
  influencer: "bg-[#FAF8F5] border border-[#E7E5E4] border-l-4 border-l-[#B8860B] shadow-sm",
  academy: "bg-[#FAF8F5] border border-[#E7E5E4] border-l-4 border-l-[#B8860B] shadow-sm",
  pageant: "bg-[#FAF8F5] border border-[#E7E5E4] border-l-4 border-l-[#B8860B] shadow-sm",
  admin: "bg-[#FAF8F5] border border-[#E7E5E4] border-l-4 border-l-[#B8860B] shadow-sm",
  "talent-mgmt": "bg-[#FAF8F5] border border-[#E7E5E4] border-l-4 border-l-[#B8860B] shadow-sm",
}

export function PageBanner({
  title,
  subtitle,
  variant = "default",
  backgroundImage,
  backgroundVideo,
  showMedia = false,
  className,
}: PageBannerProps) {
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const isLight = variant in lightVariantStyles
  const lightStyle = isLight ? lightVariantStyles[variant as keyof typeof lightVariantStyles] : null
  const darkStyle = !isLight ? (darkVariantStyles[variant] ?? darkVariantStyles.default) : null
  const hasMedia = showMedia && !!(backgroundImage || backgroundVideo)

  if (isLight && lightStyle) {
    const isAgencies = ["modelling", "pageant", "talent-mgmt", "academy", "influencer", "admin"].includes(variant)
    const bannerBg = isDark ? "#111827" : "#FAF8F5"
    const bannerBorder = isDark ? "#1f2937" : "#E7E5E4"
    const titleColor = isAgencies ? (isDark ? "#F9FAFB" : "#1C1917") : (isDark ? "#F1F5F9" : "#1f2937")
    const subtitleColor = isAgencies ? (isDark ? "#9CA3AF" : "#57534E") : (isDark ? "#94A3B8" : "#64748b")
    return (
      <div
        className={cn(
          "relative min-w-0 overflow-hidden rounded-2xl border border-l-4 border-l-[#B8860B] px-8 py-10 shadow-sm sm:px-10 sm:py-12",
          className
        )}
        style={{
          backgroundColor: bannerBg,
          borderColor: bannerBorder,
          borderLeftColor: "#B8860B",
        }}
      >
        {/* Background media – fills right side */}
        {hasMedia && (
          <>
            <div className="absolute inset-0" style={{ backgroundColor: bannerBg }} />
            <div className="absolute inset-0 flex">
              <div className="w-1/2 min-w-[200px] shrink-0" />
              <div className="relative flex-1">
                {backgroundVideo ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    src={backgroundVideo}
                  />
                ) : backgroundImage ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
                ) : null}
                <div
                  className="absolute inset-0 bg-gradient-to-r to-transparent"
                  style={{
                    backgroundImage: isDark
                      ? "linear-gradient(to right, rgba(17,24,39,1), rgba(17,24,39,0.82), rgba(17,24,39,0))"
                      : "linear-gradient(to right, rgba(250,248,245,1), rgba(250,248,245,0.82), rgba(250,248,245,0))",
                  }}
                />
              </div>
            </div>
          </>
        )}
        <div className="relative">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: titleColor }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm sm:text-base" style={{ color: subtitleColor }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl px-8 py-10 sm:px-10 sm:py-12", !isDark && "border shadow-sm", darkStyle, className)}
      style={
        isDark
          ? undefined
          : {
              backgroundColor: "#ffffff",
              borderColor: "#e5e7eb",
            }
      }
    >
      {isDark && <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />}
      <div className="relative">
        <h1 className={cn("font-display text-3xl font-semibold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-slate-900")}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn("mt-2 max-w-xl text-sm sm:text-base", isDark ? "text-white/70" : "text-slate-600")}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
