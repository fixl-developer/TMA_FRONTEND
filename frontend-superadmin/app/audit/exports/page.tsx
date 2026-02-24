/**
 * Audit Export History
 *
 * View and download previously exported audit logs.
 */

"use client"

import Link from "next/link"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"

export default function AuditExportsPage() {
  const exports = [
    {
      id: 1,
      filename: "audit_log_2024-02-01_to_2024-02-15.csv",
      format: "CSV",
      size: "2.4 MB",
      records: 15420,
      createdAt: "2024-02-15T14:30:00Z",
      expiresAt: "2024-03-15T14:30:00Z",
      status: "available"
    },
    {
      id: 2,
      filename: "security_events_january_2024.json",
      format: "JSON",
      size: "5.1 MB",
      records: 8932,
      createdAt: "2024-02-01T10:00:00Z",
      expiresAt: "2024-03-01T10:00:00Z",
      status: "available"
    },
    {
      id: 3,
      filename: "compliance_audit_q4_2023.pdf",
      format: "PDF",
      size: "1.8 MB",
      records: null,
      createdAt: "2024-01-15T09:00:00Z",
      expiresAt: "2024-02-15T09:00:00Z",
      status: "expired"
    }
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Export History"
        description="View and download previously exported audit logs"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-violet-500" />
            {exports.length} Exports
          </span>
        }
        actions={
          <Link
            href="/superadmin/audit"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      <PageSection title="Export files">
        <div className="space-y-4">
          {exports.map((exp) => (
            <Card key={exp.id} className="hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-mono">{exp.filename}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{exp.format}</Badge>
                      <span className="text-sm text-slate-600">{exp.size}</span>
                      {exp.records && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{exp.records.toLocaleString()} records</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant={exp.status === "available" ? "default" : "outline"}>
                    {exp.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    <p>Created: {new Date(exp.createdAt).toLocaleString()}</p>
                    <p className={exp.status === "expired" ? "text-rose-600" : ""}>
                      {exp.status === "expired" ? "Expired" : "Expires"}: {new Date(exp.expiresAt).toLocaleString()}
                    </p>
                  </div>
                  {exp.status === "available" && (
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
