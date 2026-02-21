"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

export interface CarouselSlide {
  src: string
  alt: string
}

interface ImageCarouselProps {
  slides: CarouselSlide[]
  intervalMs?: number
  className?: string
}

export function ImageCarousel({ slides, intervalMs = 3000, className = "" }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(goNext, intervalMs)
    return () => clearInterval(id)
  }, [goNext, intervalMs, slides.length])

  if (slides.length === 0) return null

  return (
    <section className={`relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/50 ${className}`}>
      <div className="relative h-[240px] w-full sm:h-[280px]">
        <Image
          src={slides[current].src}
          alt={slides[current].alt}
          fill
          className="object-contain object-top transition-opacity duration-300"
          priority={current === 0}
          sizes="(max-width: 1600px) 100vw, 1600px"
        />
        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={goNext}
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
