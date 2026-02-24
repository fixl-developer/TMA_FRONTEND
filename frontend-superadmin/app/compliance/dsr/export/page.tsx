"use client"

import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"
import { useState } from "react"

export default function DsrExportPage() {
  const [requestId, setRequestId] = useState("")
  const [format, setFormat] = useState("JSON")
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleExport = async () => {
    if (!requestId.trim()) { showToast("Enter request ID.", "warning"); return }
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      showToast("Export initiated (UI only – backend POST /dsr/:id/export not connected).", "success")
    } catch { showToast("Export failed.", "error") }
    finally { setSubmitting(false) }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Data export interface"
        description="Export configuration, data selection, format options. Seed/UI only."
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Download className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />Export</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/compliance/dsr"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />DSR</Link></Button>}
      />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">Export configuration</CardTitle><p className="text-sm text-[#605e5c]">Backend POST /v1/superadmin/compliance/dsr/:id/export not connected.</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-id">DSR Request ID</Label>
              <Input id="request-id" value={requestId} onChange={(e) => setRequestId(e.target.value)} placeholder="e.g. dsr_001" />
            </div>
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="format">Format</Label>
              <select id="format" value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm">
                <option value="JSON">JSON</option>
                <option value="CSV">CSV</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
            <Button size="sm" onClick={handleExport} disabled={submitting} className="gap-1.5"><Download className="h-3.5 w-3.5" />{submitting ? "Exporting…" : "Initiate export"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
