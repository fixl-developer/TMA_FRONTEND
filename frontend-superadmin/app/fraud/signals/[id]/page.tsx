"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import type { FraudSignal } from "@/shared/lib/types/fraud"
import { getFraudSignalById } from "@/shared/services/fraudService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function FraudSignalDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [signal, setSignal] = useState<FraudSignal | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getFraudSignalById(id).then(setSignal).finally(() => setLoading(false))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Signal" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/fraud/signals">Back</Link></Button></PageLayout>
  if (!signal && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/fraud/signals">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={`Signal ${signal?.id ?? id}`}
        description={signal?.description ?? "Signal details. Seed data only."}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{signal?.status ?? "—"}</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/fraud/signals"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Signals</Link></Button>}
      />
      <PageSection title="Signal information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Type</CardTitle></CardHeader><CardContent><p className="text-sm">{signal?.type ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Severity</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${signal?.severity === "critical" ? "border-[#a80000] bg-[#fde7e9]" : "border-[#ff8c00] bg-[#fff4ce]"}`}>{signal?.severity ?? "—"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Risk score</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{signal?.riskScore ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Entity</CardTitle></CardHeader><CardContent><p className="text-sm font-mono">{signal?.entityType}: {signal?.entityId}</p></CardContent></Card>
        </div>
      </PageSection>
      <PageSection title="Description">
        <Card><CardContent className="pt-4"><p className="text-sm">{signal?.description ?? "—"}</p></CardContent></Card>
      </PageSection>
      {signal?.indicators && signal.indicators.length > 0 && (
        <PageSection title="Indicators">
          <Card><CardContent className="pt-4"><ul className="list-disc list-inside text-sm space-y-1">{signal.indicators.map((i, idx) => <li key={idx}>{i}</li>)}</ul></CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Assignment & action">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Assigned to:</strong> {signal?.assignedTo ?? "—"}</p>
          <p><strong>Action taken:</strong> {signal?.actionTaken ?? "—"}</p>
          {signal?.resolution && <p><strong>Resolution:</strong> {signal.resolution}</p>}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Timeline">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Detected:</strong> {signal?.detectedAt ? format(new Date(signal.detectedAt), "PPp") : "—"}</p>
          {signal?.resolvedAt && <p><strong>Resolved:</strong> {format(new Date(signal.resolvedAt), "PPp")}</p>}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
