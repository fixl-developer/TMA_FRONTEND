"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function RbacSimulatorPage() {
  const [roleId, setRoleId] = useState("")
  const [action, setAction] = useState("")
  const [resource, setResource] = useState("")
  const [result, setResult] = useState<{ allowed: boolean; reason?: string } | null>(null)
  const { showToast } = useToast()

  const handleTest = async () => {
    if (!roleId || !action || !resource) { showToast("Enter role, action, and resource.", "warning"); return }
    setResult(null)
    try {
      await new Promise((r) => setTimeout(r, 400))
      setResult({ allowed: Math.random() > 0.5, reason: "Mock evaluation (UI only – backend POST /rbac/policies/evaluate not connected)." })
      showToast("Test completed.", "success")
    } catch { showToast("Test failed.", "error") }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Role testing tool"
        description="Select user/role, test actions, view decision trace. Seed/UI only."
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">Simulator</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/rbac/roles"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Roles</Link></Button>}
      />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">Test action</CardTitle><p className="text-sm text-[#605e5c]">Mock policy evaluation. Backend POST /rbac/policies/evaluate not connected.</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role ID</Label>
              <Input id="role" value={roleId} onChange={(e) => setRoleId(e.target.value)} placeholder="e.g. ROLE-001" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Input id="action" value={action} onChange={(e) => setAction(e.target.value)} placeholder="e.g. view_pageant" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource">Resource</Label>
                <Input id="resource" value={resource} onChange={(e) => setResource(e.target.value)} placeholder="e.g. pageants" />
              </div>
            </div>
            <Button size="sm" onClick={handleTest} className="gap-1.5"><Play className="h-3.5 w-3.5" />Test</Button>
            {result && (
              <div className={`rounded border p-4 ${result.allowed ? "border-[#107c10] bg-[#dff6dd]" : "border-[#a80000] bg-[#fde7e9]"}`}>
                <p className="font-medium">{result.allowed ? "Allowed" : "Denied"}</p>
                {result.reason && <p className="mt-1 text-xs text-[#605e5c]">{result.reason}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
