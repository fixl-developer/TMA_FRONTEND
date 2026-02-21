"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getJobsFunnel, getJobsStatusBreakdown } from "@/shared/services/modellingDashboardService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Megaphone } from "lucide-react"

const CHART_COLORS = ["#B8860B", "#9A7209", "#7A5A07", "#5A4205", "#3D2E04"]

export default function JobsDashboardPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [funnel, setFunnel] = useState<{ stage: string; count: number }[]>([])
  const [breakdown, setBreakdown] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textMuted: isDark ? "#a3a3a3" : "#57534E",
    grid: isDark ? "#3f3f46" : "#E7E5E4",
    tooltipBg: isDark ? "#18181b" : "#ffffff",
    tooltipBorder: isDark ? "#3f3f46" : "#E7E5E4",
  }

  useEffect(() => {
    Promise.all([
      getJobsFunnel(tenantId),
      getJobsStatusBreakdown(tenantId),
    ]).then(([f, b]) => {
      setFunnel(f)
      setBreakdown(b)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Jobs dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textMuted }}>Casting funnel and status breakdown</p>
      </div>
      <div className="mt-6">
        <Link
          href="/modelling"
          className="text-sm font-medium text-[#B8860B] hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>

      <section className="mt-8 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="min-w-0" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.text }}>Jobs funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnel}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                    <XAxis dataKey="stage" stroke={theme.textMuted} fontSize={12} />
                    <YAxis stroke={theme.textMuted} fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${theme.tooltipBorder}`, backgroundColor: theme.tooltipBg }} />
                    <Bar dataKey="count" fill="#B8860B" radius={[4, 4, 0, 0]} name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.text }}>Status breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-64 w-full rounded-xl" />
            ) : breakdown.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed" style={{ borderColor: theme.border }}>
                <Megaphone className="h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4 text-sm" style={{ color: theme.textMuted }}>No castings yet</p>
                <Link href="/modelling/castings/new" className="mt-2 text-sm font-medium text-[#B8860B] hover:underline">
                  Create casting
                </Link>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {breakdown.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${theme.tooltipBorder}`, backgroundColor: theme.tooltipBg }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
