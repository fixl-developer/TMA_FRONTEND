"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Truck, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import notificationDelivery from "@/data/seed/notificationDelivery.json"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "delivered", label: "Delivered" },
  { value: "bounced", label: "Bounced" },
  { value: "failed", label: "Failed" },
]

const CHANNEL_OPTIONS: FilterOption[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
]

interface DeliveryRecord {
  id: string
  templateId: string
  templateName: string
  channel: string
  sentAt: string
  recipientId: string
  recipientEmail?: string
  recipientPhone?: string
  status: string
  openedAt: string | null
  clickedAt: string | null
  bounceReason?: string
  failureReason?: string
  tenantId: string | null
}

export default function NotificationDeliveryPage() {
  const delivery = notificationDelivery as DeliveryRecord[]
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [channelFilter, setChannelFilter] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = delivery
    if (statusFilter.length > 0) result = result.filter((d) => statusFilter.includes(d.status))
    if (channelFilter.length > 0) result = result.filter((d) => channelFilter.includes(d.channel))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.templateName.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          (d.recipientEmail?.toLowerCase().includes(q) ?? false) ||
          (d.recipientPhone?.includes(q) ?? false)
      )
    }
    return result
  }, [delivery, statusFilter, channelFilter, searchQuery])

  const metrics = useMemo(() => {
    const delivered = delivery.filter((d) => d.status === "delivered").length
    const bounced = delivery.filter((d) => d.status === "bounced").length
    const failed = delivery.filter((d) => d.status === "failed").length
    const opened = delivery.filter((d) => d.openedAt).length
    return { total: delivery.length, delivered, bounced, failed, opened }
  }, [delivery])

  const formatDate = (d: string | null) => {
    if (!d) return "—"
    try {
      return new Date(d).toLocaleString("en-GB", {
        dateStyle: "short",
        timeStyle: "short",
      })
    }
    catch {
      return d
    }
  }

  const columns: Column<DeliveryRecord>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Delivery",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.templateName}</p>
            <p className="text-xs font-mono text-[#605e5c]">{row.id}</p>
          </div>
        ),
      },
      {
        key: "channel",
        header: "Channel",
        render: (v) => (
          <span className="rounded border border-[#edebe9] bg-[#f3f2f1] px-2 py-0.5 text-xs font-medium capitalize">
            {String(v)}
          </span>
        ),
      },
      {
        key: "recipientEmail",
        header: "Recipient",
        render: (_v, row) => (
          <span className="text-sm text-[#323130]">
            {row.recipientEmail ?? row.recipientPhone ?? row.recipientId}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const Icon =
            s === "delivered" ? CheckCircle : s === "bounced" ? AlertTriangle : XCircle
          const cls =
            s === "delivered"
              ? "text-[#107c10]"
              : s === "bounced"
                ? "text-[#ff8c00]"
                : "text-[#a80000]"
          return (
            <span className={`inline-flex items-center gap-1 text-xs font-medium capitalize ${cls}`}>
              <Icon className="h-3.5 w-3.5" />
              {s}
            </span>
          )
        },
      },
      {
        key: "sentAt",
        header: "Sent",
        render: (v) => <span className="text-sm text-[#605e5c]">{formatDate(String(v))}</span>,
      },
      {
        key: "openedAt",
        header: "Opened",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">{v ? formatDate(String(v)) : "—"}</span>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Delivery tracking"
        description="Monitor delivery status, success/failure rates, bounce tracking, and retry management. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Truck className="h-3.5 w-3.5 text-[#0078d4]" />
            Delivery
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
              <p className="mt-1 text-xs text-[#605e5c]">Recent deliveries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#107c10]">{metrics.delivered}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Delivered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#ff8c00]">{metrics.bounced}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Bounced</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-3xl font-semibold text-[#0078d4]">{metrics.opened}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Opened</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Delivery log"
        description={
          filtered.length !== delivery.length ? `${filtered.length} of ${delivery.length} shown` : undefined
        }
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by template or recipient..."
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
                exportFileName="notification-delivery"
                emptyMessage="No delivery records match the filters."
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
