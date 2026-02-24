/**
 * Compliance Reports
 *
 * Generate compliance audit reports for regulatory requirements.
 */

"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Download, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"

export default function ComplianceReportsPage() {
  const reports = [
    {
      id: 1,
      name: "GDPR Compliance Report",
      description: "Data access and processing activities",
      period: "Q1 2024",
      status: "ready",
      generatedAt: "2024-02-15T10:00:00Z"
    },
    {
      id: 2,
      name: "SOC 2 Audit Trail",
      description: "Security and availability controls",
      period: "January 2024",
      status: "ready",
      generatedAt: "2024-02-01T10:00:00Z"
    },
    {
      id: 3,
      name: "Financial Transactions Log",
      description: "All payment and financial activities",
      period: "February 2024",
      status: "generating",
      generatedAt: null
    }
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Compliance Reports"
        description="Generate and download compliance audit reports"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-emerald-500" />
            Compliance
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Generate New Report
            </Button>
            <Link
              href="/superadmin/audit"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        }
      />

      <PageSection title="Available reports">
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                  </div>
                  <Badge variant={report.status === "ready" ? "default" : "outline"}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Period: {report.period}</span>
                    </div>
                    {report.generatedAt && (
                      <span>Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  {report.status === "ready" && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  )
}
