"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getWesOverview,
  getPillarLabel,
  getWesScoreColor,
  getWesScoreBgColor,
} from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { Activity, TrendingUp, TrendingDown, AlertCircle, Target, Zap } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function OpsHealthPage() {
  const { tenantId } = useTenant()
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWesOverview(tenantId).then((o) => {
      setOverview(o)
      setLoading(false)
    })
  }, [tenantId])

  const latest = overview?.latest
  const trend = overview?.trend ?? 0
  const pillars = latest?.pillars ?? {}

  const getScoreColor = (score: number) => {
    if (score >= 80) return "green"
    if (score >= 60) return "yellow"
    return "pink"
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Ops Health"
        subtitle="Workflow Execution Score (WES) and operational metrics"
        action={
          <Link href="/admin/ops-health/recommendations">
            <AdminButton>
              <Zap className="mr-2 h-4 w-4" />
              View Recommendations
            </AdminButton>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="WES Score"
          value={loading ? "—" : `${latest?.wesTotal ?? 0}/100`}
          subtitle={`${trend > 0 ? "+" : ""}${trend} vs last period`}
          icon={Activity}
          color={getScoreColor(latest?.wesTotal ?? 0) as any}
          trend={trend > 0 ? "up" : trend < 0 ? "down" : "neutral"}
          trendValue={`${Math.abs(trend)}`}
        />
        <AdminStatCard
          title="Pillars"
          value={Object.keys(pillars).length}
          subtitle="Tracked metrics"
          icon={Target}
          color="blue"
        />
        <AdminStatCard
          title="Period"
          value={latest?.period ?? "—"}
          subtitle="Current tracking"
          icon={TrendingUp}
          color="purple"
        />
        <AdminStatCard
          title="Status"
          value={latest?.wesTotal >= 80 ? "Healthy" : latest?.wesTotal >= 60 ? "Fair" : "Needs Attention"}
          subtitle="Overall health"
          icon={AlertCircle}
          color={getScoreColor(latest?.wesTotal ?? 0) as any}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/ops-health/bottlenecks">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-rose-500/10 p-2">
                <AlertCircle className="h-5 w-5 text-rose-400" />
              </div>
              <p className="font-semibold text-white">Bottlenecks</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/ops-health/cashflow">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="font-semibold text-white">Cashflow</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/ops-health/disputes">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <p className="font-semibold text-white">Disputes</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/ops-health/utilization">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <p className="font-semibold text-white">Utilization</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/ops-health/recommendations">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#d4ff00]/10 p-2">
                <Zap className="h-5 w-5 text-[#d4ff00]" />
              </div>
              <p className="font-semibold text-white">Recommendations</p>
            </div>
          </AdminCard>
        </Link>
      </div>

      {/* Pillar Breakdown */}
      <AdminCard>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Pillar Breakdown</h3>
            <p className="text-sm text-white/60">
              {latest?.period ?? "—"} · Max 100 pts across 7 pillars
            </p>
          </div>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(pillars).map(([key, value]: [string, any]) => {
              const score = value as number
              const isGood = score >= 80
              const isFair = score >= 60 && score < 80
              return (
                <div
                  key={key}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">
                    {getPillarLabel(key)}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isGood
                            ? "bg-emerald-400"
                            : isFair
                            ? "bg-yellow-400"
                            : "bg-rose-400"
                        }`}
                        style={{ width: `${Math.min(score * 2.5, 100)}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isGood
                          ? "text-emerald-400"
                          : isFair
                          ? "text-yellow-400"
                          : "text-rose-400"
                      }`}
                    >
                      {score}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
