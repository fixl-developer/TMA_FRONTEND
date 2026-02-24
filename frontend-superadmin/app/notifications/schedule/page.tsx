"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, ArrowLeft, Mail, Bell, MessageSquare, Monitor } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import notificationScheduled from "@/data/seed/notificationScheduled.json"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "pending", label: "Pending" },
  { value: "sent", label: "Sent" },
  { value: "cancelled", label: "Cancelled" },
]

const CHANNEL_OPTIONS: FilterOption[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "in-app", label: "In-app" },
]

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
  "in-app": Monitor,
}

interface ScheduledNotification {
  id: string
  templateId: string
  templateName: string
  channel: string
  scheduledAt: string
  status: string
  recipientCount: number
  tenantId: string | null
  tenantName: string
  trigger: string
  createdBy: string
  createdAt: string
}

export default function NotificationSchedulePage() {
  const scheduled = notificationScheduled as ScheduledNotification[]
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [channelFilter, setChannelFilter] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = scheduled
    if (statusFilter.length > 0) result = result.filter((s) => statusFilter.includes(s.status))
    if (channelFilter.length > 0) result = result.filter((s) => channelFilter.includes(s.channel))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.templateName.toLowerCase().includes(q) ||
          s.tenantName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      )
    }
    return result
  }, [scheduled, statusFilter, channelFilter, searchQuery])

  const metrics = useMemo(() => {
    const pending = scheduled.filter((s) => s.status === "pending").length
    const sent = scheduled.filter((s) => s.status === "sent").length
    const totalRecipients = scheduled
      .filter((s) => s.status === "pending")
      .reduce((acc, s) => acc + s.recipientCount, 0)
    return { total: scheduled.length, pending, sent, totalRecipients }
  }, [scheduled])

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    }
    catch {
      return d
    }
  }

  const columns: Column<ScheduledNotification>[] = useMemo(
    () => [
      {
        key: "templateName",
        header: "Template",
        render: (_v, row) => {
          const Icon = channelIcons[row.channel] ?? Mail
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#323130]">{row.templateName}</p>
                <p className="text-xs text-[#605e5c]">{row.channel} · {row.trigger}</p>
              </div>
            </div>
          )
        },
      },
      {
        key: "scheduledAt",
        header: "Scheduled",
        render: (v) => <span className="text-sm text-[#323130]">{formatDate(String(v))}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "pending"
              ? "border-[#ff8c00] bg-[#fff4ce] text-[#c75000]"
              : s === "sent"
                ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
                : "border-[#605e5c] bg-[#f3f2f1] text-[#605e5c]"
          return (
            <span className={`rounded border px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
              {s}
            </span>
          )
        },
      },
      {
        key: "recipientCount",
        header: "Recipients",
        render: (v) => <span className="text-sm font-medium text-[#323130]">{Number(v)}</span>,
      },
      {
        key: "tenantName",
        header: "Tenant",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">{v ?? "Platform-wide"}</span>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Scheduled notifications"
        description="View and manage scheduled notifications. Recipient management and schedule configuration. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Calendar className="h-3.5 w-3.5 text-[#0078d4]" />
            Schedule
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

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#323130]">{metrics.total}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Total scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#ff8c00]">{metrics.pending}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#107c10]">{metrics.sent}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#0078d4]">{metrics.totalRecipients}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Recipients (pending)</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Scheduled list"
        description={
          filtered.length !== scheduled.length ? `${filtered.length} of ${scheduled.length} shown` : undefined
        }
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by template or tenant..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              {
                key: "status",
                label: "Status",
                options: STATUS_OPTIONS,
                selected: statusFilter,
                onSelectionChange: setStatusFilter,
              },
              {
                key: "channel",
                label: "Channel",
                options: CHANNEL_OPTIONS,
                selected: channelFilter,
                onSelectionChange: setChannelFilter,
              },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setStatusFilter([])
              setChannelFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              <DataTable
                data={filtered}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName="notification-scheduled"
                emptyMessage="No scheduled notifications match the filters."
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
