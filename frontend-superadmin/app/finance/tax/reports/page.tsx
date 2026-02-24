"use client"

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import taxReports from "@/data/seed/taxReports.json"

type TaxReport = (typeof taxReports)[number]

export default function FinanceTaxReportsPage() {
  const reports = taxReports as TaxReport[]

  const columns: Column<TaxReport>[] = [
    {
      key: "_id",
      header: "Report",
      render: (v, row) => (
        <div>
          <p className="text-sm font-semibold text-[#323130]">{String(v)}</p>
          <p className="text-xs text-[#605e5c]">
            {row.period} · {row.jurisdiction}
          </p>
        </div>
      ),
    },
    {
      key: "outputTax",
      header: "Output tax",
      render: (v) => <span className="text-sm text-[#605e5c]">{Number(v).toLocaleString()}</span>,
    },
    {
      key: "inputTax",
      header: "Input tax",
      render: (v) => <span className="text-sm text-[#605e5c]">{Number(v).toLocaleString()}</span>,
    },
    {
      key: "netTax",
      header: "Net tax",
      render: (v) => <span className="text-sm font-semibold text-[#323130]">{Number(v).toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const s = String(v)
        const cls =
          s === "FILED"
            ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
            : "border-[#ff8c00] bg-[#fff4ce] text-[#c75000]"
        return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
      },
    },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Tax reports"
        description="Tax summary reports, GST/VAT summaries, and filing exports (seed data only)."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileText className="h-3.5 w-3.5 text-[#0078d4]" />
            Reports
          </span>
        }
        actions={
          <Link href="/finance">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Finance
            </Button>
          </Link>
        }
      />

      <PageSection title="Reports">
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={reports}
              columns={columns}
              pageSize={10}
              exportable
              exportFileName="tax-reports"
              emptyMessage="No tax reports in seed data."
            />
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

