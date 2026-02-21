"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getRecommendations } from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { Lightbulb, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function RecommendationsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecommendations(tenantId).then((data) => {
      setRecommendations(data)
      setLoading(false)
    })
  }, [tenantId])

  const totalImpact = recommendations.reduce((s, r) => s + (r.impactPts ?? 0), 0)

  return (
    <AgenciesPage>
      <PageBanner
        title="Recommendations"
        subtitle="Do these 3 things to gain WES points"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/ops-health">
          <Button variant="ghost" size="sm">
            ← Ops Health
          </Button>
        </Link>
      </div>

      <div className="mb-6 mt-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <p className="text-sm font-medium text-amber-800">
          Potential impact: +{totalImpact} WES points
        </p>
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Weekly recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : recommendations.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No recommendations. You're doing great!
            </p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                  style={{ borderColor: page.border }}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                      {r.priority}
                    </span>
                    <div>
                      <p className="font-medium" style={{ color: page.text }}>
                        {r.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{r.description}</p>
                      <span className="mt-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                        +{r.impactPts ?? 0} pts
                      </span>
                    </div>
                  </div>
                  {r.actionUrl && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={r.actionUrl}>
                        Action
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
