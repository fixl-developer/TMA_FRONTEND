"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getObligations, getContractById } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { AlertCircle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function ContractObligationsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [obligations, setObligations] = useState<any[]>([])
  const [contracts, setContracts] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      const list = await getObligations(tenantId, statusFilter ? { status: statusFilter } : undefined)
      setObligations(list)
      const contractMap: Record<string, any> = {}
      for (const o of list) {
        if (o.contractId && !contractMap[o.contractId]) {
          contractMap[o.contractId] = await getContractById(o.contractId)
        }
      }
      setContracts(contractMap)
      setLoading(false)
    }
    load()
  }, [tenantId, statusFilter])

  return (
    <AgenciesPage>
      <PageBanner
        title="Obligations"
        subtitle="Deliverables, payments, renewals."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/admin/contracts">
          <Button variant="ghost" size="sm">← Contracts</Button>
        </Link>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Obligations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : obligations.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No obligations match your filters.</p>
          ) : (
            <div className="space-y-4">
              {obligations.map((o) => (
                <div
                  key={o._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
                  style={{ borderColor: page.border }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold" style={{ color: page.text }}>{o.title}</p>
                      <p className="text-sm text-slate-500">{o.type} · Due {o.dueDate}</p>
                      {contracts[o.contractId] && (
                        <Link href={`/admin/contracts/${o.contractId}`} className="block text-sm text-amber-600 hover:underline">
                          {contracts[o.contractId].projectName}
                        </Link>
                      )}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {o.status}
                    </span>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/contracts/${o.contractId}`}>View contract</Link>
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
