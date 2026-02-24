"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { ModerationRule } from "@/shared/lib/types/moderation"
import { getModerationRuleById } from "@/shared/services/moderationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function ModerationRuleDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [rule, setRule] = useState<ModerationRule | undefined>(undefined)

  useEffect(() => { if (id) getModerationRuleById(id).then(setRule) }, [id])

  if (!id) return <PageLayout><PageHeader title="Rule" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/moderation/rules">Back</Link></Button></PageLayout>
  if (!rule) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/moderation/rules">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={`Rule ${rule._id}`}
        description={rule.description ?? "Moderation rule details. Seed data only."}
        actions={<Button asChild variant="outline" size="sm"><Link href="/moderation/rules"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rules</Link></Button>}
      />
      <PageSection title="Configuration">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Name:</strong> {rule.name}</p>
          <p><strong>Trigger type:</strong> {rule.triggerType}</p>
          <p><strong>Status:</strong> {rule.status}</p>
          {rule.priority != null && <p><strong>Priority:</strong> {rule.priority}</p>}
          {rule.tenantId && <p><strong>Tenant:</strong> <span className="font-mono">{rule.tenantId}</span></p>}
        </CardContent></Card>
      </PageSection>
      {rule.triggerConditions && (
        <PageSection title="Trigger conditions">
          <Card><CardContent className="pt-4"><pre className="text-xs overflow-auto">{JSON.stringify(rule.triggerConditions, null, 2)}</pre></CardContent></Card>
        </PageSection>
      )}
      {rule.actions && rule.actions.length > 0 && (
        <PageSection title="Actions">
          <Card><CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {rule.actions.map((a) => <span key={a} className="rounded border border-[#edebe9] bg-[#faf9f8] px-2 py-1 text-xs">{a}</span>)}
            </div>
          </CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Performance metrics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card><CardHeader><CardTitle>Execution count</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{rule.executionCount?.toLocaleString() ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Success rate</CardTitle></CardHeader><CardContent><p className={`text-2xl font-semibold ${rule.successRate && rule.successRate >= 0.9 ? "text-[#107c10]" : rule.successRate && rule.successRate >= 0.8 ? "text-[#ff8c00]" : "text-[#a80000]"}`}>{rule.successRate ? `${(rule.successRate * 100).toFixed(1)}%` : "—"}</p></CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
