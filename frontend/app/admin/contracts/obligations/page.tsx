"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getObligations, getContractById } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminLoading,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

export default function ContractObligationsPage() {
  const { tenantId } = useTenant()
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
    <AdminPageWrapper>
      <AdminPageLayout
        title="Obligations"
        subtitle="Deliverables, payments, renewals"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/contracts">
              <AdminButton variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Contracts
              </AdminButton>
            </Link>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-[#d4ff00] focus:outline-none"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        }
      >
        <AdminCard title="Obligations" subtitle={`${obligations.length} total obligations`}>
          {loading ? (
            <AdminLoading rows={5} />
          ) : obligations.length === 0 ? (
            <AdminEmptyState
              icon={AlertCircle}
              title="No obligations match your filters"
              description="Try adjusting your filter settings"
            />
          ) : (
            <div className="space-y-4">
              {obligations.map((o) => (
                <div
                  key={o._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{o.title}</p>
                      <p className="text-sm text-white/60">{o.type} · Due {o.dueDate}</p>
                      {contracts[o.contractId] && (
                        <Link href={`/admin/contracts/${o.contractId}`} className="block text-sm text-[#d4ff00] hover:underline">
                          {contracts[o.contractId].projectName}
                        </Link>
                      )}
                    </div>
                    <AdminBadge variant={o.status === "COMPLETED" ? "success" : "warning"}>
                      {o.status}
                    </AdminBadge>
                  </div>
                  <Link href={`/admin/contracts/${o.contractId}`}>
                    <AdminButton variant="secondary" size="sm">View Contract</AdminButton>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
