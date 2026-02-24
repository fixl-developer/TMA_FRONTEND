"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"
import type { LegalHold } from "@/shared/lib/types/compliance"
import { getLegalHoldById } from "@/shared/services/complianceService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function LegalHoldDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [hold, setHold] = useState<LegalHold | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getLegalHoldById(id).then(setHold).finally(() => setLoading(false))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Hold" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/compliance/legal-holds">Back</Link></Button></PageLayout>
  if (!hold && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/compliance/legal-holds">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={`Legal Hold ${hold?._id ?? id}`}
        description={hold?.reason ?? "Legal hold details. Seed data only."}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Lock className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{hold?.status ?? "—"}</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/compliance/legal-holds"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Legal Holds</Link></Button>
            {hold?.status === "ACTIVE" && <Link href={`/compliance/legal-holds/${id}/release`}><Button size="sm">Release</Button></Link>}
          </div>
        }
      />
      <PageSection title="Hold information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${hold?.status === "ACTIVE" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" : "border-[#107c10] bg-[#dff6dd] text-[#107c10]"}`}>{hold?.status ?? "—"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Tenant</CardTitle></CardHeader><CardContent><p className="text-sm font-mono">{hold?.tenantId ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Affected data</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{hold?.affectedDataCount?.toLocaleString() ?? "—"}</p></CardContent></Card>
          {hold?.expiresAt && <Card><CardHeader><CardTitle>Expires</CardTitle></CardHeader><CardContent><p className="text-sm">{format(new Date(hold.expiresAt), "PPp")}</p></CardContent></Card>}
        </div>
      </PageSection>
      <PageSection title="Reason">
        <Card><CardContent className="pt-4"><p className="text-sm font-medium">{hold?.reason ?? "—"}</p></CardContent></Card>
      </PageSection>
      {hold?.entityTypes && hold.entityTypes.length > 0 && (
        <PageSection title="Affected entity types">
          <Card><CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {hold.entityTypes.map((et) => <span key={et} className="rounded border border-[#edebe9] bg-[#faf9f8] px-2 py-1 text-xs">{et}</span>)}
            </div>
          </CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Timeline">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Created:</strong> {hold?.createdAt ? format(new Date(hold.createdAt), "PPp") : "—"}</p>
          {hold?.releasedAt && <p><strong>Released:</strong> {format(new Date(hold.releasedAt), "PPp")}</p>}
          {hold?.releasedBy && <p><strong>Released by:</strong> {hold.releasedBy}</p>}
          {hold?.releaseReason && <p><strong>Release reason:</strong> {hold.releaseReason}</p>}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
