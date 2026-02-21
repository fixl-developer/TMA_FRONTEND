"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { getCreators, formatCurrency } from "@/shared/services/influencerService"
import { useTenant } from "@/shared/context/TenantContext"
import { UserCircle2, Search, FileText } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

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
    <AgenciesPage>
      <PageBanner
        title="Creator Roster"
        subtitle="Discover creators, view media kits, filter by niche and rate."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80"
      />
      <section className="mt-8 min-w-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5" /> Creators
            </CardTitle>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by name or niche..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 text-sm text-slate-700"
              >
                <option value="">All niches</option>
                {niches.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading creators…</p>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <UserCircle2 className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-slate-500">No creators found.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c) => (
                  <div
                    key={c._id}
                    className="overflow-hidden rounded-xl border border-[#E7E5E4] bg-white transition-all hover:border-[#B8860B]/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-200">
                        {c.avatarUrl ? (
                          <img src={c.avatarUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UserCircle2 className="h-7 w-7 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800">{c.stageName}</p>
                        <p className="text-sm text-slate-500">{c.niche}</p>
                        <p className="text-sm font-medium text-amber-600">{c.reach} · {formatCurrency(c.rateMinor ?? 0, c.currency ?? "INR")}/post</p>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t border-[#E7E5E4] p-3">
                      {c.mediaKitUrl && (
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a href={c.mediaKitUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-1 h-4 w-4" /> Media kit
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/talent?talent=${c.talentId}`}>View profile</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
