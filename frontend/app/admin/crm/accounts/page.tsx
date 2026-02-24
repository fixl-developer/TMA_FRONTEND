"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getAccounts } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { Building2, ChevronRight, ArrowLeft, Filter } from "lucide-react"

const typeColors: Record<string, string> = {
  BRAND: "bg-purple-500/20 text-purple-300",
  CLIENT: "bg-blue-500/20 text-blue-300",
  PARTNER: "bg-emerald-500/20 text-emerald-300",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-300",
  PENDING: "bg-amber-500/20 text-amber-300",
}

export default function CrmAccountsPage() {
  const { tenantId } = useTenant()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>("")

  useEffect(() => {
    getAccounts(tenantId, typeFilter ? { type: typeFilter } : undefined).then((data) => {
      setAccounts(data)
      setLoading(false)
    })
  }, [tenantId, typeFilter])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Accounts</h1>
          <p className="mt-2 text-base text-white/60">Clients, brands, and partners</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link href="/admin/crm">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              CRM
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/50" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-md"
            >
              <option value="" className="bg-[#1a0b2e] text-white">All types</option>
              <option value="BRAND" className="bg-[#1a0b2e] text-white">Brand</option>
              <option value="CLIENT" className="bg-[#1a0b2e] text-white">Client</option>
              <option value="PARTNER" className="bg-[#1a0b2e] text-white">Partner</option>
            </select>
          </div>
        </div>

        {/* Account List */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-bold text-white">Account list</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <div className="py-12 text-center">
              <Building2 className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">No accounts match your filters</p>
              <p className="mt-1 text-sm text-white/40">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((a) => (
                <Link key={a._id} href={`/admin/crm/accounts/${a._id}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <Building2 className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{a.name}</p>
                        <p className="text-sm text-white/60">{a.industry}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[a.type] ?? "bg-white/10 text-white/60"}`}>
                            {a.type}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[a.status] ?? "bg-white/10 text-white/60"}`}>
                            {a.status}
                          </span>
                          {a.ndaStatus === "SIGNED" && (
                            <span className="text-xs text-emerald-400">NDA ✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
