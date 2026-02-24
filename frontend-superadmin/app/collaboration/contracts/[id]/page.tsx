"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { CollaborationContract } from "@/shared/lib/types/collaboration"
import { getCollaborationContracts } from "@/shared/services/collaborationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function CollaborationContractDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [contract, setContract] = useState<CollaborationContract | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    getCollaborationContracts().then((contracts) => setContract(contracts.find((c) => c.id === id)))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Contract" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/collaboration/contracts">Back</Link></Button></PageLayout>
  if (!contract) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/collaboration/contracts">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={contract.title}
        description={contract.description ?? "Contract details. Seed data only."}
        actions={<Button asChild variant="outline" size="sm"><Link href="/collaboration/contracts"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Contracts</Link></Button>}
      />
      <PageSection title="Contract information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${contract.status === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1]"}`}>{contract.status}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Room</CardTitle></CardHeader><CardContent><p className="text-sm">{contract.roomName ?? contract.roomId}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Created</CardTitle></CardHeader><CardContent><p className="text-sm">{contract.createdAt ? format(new Date(contract.createdAt), "PPp") : "—"}</p></CardContent></Card>
          {contract.signedAt && <Card><CardHeader><CardTitle>Signed</CardTitle></CardHeader><CardContent><p className="text-sm">{format(new Date(contract.signedAt), "PPp")}</p></CardContent></Card>}
        </div>
      </PageSection>
      <PageSection title="Parties">
        <Card><CardContent className="pt-4">
          {contract.tenantNames && contract.tenantNames.length > 0 ? (
            <ul className="space-y-2">
              {contract.tenantNames.map((name, i) => <li key={i} className="text-sm">{name} <span className="text-xs text-[#605e5c] font-mono">({contract.tenantIds[i]})</span></li>)}
            </ul>
          ) : (
            <ul className="space-y-2">
              {contract.tenantIds.map((tid) => <li key={tid} className="text-sm font-mono">{tid}</li>)}
            </ul>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
