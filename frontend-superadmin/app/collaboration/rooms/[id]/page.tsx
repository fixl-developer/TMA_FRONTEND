"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Building2, FileText, Shield } from "lucide-react"
import type { CollaborationRoom, CollaborationContract, CollaborationEscrow } from "@/shared/lib/types/collaboration"
import { getCollaborationRoomById } from "@/shared/services/collaborationService"
import { getCollaborationContractsByRoomId } from "@/shared/services/collaborationService"
import { getCollaborationEscrowByRoomId } from "@/shared/services/collaborationService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"
import { format } from "date-fns"

export default function CollaborationRoomDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [room, setRoom] = useState<CollaborationRoom | undefined>(undefined)
  const [contracts, setContracts] = useState<CollaborationContract[]>([])
  const [escrow, setEscrow] = useState<CollaborationEscrow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      getCollaborationRoomById(id),
      getCollaborationContractsByRoomId(id),
      getCollaborationEscrowByRoomId(id),
    ]).then(([r, c, e]) => {
      setRoom(r)
      setContracts(c)
      setEscrow(e)
    }).finally(() => setLoading(false))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Room" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/collaboration/rooms">Back</Link></Button></PageLayout>
  if (!room && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/collaboration/rooms">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={room?.name ?? id}
        description={room?.description ?? "Collaboration room details. Seed data only."}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Building2 className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{room?.status ?? "—"}</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/collaboration/rooms"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rooms</Link></Button>
            <Link href="/collaboration/contracts"><Button variant="outline" size="sm" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Contracts</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${room?.status === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1]"}`}>{room?.status ?? "—"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Participants</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{room?.participantCount ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Contracts</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#0078d4]">{room?.contractCount ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Shared resources</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{room?.sharedResourceCount ?? 0}</p></CardContent></Card>
        </div>
      </PageSection>
      <PageSection title="Participants">
        <Card><CardContent className="pt-4">
          {room?.tenantNames && room.tenantNames.length > 0 ? (
            <ul className="space-y-2">
              {room.tenantNames.map((name, i) => <li key={i} className="text-sm">{name} <span className="text-xs text-[#605e5c] font-mono">({room.tenantIds[i]})</span></li>)}
            </ul>
          ) : (
            <ul className="space-y-2">
              {room?.tenantIds.map((tid) => <li key={tid} className="text-sm font-mono">{tid}</li>)}
            </ul>
          )}
        </CardContent></Card>
      </PageSection>
      {contracts.length > 0 && (
        <PageSection title="Contracts">
          <Card><CardContent className="p-0">
            <ul className="divide-y divide-[#edebe9]">
              {contracts.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-3">
                  <div><p className="text-sm font-medium">{c.title}</p><p className="text-xs text-[#605e5c] font-mono">{c.id} · {c.status}</p></div>
                  <Link href={`/collaboration/contracts/${c.id}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">View</Button></Link>
                </li>
              ))}
            </ul>
          </CardContent></Card>
        </PageSection>
      )}
      {escrow.length > 0 && (
        <PageSection title="Escrow accounts">
          <Card><CardContent className="p-0">
            <ul className="divide-y divide-[#edebe9]">
              {escrow.map((e) => (
                <li key={e.id} className="flex items-center justify-between px-4 py-3">
                  <div><p className="font-mono text-sm">{e.id}</p><p className="text-xs text-[#605e5c]">{e.status}</p></div>
                  <span className="font-semibold text-[#107c10]">{formatCurrency(e.amountMinor, e.currency)}</span>
                </li>
              ))}
            </ul>
          </CardContent></Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
