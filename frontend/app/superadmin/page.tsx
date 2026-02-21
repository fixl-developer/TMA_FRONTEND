/**
 * Super Admin Dashboard
 *
 * Overview of platform metrics, tenants, revenue, incidents.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Crown, Users2, Wallet2, PlaySquare, Headphones, TrendingUp, ShieldAlert, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { getPlatformDashboardStats, formatCurrency } from "@/shared/services/dashboardService"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<{
    tenantCount: number
    totalRevenue: number
    revenueCurrency: string
    openIncidents: number
    openDisputes: number
    revenueOverTime: { period: string; revenue: number }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlatformDashboardStats().then(setStats).finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard"
        description="Platform overview: tenants, revenue, incidents."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <LayoutDashboard className="h-3.5 w-3.5 text-blue-500" />
            Super Admin
          </span>
        }
      />

      <PageSection title="Key metrics">
        <MetricsGrid>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/tenants" className="absolute inset-0 z-10" aria-label="Tenants" />
            <CardHeader className="relative z-20">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users2 className="h-5 w-5 text-sky-500" />
                  Tenants
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-2xl font-semibold text-slate-800">{loading ? "—" : stats?.tenantCount ?? 0}</p>
                <p className="text-sm text-slate-500">Active organizations</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/finance" className="absolute inset-0 z-10" aria-label="Revenue" />
            <CardHeader className="relative z-20">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Revenue
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-2xl font-semibold text-emerald-600">
                  {loading ? "—" : stats ? formatCurrency(stats.totalRevenue, stats.revenueCurrency) : "—"}
                </p>
                <p className="text-sm text-slate-500">This month</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/governance" className="absolute inset-0 z-10" aria-label="Incidents" />
            <CardHeader className="relative z-20">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Incidents
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-2xl font-semibold text-amber-600">{loading ? "—" : stats?.openIncidents ?? 0}</p>
                <p className="text-sm text-slate-500">Open moderation</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/governance" className="absolute inset-0 z-10" aria-label="Disputes" />
            <CardHeader className="relative z-20">
              <CardTitle className="flex items-center gap-2 text-base">
                <Scale className="h-5 w-5 text-rose-500" />
                Disputes
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-2xl font-semibold text-rose-600">{loading ? "—" : stats?.openDisputes ?? 0}</p>
                <p className="text-sm text-slate-500">Open disputes</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {!loading && stats && stats.revenueOverTime?.length > 0 && (
        <PageSection title="Revenue over time">
          <Card>
            <CardHeader>
              <CardTitle>Monthly revenue</CardTitle>
              <p className="text-sm text-slate-500">Subscription, usage, platform fees</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                    <XAxis dataKey="period" stroke="#57534E" fontSize={12} />
                    <YAxis stroke="#57534E" fontSize={12} tickFormatter={(v) => `₹${(v / 100).toLocaleString()}`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v, "INR")} contentStyle={{ borderRadius: 8, border: "1px solid #E7E5E4" }} />
                    <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}

      <PageSection title="Quick links">
        <MetricsGrid>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/pageants" className="absolute inset-0 z-10" aria-label="Pageants" />
            <CardHeader className="relative z-20">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Pageants
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-sm text-slate-600">Manage pageants and events</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/tenants" className="absolute inset-0 z-10" aria-label="Tenants" />
            <CardHeader className="relative z-20">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users2 className="h-5 w-5 text-sky-500" />
                Tenants
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-sm text-slate-600">Organizations and agencies</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/users" className="absolute inset-0 z-10" aria-label="Users" />
            <CardHeader className="relative z-20">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users2 className="h-5 w-5 text-emerald-500" />
                  Users
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-sm text-slate-600">Platform users and roles</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/finance" className="absolute inset-0 z-10" aria-label="Finance" />
            <CardHeader className="relative z-20">
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet2 className="h-5 w-5 text-violet-500" />
                Finance
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-sm text-slate-600">Revenue, wallets, payments</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/talent-showcase" className="absolute inset-0 z-10" aria-label="Talent Showcase" />
            <CardHeader className="relative z-20">
              <CardTitle className="flex items-center gap-2 text-base">
                <PlaySquare className="h-5 w-5 text-rose-500" />
                Talent Showcase
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-sm text-slate-600">Showcase content across tenants</p>
            </CardContent>
          </Card>
          <Card className="relative hover:border-blue-400 transition-colors cursor-pointer h-full">
            <Link href="/superadmin/support" className="absolute inset-0 z-10" aria-label="Support" />
            <CardHeader className="relative z-20">
              <CardTitle className="flex items-center gap-2 text-base">
                <Headphones className="h-5 w-5 text-blue-500" />
                Support
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20">
                <p className="text-sm text-slate-600">Tenant support cases</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>
    </PageLayout>
  )
}
