"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantDashboardStats } from "@/shared/services/adminService"
import { getPendingApprovals } from "@/shared/services/commsService"
import { useTenant } from "@/shared/context/TenantContext"
import { 
  Users2, ShieldCheck, Settings, Wallet, UserPlus, Building2, 
  UserCircle2, Briefcase, CalendarCheck, Banknote, Target, 
  FileSignature, CheckSquare, ChevronRight, TrendingUp, TrendingDown
} from "lucide-react"
import { ErrorState } from "@/shared/components/ui/error-state"
import { ActivityFeed } from "@/shared/components/ui/ActivityFeed"
import { RecentlyVisited } from "@/shared/components/ui/RecentlyVisited"
import { CreativeChartWithToggle } from "@/shared/components/charts/CreativeChartWithToggle"
import { useAuth } from "@/shared/context/AuthContext"

export default function AdminDashboard() {
  const { tenantId } = useTenant()
  const { user } = useAuth()
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
    sparklineTalents?: number[]
    sparklineJobs?: number[]
    sparklineBookings?: number[]
    sparklineRevenue?: number[]
    bookingsByMonth?: { month: string; count: number }[]
    jobStatusBreakdown?: { name: string; value: number }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0)
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "settings">("dashboard")

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
      <div className="admin-dashboard min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-6">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Top Navigation Pills */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-[#d4ff00] text-black shadow-lg shadow-[#d4ff00]/30"
                : "bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10"
            }`}
          >
            <span>Dashboard</span>
          </button>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <span>Users</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <span>Settings</span>
          </Link>
        </div>

        {/* Top Stat Cards - 3 Cards like reference */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Active Talents Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total orders</p>
                  <p className="mt-1 text-sm text-white/60">Active Talents</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <UserCircle2 className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-white">
                  {loading ? "—" : stats?.activeTalents ?? stats?.talents ?? "—"}
                </p>
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                  +9%
                </span>
              </div>
            </div>
          </div>

          {/* Open Jobs Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total orders</p>
                  <p className="mt-1 text-sm text-white/60">Open Jobs</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-white">
                  {loading ? "—" : stats?.openJobs ?? stats?.castings ?? "—"}
                </p>
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                  +15%
                </span>
              </div>
            </div>
          </div>

          {/* Pending Bookings Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-pink-400/20 to-rose-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total orders</p>
                  <p className="mt-1 text-sm text-white/60">Pending Bookings</p>
                </div>
                <div className="rounded-lg bg-pink-500/10 p-2">
                  <CalendarCheck className="h-5 w-5 text-pink-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-white">
                  {loading ? "—" : stats?.pendingBookings ?? "—"}
                </p>
                <span className="flex items-center gap-1 text-sm font-semibold text-rose-400">
                  <TrendingDown className="h-4 w-4" />
                  -10%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Job Status Chart (Dark) */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-6 text-lg font-bold text-white">Job status</h3>
              <div className="mb-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-400" />
                  <span className="text-white/60">Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-pink-400" />
                  <span className="text-white/60">Shortlisting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-white/60">Closed</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">60%</span>
                  <span className="text-sm text-white/50">Avg job completion</span>
                </div>
              </div>
              {!loading && stats?.jobStatusBreakdown && (
                <CreativeChartWithToggle
                  data={stats.jobStatusBreakdown}
                  dataKey="value"
                  xAxisKey="name"
                  variants={["area", "line"]}
                  height={200}
                  theme="dark"
                />
              )}
            </div>
          </div>

          {/* Right: Revenue Growth Chart (Bright Yellow) */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-[#d4ff00]/20 bg-gradient-to-br from-[#d4ff00] to-[#b8e600] p-6 shadow-xl shadow-[#d4ff00]/20">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">Revenue growth</h3>
                <button className="rounded-lg bg-black/10 px-3 py-1.5 text-xs font-semibold text-black backdrop-blur-sm">
                  Monthly
                </button>
              </div>
              <div className="mb-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-black/70">Active Talents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-black/70">Open Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-black/70">Bookings</span>
                </div>
              </div>
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-emerald-600">+38% Growth since last Month</span>
              </div>
              {!loading && stats?.bookingsByMonth && (
                <div className="rounded-xl bg-white/30 p-4 backdrop-blur-sm">
                  <CreativeChartWithToggle
                    data={stats.bookingsByMonth}
                    dataKey="count"
                    xAxisKey="month"
                    variants={["bar", "line", "area"]}
                    height={220}
                    theme="light"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed & Focus Section */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Orders activity</h3>
                <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-sm hover:bg-white/10">
                  Monthly
                </button>
              </div>
              <p className="mb-6 text-sm text-white/50">Track your overall order progress from here</p>
              
              {/* Mini Stats */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    <span className="text-xs text-white/50">Users</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">{loading ? "—" : stats?.users ?? "—"}</p>
                    <span className="text-xs font-semibold text-emerald-400">+40% growth</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#d4ff00]" />
                    <span className="text-xs text-white/50">Roles</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">{loading ? "—" : stats?.roles ?? "—"}</p>
                    <span className="text-xs font-semibold text-emerald-400">+40% growth</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-rose-400" />
                    <span className="text-xs text-white/50">Compliance</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">{loading ? "—" : stats?.compliance ?? "—"}</p>
                    <span className="text-xs font-semibold text-rose-400">10% fall</span>
                  </div>
                </div>
              </div>

              {/* Current Order List */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Current order list</h4>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm hover:bg-white/10">
                      View all
                    </button>
                    <button className="rounded-lg bg-white/5 p-1.5 text-white/70 backdrop-blur-sm hover:bg-white/10">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Name & Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Date start - end</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 transition-colors hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-purple-400 to-pink-400" />
                            <div>
                              <p className="text-sm font-semibold text-white">Talent Booking</p>
                              <p className="text-xs text-white/50">ID: 2846352783</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/70">Fashion</td>
                        <td className="px-4 py-3 text-sm text-white/70">Jan 14 to 28</td>
                        <td className="px-4 py-3 text-sm font-semibold text-white">₹25,000</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-white/50 hover:text-white">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Activity Feed */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <ActivityFeed maxItems={5} />
            </div>
            
            {/* Recently Visited */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <RecentlyVisited />
            </div>
          </div>
        </div>

        {/* Your Focus Section */}
        {!loading && stats && (
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/50">Your focus</h3>
            <div className="flex flex-wrap gap-3">
              {(stats.pendingBookings ?? 0) > 0 && (
                <Link
                  href="/admin/bookings"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="rounded-lg bg-[#d4ff00]/10 p-2">
                    <CalendarCheck className="h-4 w-4 text-[#d4ff00]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {stats.pendingBookings} pending bookings
                  </span>
                  <ChevronRight className="h-4 w-4 text-white/50" />
                </Link>
              )}
              <Link
                href="/admin/content/pending"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <CheckSquare className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-sm font-semibold text-white">
                  {pendingApprovalsCount > 0 ? `${pendingApprovalsCount} pending approvals` : "Content approvals"}
                </span>
                <ChevronRight className="h-4 w-4 text-white/50" />
              </Link>
              <Link
                href="/admin/contracts"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <FileSignature className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-white">Contracts</span>
                <ChevronRight className="h-4 w-4 text-white/50" />
              </Link>
              <Link
                href="/admin/ops-health"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="rounded-lg bg-pink-500/10 p-2">
                  <Target className="h-4 w-4 text-pink-400" />
                </div>
                <span className="text-sm font-semibold text-white">Ops Health</span>
                <ChevronRight className="h-4 w-4 text-white/50" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/50">Quick actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/users"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-[#d4ff00]/10 p-3">
                  <UserPlus className="h-6 w-6 text-[#d4ff00]" />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-bold text-white">Invite user</h4>
                  <p className="text-sm text-white/60">Add team members and assign roles</p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/organization"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <Building2 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-bold text-white">Organization</h4>
                  <p className="text-sm text-white/60">Branding, settings, limits</p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/wallet"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Wallet className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-bold text-white">Wallet</h4>
                  <p className="text-sm text-white/60">Balance, payouts, invoices</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Quick Links */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Analytics", href: "/admin/dashboards/analytics" },
            { label: "Talent", href: "/admin/talent" },
            { label: "Content", href: "/admin/content/pending" },
            { label: "Ads", href: "/admin/ads" },
            { label: "CRM", href: "/admin/crm" },
            { label: "Sales", href: "/admin/sales" },
            { label: "Contracts", href: "/admin/contracts" },
            { label: "Projects", href: "/admin/projects" },
            { label: "Resources", href: "/admin/resources" },
            { label: "Vendors", href: "/admin/vendors" },
            { label: "Logistics", href: "/admin/logistics/shipments" },
            { label: "Franchise", href: "/admin/franchise" },
            { label: "Comms", href: "/admin/comms" },
            { label: "Mobile", href: "/mobile" },
            { label: "Automation", href: "/admin/automation/campaigns" },
            { label: "Reports", href: "/admin/reports" },
            { label: "Support", href: "/admin/support" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
