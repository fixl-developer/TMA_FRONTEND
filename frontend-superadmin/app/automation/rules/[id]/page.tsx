"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, List, Play, FileText } from "lucide-react"
import type { AutomationRule, AutomationLog } from "@/shared/lib/types/automation"
import { getAutomationRuleById } from "@/shared/services/automationService"
import { getAutomationPackById } from "@/shared/services/automationService"
import { getAutomationLogsByRuleId } from "@/shared/services/automationService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function AutomationRuleDetailPage() {
  const params = useParams<{ id: string }>()
  const ruleId = params?.id
  const [rule, setRule] = useState<AutomationRule | undefined>(undefined)
  const [pack, setPack] = useState<Awaited<ReturnType<typeof getAutomationPackById>>>(undefined)
  const [logs, setLogs] = useState<AutomationLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ruleId) return
    setLoading(true)
    getAutomationRuleById(ruleId).then((r) => {
      setRule(r)
      if (r) return getAutomationPackById(r.packId).then(setPack)
    }).finally(() => setLoading(false))
    getAutomationLogsByRuleId(ruleId).then(setLogs)
  }, [ruleId])

  if (!ruleId) {
    return (
      <PageLayout>
        <PageHeader title="Rule not found" description="Invalid rule id." />
        <Button asChild variant="outline" size="sm"><Link href="/automation/rules">Back</Link></Button>
      </PageLayout>
    )
  }

  if (!rule && !loading) {
    return (
      <PageLayout>
        <PageHeader title={`Rule ${ruleId}`} description="Not found in seed data." />
        <Button asChild variant="outline" size="sm"><Link href="/automation/rules">Back to rules</Link></Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title={rule?.name ?? ruleId}
        description={rule?.description ?? "Rule definition, trigger, conditions, actions. Seed data only."}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <List className="h-3.5 w-3.5 text-[#0078d4]" />
            {rule?.trigger?.type ?? "—"} {rule?.trigger?.event ? `· ${rule.trigger.event}` : ""}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/automation/rules"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rules</Link>
            </Button>
            {pack && (
              <Link href={`/automation/packs/${pack.id}`}>
                <Button variant="outline" size="sm">Pack: {pack.name}</Button>
              </Link>
            )}
            <Link href={`/automation/rules/${ruleId}/test`}>
              <Button size="sm" className="gap-1.5">
                <Play className="h-3.5 w-3.5" /> Test rule
              </Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <span className={`rounded border px-2 py-1 text-sm font-medium ${
                rule?.status === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
              }`}>
                {rule?.status ?? "—"}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Executions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130]">{rule?.stats?.executionCount ?? 0}</p>
              <p className="text-xs text-[#605e5c]">Success: {rule?.stats?.successCount ?? 0} · Fail: {rule?.stats?.failureCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Avg duration</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4]">
                {rule?.stats?.avgDurationMs != null ? `${rule.stats.avgDurationMs}ms` : "—"}
              </p>
              <p className="text-xs text-[#605e5c]">
                Last run: {rule?.stats?.lastRunAt ? format(new Date(rule.stats.lastRunAt), "PPp") : "—"}
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Definition">
        <Card>
          <CardHeader><CardTitle className="text-sm">Trigger</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"><strong>Type:</strong> {rule?.trigger?.type ?? "—"}</p>
            {rule?.trigger?.event && <p className="text-sm"><strong>Event:</strong> <code className="rounded bg-[#f3f2f1] px-1">{rule.trigger.event}</code></p>}
            {rule?.trigger?.schedule && <p className="text-sm"><strong>Schedule:</strong> <code className="rounded bg-[#f3f2f1] px-1">{rule.trigger.schedule}</code></p>}
          </CardContent>
        </Card>
        {(rule?.conditions?.length ?? 0) > 0 && (
          <Card className="mt-3">
            <CardHeader><CardTitle className="text-sm">Conditions</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-[#605e5c]">
                {rule!.conditions!.map((c, i) => (
                  <li key={i}>{c.expression} {c.description ? `(${c.description})` : ""}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {(rule?.actions?.length ?? 0) > 0 && (
          <Card className="mt-3">
            <CardHeader><CardTitle className="text-sm">Actions</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-[#605e5c]">
                {rule!.actions!.map((a, i) => (
                  <li key={i}>{a.type} {a.config && Object.keys(a.config).length > 0 ? JSON.stringify(a.config) : ""}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </PageSection>

      <PageSection title="Recent execution logs">
        <Card>
          <CardContent className="p-0">
            <div className="space-y-2 p-4">
              {logs.length === 0 ? (
                <p className="text-sm text-[#605e5c]">No execution logs in seed for this rule.</p>
              ) : (
                logs.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-mono text-xs text-[#605e5c]">{log.id}</p>
                      <p className="text-xs text-[#605e5c]">
                        {format(new Date(log.startedAt), "PPp")} · {log.durationMs ?? "—"}ms
                        {log.tenantId && ` · ${log.tenantId}`}
                      </p>
                    </div>
                    <span className={`rounded border px-2 py-0.5 text-xs ${
                      log.status === "SUCCESS" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
                      log.status === "FAILED" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" :
                      "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-[#edebe9] px-4 py-2">
              <Link href="/automation/logs">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  View all logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
