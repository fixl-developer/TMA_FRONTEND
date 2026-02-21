"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  getVendors,
  getVendorTypeLabel,
} from "@/shared/services/vendorService"
import { useTenant } from "@/shared/context/TenantContext"
import { Truck, ChevronRight, AlertTriangle, Search, Star } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminPagination,
  AdminSearchBar,
} from "@/shared/components/layout/AdminPageWrapper"
import vendorScorecards from "@/data/seed/vendor_scorecards.json"

const PAGE_SIZE = 6

export default function VendorsPage() {
  const { tenantId } = useTenant()
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [page, setPage] = useState(1)

  useEffect(() => {
    getVendors(tenantId).then((data) => {
      setVendors(data)
      setLoading(false)
    })
  }, [tenantId])

  const verifiedCount = vendors.filter((v) => v.status === "VERIFIED").length
  const pendingCount = vendors.filter((v) => v.status === "PENDING").length

  const categories = useMemo(() => {
    const types = [...new Set(vendors.map((v) => v.type).filter(Boolean))]
    return types
  }, [vendors])

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (search && !v.name?.toLowerCase().includes(search.toLowerCase()) && !v.contactName?.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter !== "ALL" && v.type !== categoryFilter) return false
      return true
    })
  }, [vendors, search, categoryFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function getScorecardBadge(vendorId: string) {
    const sc = (vendorScorecards as any[]).find((s) => s.vendorId === vendorId)
    if (!sc) return null
    return sc.overall
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "VERIFIED": return "success"
      case "PENDING": return "warning"
      case "REJECTED": return "danger"
      default: return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Vendors"
        subtitle="Vendor onboarding, verification, scorecards"
        action={
          <Link href="/admin/procurement/rfqs">
            <AdminButton variant="secondary" size="sm">View RFQs</AdminButton>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              title="Total Vendors"
              value={vendors.length}
              subtitle={`${verifiedCount} verified`}
              icon={Truck}
              color="purple"
            />
            <AdminStatCard
              title="Pending Verification"
              value={pendingCount}
              subtitle="Awaiting review"
              icon={AlertTriangle}
              color="yellow"
            />
          </>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <AdminSearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Search vendors..."
          className="flex-1 min-w-48"
        />
        <select
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:text-slate-800"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{getVendorTypeLabel(c)}</option>)}
        </select>
      </div>

      {/* Vendor List */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
            Vendor List {filtered.length !== vendors.length && <span className="text-sm font-normal text-white/40">({filtered.length} of {vendors.length})</span>}
          </h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            icon={Truck}
            title={search || categoryFilter !== "ALL" ? "No vendors match" : "No vendors yet"}
            description={search || categoryFilter !== "ALL" ? "Try adjusting search or filters" : "Add vendors to manage procurement and supply chain"}
          />
        ) : (
          <>
            <div className="space-y-3">
              {paged.map((v) => {
                const score = getScorecardBadge(v._id)
                return (
                  <Link key={v._id} href={`/admin/vendors/${v._id}`}>
                    <div className="flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md border-white/10 bg-white/5 hover:bg-white/10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 admin-light-theme:bg-blue-100 admin-light-theme:text-blue-600 transition-colors">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white admin-light-theme:text-slate-900 transition-colors">
                            {v.name}
                          </p>
                          <p className="text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">
                            {getVendorTypeLabel(v.type)} · {v.contactName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {score && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                            <Star className="h-3 w-3 fill-current" />{score.toFixed(1)}
                          </span>
                        )}
                        <AdminBadge variant={getStatusVariant(v.status)}>
                          {v.status}
                        </AdminBadge>
                        <Link href={`/admin/vendors/${v._id}/scorecard`} onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-blue-400 hover:underline">Scorecard</span>
                        </Link>
                        <ChevronRight className="h-4 w-4 text-white/40 admin-light-theme:text-slate-400 transition-colors" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4">
              <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </AdminCard>

      {/* Quick Links */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/procurement/rfqs">
          <AdminButton variant="secondary">RFQs</AdminButton>
        </Link>
        <Link href="/admin/procurement/pos">
          <AdminButton variant="secondary">Purchase Orders</AdminButton>
        </Link>
        <Link href="/admin/procurement/receipts">
          <AdminButton variant="secondary">Goods Receipts</AdminButton>
        </Link>
      </div>
    </AdminPageWrapper>
  )
}
