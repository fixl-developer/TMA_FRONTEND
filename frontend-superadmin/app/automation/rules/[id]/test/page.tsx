"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Play } from "lucide-react"
import type { AutomationRule } from "@/shared/lib/types/automation"
import { getAutomationRuleById } from "@/shared/services/automationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function AutomationRuleTestPage() {
  const params = useParams<{ id: string }>()
  const ruleId = params?.id
  const [rule, setRule] = useState<AutomationRule | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [testPayload, setTestPayload] = useState("{}")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; durationMs?: number } | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (!ruleId) return
    setLoading(true)
    getAutomationRuleById(ruleId).then(setRule).finally(() => setLoading(false))
  }, [ruleId])

  const handleRunTest = async () => {
    let payload: Record<string, unknown> = {}
    try {
      payload = JSON.parse(testPayload)
    } catch {
      showToast("Invalid JSON payload.", "warning")
      return
    }
    setRunning(true)
    setResult(null)
    try {
      // Mock dry-run: no backend yet
      await new Promise((r) => setTimeout(r, 800))
      setResult({
        success: true,
        message: "Dry-run completed (UI only – backend test endpoint not connected).",
        durationMs: 42,
      })
      showToast("Test run completed.", "success")
    } catch {
      setResult({ success: false, message: "Test run failed." })
      showToast("Test run failed.", "error")
    } finally {
      setRunning(false)
    }
  }

  if (!ruleId) {
    return (
      <PageLayout>
        <PageHeader title="Test rule" description="Invalid rule id." />
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
        title={`Test: ${rule?.name ?? ruleId}`}
        description="Dry-run simulator. Provide test payload (JSON). Result is mock until API is connected."
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">Test</span>}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/automation/rules/${ruleId}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rule details</Link>
          </Button>
        }
      />

      <PageSection title="Test input">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Payload (JSON)</CardTitle>
            <p className="text-xs text-[#605e5c]">Simulated trigger payload for dry-run. Backend POST /rules/:id/test not connected.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payload">JSON payload</Label>
              <textarea
                id="payload"
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="min-h-[120px] w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 font-mono text-sm"
                placeholder='{"entityId": "test-1", "tenantId": "T1"}'
              />
            </div>
            <Button size="sm" onClick={handleRunTest} disabled={running} className="gap-1.5">
              <Play className="h-3.5 w-3.5" />
              {running ? "Running…" : "Run dry-run"}
            </Button>
          </CardContent>
        </Card>
      </PageSection>

      {result && (
        <PageSection title="Result">
          <Card>
            <CardContent className="pt-4">
              <div className={`rounded border p-4 ${result.success ? "border-[#107c10] bg-[#dff6dd]" : "border-[#a80000] bg-[#fde7e9]"}`}>
                <p className="text-sm font-medium">{result.message}</p>
                {result.durationMs != null && <p className="mt-1 text-xs text-[#605e5c]">Duration: {result.durationMs}ms</p>}
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
