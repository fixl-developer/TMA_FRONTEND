"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { getTenantTransactions } from "@/shared/services/tenantFinanceService"
import { ArrowDownLeft, ArrowUpRight, Download, RefreshCcw, Filter } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import { format } from "date-fns"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  SETTLED: "success",
  PENDING: "warning",
  FAILED: "danger",
  PROCESSING: "info",
}

const TYPE_LABELS: Record<string, string> = {
  PAGEANT_FEE: "Pageant Fee",
  PAYOUT_TALENT: "Talent Payout",
  CAMPAIGN_BUDGET: "Campaign Budget",
  ESCROW_FUND: "Escrow Fund",
  ESCROW_RELEASE: "Escrow Release",
  INVOICE_PAYMENT: "Invoice Payment",
  REFUND: "Refund",
  COMMISSION: "Commission",
  PLATFORM_FEE: "Platform Fee",
}

function exportCsv(transactions: any[]) {
  const headers = ["ID", "Date", "Type", "Direction", "Description", "Amount", "Currency", "Status"]
  const rows = transactions.map((t) => [
    t._id,
    t.createdAt ? format(new Date(t.createdAt), "yyyy-MM-dd") : "",
    t.type,
    t.direction,
    `"${t.description?.replace(/"/g, "'') ?? ""}"`,
    (t.amountMinor / 100).toFixed(2),
    t.currency,
    t.status,
  ])
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `transactions_${format(new Date(), "yyyyMMdd")}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dirFilter, setDirFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    getTenantTransactions().then((data) => {
      setTransactions(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (dirFilter !== "ALL" && t.direction !== dirFilter) return false
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false
      if (dateFrom && t.createdAt < dateFrom) return false
      if (dateTo && t.createdAt > dateTo + "T23:59:59") return false
      if (search) {
        const q = search.toLowerCase()
        if (!t.description?.toLowerCase().includes(q) && !t.type?.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [transactions, dirFilter, statusFilter, dateFrom, dateTo, search])

  const totalInbound = filtered.filter((t) => t.direction === "INBOUND").reduce((s, t) => s + t.amountMinor, 0)
  const totalOutbound = filtered.filter((t) => t.direction === "OUTBOUND").reduce((s, t) => s + t.amountMinor, 0)
  const pendingCount = transactions.filter((t) => t.status === "PENDING").length

  // Running balance (sorted by date)
  const sorted = [...filtered].sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""))
  let running = 0
  const withBalance = sorted.map((t) => {
    running += t.direction === "INBOUND" ? t.amountMinor : -t.amountMinor
    return { ...t, runningBalance: running }
  }).reverse()

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Transaction History"
        subtitle="All wallet transactions — filter, search, and export"
        action={
          <div className="flex gap-2">
            <Link href="/admin/wallet">
              <AdminButton variant="ghost">← Wallet</AdminButton>
            </Link>
            <AdminButton variant="secondary" onClick={() => exportCsv(filtered)}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </AdminButton>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Total Inbound" value={formatCurrency(totalInbound, "INR")} subtitle={`${filtered.filter((t) => t.direction === "INBOUND").length} transactions`} icon={ArrowDownLeft} color="green" />
        <AdminStatCard title="Total Outbound" value={formatCurrency(totalOutbound, "INR")} subtitle={`${filtered.filter((t) => t.direction === "OUTBOUND").length} transactions`} icon={ArrowUpRight} color="purple" />
        <AdminStatCard title="Pending" value={pendingCount} subtitle="Awaiting settlement" icon={RefreshCcw} color="yellow" />
      </div>

      <AdminCard>
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Input
              placeholder="Search description or type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/20 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={dirFilter} onValueChange={setDirFilter}>
            <SelectTrigger className="w-[140px] border-white/20 bg-white/5 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All directions</SelectItem>
              <SelectItem value="INBOUND">Inbound</SelectItem>
              <SelectItem value="OUTBOUND">Outbound</SelectItem>
              <SelectItem value="INTERNAL">Internal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] border-white/20 bg-white/5 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="SETTLED">Settled</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[140px] border-white/20 bg-white/5 text-white" />
            <span className="text-white/30">—</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[140px] border-white/20 bg-white/5 text-white" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : withBalance.length === 0 ? (
          <AdminEmptyState icon={Filter} title="No transactions match" description="Try adjusting your filters." />
        ) : (
          <AdminTable headers={["", "Description", "Type", "Date", "Amount", "Balance", "Status"]}>
            {withBalance.map((t) => (
              <AdminTableRow key={t._id}>
                <td className="px-4 py-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.direction === "INBOUND" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                    {t.direction === "INBOUND"
                      ? <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                      : <ArrowUpRight className="h-4 w-4 text-rose-400" />
                    }
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{t.description}</p>
                  <p className="text-xs text-white/40">{t._id}</p>
                </td>
                <td className="px-6 py-4 text-xs text-white/60">
                  {TYPE_LABELS[t.type] ?? t.type}
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  {t.createdAt ? format(new Date(t.createdAt), "MMM d, yyyy") : "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${t.direction === "INBOUND" ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.direction === "INBOUND" ? "+" : "−"}{formatCurrency(t.amountMinor, t.currency)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-white/70">
                  {formatCurrency(t.runningBalance, t.currency)}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={STATUS_VARIANT[t.status] ?? "default"}>
                    {t.status}
                  </AdminBadge>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
