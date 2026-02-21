"use client"

import * as React from "react"

export type Locale = "en" | "hi"

const LOCALE_KEY = "talentos-locale"

const messages: Record<Locale, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.bookings": "Bookings",
    "nav.content": "Content",
    "nav.wallet": "Wallet",
    "mobile.title": "Mobile",
    "mobile.subtitle": "Talent & Brand – mobile-optimized",
    "mobile.welcome": "Welcome",
    "mobile.quickActions": "Quick actions",
    "locale.en": "English",
    "locale.hi": "हिंदी",
  },
  hi: {
    "nav.dashboard": "डैशबोर्ड",
    "nav.bookings": "बुकिंग",
    "nav.content": "कंटेंट",
    "nav.wallet": "वॉलेट",
    "mobile.title": "मोबाइल",
    "mobile.subtitle": "टैलेंट और ब्रांड – मोबाइल अनुकूल",
    "mobile.welcome": "स्वागत है",
    "mobile.quickActions": "त्वरित कार्य",
    "locale.en": "English",
    "locale.hi": "हिंदी",
  },
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en")

  React.useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null
    if (stored && (stored === "en" || stored === "hi")) setLocaleState(stored)
  }, [])

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(LOCALE_KEY, l)
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "hi" ? "hi" : "en"
    }
  }, [])

  const t = React.useCallback(
    (key: string) => messages[locale][key] ?? key,
    [locale]
  )

  const value = React.useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = React.useContext(LocaleContext)
  if (!ctx) return { locale: "en" as Locale, setLocale: () => {}, t: (k: string) => k }
  return ctx
}
