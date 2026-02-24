"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BarChart3, ArrowLeft, Activity, Timer, AlertTriangle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { getApiUsage } from "@/shared/services/integrationsService"

type ApiUsage = {
  period: string
  totals: {
    requests: number
    errors: number
    errorRatePercent: number
    p50LatencyMs: number
    p95LatencyMs: number
    p99LatencyMs: number
  }
  timeseries: { date: string; requests: number; errors: number; p95LatencyMs: number }[]
  topEndpoints: { method: string; path: string; requests: number; errorRatePercent: number; p95LatencyMs: number }[]
  byTenant: { tenantId: string; tenantName: string; requests: number; errorRatePercent: number; p95LatencyMs: number }[]
}

export default function ApiUsagePage() {
  const [data, setData] = useState<ApiUsage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getApiUsage()
      .then((d) => setData(d as ApiUsage))
      .finally(() => setLoading(false))
  }, [])

  const totals = data?.totals
  const ts = data?.timeseries ?? []

  const endpointColumns: Column<ApiUsage["topEndpoints"][number]>[] = useMemo(
    () => [
      {
        key: "path",
        header: "Endpoint",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">
              <span className="mr-2 rounded border border-[#edebe9] bg-[#f3f2f1] px-1.5 py-0.5 text-xs font-medium">
                {row.method}
              </span>
              <span className="font-mono text-xs">{row.path}</span>
            </p>
          </div>
        ),
      },
      {
        key: "requests",
        header: "Requests",
        render: (v) => <span className="text-sm font-medium text-[#323130]">{Number(v).toLocaleString()}</span>,
      },
      {
        key: "errorRatePercent",
        header: "Error rate",
        render: (v) => <span className="text-sm text-[#605e5c]">{Number(v).toFixed(1)}%</span>,
      },
      {
        key: "p95LatencyMs",
        header: "p95 latency",
        render: (v) => <span className="text-sm text-[#605e5c]">{Number(v)} ms</span>,
      },
    ],
    []
  )

  const tenantColumns: Column<ApiUsage["byTenant"][number]>[] = useMemo(
    () => [
      {
        key: "tenantName",
        header: "Tenant",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.tenantName}</p>
            <p className="text-xs font-mono text-[#605e5c]">{row.tenantId}</p>
          </div>
        ),
      },
      {
        key: "requests",
        header: "Requests",
        render: (v) => <span className="text-sm font-medium text-[#323130]">{Number(v).toLocaleString()}</span>,
      },
      {
        key: "errorRatePercent",
        header: "Error rate",
        render: (v) => <span className="text-sm text-[#605e5c]">{Number(v).toFixed(1)}%</span>,
      },
      {
        key: "p95LatencyMs",
        header: "p95 latency",
        render: (v) => <span className="text-sm text-[#605e5c]">{Number(v)} ms</span>,
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="API usage"
        description="Request volume, endpoint usage, error rates, and latency metrics. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />
            {loading ? "Loading…" : data?.period ?? "Usage"}
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

      <PageSection title="Key metrics">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : totals?.requests.toLocaleString()}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Total ({data?.period ?? "—"})</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#a80000]">{loading ? "—" : totals?.errors.toLocaleString()}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Total errors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Error rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ff8c00]">{loading ? "—" : `${totals?.errorRatePercent.toFixed(2)}%`}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Platform-wide</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">p95 latency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : `${totals?.p95LatencyMs} ms`}</p>
              <p className="mt-1 text-xs text-[#605e5c]">p50 {totals?.p50LatencyMs ?? "—"} ms · p99 {totals?.p99LatencyMs ?? "—"} ms</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <PageSection title="Requests over time">
          <Card>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" />
                    <XAxis dataKey="date" stroke="#605e5c" fontSize={12} />
                    <YAxis stroke="#605e5c" fontSize={12} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #edebe9", backgroundColor: "#fff" }} />
                    <Bar dataKey="requests" fill="#0078d4" radius={[4, 4, 0, 0]} name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Latency (p95)">
          <Card>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" />
                    <XAxis dataKey="date" stroke="#605e5c" fontSize={12} />
                    <YAxis stroke="#605e5c" fontSize={12} tickFormatter={(v) => `${v}ms`} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #edebe9", backgroundColor: "#fff" }} />
                    <Line type="monotone" dataKey="p95LatencyMs" stroke="#ff8c00" strokeWidth={2} dot={false} name="p95 latency (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </div>

      <PageSection title="Top endpoints" description="Highest-volume endpoints for the selected period.">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#605e5c]">
                <Activity className="h-4 w-4" /> Loading…
              </div>
            ) : (
              <DataTable
                data={data?.topEndpoints ?? []}
                columns={endpointColumns}
                pageSize={8}
                exportable
                exportFileName="api-top-endpoints"
                emptyMessage="No endpoints found."
              />
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Tenant breakdown" description="Request volume and performance by tenant.">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#605e5c]">
                <Timer className="h-4 w-4" /> Loading…
              </div>
            ) : (
              <DataTable
                data={data?.byTenant ?? []}
                columns={tenantColumns}
                pageSize={8}
                exportable
                exportFileName="api-tenant-usage"
                emptyMessage="No tenant usage found."
              />
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Notes">
        <Card>
          <CardContent className="pt-4 text-sm text-[#605e5c]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-[#ff8c00]" />
              <p>
                This is a seed-data dashboard for Phase 3.2. Backend integration will replace these aggregates with real-time
                analytics (per-tenant, per-key, per-endpoint).
              </p>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

