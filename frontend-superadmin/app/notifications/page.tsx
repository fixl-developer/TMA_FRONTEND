"use client"

import Link from "next/link"
import { Bell, FileText, Calendar, Truck, BarChart3, Plus } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import notificationTemplates from "@/data/seed/notificationTemplates.json"
import notificationAnalytics from "@/data/seed/notificationAnalytics.json"

export default function NotificationsOverviewPage() {
  const stats = notificationAnalytics
  const templateCount = notificationTemplates.length
  const activeTemplates = notificationTemplates.filter((t: { status: string }) => t.status === "active").length

  return (
    <PageLayout>
      <PageHeader
        title="Notification system"
        description="Manage notification templates (email, SMS, push, in-app), scheduled notifications, delivery tracking, and analytics. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Bell className="h-3.5 w-3.5 text-[#0078d4]" />
            Phase 3
          </span>
        }
        actions={
          <Link href="/notifications/templates">
            <span className="inline-flex items-center gap-1.5 rounded border border-[#0078d4] bg-[#0078d4] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#106ebe]">
              <Plus className="h-3.5 w-3.5" />
              Create template
            </span>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-[#605e5c]">Templates</span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{templateCount}</p>
              <p className="mt-1 text-xs text-[#605e5c]">{activeTemplates} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-[#605e5c]">Total sent ({stats.period})</span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {stats.overview.totalSent.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Across all channels</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-[#605e5c]">Delivery rate</span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">{stats.overview.deliveryRate}%</p>
              <p className="mt-1 text-xs text-[#605e5c]">Successfully delivered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-[#605e5c]">Open rate</span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{stats.overview.openRate}%</p>
              <p className="mt-1 text-xs text-[#605e5c]">Email & in-app</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Quick links">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/notifications/templates">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Templates</p>
                  <p className="text-xs text-[#605e5c]">Email, SMS, push, in-app</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/notifications/schedule">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Scheduled</p>
                  <p className="text-xs text-[#605e5c]">Scheduled notifications</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/notifications/delivery">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Delivery</p>
                  <p className="text-xs text-[#605e5c]">Delivery status & tracking</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/notifications/analytics">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Analytics</p>
                  <p className="text-xs text-[#605e5c]">Metrics & performance</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
