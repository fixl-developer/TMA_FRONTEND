"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getQuoteTemplates } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { LayoutTemplate } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function SalesTemplatesPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuoteTemplates(tenantId).then((data) => {
      setTemplates(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <PageBanner
        title="Quote templates"
        subtitle="Pre-built templates for quotes."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/sales">
          <Button variant="ghost" size="sm">← Sales</Button>
        </Link>
        <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
          <Link href="/admin/sales/quotes/create">Create quote</Link>
        </Button>
      </div>
      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle>Template library</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading templates…</p>
          ) : templates.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No templates yet.</p>
          ) : (
            <div className="space-y-4">
              {templates.map((t) => (
                <div
                  key={t._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
                  style={{ borderColor: page.border }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <LayoutTemplate className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold" style={{ color: page.text }}>{t.name}</p>
                      <p className="text-sm text-slate-500">{t.description}</p>
                      <p className="mt-1 text-xs text-slate-500">Category: {t.category} · Valid {t.defaultValidDays ?? 14} days</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/sales/quotes/create?template=${t._id}`}>Use template</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
