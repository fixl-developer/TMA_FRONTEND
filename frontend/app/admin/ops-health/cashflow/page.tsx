"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getCccMetrics } from "@/shared/services/opsHealthService"
import { useTenant } from "@/shared/context/TenantContext"
import { DollarSign, TrendingUp, AlertCircle, ArrowLeft } from "lucide-react"

export default function CashflowPage() {
  const { tenantId } = useTenant()
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCccMetrics(tenantId).then((data) => {
      setMetrics(data)
      setLoading(false)
    })
  }, [tenantId])

  const latest = metrics[0]

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
            <h1 className="text-4xl font-bold text-white">Cashflow</h1>
            <p className="mt-2 text-base text-white/60">Cash Conversion Cycle (CCC) & overdue invoices</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">CCC (days)</p>
                  <p className="mt-1 text-sm text-white/60">Target: {latest?.targetDays ?? 21} days</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : latest?.cccDays ?? 0}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Overdue invoices</p>
                  <p className="mt-1 text-sm text-white/60">
                    {latest ? `${(latest.overdueInvoiceRate * 100).toFixed(0)}% of ${latest.totalInvoices}` : ""}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : latest?.overdueCount ?? 0}</p>
            </div>
          </div>
        </div>

        {/* CCC Trend */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-bold text-white">CCC trend</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : metrics.length === 0 ? (
            <div className="py-12 text-center">
              <TrendingUp className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">No CCC data</p>
              <p className="mt-1 text-sm text-white/40">Cash conversion cycle metrics will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                >
                  <span className="font-medium text-white">{m.period}</span>
                  <span
                    className={
                      m.cccDays > m.targetDays ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"
                    }
                  >
                    {m.cccDays} days
                  </span>
                  <span className="text-sm text-white/60">{m.overdueCount} overdue</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
