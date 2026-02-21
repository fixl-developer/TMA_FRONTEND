"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getBottlenecks } from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function BottlenecksPage() {
  const { tenantId } = useTenant()
  const [bottlenecks, setBottlenecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBottlenecks(tenantId).then((data) => {
      setBottlenecks(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
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
            <h1 className="text-4xl font-bold text-white">Bottlenecks</h1>
            <p className="mt-2 text-base text-white/60">Stage time ratios – where work gets stuck</p>
          </div>
        </div>

        {/* Bottlenecks List */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Top bottlenecks (ratio &gt; 1 = over target)</h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : bottlenecks.length === 0 ? (
            <div className="py-12 text-center">
              <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">No bottleneck data</p>
              <p className="mt-1 text-sm text-white/40">Bottlenecks will appear when stage times exceed targets</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bottlenecks.map((b) => (
                <div
                  key={b._id}
                  className={`flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all ${
                    (b.stageTimeRatio ?? 0) > 1
                      ? "border-amber-500/30 bg-amber-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div>
                    <p className="font-medium text-white">
                      {b.objectType} · {b.stage}
                    </p>
                    <p className="text-sm text-white/60">
                      Ratio: {(b.stageTimeRatio ?? 0).toFixed(2)}x · Target {b.targetHours}h · Actual{" "}
                      {b.medianActualHours}h median · {b.itemCount} items
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      (b.stageTimeRatio ?? 0) > 1
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {(b.stageTimeRatio ?? 0) > 1 ? "Over target" : "On target"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
