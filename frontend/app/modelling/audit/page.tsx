"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getPlatformAuditLogs, type AuditLogEntry } from "@/shared/services/superadminAuditService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { FileText } from "lucide-react"

export default function ModellingAuditPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }

  useEffect(() => {
    getPlatformAuditLogs({ tenantId: tenantId ?? undefined, limit: 50 }).then((data) => {
      setLogs(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Audit log</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Tenant activity and changes</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
              <FileText className="h-5 w-5 text-[#B8860B]" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <LoadingSkeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <FileText className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No audit entries for this tenant.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log._id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-xs font-medium text-[#B8860B]">
                        {log.action}
                      </span>
                      <span className="text-sm" style={{ color: theme.text }}>
                        {log.actorType}:{log.actorId}
                      </span>
                      <span className="text-xs" style={{ color: theme.textSecondary }}>
                        {log.entityType}:{log.entityId}
                      </span>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: theme.textSecondary }}>
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
