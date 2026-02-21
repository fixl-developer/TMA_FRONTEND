"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getSegments } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { Layers } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function CrmSegmentsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [segments, setSegments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSegments(tenantId).then((data) => {
      setSegments(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <PageBanner
        title="Segments"
        subtitle="Account segments by criteria."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/crm">
          <Button variant="ghost" size="sm">← CRM</Button>
        </Link>
      </div>
      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle>Segment list</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading segments…</p>
          ) : segments.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No segments defined yet.</p>
          ) : (
            <div className="space-y-4">
              {segments.map((s) => (
                <div
                  key={s._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-slate-50"
                  style={{ borderColor: page.border }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <Layers className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold" style={{ color: page.text }}>{s.name}</p>
                      <p className="text-sm text-slate-500">{s.description}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {s.count ?? 0} accounts
                      </p>
                    </div>
                  </div>
                  <Button disabled variant="outline" size="sm">
                    View accounts (coming soon)
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
