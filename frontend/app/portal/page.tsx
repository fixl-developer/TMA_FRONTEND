"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPendingApprovals } from "@/shared/services/commsService"
import { getContracts } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useAuth } from "@/shared/context/AuthContext"
import {
  CheckSquare,
  FileText,
  FileSignature,
  ChevronRight,
  Clock,
  CheckCircle2,
  Bell,
  Briefcase,
} from "lucide-react"
import { format } from "date-fns"

export default function PortalPage() {
  const { tenantId } = useTenant()
  const { user } = useAuth()
  const [approvals, setApprovals] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const displayName = user?.name?.split(" ")[0] ?? "there"

  useEffect(() => {
    Promise.all([
      getPendingApprovals(tenantId),
      getContracts(tenantId),
    ]).then(([a, c]) => {
      setApprovals(a as any[])
      setContracts((c as any[]).filter((ct) => ["SENT", "SIGNED", "ACTIVE"].includes(ct.status)).slice(0, 5))
      setLoading(false)
    })
  }, [tenantId])

  const pendingCount = approvals.filter((a) => a.status === "PENDING").length

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <Briefcase className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Client Portal</h1>
              <p className="text-sm text-white/50">Welcome back, {displayName}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {pendingCount > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
            <Bell className="h-5 w-5 text-amber-400" />
            <p className="text-sm text-amber-300">
              {pendingCount} item{pendingCount > 1 ? "s" : ""} awaiting your approval.
            </p>
            <Link href="/portal/approvals" className="ml-auto text-sm font-semibold text-amber-400 underline">
              Review now
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/portal/approvals">
            <div className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                <CheckSquare className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-white">Approvals</p>
                <p className="text-sm text-white/50">{pendingCount} pending</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-white/20" />
            </div>
          </Link>
          <Link href="/portal/projects">
            <div className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <Briefcase className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-white">Projects</p>
                <p className="text-sm text-white/50">Active projects</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-white/20" />
            </div>
          </Link>
          <Link href="/portal/approvals">
            <div className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <FileSignature className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-white">Contracts</p>
                <p className="text-sm text-white/50">{contracts.length} active</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-white/20" />
            </div>
          </Link>
        </div>

        {/* Pending Approvals */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Pending Approvals</h2>
            <Link href="/portal/approvals" className="text-sm text-purple-400 hover:text-purple-300">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />)}</div>
          ) : approvals.filter((a) => a.status === "PENDING").slice(0, 3).length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
              <p className="text-white/60">All caught up! No pending approvals.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvals.filter((a) => a.status === "PENDING").slice(0, 3).map((a) => (
                <Link key={a._id} href="/portal/approvals">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-amber-400/30 hover:bg-amber-500/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                        <Clock className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{a.title}</p>
                        <p className="text-xs text-white/40">
                          {a.objectType} · Due {a.dueDate ? format(new Date(a.dueDate), "MMM d") : "—"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/20" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Active Contracts */}
        {contracts.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Active Contracts</h2>
            </div>
            <div className="space-y-3">
              {contracts.map((c) => (
                <div key={c._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                      <FileSignature className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{c.title || c._id}</p>
                      <p className="text-xs text-white/40">{c.status} · {c.expiresAt ? `Expires ${format(new Date(c.expiresAt), "MMM d, yyyy")}` : "No expiry"}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
