"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
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
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton, AdminBadge } from "@/shared/components/admin/AdminPageLayout"

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  COMPLETED: "bg-white/20 text-white/80 border-white/30",
  DRAFT: "bg-amber-500/20 text-amber-300 border-amber-500/30",
}

const deliverableStatusColors: Record<string, string> = {
  APPROVED: "bg-emerald-500/20 text-emerald-300",
  PENDING_REVIEW: "bg-amber-500/20 text-amber-300",
  DRAFT: "bg-white/20 text-white/80",
  REJECTED: "bg-red-500/20 text-red-300",
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
      <AdminPageWrapper>
        <div className="py-12 text-center text-white/60">Loading…</div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title={campaign.name}
        subtitle={`${campaign.brand} · ${formatCurrency(campaign.budgetMinor, campaign.currency)}`}
        actions={
          <Link href="/admin/influencers">
            <AdminButton variant="outline">← Campaigns</AdminButton>
          </Link>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="h-5 w-5 text-[#d4ff00]" />
                <h3 className="text-lg font-semibold text-white">Deliverables</h3>
              </div>
              {deliverables.length === 0 ? (
                <p className="py-6 text-center text-white/60">No deliverables yet.</p>
              ) : (
                <div className="space-y-4">
                  {deliverables.map((d) => (
                    <div
                      key={d._id}
                      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white">{d.title}</p>
                        <p className="text-sm text-white/60">
                          {talentMap[d.talentId]?.stageName ?? "Creator"} · {d.type} · Due {new Date(d.dueDate).toLocaleDateString()}
                        </p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${deliverableStatusColors[d.status] ?? "bg-white/20"}`}>
                          {d.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {d.status === "PENDING_REVIEW" && (
                          <>
                            <AdminButton size="sm" variant="outline" className="text-emerald-300 hover:bg-emerald-500/20" onClick={() => handleApprove(d._id)}>
                              <Check className="mr-1 h-4 w-4" /> Approve
                            </AdminButton>
                            <AdminButton size="sm" variant="outline" className="text-red-300 hover:bg-red-500/20" onClick={() => handleReject(d._id)}>
                              <X className="mr-1 h-4 w-4" /> Reject
                            </AdminButton>
                          </>
                        )}
                        {d.contentUrl && (
                          <AdminButton size="sm" variant="outline" asChild>
                            <a href={d.contentUrl} target="_blank" rel="noopener noreferrer">View</a>
                          </AdminButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          </div>
          <div className="space-y-6">
            <AdminCard>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[#d4ff00]" />
                <h3 className="text-lg font-semibold text-white">Campaign</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-white/60">Brand:</span> <span className="text-white">{campaign.brand}</span></p>
                <p><span className="text-white/60">Budget:</span> <span className="text-white">{formatCurrency(campaign.budgetMinor, campaign.currency)}</span></p>
                <p><span className="text-white/60">Dates:</span> <span className="text-white">{campaign.startDate} – {campaign.endDate}</span></p>
                <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[campaign.status] ?? "bg-white/20"}`}>
                  {campaign.status}
                </span>
              </div>
            </AdminCard>
            <AdminCard>
              <div className="flex items-center gap-2 mb-4">
                <Users2 className="h-5 w-5 text-[#d4ff00]" />
                <h3 className="text-lg font-semibold text-white">Creators (Deals)</h3>
              </div>
              {deals.length === 0 ? (
                <p className="text-sm text-white/60">No creators assigned.</p>
              ) : (
                <ul className="space-y-3">
                  {deals.map((d) => (
                    <li key={d._id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <span className="font-medium text-white">{talentMap[d.talentId]?.stageName ?? "Creator"}</span>
                      <span className="text-sm text-[#d4ff00]">{formatCurrency(d.feeMinor, d.currency)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>
          </div>
        </div>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
