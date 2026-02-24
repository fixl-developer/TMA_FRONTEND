"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getLegalHoldById } from "@/shared/services/complianceService"
import type { LegalHold } from "@/shared/lib/types/compliance"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function LegalHoldReleasePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [hold, setHold] = useState<LegalHold | undefined>(undefined)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => { if (id) getLegalHoldById(id).then(setHold) }, [id])

  const handleRelease = async () => {
    if (!reason.trim()) { showToast("Enter release reason.", "warning"); return }
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      showToast("Hold released (UI only – backend later).", "success")
    } catch { showToast("Release failed.", "error") }
    finally { setSubmitting(false) }
  }

  if (!id) return <PageLayout><PageHeader title="Release" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/compliance/legal-holds">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader title={`Release hold ${hold?._id ?? id}`} description="Release confirmation and reason documentation. Seed/UI only." actions={<Button asChild variant="outline" size="sm"><Link href={`/compliance/legal-holds/${id}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Hold</Link></Button>} />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">Release legal hold</CardTitle><p className="text-sm text-[#605e5c]">Reason: {hold?.reason ?? "—"}</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Release reason</Label>
              <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-[80px] w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm" placeholder="Document why this hold is being released" />
            </div>
            <Button size="sm" onClick={handleRelease} disabled={submitting}>{submitting ? "Releasing…" : "Confirm release"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
