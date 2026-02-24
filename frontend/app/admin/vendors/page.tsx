"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  getVendors,
  getVendorTypeLabel,
} from "@/shared/services/vendorService"
import { useTenant } from "@/shared/context/TenantContext"
import { Truck, ChevronRight, AlertTriangle, Star } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminSearchBar,
} from "@/shared/components/admin/AdminPageLayout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import vendorScorecards from "@/data/seed/vendor_scorecards.json"

const PAGE_SIZE = 10

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
      <AdminPageLayout
        title="Vendors"
        subtitle="Vendor onboarding, verification, and scorecards"
        actions={
        <Link href="/admin/procurement/rfqs">
          <AdminButton variant="secondary">View RFQs</AdminButton>
        </Link>
      }
    >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Total Vendors"
          value={vendors.length}
          subtitle={`${verifiedCount} verified`}
          icon={Truck}
          color="purple"
        />
        <AdminStatCard
          label="Verified"
          value={verifiedCount}
          subtitle="Active vendors"
          icon={Truck}
          color="green"
        />
        <AdminStatCard
          label="Pending Verification"
          value={pendingCount}
          subtitle="Awaiting review"
          icon={AlertTriangle}
          color="yellow"
        />
        <AdminStatCard
          label="Categories"
          value={categories.length}
          subtitle="Vendor types"
          icon={Truck}
          color="blue"
        />
      </AdminStatsGrid>

      <AdminCard
        title="All Vendors"
        subtitle={`${filtered.length} of ${vendors.length} vendors`}
        actions={
          <div className="flex items-center gap-3">
            <AdminSearchBar
              value={search}
              onChange={(v) => { setSearch(v); setPage(1) }}
              placeholder="Search vendors..."
            />
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1) }}>
              <SelectTrigger className="h-8 w-[180px] border-[#edebe9] bg-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{getVendorTypeLabel(c)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-[#f3f2f1]" />
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
            <div className="space-y-2">
              {paged.map((v) => {
                const score = getScorecardBadge(v._id)
                return (
                  <Link key={v._id} href={`/admin/vendors/${v._id}`}>
                    <div className="flex items-center justify-between rounded border border-[#edebe9] bg-white p-4 transition-all hover:bg-[#f3f2f1] hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#8764b8] text-white">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#323130]">{v.name}</p>
                          <p className="text-xs text-[#605e5c]">
                            {getVendorTypeLabel(v.type)} · {v.contactName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {score && (
                          <span className="flex items-center gap-1 rounded border border-[#ffb900] bg-[#fff4ce] px-2 py-0.5 text-xs font-semibold text-[#797673]">
                            <Star className="h-3 w-3 fill-current" />{score.toFixed(1)}
                          </span>
                        )}
                        <AdminBadge variant={getStatusVariant(v.status)}>
                          {v.status}
                        </AdminBadge>
                        <Link href={`/admin/vendors/${v._id}/scorecard`} onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-[#0078d4] hover:underline">Scorecard</span>
                        </Link>
                        <ChevronRight className="h-4 w-4 text-[#a19f9d]" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-[#edebe9] pt-4">
                <p className="text-xs text-[#605e5c]">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <AdminButton size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </AdminButton>
                  <AdminButton size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                  </AdminButton>
                </div>
              </div>
            )}
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
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
