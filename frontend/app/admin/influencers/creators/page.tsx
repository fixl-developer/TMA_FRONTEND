"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "@/shared/components/ui/input"
import { getCreators, formatCurrency } from "@/shared/services/influencerService"
import { useTenant } from "@/shared/context/TenantContext"
import { UserCircle2, Search, FileText, ArrowLeft } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminLoading,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

export default function CreatorsPage() {
  const { tenantId } = useTenant()
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [nicheFilter, setNicheFilter] = useState("")

  useEffect(() => {
    getCreators(tenantId, { niche: nicheFilter || undefined }).then((data) => {
      setCreators(data)
      setLoading(false)
    })
  }, [tenantId, nicheFilter])

  const filtered = creators.filter((c) =>
    !search || c.stageName?.toLowerCase().includes(search.toLowerCase()) || c.niche?.toLowerCase().includes(search.toLowerCase())
  )

  const niches = [...new Set(creators.map((c) => c.niche).filter(Boolean))] as string[]

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Creator Roster"
        subtitle="Discover creators, view media kits, filter by niche and rate"
        actions={
          <Link href="/admin/influencers">
            <AdminButton variant="ghost">
              <ArrowLeft className="h-4 w-4" />
              Back to Influencers
            </AdminButton>
          </Link>
        }
      >
        <AdminCard title="Creators" subtitle={`${filtered.length} of ${creators.length} creators`}>
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search by name or niche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-white/20 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>
            <select
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#d4ff00] focus:outline-none"
            >
              <option value="">All niches</option>
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <AdminEmptyState
              icon={UserCircle2}
              title="No creators found"
              description="Try adjusting your search or filters"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <div
                  key={c._id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white/10">
                      {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <UserCircle2 className="h-7 w-7 text-white/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{c.stageName}</p>
                      <p className="text-sm text-white/60">{c.niche}</p>
                      <p className="text-sm font-medium text-[#d4ff00]">
                        {c.reach} · {formatCurrency(c.rateMinor ?? 0, c.currency ?? "INR")}/post
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-white/10 p-3">
                    {c.mediaKitUrl && (
                      <a href={c.mediaKitUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <AdminButton variant="secondary" size="sm" className="w-full">
                          <FileText className="mr-1 h-4 w-4" /> Media Kit
                        </AdminButton>
                      </a>
                    )}
                    <Link href={`/admin/talent?talent=${c.talentId}`}>
                      <AdminButton variant="secondary" size="sm">View Profile</AdminButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
