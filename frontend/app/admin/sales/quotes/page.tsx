"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getQuotes, getAccountById, formatCurrency } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileText, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  SENT: "bg-blue-100 text-blue-700 border-blue-200",
  ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REVISED: "bg-amber-100 text-amber-700 border-amber-200",
  EXPIRED: "bg-red-100 text-red-700 border-red-200",
}

export default function SalesQuotesPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
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
    <AgenciesPage>
      <PageBanner
        title="Quotes"
        subtitle="Proposals, quotes, client acceptance."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/admin/sales">
          <Button variant="ghost" size="sm">← Sales</Button>
        </Link>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REVISED">Revised</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
          <Link href="/admin/sales/quotes/create">Create quote</Link>
        </Button>
      </div>
      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle>Quote list</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading quotes…</p>
          ) : quotes.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No quotes match your filters.</p>
          ) : (
            <div className="space-y-4">
              {quotes.map((q) => (
                <Link key={q._id} href={`/admin/sales/quotes/${q._id}`}>
                  <div
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-slate-50"
                    style={{ borderColor: page.border }}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold" style={{ color: page.text }}>{q.quoteNumber}</p>
                        <p className="text-sm text-slate-500">{accounts[q.accountId]?.name ?? "Account"}</p>
                        <p className="text-xs text-slate-500">Valid until {q.validUntil}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[q.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {q.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-600">{formatCurrency(q.totalMinor, q.currency)}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
