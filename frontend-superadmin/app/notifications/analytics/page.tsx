"use client"

import Link from "next/link"
import { BarChart3, ArrowLeft, Mail, MessageSquare, Bell, Monitor } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import notificationAnalytics from "@/data/seed/notificationAnalytics.json"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const channelColors: Record<string, string> = {
  email: "#0078d4",
  sms: "#107c10",
  push: "#ff8c00",
  "in-app": "#605e5c",
}

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
  "in-app": Monitor,
}

export default function NotificationAnalyticsPage() {
  const stats = notificationAnalytics
  const overview = stats.overview
  const byChannel = stats.byChannel
  const topTemplates = stats.topTemplates
  const dailyTrend = stats.dailyTrend
  const tenantUsage = stats.tenantUsage

  const pieData = byChannel.map((c: { channel: string; sent: number }) => ({
    name: c.channel,
    value: c.sent,
    color: channelColors[c.channel] ?? "#605e5c",
  }))

  return (
    <PageLayout>
      <PageHeader
        title="Notification analytics"
        description="Delivery rates, open rates, click rates, channel performance, and tenant usage. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />
            Analytics
          </span>
        }
        actions={
          <Link href="/notifications">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Overview
            </Button>
          </Link>
        }
      />

      <PageSection title="Key metrics">
        <MetricsGrid>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#323130]">
                {overview.totalSent.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Total sent ({stats.period})</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#107c10]">{overview.deliveryRate}%</p>
              <p className="mt-1 text-xs text-[#605e5c]">Delivery rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#0078d4]">{overview.openRate}%</p>
              <p className="mt-1 text-xs text-[#605e5c]">Open rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#323130]">{overview.clickRate}%</p>
              <p className="mt-1 text-xs text-[#605e5c]">Click rate</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <PageSection title="Volume by channel">
          <Card>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byChannel} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" />
                    <XAxis
                      dataKey="channel"
                      stroke="#605e5c"
                      fontSize={12}
                      tickFormatter={(v) => String(v).charAt(0).toUpperCase() + String(v).slice(1)}
                    />
                    <YAxis stroke="#605e5c" fontSize={12} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
                    <Tooltip
                      formatter={(v: number) => v.toLocaleString()}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #edebe9",
                        backgroundColor: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="sent"
                      fill="#0078d4"
                      radius={[4, 4, 0, 0]}
                      name="Sent"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Channel distribution">
          <Card>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => v.toLocaleString()}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #edebe9",
                        backgroundColor: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </div>

      <PageSection title="Daily trend">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sent vs delivered (last 7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyTrend}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" />
                  <XAxis dataKey="date" stroke="#605e5c" fontSize={12} />
                  <YAxis stroke="#605e5c" fontSize={12} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #edebe9",
                      backgroundColor: "#fff",
                    }}
                  />
                  <Bar dataKey="sent" fill="#0078d4" radius={[4, 4, 0, 0]} name="Sent" />
                  <Bar dataKey="delivered" fill="#107c10" radius={[4, 4, 0, 0]} name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <PageSection title="Top templates">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {topTemplates.map((t: { templateId: string; templateName: string; channel: string; sent: number; deliveryRate: number }, i: number) => {
                  const Icon = channelIcons[t.channel] ?? BarChart3
                  return (
                    <div
                      key={t.templateId}
                      className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[#605e5c] w-5">{i + 1}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#deecf9] text-[#0078d4]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#323130]">{t.templateName}</p>
                          <p className="text-xs text-[#605e5c]">{t.channel}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#323130]">
                          {t.sent.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#107c10]">{t.deliveryRate}% delivered</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Tenant usage">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {tenantUsage.map((t: { tenantId: string; tenantName: string; sent: number; percentage: number }) => (
                  <div
                    key={t.tenantId}
                    className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#323130]">{t.tenantName}</p>
                      <p className="text-xs font-mono text-[#605e5c]">{t.tenantId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#323130]">
                        {t.sent.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#605e5c]">{t.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </div>
    </PageLayout>
  )
}
