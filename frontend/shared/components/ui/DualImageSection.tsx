"use client"

import Image from "next/image"

interface DualImageSectionProps {
  images: { src: string; alt: string }[]
  className?: string
}

export function DualImageSection({ images, className = "" }: DualImageSectionProps) {
  if (images.length === 0) return null

  return (
    <section className={`relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/50 ${className}`}>
      <div className="flex h-[240px] w-full gap-4 p-4 sm:h-[280px] sm:p-6">
        {images.map((img, i) => (
          <div key={i} className="relative min-h-0 flex-1 min-w-0 overflow-hidden">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-contain object-center"
              priority={i === 0}
              sizes="(max-width: 1600px) 50vw, 800px"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
