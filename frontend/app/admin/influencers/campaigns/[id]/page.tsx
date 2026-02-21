"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getCampaignById,
  getDealsByCampaign,
  getDeliverablesByCampaign,
  getTalentById,
  approveDeliverable,
  rejectDeliverable,
  formatCurrency,
} from "@/shared/services/influencerService"
import { useTenant } from "@/shared/context/TenantContext"
import { Sparkles, Users2, FileCheck, Check, X } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
  DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
}

const deliverableStatusColors: Record<string, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  DRAFT: "bg-slate-100 text-slate-600",
  REJECTED: "bg-red-100 text-red-700",
}

export default function CampaignDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const id = params.id as string
  const [campaign, setCampaign] = useState<any>(null)
  const [deals, setDeals] = useState<any[]>([])
  const [deliverables, setDeliverables] = useState<any[]>([])
  const [talentMap, setTalentMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!id) return
    Promise.all([
      getCampaignById(id),
      getDealsByCampaign(id),
      getDeliverablesByCampaign(id),
    ]).then(([c, d, del]) => {
      setCampaign(c)
      setDeals(d)
      setDeliverables(del)
      const talentIds = [...new Set([...d.map((x: any) => x.talentId), ...del.map((x: any) => x.talentId)])]
      Promise.all(talentIds.map((tid) => getTalentById(tid))).then((talents) => {
        const map: Record<string, any> = {}
        talents.forEach((t, i) => {
          if (t && talentIds[i]) map[talentIds[i]] = t
        })
        setTalentMap(map)
      })
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [id])

  const handleApprove = async (delId: string) => {
    await approveDeliverable(delId)
    load()
  }

  const handleReject = async (delId: string) => {
    await rejectDeliverable(delId)
    load()
  }

  if (loading || !campaign) {
    return (
      <AgenciesPage>
        <p className="py-12 text-center text-slate-500">Loading…</p>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="text-slate-500">
          <Link href="/admin/influencers">← Campaigns</Link>
        </Button>
      </div>
      <PageBanner
        title={campaign.name}
        subtitle={`${campaign.brand} · ${formatCurrency(campaign.budgetMinor, campaign.currency)}`}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80"
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" /> Deliverables
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deliverables.length === 0 ? (
                <p className="py-6 text-center text-slate-500">No deliverables yet.</p>
              ) : (
                <div className="space-y-4">
                  {deliverables.map((d) => (
                    <div
                      key={d._id}
                      className="flex flex-col gap-3 rounded-xl border border-[#E7E5E4] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">{d.title}</p>
                        <p className="text-sm text-slate-500">
                          {talentMap[d.talentId]?.stageName ?? "Creator"} · {d.type} · Due {new Date(d.dueDate).toLocaleDateString()}
                        </p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${deliverableStatusColors[d.status] ?? "bg-slate-100"}`}>
                          {d.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {d.status === "PENDING_REVIEW" && (
                          <>
                            <Button size="sm" variant="outline" className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleApprove(d._id)}>
                              <Check className="mr-1 h-4 w-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleReject(d._id)}>
                              <X className="mr-1 h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                        {d.contentUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={d.contentUrl} target="_blank" rel="noopener noreferrer">View</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-500">Brand:</span> {campaign.brand}</p>
                <p><span className="text-slate-500">Budget:</span> {formatCurrency(campaign.budgetMinor, campaign.currency)}</p>
                <p><span className="text-slate-500">Dates:</span> {campaign.startDate} – {campaign.endDate}</p>
                <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[campaign.status] ?? "bg-slate-100"}`}>
                  {campaign.status}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5" /> Creators (Deals)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deals.length === 0 ? (
                <p className="text-sm text-slate-500">No creators assigned.</p>
              ) : (
                <ul className="space-y-3">
                  {deals.map((d) => (
                    <li key={d._id} className="flex items-center justify-between rounded-lg border border-[#E7E5E4] px-3 py-2">
                      <span className="font-medium text-slate-800">{talentMap[d.talentId]?.stageName ?? "Creator"}</span>
                      <span className="text-sm text-amber-600">{formatCurrency(d.feeMinor, d.currency)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
