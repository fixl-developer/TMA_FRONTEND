"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import type { DsrRequest } from "@/shared/lib/types/compliance"
import { getDsrRequestById } from "@/shared/services/complianceService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function DsrRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [request, setRequest] = useState<DsrRequest | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getDsrRequestById(id).then(setRequest).finally(() => setLoading(false))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Request" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/compliance/dsr">Back</Link></Button></PageLayout>
  if (!request && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/compliance/dsr">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={`DSR Request ${request?._id ?? id}`}
        description={`${request?.type ?? "—"} request. Seed data only.`}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{request?.status ?? "—"}</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/compliance/dsr"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />DSR</Link></Button>}
      />
      <PageSection title="Request information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Type</CardTitle></CardHeader><CardContent><p className="text-sm font-medium">{request?.type ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${request?.status === "COMPLETED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : request?.status === "PENDING" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" : "border-[#edebe9] bg-[#f3f2f1]"}`}>{request?.status ?? "—"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>SLA status</CardTitle></CardHeader><CardContent><span className={`text-sm ${request?.slaStatus === "BREACHED" ? "text-[#a80000]" : request?.slaStatus === "AT_RISK" ? "text-[#ff8c00]" : "text-[#107c10]"}`}>{request?.slaStatus ?? "—"}</span></CardContent></Card>
          {request?.priority && <Card><CardHeader><CardTitle>Priority</CardTitle></CardHeader><CardContent><p className="text-sm">{request.priority}</p></CardContent></Card>}
        </div>
      </PageSection>
      <PageSection title="Data subject">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>User ID:</strong> <span className="font-mono">{request?.userId ?? "—"}</span></p>
          <p><strong>Tenant ID:</strong> <span className="font-mono">{request?.tenantId ?? "—"}</span></p>
          {request?.dataSubjectName && <p><strong>Name:</strong> {request.dataSubjectName}</p>}
          {request?.dataSubjectEmail && <p><strong>Email:</strong> {request.dataSubjectEmail}</p>}
        </CardContent></Card>
      </PageSection>
      {request?.description && (
        <PageSection title="Description">
          <Card><CardContent className="pt-4"><p className="text-sm text-[#605e5c]">{request.description}</p></CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Timeline">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Requested:</strong> {request?.requestedAt ? format(new Date(request.requestedAt), "PPp") : "—"}</p>
          {request?.completedAt && <p><strong>Completed:</strong> {format(new Date(request.completedAt), "PPp")}</p>}
          {request?.dueDate && <p><strong>Due date:</strong> {format(new Date(request.dueDate), "PPp")}</p>}
          {request?.slaDays && <p><strong>SLA:</strong> {request.slaDays} days</p>}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
