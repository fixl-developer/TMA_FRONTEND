"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const DEFAULT_GRADIENTS: Record<string, string> = {
  gold: "from-[#E4A853] via-[#B8860B] to-[#9A7209]",
  coral: "from-[#E07C5C] via-[#B8860B] to-[#9A7209]",
  teal: "from-[#0D9488] via-[#B8860B] to-[#9A7209]",
}

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  imageUrl?: string
  videoUrl?: string
  gradient?: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoRotateMs?: number
  /** Role-specific gradients (extends defaults) */
  gradients?: Record<string, string>
  className?: string
}

export function HeroCarousel({ slides, autoRotateMs = 6000, gradients: customGradients, className }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [videoError, setVideoError] = React.useState<Record<number, boolean>>({})
  const gradients = React.useMemo(() => ({ ...DEFAULT_GRADIENTS, ...customGradients }), [customGradients])

  React.useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setActiveIndex((i) => (i + 1) % slides.length), autoRotateMs)
    return () => clearInterval(t)
  }, [slides.length, autoRotateMs])

  if (slides.length === 0) return null

  const slide = slides[activeIndex]
  const gradient = (slide.gradient && gradients[slide.gradient]) ?? gradients.gold
  const showVideo = slide.videoUrl && !videoError[activeIndex]

  return (
    <div className={cn("relative min-w-0 overflow-hidden rounded-2xl", className)}>
      <div
        className={cn(
          "relative flex min-h-[200px] items-center justify-between px-8 py-10 sm:min-h-[240px] sm:px-12 sm:py-14",
          !showVideo && "bg-gradient-to-r",
          !showVideo && gradient
        )}
      >
        {showVideo && (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={slide.imageUrl}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setVideoError((prev) => ({ ...prev, [activeIndex]: true }))}
            >
              <source src={slide.videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </>
        )}
        {slide.videoUrl && !showVideo && (
          <>
            {slide.imageUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </>
        )}
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="mt-2 text-sm text-white/90 sm:text-base">{slide.subtitle}</p>
          )}
          {slide.ctaLabel && slide.ctaHref && (
            <Link
              href={slide.ctaHref}
              className="mt-4 inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#B8860B] shadow-md transition hover:bg-white/95"
            >
              {slide.ctaLabel}
            </Link>
          )}
        </div>
        {slide.imageUrl && (
          <div className="relative z-10 hidden w-48 shrink-0 sm:block lg:w-56">
            <div className="aspect-square overflow-hidden rounded-xl border-2 border-white/30 shadow-xl">
              <img
                src={slide.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="group absolute left-4 top-1/2 z-20 -translate-y-1/2 text-white drop-shadow-lg transition-all duration-300 hover:scale-125 hover:opacity-100 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i + 1) % slides.length)}
            className="group absolute right-4 top-1/2 z-20 -translate-y-1/2 text-white drop-shadow-lg transition-all duration-300 hover:scale-125 hover:opacity-100 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8 transition-transform group-hover:translate-x-0.5" />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  i === activeIndex ? "w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "w-2.5 bg-white/50 hover:bg-white/80 hover:scale-110"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
