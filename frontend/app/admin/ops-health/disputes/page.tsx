"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getDisputeMetrics } from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { AlertCircle, CheckCircle, Clock, ArrowLeft } from "lucide-react"

export default function DisputesHealthPage() {
  const { tenantId } = useTenant()
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDisputeMetrics(tenantId).then((m) => {
      setMetrics(m)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/ops-health">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ops Health
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Disputes</h1>
            <p className="mt-2 text-base text-white/60">Dispute rate & resolution time</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Open disputes</p>
                  <p className="mt-1 text-sm text-white/60">Needs resolution</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : metrics?.open ?? 0}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Resolved</p>
                  <p className="mt-1 text-sm text-white/60">Successfully closed</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : metrics?.resolved ?? 0}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Resolution time</p>
                  <p className="mt-1 text-sm text-white/60">Median days</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : metrics?.resolutionDays ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Dispute Metrics */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-bold text-white">Dispute metrics</h3>
          {loading ? (
            <p className="py-8 text-center text-white/50">Loading…</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                Lower dispute rate and faster resolution improve WES. Total disputes: {metrics?.total ?? 0}.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total Disputes</p>
                  <p className="mt-2 text-2xl font-bold text-white">{metrics?.total ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Resolution Rate</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">
                    {metrics?.total > 0
                      ? `${((metrics.resolved / metrics.total) * 100).toFixed(0)}%`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
