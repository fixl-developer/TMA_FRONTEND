"use client"

import { useEffect, useState, useMemo } from "react"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getRecentTransactions } from "@/shared/services/financeService"
import { seedWallets } from "@/data/seed"
import { Wallet } from "lucide-react"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { FilterPanel } from "@/shared/components/ui/filter-panel"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const DEMO_TENANT = "tenant_001"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(Math.abs(amountMinor) / 100)
}

type Transaction = { _id: string; tenantId?: string; type: string; direction: string; amountMinor: number; currency: string; description: string; status: string; createdAt: string }

export default function TalentMgmtLedgerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [directionFilter, setDirectionFilter] = useState<string[]>([])

  useEffect(() => {
    getRecentTransactions().then((data) => {
      setTransactions((data as Transaction[]).filter((t) => t.tenantId === DEMO_TENANT))
      setLoading(false)
    })
  }, [])

  const tenantWallet = (seedWallets as any[]).find((w) => w.scope === "TENANT" && w.tenantId === DEMO_TENANT)
  const balance = tenantWallet?.balanceMinor ?? 0

  const filteredTransactions = useMemo(() => {
    let out = transactions
    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          t.type?.toLowerCase().includes(q)
      )
    }
    if (directionFilter.length > 0) {
      out = out.filter((t) => directionFilter.includes(t.direction))
    }
    return out
  }, [transactions, search, directionFilter])

  const directionOptions = [
    { value: "INBOUND", label: "Inbound" },
    { value: "OUTBOUND", label: "Outbound" },
  ]

  const transactionColumns: Column<Transaction>[] = [
    { key: "description", header: "Description", sortable: true },
    { key: "type", header: "Type", sortable: true },
    {
      key: "direction",
      header: "Direction",
      sortable: true,
      render: (val) => (
        <span className={val === "INBOUND" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
          {String(val)}
        </span>
      ),
    },
    {
      key: "amountMinor",
      header: "Amount",
      sortable: true,
      render: (val, row) => (
        <span className={row.direction === "INBOUND" ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
          {row.direction === "INBOUND" ? "+" : "-"}{formatCurrency(val as number, row.currency)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (val) => (
        <span className={`text-xs ${val === "SETTLED" ? "text-slate-500" : "text-amber-600"}`}>{String(val)}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (val) => new Date(val as string).toLocaleDateString("en-IN"),
    },
  ]

  return (
    <AgenciesPage>
      <PageBanner title="Ledger" subtitle="Wallet, transactions, payouts." variant="talent-mgmt" backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80" />
      <section className="mt-8">
        <Card className="mb-6 border-[#E7E5E4]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#1C1917]">Wallet balance</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20"><Wallet className="h-5 w-5 text-teal-600" /></div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teal-600">₹{(balance / 100).toLocaleString("en-IN")}</p>
            <p className="mt-1 text-sm text-slate-500">INR · Tenant wallet</p>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 shrink-0">
            <FilterPanel
              searchPlaceholder="Search transactions…"
              searchValue={search}
              onSearchChange={setSearch}
              multiSelectFilters={[
                {
                  key: "direction",
                  label: "Direction",
                  options: directionOptions,
                  selected: directionFilter,
                  onSelectionChange: setDirectionFilter,
                },
              ]}
            />
          </aside>
          <div className="min-w-0 flex-1">
            <Card className="border-[#E7E5E4]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1C1917]">Recent transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="py-8 text-center text-slate-500">Loading…</p>
                ) : (
                  <DataTable
                    data={filteredTransactions}
                    columns={transactionColumns}
                    pageSize={10}
                    exportable
                    exportFileName="ledger-transactions"
                    emptyMessage="No transactions yet."
                    variant="agencies"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </AgenciesPage>
  )
}
