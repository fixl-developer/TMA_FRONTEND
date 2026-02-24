"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import type { CollaborationRequest } from "@/shared/lib/types/collaboration"
import { getCollaborationRequestById } from "@/shared/services/collaborationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function CollaborationRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [request, setRequest] = useState<CollaborationRequest | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getCollaborationRequestById(id).then(setRequest).finally(() => setLoading(false))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Request" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/collaboration/requests">Back</Link></Button></PageLayout>
  if (!request && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/collaboration/requests">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={request?.title ?? id}
        description={request?.description ?? "Collaboration request details. Seed data only."}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Users className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{request?.status ?? "—"}</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/collaboration/requests"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Requests</Link></Button>}
      />
      <PageSection title="Request information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>From</CardTitle></CardHeader><CardContent><p className="text-sm font-medium">{request?.requesterTenantName ?? request?.requesterTenantId ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>To</CardTitle></CardHeader><CardContent><p className="text-sm font-medium">{request?.targetTenantName ?? request?.targetTenantId ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Type</CardTitle></CardHeader><CardContent><p className="text-sm">{request?.type?.replace(/_/g, " ") ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${request?.status === "APPROVED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : request?.status === "PENDING" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" : "border-[#a80000] bg-[#fde7e9] text-[#a80000]"}`}>{request?.status ?? "—"}</span></CardContent></Card>
        </div>
      </PageSection>
      {request?.description && (
        <PageSection title="Description">
          <Card><CardContent className="pt-4"><p className="text-sm text-[#605e5c]">{request.description}</p></CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Timeline">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Requested:</strong> {request?.requestedAt ? format(new Date(request.requestedAt), "PPp") : "—"}</p>
          {request?.respondedAt && <p><strong>Responded:</strong> {format(new Date(request.respondedAt), "PPp")}</p>}
          {request?.expiresAt && <p><strong>Expires:</strong> {format(new Date(request.expiresAt), "PPp")}</p>}
          {request?.approvedBy && <p><strong>Approved by:</strong> {request.approvedBy}</p>}
          {request?.rejectionReason && <p><strong>Rejection reason:</strong> <span className="text-[#a80000]">{request.rejectionReason}</span></p>}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
