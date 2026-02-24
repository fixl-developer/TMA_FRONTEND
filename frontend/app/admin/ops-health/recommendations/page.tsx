"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getRecommendations } from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { Lightbulb, ChevronRight, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminTableSkeleton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function RecommendationsPage() {
  const { tenantId } = useTenant()
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
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Recommendations"
        subtitle="Do these 3 things to gain WES points"
        action={
          <Link href="/admin/ops-health">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Ops Health
            </AdminButton>
          </Link>
        }
      />

      <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
        <p className="text-sm font-medium text-yellow-400">
          Potential impact: +{totalImpact} WES points
        </p>
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Weekly recommendations</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={5} cols={2} />
        ) : recommendations.length === 0 ? (
          <AdminEmptyState
            icon={Lightbulb}
            title="No recommendations"
            description="You're doing great! No recommendations at this time."
          />
        ) : (
          <div className="space-y-4">
            {recommendations.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-sm font-bold text-yellow-400">
                    {r.priority}
                  </span>
                  <div>
                    <p className="font-medium text-white">
                      {r.title}
                    </p>
                    <p className="mt-1 text-sm text-white/60">{r.description}</p>
                    <AdminBadge variant="success" className="mt-2">
                      +{r.impactPts ?? 0} pts
                    </AdminBadge>
                  </div>
                </div>
                {r.actionUrl && (
                  <Link href={r.actionUrl}>
                    <AdminButton size="sm" variant="secondary">
                      Action
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </AdminButton>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
