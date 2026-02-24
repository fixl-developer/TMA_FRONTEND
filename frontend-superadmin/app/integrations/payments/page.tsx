"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CreditCard, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { getPaymentGateways } from "@/shared/services/integrationsService"

type Gateway = {
  _id: string
  name: string
  provider: string
  status: "ACTIVE" | "DISABLED"
  environment: "SANDBOX" | "PRODUCTION"
  lastHealthCheckAt: string
  lastIncidentAt: string | null
  uptime90dPercent: number
  tenantsUsing: number
}

export default function PaymentsOverviewPage() {
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPaymentGateways()
      .then((g) => setGateways(g as Gateway[]))
      .finally(() => setLoading(false))
  }, [])

  const metrics = useMemo(() => {
    const active = gateways.filter((g) => g.status === "ACTIVE").length
    const totalTenants = gateways.reduce((acc, g) => acc + g.tenantsUsing, 0)
    const avgUptime =
      gateways.length > 0
        ? Math.round(
            (gateways.reduce((acc, g) => acc + (g.uptime90dPercent ?? 0), 0) / gateways.length) * 100
          ) / 100
        : 0
    return { total: gateways.length, active, totalTenants, avgUptime }
  }, [gateways])

  const columns: Column<Gateway>[] = [
    {
      key: "name",
      header: "Gateway",
      render: (_v, row) => (
        <div>
          <p className="text-sm font-semibold text-[#323130]">{row.name}</p>
          <p className="text-xs text-[#605e5c]">{row.provider}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const s = String(v)
        const cls =
          s === "ACTIVE"
            ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
            : "border-[#605e5c] bg-[#f3f2f1] text-[#605e5c]"
        return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
      },
    },
    {
      key: "environment",
      header: "Environment",
      render: (v) => (
        <span className="text-xs text-[#605e5c]">{String(v)}</span>
      ),
    },
    {
      key: "uptime90dPercent",
      header: "Uptime (90d)",
      render: (v) => (
        <span className="text-sm text-[#605e5c]">
          {Number(v).toFixed(2)}%
        </span>
      ),
    },
    {
      key: "tenantsUsing",
      header: "Tenants",
      render: (v) => (
        <span className="text-sm text-[#605e5c]">{Number(v)}</span>
      ),
    },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Payment gateways"
        description="Multi-gateway configuration and health overview (Razorpay, Stripe). Seed UI only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <CreditCard className="h-3.5 w-3.5 text-[#0078d4]" />
            Payments
          </span>
        }
        actions={
          <Link href="/integrations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Integrations
            </Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Gateways</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Active</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.active}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Tenants</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : metrics.totalTenants}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Avg uptime</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : `${metrics.avgUptime}%`}</p></CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Gateways">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">
                Loading gateways…
              </div>
            ) : (
              <DataTable
                data={gateways}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName="payment-gateways"
                emptyMessage="No payment gateways in seed data."
              />
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

