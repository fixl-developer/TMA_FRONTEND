"use client"

import { useEffect, useState } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getPlatformAuditLogs, type AuditLogEntry } from "@/shared/services/superadminAuditService"
import { exportToCsv } from "@/shared/lib/exportCsv"
import { FileText, Download, Lock, ShieldCheck } from "lucide-react"

export default function SuperadminAuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantFilter, setTenantFilter] = useState<string>("")

  useEffect(() => {
    getPlatformAuditLogs({ tenantId: tenantFilter || undefined, limit: 50 }).then((data) => {
      setLogs(data)
      setLoading(false)
    })
  }, [tenantFilter])

  return (
    <PageLayout>
      <PageHeader
        title="Platform audit log"
        description="Platform-wide activity and changes."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            Audit
          </span>
        }
      />

      <PageSection title="Audit entries">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Recent activity</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCsv(logs as any[], `audit-log-${new Date().toISOString().slice(0, 10)}`, ["_id", "action", "actorType", "actorId", "entityType", "entityId", "tenantId", "createdAt", "signature"])}
                >
                  <Download className="mr-1 h-4 w-4" /> Export CSV
                </Button>
                <input
                  type="text"
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value)}
                  placeholder="Filter by tenant ID"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <LoadingSkeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No audit entries.</p>
            ) : (
              <div className="space-y-2">
                <p className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="h-3.5 w-3.5" />
                  Immutable audit log — entries are signed and cannot be modified.
                </p>
                {logs.map((log) => (
                  <div
                    key={log._id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-3 min-w-0">
                      <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {log.action}
                      </span>
                      {log.immutable !== false && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700" title="Signed & immutable">
                          <ShieldCheck className="h-3 w-3" />
                          Signed
                        </span>
                      )}
                      <span className="text-sm text-slate-700">
                        {log.actorType}:{log.actorId}
                      </span>
                      <span className="text-xs text-slate-500">
                        {log.entityType}:{log.entityId}
                      </span>
                      {log.tenantId && (
                        <span className="text-xs text-slate-400">tenant: {log.tenantId}</span>
                      )}
                      {log.signature && (
                        <span className="text-[10px] text-slate-400 font-mono" title="Signature">
                          {log.signature}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 shrink-0" title="Timestamp">
                      {new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
