"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, Ban } from "lucide-react"
import type { ModerationItem } from "@/shared/lib/types/moderation"
import { getModerationItemById } from "@/shared/services/moderationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/toast"
import { format } from "date-fns"

export default function ModerationItemDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [item, setItem] = useState<ModerationItem | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getModerationItemById(id).then(setItem).finally(() => setLoading(false))
  }, [id])

  const handleAction = async (action: string) => {
    showToast(`Action "${action}" initiated (UI only – backend POST /moderation/queue/:id/action not connected).`, "success")
  }

  if (!id) return <PageLayout><PageHeader title="Item" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/moderation/queue">Back</Link></Button></PageLayout>
  if (!item && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/moderation/queue">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={`Moderation Item ${item?._id ?? id}`}
        description={`${item?.contentType ?? "—"} content review. Seed data only.`}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{item?.status ?? "—"}</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/moderation/queue"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Queue</Link></Button>}
      />
      <PageSection title="Content information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Content ID</CardTitle></CardHeader><CardContent><p className="text-sm font-mono">{item?.contentId ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Type</CardTitle></CardHeader><CardContent><p className="text-sm">{item?.contentType ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Priority</CardTitle></CardHeader><CardContent><span className={`text-sm ${item?.priority === "URGENT" ? "text-[#a80000]" : item?.priority === "HIGH" ? "text-[#ff8c00]" : "text-[#605e5c]"}`}>{item?.priority ?? "—"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Strikes</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{item?.strikeCount ?? 0}</p></CardContent></Card>
        </div>
      </PageSection>
      {item?.reason && (
        <PageSection title="Reason">
          <Card><CardContent className="pt-4"><p className="text-sm font-medium">{item.reason}</p></CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Assignment">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Assigned to:</strong> {item?.assignedTo ? <span className="font-mono">{item.assignedTo}</span> : <span className="text-[#605e5c]">Unassigned</span>}</p>
          <p><strong>Reported by:</strong> {item?.reportedBy ? <span className="font-mono">{item.reportedBy}</span> : "—"}</p>
        </CardContent></Card>
      </PageSection>
      <PageSection title="Timeline">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Created:</strong> {item?.createdAt ? format(new Date(item.createdAt), "PPp") : "—"}</p>
          {item?.reportedAt && <p><strong>Reported:</strong> {format(new Date(item.reportedAt), "PPp")}</p>}
          {item?.reviewedAt && <p><strong>Reviewed:</strong> {format(new Date(item.reviewedAt), "PPp")}</p>}
          {item?.reviewedBy && <p><strong>Reviewed by:</strong> <span className="font-mono">{item.reviewedBy}</span></p>}
          {item?.action && <p><strong>Action taken:</strong> {item.action}</p>}
        </CardContent></Card>
      </PageSection>
      <PageSection title="Moderation actions">
        <Card><CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleAction("APPROVE")} className="gap-1.5"><CheckCircle className="h-3.5 w-3.5" />Approve</Button>
            <Button size="sm" variant="outline" onClick={() => handleAction("REJECT")} className="gap-1.5"><XCircle className="h-3.5 w-3.5" />Reject</Button>
            <Button size="sm" variant="outline" onClick={() => handleAction("QUARANTINE")} className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />Quarantine</Button>
            <Button size="sm" variant="outline" onClick={() => handleAction("DELETE")} className="gap-1.5"><Ban className="h-3.5 w-3.5" />Delete</Button>
            <Button size="sm" variant="outline" onClick={() => handleAction("WARN")}>Warn</Button>
            <Button size="sm" variant="outline" onClick={() => handleAction("STRIKE")}>Strike</Button>
          </div>
          <p className="mt-3 text-xs text-[#605e5c]">Actions are UI-only. Backend POST /v1/superadmin/moderation/queue/:id/action not connected.</p>
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
