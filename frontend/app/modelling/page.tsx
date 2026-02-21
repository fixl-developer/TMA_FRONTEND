"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { ChevronRight, Calendar, FileSignature, Users, UserPlus, Megaphone } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { getJobsFunnel, getRevenueByMonth } from "@/shared/services/modellingDashboardService"
import { useTenant } from "@/shared/context/TenantContext"
import castingsData from "@/data/seed/castings.json"
import talentsData from "@/data/seed/talents.json"
import bookingsData from "@/data/seed/bookings.json"
import assetsData from "@/data/seed/assets.json"
import contractSignersData from "@/data/seed/contract_signers.json"
import { CreativeChartWithToggle } from "@/shared/components/charts/CreativeChartWithToggle"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { useAuth } from "@/shared/context/AuthContext"

// Helper function for consistent date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

export default function ModellingDashboard() {
  const { mode } = useColorMode()
  const { tenantId } = useTenant()
  const { user } = useAuth()
  const [jobsFunnel, setJobsFunnel] = useState<{ stage: string; count: number }[]>([])
  const [revenueByMonth, setRevenueByMonth] = useState<{ month: string; count: number }[]>([])
  const [chartsLoading, setChartsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const tid = tenantId || "tenant_001"
  const castings = (castingsData as { tenantId?: string; status: string }[]).filter(
    (c) => (c.tenantId ?? "tenant_001") === tid && (c.status === "OPEN" || c.status === "SHORTLISTING")
  )
  const shortlistCastings = (castingsData as { tenantId?: string; status: string }[]).filter(
    (c) => (c.tenantId ?? "tenant_001") === tid && c.status === "SHORTLISTING"
  )
  const pendingContractIds = new Set(
    (contractSignersData as { tenantId: string; contractId: string; status: string }[])
      .filter((s) => s.tenantId === tid && s.status === "PENDING")
      .map((s) => s.contractId)
  )
  const talents = talentsData.filter((t: { tenantId: string }) => t.tenantId === tid)
  const upcomingBookings = bookingsData
    .filter((b: { tenantId: string; stage: string }) => b.tenantId === tid && b.stage === "CONFIRMED")
    .slice(0, 5)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setChartsLoading(true)
    Promise.all([
      getJobsFunnel(tenantId),
      getRevenueByMonth(tenantId),
    ]).then(([f, r]) => {
      setJobsFunnel(f)
      setRevenueByMonth(r)
      setChartsLoading(false)
    })
  }, [tenantId])

  const getTalentImage = (talentId: string) => {
    const asset = (assetsData as { talentId: string; url: string; kind?: string }[]).find((a) => a.talentId === talentId && (a.kind === "image" || !a.kind))
    return asset?.url
  }

  // Dark theme colors - matching reference image
  const isDark = mode === "dark"
  const theme = {
    bg: isDark ? "#0a0a0a" : "#ffffff",
    cardBg: isDark ? "#171717" : "#f9fafb",
    chartBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#e5e7eb",
    text: isDark ? "#fafafa" : "#111827",
    textSecondary: isDark ? "#a3a3a3" : "#6b7280",
    accent: "#fbbf24", // Gold/Yellow
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
  }

  return (
    <AgenciesPage>
      {/* Top Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
            Welcome Back, {user?.name || "User"}
          </h1>
          <p className="mt-2 text-base" style={{ color: theme.textSecondary }}>
            Your talent management control room - monitoring roster, bookings, and revenue
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="sm"
            className="bg-[#fbbf24] text-black hover:bg-[#f59e0b]"
          >
            <Link href="/modelling/talent/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Talent
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.cardBg }}
          >
            <Link href="/modelling/castings/new">
              <Megaphone className="mr-2 h-4 w-4" />
              New Casting
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.cardBg }}
          >
            <Link href="/modelling/bookings/new">
              <Calendar className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards - Compact Single Line */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Talent */}
        <Card className="rounded-xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Active Talent
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {talents.length}
                  </p>
                  <span className="text-xs font-semibold" style={{ color: theme.success }}>+12%</span>
                  <span className="text-xs" style={{ color: theme.textSecondary }}>vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Castings */}
        <Card className="rounded-xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Open Castings
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {castings.length}
                  </p>
                  <span className="text-xs font-semibold" style={{ color: theme.danger }}>-5%</span>
                  <span className="text-xs" style={{ color: theme.textSecondary }}>vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card className="rounded-xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Total Bookings
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {bookingsData.filter((b: { tenantId: string }) => b.tenantId === tid).length}
                  </p>
                  <span className="text-xs font-semibold" style={{ color: theme.success }}>+18%</span>
                  <span className="text-xs font-semibold" style={{ color: theme.success }}>+18%</span>
                  <span className="text-xs" style={{ color: theme.textSecondary }}>vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmed Bookings */}
        <Card className="rounded-xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Confirmed
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {upcomingBookings.length}
                  </p>
                  <span className="text-xs font-semibold" style={{ color: theme.success }}>+24%</span>
                  <span className="text-xs" style={{ color: theme.textSecondary }}>vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Needs Attention */}
      {(shortlistCastings.length > 0 || pendingContractIds.size > 0) && (
        <div className="mb-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
            Needs Your Attention
          </h2>
          <div className="flex flex-wrap gap-3">
            {shortlistCastings.length > 0 && (
              <Link
                href="/modelling/castings"
                className="flex items-center gap-3 rounded-xl border px-5 py-4 transition-all hover:border-[#fbbf24]"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fbbf24]/10">
                  <Users className="h-5 w-5 text-[#fbbf24]" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: theme.text }}>
                    {shortlistCastings.length} casting{shortlistCastings.length !== 1 ? "s" : ""} in shortlisting
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Review and finalize
                  </p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4" style={{ color: theme.textSecondary }} />
              </Link>
            )}
            {pendingContractIds.size > 0 && (
              <Link
                href="/modelling/contracts"
                className="flex items-center gap-3 rounded-xl border px-5 py-4 transition-all hover:border-[#fbbf24]"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fbbf24]/10">
                  <FileSignature className="h-5 w-5 text-[#fbbf24]" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: theme.text }}>
                    {pendingContractIds.size} contract{pendingContractIds.size !== 1 ? "s" : ""} awaiting signature
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Pending approval
                  </p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4" style={{ color: theme.textSecondary }} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Jobs Funnel Chart */}
        <Card className="rounded-xl border overflow-hidden" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <div className="px-5 pt-5 pb-3" style={{ backgroundColor: theme.chartBg }}>
            {chartsLoading ? (
              <>
                <LoadingSkeleton className="mb-3 h-5 w-32" />
                <LoadingSkeleton className="h-56 w-full" />
              </>
            ) : (
              <CreativeChartWithToggle
                data={jobsFunnel}
                dataKey="count"
                xAxisKey="stage"
                title="Jobs Funnel"
                variants={["line", "pie"]}
                height={220}
                theme={isDark ? "dark" : "light"}
              />
            )}
          </div>
        </Card>

        {/* Bookings by Month Chart */}
        <Card className="rounded-xl border overflow-hidden" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <div className="px-5 pt-5 pb-3" style={{ backgroundColor: theme.chartBg }}>
            {chartsLoading ? (
              <>
                <LoadingSkeleton className="mb-3 h-5 w-40" />
                <LoadingSkeleton className="h-56 w-full" />
              </>
            ) : (
              <CreativeChartWithToggle
                data={revenueByMonth}
                dataKey="count"
                xAxisKey="month"
                title="Bookings by Month"
                variants={["bar", "line", "area", "pie"]}
                height={220}
                theme={isDark ? "dark" : "light"}
              />
            )}
          </div>
        </Card>
      </div>
      {/* Featured Opportunities - Table View */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
            Featured Opportunities
          </h2>
          <Link href="/modelling/castings" className="text-xs font-semibold text-[#fbbf24] hover:underline">
            View all <ChevronRight className="inline h-3 w-3" />
          </Link>
        </div>
        <Card className="rounded-xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {castings.slice(0, 5).map((c: any) => (
                    <tr
                      key={c._id}
                      className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
                      style={{ borderBottom: `1px solid ${theme.border}` }}
                    >
                      <td className="px-6 py-3">
                        <p className="text-sm font-semibold" style={{ color: theme.text }}>
                          {c.title}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {c.client}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-[#fbbf24]/10 px-2.5 py-1 text-xs font-semibold text-[#fbbf24]">
                          {c.type}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            c.status === "OPEN"
                              ? "bg-[#10b981]/10 text-[#10b981]"
                              : c.status === "SHORTLISTING"
                              ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {mounted && c.deadline ? formatDate(c.deadline) : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/modelling/castings/${c._id}`}
                          className="text-xs font-semibold text-[#fbbf24] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Talent - Table View */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
            Featured Talent
          </h2>
          <Link href="/modelling/talent" className="text-xs font-semibold text-[#fbbf24] hover:underline">
            View all <ChevronRight className="inline h-3 w-3" />
          </Link>
        </div>
        <Card className="rounded-xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {talents.slice(0, 6).map((t: any) => (
                    <tr
                      key={t._id}
                      className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
                      style={{ borderBottom: `1px solid ${theme.border}` }}
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]"
                            style={{
                              backgroundImage: getTalentImage(t._id) ? `url(${getTalentImage(t._id)})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <p className="text-sm font-semibold" style={{ color: theme.text }}>
                            {t.stageName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {t.location || t.email || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-[#10b981]/10 px-2.5 py-1 text-xs font-semibold text-[#10b981]">
                          {t.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/modelling/talent/${t._id}`}
                          className="text-xs font-semibold text-[#fbbf24] hover:underline"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
            Upcoming Bookings
          </h2>
          <Link href="/modelling/bookings" className="text-xs font-semibold text-[#fbbf24] hover:underline">
            View all <ChevronRight className="inline h-3 w-3" />
          </Link>
        </div>
        <Card className="rounded-xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Stage
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.map((b: any) => (
                    <tr
                      key={b._id}
                      className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
                      style={{ borderBottom: `1px solid ${theme.border}` }}
                    >
                      <td className="px-6 py-3">
                        <p className="text-sm font-semibold" style={{ color: theme.text }}>
                          {b.projectName}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {b.clientName}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {mounted ? `${formatDate(b.dates.start)} - ${formatDate(b.dates.end)}` : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-[#10b981]/10 px-2.5 py-1 text-xs font-semibold text-[#10b981]">
                          {b.stage}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/modelling/bookings/${b._id}`}
                          className="text-xs font-semibold text-[#fbbf24] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgenciesPage>
  )
}
