"use client"

import * as React from "react"
import { useLocale } from "@/shared/context/LocaleContext"
import type { Locale } from "@/shared/context/LocaleContext"
import { Globe } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = React.useState(false)

  const locales: { code: Locale; label: string }[] = [
    { code: "en", label: t("locale.en") },
    { code: "hi", label: t("locale.hi") },
  ]

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-100"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 text-slate-600" />
        <span className="font-medium text-slate-700">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {locales.map((l) => (
              <li key={l.code} role="option" aria-selected={locale === l.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(l.code)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-slate-50",
                    locale === l.code && "bg-amber-50 font-medium text-amber-800"
                  )}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
