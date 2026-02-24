"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantDashboardStats } from "@/shared/services/adminService"
import { getPendingApprovals } from "@/shared/services/commsService"
import { useTenant } from "@/shared/context/TenantContext"
import {
  Users2, Settings, Wallet, UserPlus,
  UserCircle2, Briefcase, CalendarCheck, Banknote, Target,
  FileSignature, CheckSquare, ChevronRight, TrendingUp, TrendingDown,
  BarChart3, FileText
} from "lucide-react"
import { ErrorState } from "@/shared/components/ui/error-state"

export default function AdminDashboard() {
  const { tenantId } = useTenant()
  const [stats, setStats] = useState<{
    users: number
    roles: number
    talents: number
    castings: number
    activeTalents?: number
    openJobs?: number
    pendingBookings?: number
    revenue?: string
    compliance: string
    walletBalance: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getTenantDashboardStats(tenantId)
      .then(setStats)
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false))
  }, [tenantId])

  useEffect(() => {
    getPendingApprovals(tenantId).then((list) => setPendingApprovalsCount(list.length))
  }, [tenantId])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Overview of your tenant metrics and activities</p>
        </div>

        {/* Top Stat Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Active Talents</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {loading ? "—" : stats?.activeTalents ?? stats?.talents ?? "—"}
                </p>
              </div>
              <UserCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">+9%</span>
            </div>
          </div>

          <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Open Jobs</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {loading ? "—" : stats?.openJobs ?? stats?.castings ?? "—"}
                </p>
              </div>
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">+15%</span>
            </div>
          </div>

          <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Pending Bookings</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {loading ? "—" : stats?.pendingBookings ?? "—"}
                </p>
              </div>
              <CalendarCheck className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingDown className="h-3 w-3" />
              <span className="font-semibold">-10%</span>
            </div>
          </div>

          <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Revenue</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {loading ? "—" : stats?.revenue ?? "—"}
                </p>
              </div>
              <Banknote className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">+38%</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                      <UserPlus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">New user registered</p>
                      <p className="text-xs text-gray-600 mt-1">Priya Sharma joined as Talent</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50">
                      <Briefcase className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">New casting posted</p>
                      <p className="text-xs text-gray-600 mt-1">Fashion shoot for summer collection</p>
                      <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                      <CheckSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Booking confirmed</p>
                      <p className="text-xs text-gray-600 mt-1">Talent booking for event on Jan 28</p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-gray-900">Quick Stats</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Users</span>
                    <span className="text-sm font-semibold text-gray-900">{loading ? "—" : stats?.users ?? "—"}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Roles</span>
                    <span className="text-sm font-semibold text-gray-900">{loading ? "—" : stats?.roles ?? "—"}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Compliance</span>
                    <span className="text-sm font-semibold text-gray-900">{loading ? "—" : stats?.compliance ?? "—"}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        {!loading && stats && (
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Action Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(stats.pendingBookings ?? 0) > 0 && (
                <Link
                  href="/admin/bookings"
                  className="group rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-all hover:border-blue-600 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <CalendarCheck className="h-5 w-5 text-blue-600" />
                    <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-xl font-semibold text-gray-900 mb-1">{stats.pendingBookings}</p>
                  <p className="text-xs font-semibold text-gray-600">Pending bookings</p>
                </Link>
              )}
              <Link
                href="/admin/content/pending"
                className="group rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-all hover:border-blue-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-1">{pendingApprovalsCount}</p>
                <p className="text-xs font-semibold text-gray-600">Pending approvals</p>
              </Link>
              <Link
                href="/admin/contracts"
                className="group rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-all hover:border-blue-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileSignature className="h-5 w-5 text-blue-600" />
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-1">12</p>
                <p className="text-xs font-semibold text-gray-600">Active contracts</p>
              </Link>
              <Link
                href="/admin/ops-health"
                className="group rounded-lg bg-white border border-gray-200 p-4 shadow-sm transition-all hover:border-blue-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-1">85%</p>
                <p className="text-xs font-semibold text-gray-600">Ops Health Score</p>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Users", href: "/admin/users", icon: Users2 },
                { label: "Talent", href: "/admin/talent", icon: UserCircle2 },
                { label: "Analytics", href: "/admin/dashboards/analytics", icon: BarChart3 },
                { label: "Settings", href: "/admin/settings", icon: Settings },
                { label: "Wallet", href: "/admin/wallet", icon: Wallet },
                { label: "Reports", href: "/admin/reports", icon: FileText },
              ].map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-gray-50"
                  >
                    <Icon className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-900">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
