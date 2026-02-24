"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { FileText, Mail, MessageSquare, Bell, Monitor, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import notificationTemplates from "@/data/seed/notificationTemplates.json"

const CHANNEL_OPTIONS: FilterOption[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "in-app", label: "In-app" },
]

const STATUS_OPTIONS: FilterOption[] = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
]

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
  "in-app": Monitor,
}

interface NotificationTemplate {
  id: string
  name: string
  channel: string
  subject: string | null
  body: string
  variables: string[]
  status: string
  usageCount: number
  lastModified: string
  tenantScope: string
}

export default function NotificationTemplatesPage() {
  const templates = notificationTemplates as NotificationTemplate[]
  const [searchQuery, setSearchQuery] = useState("")
  const [channelFilter, setChannelFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = templates
    if (channelFilter.length > 0) result = result.filter((t) => channelFilter.includes(t.channel))
    if (statusFilter.length > 0) result = result.filter((t) => statusFilter.includes(t.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          (t.body?.toLowerCase().includes(q) ?? false)
      )
    }
    return result
  }, [templates, channelFilter, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const active = templates.filter((t) => t.status === "active").length
    const byChannel = templates.reduce(
      (acc, t) => {
        acc[t.channel] = (acc[t.channel] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    const totalUsage = templates.reduce((acc, t) => acc + t.usageCount, 0)
    return { total: templates.length, active, byChannel, totalUsage }
  }, [templates])

  const columns: Column<NotificationTemplate>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Template",
        render: (_v, row) => {
          const Icon = channelIcons[row.channel] ?? FileText
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#323130]">{row.name}</p>
                <p className="text-xs font-mono text-[#605e5c]">{row.id}</p>
              </div>
            </div>
          )
        },
      },
      {
        key: "channel",
        header: "Channel",
        render: (v) => {
          const ch = String(v)
          const cls =
            ch === "email"
              ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]"
              : ch === "sms"
                ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
                : ch === "push"
                  ? "border-[#ff8c00] bg-[#fff4ce] text-[#c75000]"
                  : "border-[#605e5c] bg-[#f3f2f1] text-[#605e5c]"
          return (
            <span className={`rounded border px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
              {ch}
            </span>
          )
        },
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "active"
              ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
              : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "variables",
        header: "Variables",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">{(v as string[])?.length ?? 0} vars</span>
        ),
      },
      {
        key: "usageCount",
        header: "Usage",
        render: (v) => (
          <span className="text-sm font-medium text-[#323130]">
            {Number(v).toLocaleString()}
          </span>
        ),
      },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/notifications/templates/${row.id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">
              Edit
            </Button>
          </Link>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Notification templates"
        description="Manage notification templates for email, SMS, push, and in-app channels. Variable placeholders supported."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileText className="h-3.5 w-3.5 text-[#0078d4]" />
            Templates
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
              <p className="mt-1 text-xs text-[#605e5c]">Total templates</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#107c10]">{metrics.active}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#0078d4]">
                {metrics.totalUsage.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Total sends (all time)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-semibold text-[#323130]">
                {Object.keys(metrics.byChannel).length}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Channels in use</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Templates"
        description={filtered.length !== templates.length ? `${filtered.length} of ${templates.length} shown` : undefined}
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name or id..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              {
                key: "channel",
                label: "Channel",
                options: CHANNEL_OPTIONS,
                selected: channelFilter,
                onSelectionChange: setChannelFilter,
              },
              {
                key: "status",
                label: "Status",
                options: STATUS_OPTIONS,
                selected: statusFilter,
                onSelectionChange: setStatusFilter,
              },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setChannelFilter([])
              setStatusFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              <DataTable
                data={filtered}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName="notification-templates"
                emptyMessage="No templates match the filters."
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
