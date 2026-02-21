import * as React from "react"
import { cn } from "@/shared/lib/utils"

export function PageLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={cn("min-h-full bg-slate-950", className)}>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </main>
  )
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  )
}

export function PageSection({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mb-8", className)}>
      {title && <h2 className="mb-4 text-sm font-semibold text-slate-300 sm:text-base">{title}</h2>}
      {children}
    </section>
  )
}

export function MetricsGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
}
