"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getDisputes, type Dispute } from "@/shared/services/modellingDisputeService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { AlertCircle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-700",
  EVIDENCE: "bg-blue-100 text-blue-700",
  ASSIGNED: "bg-slate-100 text-slate-600",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-500",
}

export default function ModellingDisputesPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }

  useEffect(() => {
    getDisputes(tenantId).then((data) => {
      setDisputes(data)
      setLoading(false)
    })
  }, [tenantId])

  const filtered = statusFilter
    ? disputes.filter((d) => d.status === statusFilter)
    : disputes

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Disputes</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Manage and resolve disputes</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle style={{ color: theme.text }}>Disputes</CardTitle>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              >
                <option value="">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="EVIDENCE">Evidence</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <LoadingSkeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <AlertCircle className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No disputes found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((d) => (
                  <Link
                    key={d._id}
                    href={`/modelling/disputes/${d._id}`}
                    className="block rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: theme.text }}>
                            {d.referenceType} · {d.referenceId}
                          </p>
                          <p className="text-sm" style={{ color: theme.textSecondary }}>{d.reason}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[d.status] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {d.status}
                        </span>
                        <span className="text-sm font-medium text-[#B8860B]">
                          {formatCurrency(d.amountMinor, d.currency)}
                        </span>
                      </div>
                      <span className="text-[#B8860B]">View</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
