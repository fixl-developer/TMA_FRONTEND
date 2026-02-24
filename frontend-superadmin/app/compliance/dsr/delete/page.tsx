"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function DsrDeletePage() {
  const [requestId, setRequestId] = useState("")
  const [scope, setScope] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleDelete = async () => {
    if (!requestId.trim()) { showToast("Enter request ID.", "warning"); return }
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      showToast("Deletion workflow initiated (UI only – backend POST /dsr/:id/delete not connected).", "success")
    } catch { showToast("Deletion failed.", "error") }
    finally { setSubmitting(false) }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Deletion workflow"
        description="Deletion scope, retention checks, legal hold checks, confirmation. Seed/UI only."
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Trash2 className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />Delete</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/compliance/dsr"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />DSR</Link></Button>}
      />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">Deletion workflow</CardTitle><p className="text-sm text-[#605e5c]">Backend POST /v1/superadmin/compliance/dsr/:id/delete not connected. Retention and legal hold checks will be performed.</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-id">DSR Request ID</Label>
              <Input id="request-id" value={requestId} onChange={(e) => setRequestId(e.target.value)} placeholder="e.g. dsr_001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope">Deletion scope</Label>
              <textarea id="scope" value={scope} onChange={(e) => setScope(e.target.value)} className="min-h-[80px] w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm" placeholder="Describe what data should be deleted" />
            </div>
            <Button size="sm" onClick={handleDelete} disabled={submitting} className="gap-1.5"><Trash2 className="h-3.5 w-3.5" />{submitting ? "Processing…" : "Initiate deletion"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
