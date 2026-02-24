"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ShieldCheck, ArrowLeft, AlertTriangle } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import verificationData from "@/data/seed/backupVerification.json"

type Verification = (typeof verificationData)[number]

export default function BackupVerificationPage() {
  const verifications = verificationData as Verification[]

  const metrics = useMemo(() => {
    const total = verifications.length
    const failed = verifications.filter((v) => v.status === "FAILED").length
    const passed = verifications.filter((v) => v.status === "PASSED").length
    const warnings = verifications.filter((v) => v.status === "PASSED_WITH_WARNINGS").length
    return { total, passed, failed, warnings }
  }, [verifications])

  const columns: Column<Verification>[] = useMemo(
    () => [
      {
        key: "snapshotId",
        header: "Snapshot",
        render: (v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{String(v)}</p>
            <p className="text-xs text-[#605e5c]">
              {new Date(String(row.performedAt)).toLocaleString("en-IN")}
            </p>
          </div>
        ),
      },
      {
        key: "type",
        header: "Type",
        render: (v) => (
          <span className="text-xs text-[#605e5c]">{String(v)}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "PASSED"
              ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
              : s === "FAILED"
                ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]"
                : "border-[#ff8c00] bg-[#fff4ce] text-[#c75000]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
      },
      {
        key: "issuesFound",
        header: "Issues",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">{Number(v)}</span>
        ),
      },
      {
        key: "durationSeconds",
        header: "Duration",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">
            {Math.round(Number(v) / 60)} min
          </span>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Backup verification"
        description="Verification status, integrity checks, test restores, and compliance reports. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0078d4]" />
            Verification
          </span>
        }
        actions={
          <Link href="/backup/config">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Config
            </Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Total runs</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{metrics.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Passed</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{metrics.passed}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Warnings</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{metrics.warnings}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Failed</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#a80000]">{metrics.failed}</p></CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Verification runs">
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={verifications}
              columns={columns}
              pageSize={10}
              exportable
              exportFileName="backup-verification"
              emptyMessage="No verification runs found."
            />
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Compliance notes">
        <Card>
          <CardContent className="pt-4 text-sm text-[#605e5c] space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-[#ff8c00]" />
              <p>
                In a later phase this page will be backed by{" "}
                <span className="font-mono text-xs">GET /v1/superadmin/backup/verification</span> and export signed reports for
                audit evidence (GDPR, DPDP, SOC 2).
              </p>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

