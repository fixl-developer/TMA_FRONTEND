"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getQuotes, getAccountById, formatCurrency } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileText, ChevronRight, ArrowLeft, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminLoading,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  DRAFT: "default",
  SENT: "info",
  ACCEPTED: "success",
  REVISED: "warning",
  EXPIRED: "danger",
}

export default function SalesQuotesPage() {
  const { tenantId } = useTenant()
  const [quotes, setQuotes] = useState<any[]>([])
  const [accounts, setAccounts] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    getQuotes(tenantId, statusFilter ? { status: statusFilter } : undefined).then(async (data) => {
      setQuotes(data)
      const accMap: Record<string, any> = {}
      for (const q of data) {
        if (q.accountId && !accMap[q.accountId]) {
          accMap[q.accountId] = await getAccountById(q.accountId)
        }
      }
      setAccounts(accMap)
      setLoading(false)
    })
  }, [tenantId, statusFilter])

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Quotes"
        subtitle="Proposals, quotes, client acceptance"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/sales">
              <AdminButton variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Sales
              </AdminButton>
            </Link>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-[#d4ff00] focus:outline-none"
            >
              <option value="">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REVISED">Revised</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <Link href="/admin/sales/quotes/create">
              <AdminButton>
                <Plus className="h-4 w-4" />
                Create Quote
              </AdminButton>
            </Link>
          </div>
        }
      >
        <AdminCard title="Quote List" subtitle={`${quotes.length} total quotes`}>
          {loading ? (
            <AdminLoading rows={5} />
          ) : quotes.length === 0 ? (
            <AdminEmptyState
              icon={FileText}
              title="No quotes match your filters"
              description="Try adjusting your filter settings"
              action={
                <Link href="/admin/sales/quotes/create">
                  <AdminButton>Create Quote</AdminButton>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {quotes.map((q) => (
                <Link key={q._id} href={`/admin/sales/quotes/${q._id}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                        <FileText className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{q.quoteNumber}</p>
                        <p className="text-sm text-white/60">{accounts[q.accountId]?.name ?? "Account"}</p>
                        <p className="text-xs text-white/40">Valid until {q.validUntil}</p>
                      </div>
                      <AdminBadge variant={STATUS_VARIANT[q.status] ?? "default"}>
                        {q.status}
                      </AdminBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#d4ff00]">
                        {formatCurrency(q.totalMinor, q.currency)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
