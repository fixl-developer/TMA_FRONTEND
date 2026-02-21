"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getContractTemplates, getClauses } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { LayoutTemplate, FileText } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function ContractTemplatesPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [templates, setTemplates] = useState<any[]>([])
  const [clauses, setClauses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getContractTemplates(tenantId),
      getClauses(tenantId),
    ]).then(([t, c]) => {
      setTemplates(t)
      setClauses(c)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <PageBanner
        title="Contract templates"
        subtitle="Templates and clause library."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/contracts">
          <Button variant="ghost" size="sm">← Contracts</Button>
        </Link>
        <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
          <Link href="/admin/contracts/create">Create contract</Link>
        </Button>
      </div>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
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
                      <p className="mt-1 text-xs text-slate-500">{(t.clauseIds ?? []).length} clauses</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/contracts/create?template=${t._id}`}>Use template</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Clause library
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : clauses.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No clauses yet.</p>
          ) : (
            <div className="space-y-4">
              {clauses.map((c) => (
                <div
                  key={c._id}
                  className="rounded-xl border p-4"
                  style={{ borderColor: page.border }}
                >
                  <p className="font-semibold" style={{ color: page.text }}>{c.name}</p>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{c.content}</p>
                  <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs">{c.category}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
