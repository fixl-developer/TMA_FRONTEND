"use client"

import { useEffect, useState, useMemo } from "react"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getContracts, type Contract } from "@/shared/services/contractService"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { FilterPanel } from "@/shared/components/ui/filter-panel"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const DEMO_TENANT = "tenant_001"
const statusColors: Record<string, string> = {
  SIGNED: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  PENDING: "bg-amber-100 text-amber-600 border-amber-500/40",
}

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

export default function TalentMgmtContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  useEffect(() => {
    getContracts().then((data) => {
      setContracts((data as Contract[]).filter((c) => c.tenantId === DEMO_TENANT))
      setLoading(false)
    })
  }, [])

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(contracts.map((c) => c.status))]
    return statuses.map((s) => ({ value: s, label: s }))
  }, [contracts])

  const filteredContracts = useMemo(() => {
    let out = contracts
    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter(
        (c) =>
          c.projectName?.toLowerCase().includes(q) ||
          c.clientName?.toLowerCase().includes(q) ||
          c.talentId?.toLowerCase().includes(q)
      )
    }
    if (statusFilter.length > 0) {
      out = out.filter((c) => statusFilter.includes(c.status))
    }
    return out
  }, [contracts, search, statusFilter])

  const contractColumns: Column<Contract>[] = [
    { key: "projectName", header: "Project", sortable: true },
    { key: "clientName", header: "Client", sortable: true },
    { key: "talentId", header: "Talent", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (val) => (
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[val as string] ?? "bg-[#E7E5E4]/60 text-[#57534E]"}`}>
          {String(val)}
        </span>
      ),
    },
    {
      key: "amountMinor",
      header: "Amount",
      sortable: true,
      render: (val, row) => formatCurrency(val as number, row.currency),
    },
    {
      key: "signedAt",
      header: "Signed",
      sortable: true,
      render: (val) => (val ? new Date(val as string).toLocaleDateString("en-IN") : "—"),
    },
  ]

  return (
    <AgenciesPage>
      <PageBanner title="Contracts" subtitle="Templates, e-sign, commission rules." variant="talent-mgmt" backgroundImage="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80" />
      <section className="mt-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 shrink-0">
            <FilterPanel
              searchPlaceholder="Search contracts…"
              searchValue={search}
              onSearchChange={setSearch}
              multiSelectFilters={
                statusOptions.length > 0
                  ? [
                      {
                        key: "status",
                        label: "Status",
                        options: statusOptions,
                        selected: statusFilter,
                        onSelectionChange: setStatusFilter,
                      },
                    ]
                  : []
              }
            />
          </aside>
          <div className="min-w-0 flex-1">
            <Card className="border-[#E7E5E4]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1C1917]">Contracts</CardTitle>
                <Button className="bg-teal-500 text-slate-900 hover:bg-teal-400">New contract</Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="py-8 text-center text-slate-500">Loading contracts…</p>
                ) : (
                  <DataTable
                    data={filteredContracts}
                    columns={contractColumns}
                    pageSize={10}
                    exportable
                    exportFileName="contracts"
                    emptyMessage="No contracts yet."
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
