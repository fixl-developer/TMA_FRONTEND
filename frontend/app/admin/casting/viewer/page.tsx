"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getTenantCastings } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { Eye, ArrowLeft, UserCircle2 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

/**
 * Client viewer room – casting agencies share shortlist with clients.
 * UI-only seed workflow for B2 Casting Pipeline.
 */
export default function CastingViewerPage() {
  const { tenantId } = useTenant()
  const [castings, setCastings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantCastings(tenantId).then((data) => {
      setCastings(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-800">
          <Link href="/admin/casting" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to castings
          </Link>
        </Button>
        <PageBanner
          title="Client viewer room"
          subtitle="Share shortlist with clients in a controlled, view-only workspace."
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
        />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Shared sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-800">{loading ? "—" : castings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">With shortlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-emerald-600">
              {loading ? "—" : castings.filter((c) => (c.shortlistedCount ?? 0) > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Client-ready links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-sky-600">{loading ? "—" : castings.length}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Shared sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                  <div className="h-4 w-48 rounded bg-slate-200" />
                  <div className="h-8 w-24 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : castings.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
              <UserCircle2 className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">No casting sessions to view.</p>
              <p className="mt-1 text-sm text-slate-400">
                Clients receive a link to view shortlisted talent for a casting.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {castings.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">{c.title ?? c._id}</p>
                    <p className="text-xs text-slate-500">
                      {c.status ?? "—"} · {c.submissionsCount ?? 0} submissions · {c.shortlistedCount ?? 0} shortlisted
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/casting/viewer/${c._id}`}>View as client</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
