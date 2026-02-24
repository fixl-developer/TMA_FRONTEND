"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"
import type { AutomationLog } from "@/shared/lib/types/automation"
import { getAutomationLogs } from "@/shared/services/automationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

export default function AutomationLogsPage() {
  const [logs, setLogs] = useState<AutomationLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAutomationLogs().then(setLogs).finally(() => setLoading(false))
  }, [])

  const columns: Column<AutomationLog>[] = [
    {
      key: "id",
      header: "Log ID",
      render: (v) => <span className="font-mono text-xs">{String(v)}</span>,
    },
    {
      key: "ruleName",
      header: "Rule",
      render: (v) => <span className="text-sm">{String(v ?? "—")}</span>,
    },
    {
      key: "ruleId",
      header: "Rule ID",
      render: (v) => <span className="font-mono text-xs text-[#605e5c]">{String(v)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const s = String(v)
        const cls =
          s === "SUCCESS" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
          s === "FAILED" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" :
          s === "RUNNING" ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]" :
          "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
        return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
      },
    },
    {
      key: "startedAt",
      header: "Started",
      render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span>,
    },
    {
      key: "durationMs",
      header: "Duration",
      render: (v) => <span className="text-xs">{v != null ? `${v}ms` : "—"}</span>,
    },
    {
      key: "tenantId",
      header: "Tenant",
      render: (v) => <span className="text-xs">{v ? String(v) : "—"}</span>,
    },
    {
      key: "errorMessage",
      header: "Error",
      render: (v) => (v ? <span className="text-xs text-[#a80000]">{String(v)}</span> : "—"),
    },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Execution logs"
        description="All automation rule executions. Filter by rule, status, tenant. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileText className="h-3.5 w-3.5 text-[#0078d4]" />
            Logs
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/automation"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Overview</Link>
          </Button>
        }
      />

      <PageSection>
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div>
            ) : (
              <DataTable
                data={logs}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName="automation-logs"
                emptyMessage="No execution logs in seed."
              />
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
