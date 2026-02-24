"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import type { AutomationPack, AutomationRule } from "@/shared/lib/types/automation"
import { getAutomationPackById } from "@/shared/services/automationService"
import { getAutomationRulesByPackId } from "@/shared/services/automationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function AutomationPackDetailPage() {
  const params = useParams<{ id: string }>()
  const packId = params?.id
  const [pack, setPack] = useState<AutomationPack | undefined>(undefined)
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!packId) return
    setLoading(true)
    Promise.all([getAutomationPackById(packId), getAutomationRulesByPackId(packId)])
      .then(([p, r]) => {
        setPack(p)
        setRules(r)
      })
      .finally(() => setLoading(false))
  }, [packId])

  const HealthIcon = pack?.health === "ok" ? CheckCircle : pack?.health === "warning" ? AlertTriangle : XCircle
  const healthClass = pack?.health === "ok" ? "text-[#107c10]" : pack?.health === "warning" ? "text-[#ff8c00]" : "text-[#a80000]"

  if (!packId) {
    return (
      <PageLayout>
        <PageHeader title="Pack not found" description="Invalid pack id." />
        <Button asChild variant="outline" size="sm"><Link href="/automation/packs">Back</Link></Button>
      </PageLayout>
    )
  }

  if (!pack && !loading) {
    return (
      <PageLayout>
        <PageHeader title={`Pack ${packId}`} description="Not found in seed data." />
        <Button asChild variant="outline" size="sm"><Link href="/automation/packs">Back to packs</Link></Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title={pack?.name ?? packId}
        description={pack?.description ?? "Automation pack details. Seed data only."}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Package className="h-3.5 w-3.5 text-[#0078d4]" />
            {pack?.status ?? "—"}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/automation/packs"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Packs</Link>
            </Button>
            <Link href="/automation/rules">
              <Button variant="outline" size="sm">View all rules</Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <span className={`rounded border px-2 py-1 text-sm font-medium ${
                pack?.status === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
              }`}>
                {pack?.status ?? "—"}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Health</CardTitle></CardHeader>
            <CardContent>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${healthClass}`}>
                <HealthIcon className="h-4 w-4" />
                {pack?.health ?? "—"}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Rules</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130]">{pack?.ruleIds?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tenant adoptions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4]">{pack?.tenantAdoptionCount ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {pack?.dependencies && pack.dependencies.length > 0 && (
        <PageSection title="Dependencies">
          <Card>
            <CardContent className="pt-4">
              <ul className="list-inside list-disc text-sm text-[#605e5c]">
                {pack.dependencies.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </PageSection>
      )}

      <PageSection title="Rules in this pack">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-8 text-center text-sm text-[#605e5c]">Loading…</div>
            ) : rules.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#605e5c]">No rules in seed for this pack.</div>
            ) : (
              <ul className="divide-y divide-[#edebe9]">
                {rules.map((r) => (
                  <li key={r.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#323130]">{r.name}</p>
                      <p className="text-xs text-[#605e5c] font-mono">{r.id} · {r.trigger.type} {r.trigger.event ? `· ${r.trigger.event}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-2 py-0.5 text-xs ${
                        r.status === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
                      }`}>
                        {r.status}
                      </span>
                      <Link href={`/automation/rules/${r.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">Details</Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
