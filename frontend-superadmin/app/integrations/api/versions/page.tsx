"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, GitBranch, Wrench, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { getApiVersions } from "@/shared/services/integrationsService"

type ApiVersion = {
  _id: string
  version: string
  status: "ACTIVE" | "BETA" | "DEPRECATED"
  releasedAt: string
  deprecationAt: string | null
  sunsetAt: string | null
  notes?: string
}

function formatDate(d: string | null) {
  if (!d) return "—"
  try {
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })
  } catch {
    return d
  }
}

export default function ApiVersionsPage() {
  const [versions, setVersions] = useState<ApiVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getApiVersions()
      .then((d) => setVersions(d as ApiVersion[]))
      .finally(() => setLoading(false))
  }, [])

  const metrics = useMemo(() => {
    const active = versions.filter((v) => v.status === "ACTIVE").length
    const beta = versions.filter((v) => v.status === "BETA").length
    const deprecated = versions.filter((v) => v.status === "DEPRECATED").length
    return { total: versions.length, active, beta, deprecated }
  }, [versions])

  const columns: Column<ApiVersion>[] = useMemo(
    () => [
      {
        key: "version",
        header: "Version",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.version}</p>
            <p className="text-xs text-[#605e5c]">{row.notes ?? "—"}</p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const Icon = s === "ACTIVE" ? CheckCircle : s === "BETA" ? Clock : XCircle
          const cls =
            s === "ACTIVE"
              ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
              : s === "BETA"
                ? "border-[#ff8c00] bg-[#fff4ce] text-[#c75000]"
                : "border-[#a80000] bg-[#fde7e9] text-[#a80000]"
          return (
            <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>
              <Icon className="h-3.5 w-3.5" />
              {s}
            </span>
          )
        },
      },
      {
        key: "releasedAt",
        header: "Released",
        render: (v) => <span className="text-sm text-[#605e5c]">{formatDate(String(v))}</span>,
      },
      {
        key: "deprecationAt",
        header: "Deprecation",
        render: (v) => <span className="text-sm text-[#605e5c]">{formatDate(v as any)}</span>,
      },
      {
        key: "sunsetAt",
        header: "Sunset",
        render: (v) => <span className="text-sm text-[#605e5c]">{formatDate(v as any)}</span>,
      },
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">
              Details
            </Button>
            {row.status !== "DEPRECATED" && (
              <Button size="sm" variant="ghost" className="h-7 text-xs text-[#605e5c]">
                Deprecate
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="API versions"
        description="Manage API versions, deprecation timelines, and migration readiness. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <GitBranch className="h-3.5 w-3.5 text-[#0078d4]" />
            Versioning
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/integrations/api/usage">
              <Button variant="outline" size="sm">Usage</Button>
            </Link>
            <Link href="/integrations/api/rate-limits">
              <Button variant="outline" size="sm">Rate limits</Button>
            </Link>
            <Link href="/integrations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Integrations
              </Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Total versions</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Active</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.active}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Beta</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loading ? "—" : metrics.beta}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Deprecated</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#a80000]">{loading ? "—" : metrics.deprecated}</p></CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Versions">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading versions…</div>
            ) : (
              <DataTable
                data={versions}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName="api-versions"
                emptyMessage="No versions found."
              />
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Migration tooling (placeholder)">
        <Card>
          <CardContent className="pt-4 text-sm text-[#605e5c]">
            <div className="flex items-start gap-2">
              <Wrench className="h-4 w-4 mt-0.5 text-[#0078d4]" />
              <p>
                In a later phase we’ll add migration tools and docs links per version, plus tenant impact analysis (which tenants
                still call deprecated endpoints).
              </p>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-[#ff8c00]" />
              <p>
                Deprecation and sunset dates are informational in seed mode. Eventually these will drive warnings and enforcement.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

