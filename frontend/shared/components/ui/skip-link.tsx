"use client"

/**
 * Skip link for keyboard/screen reader users – jumps to main content.
 * Visible on focus for accessibility.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  )
}
