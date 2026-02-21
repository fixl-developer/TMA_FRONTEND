"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getCollaborations } from "@/shared/services/collaborationService"
import { useToast } from "@/shared/components/ui/toast"
import { Link2, Users2, DollarSign, AlertTriangle } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"

const DEMO_TENANT = "tenant_001"

const OVERRIDES_KEY = "talentos_collab_overrides"
function getCollabOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}") } catch { return {} }
}
function saveCollabOverride(id: string, patch: any) {
  const ov = getCollabOverrides()
  ov[id] = { ...(ov[id] || {}), ...patch }
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(ov))
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  ACTIVE: "success", PENDING: "warning", TERMINATED: "danger", COMPLETED: "info", DRAFT: "default",
}

export default function CollaborationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { showToast } = useToast()
  const [collab, setCollab] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [terminateOpen, setTerminateOpen] = useState(false)
  const [reason, setReason] = useState("")

  useEffect(() => {
    getCollaborations(DEMO_TENANT).then((all: any[]) => {
      const found = all.find((c) => c._id === id)
      if (found) {
        const ov = getCollabOverrides()
        setCollab(ov[found._id] ? { ...found, ...ov[found._id] } : found)
      }
      setLoading(false)
    })
  }, [id])

  const handleStatusChange = (newStatus: string) => {
    const patch = { status: newStatus, ...(newStatus === "ACTIVE" ? { activatedAt: new Date().toISOString() } : {}), ...(newStatus === "TERMINATED" ? { terminatedAt: new Date().toISOString(), terminationReason: reason } : {}) }
    saveCollabOverride(id, patch)
    setCollab((c: any) => ({ ...c, ...patch }))
    showToast(`Collaboration updated to ${newStatus}.`, "success")
    setTerminateOpen(false)
    setReason("")
  }

  if (loading) return <AdminPageWrapper><div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />)}</div></AdminPageWrapper>
  if (!collab) return <AdminPageWrapper><AdminCard><p className="text-center text-white/50">Collaboration not found.</p></AdminCard></AdminPageWrapper>

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={collab.title}
        subtitle={`${collab.type?.replace("_", " ")} · ${collab.partnerName}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/collaboration"><AdminButton variant="ghost">← Collaborations</AdminButton></Link>
            {collab.status === "PENDING" && (
              <AdminButton onClick={() => handleStatusChange("ACTIVE")}>Activate</AdminButton>
            )}
            {collab.status === "ACTIVE" && (
              <AdminButton variant="danger" onClick={() => setTerminateOpen(true)}>
                <AlertTriangle className="mr-2 h-4 w-4" />Terminate
              </AdminButton>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <AdminCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white">Status</h3>
              <AdminBadge variant={STATUS_VARIANT[collab.status] ?? "default"}>{collab.status}</AdminBadge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/50">Type</span><span className="text-white">{collab.type?.replace("_", " ")}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Partner</span><span className="text-white">{collab.partnerName}</span></div>
              {collab.createdAt && <div className="flex justify-between"><span className="text-white/50">Created</span><span className="text-white">{format(new Date(collab.createdAt), "MMM d, yyyy")}</span></div>}
              {collab.activatedAt && <div className="flex justify-between"><span className="text-white/50">Activated</span><span className="text-white">{format(new Date(collab.activatedAt), "MMM d, yyyy")}</span></div>}
              {collab.terminatedAt && <div className="flex justify-between"><span className="text-white/50">Terminated</span><span className="text-rose-400">{format(new Date(collab.terminatedAt), "MMM d, yyyy")}</span></div>}
            </div>
            {collab.terminationReason && (
              <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3">
                <p className="text-xs font-semibold text-rose-400">Termination Reason</p>
                <p className="mt-1 text-sm text-rose-300">{collab.terminationReason}</p>
              </div>
            )}
          </AdminCard>

          {collab.revenueSplit && (
            <AdminCard>
              <h3 className="mb-4 font-bold text-white">Revenue Split</h3>
              <div className="space-y-3">
                {Object.entries(collab.revenueSplit).map(([tid, pct]) => (
                  <div key={tid}>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">{tid === DEMO_TENANT ? "Our Agency" : collab.partnerName}</span>
                      <span className="font-bold text-white">{pct}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-purple-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Collaboration Details</h3>
            {collab.description ? (
              <p className="text-sm text-white/70">{collab.description}</p>
            ) : (
              <p className="text-sm text-white/40">No description provided.</p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {collab.scope && (
                <div>
                  <p className="text-white/40">Scope</p>
                  <p className="mt-1 text-white">{collab.scope}</p>
                </div>
              )}
              {collab.contractTemplateId && (
                <div>
                  <p className="text-white/40">Contract Template</p>
                  <p className="mt-1 text-white">{collab.contractTemplateId}</p>
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Activity Log</h3>
            <div className="space-y-3 text-sm">
              {collab.activatedAt && (
                <div className="flex gap-3">
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-emerald-400" />
                  <div>
                    <p className="text-white">Collaboration activated</p>
                    <p className="text-xs text-white/40">{format(new Date(collab.activatedAt), "MMM d, yyyy HH:mm")}</p>
                  </div>
                </div>
              )}
              {collab.terminatedAt && (
                <div className="flex gap-3">
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-rose-400" />
                  <div>
                    <p className="text-rose-300">Collaboration terminated</p>
                    <p className="text-xs text-white/40">{format(new Date(collab.terminatedAt), "MMM d, yyyy HH:mm")}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-white/30" />
                <div>
                  <p className="text-white">Collaboration created</p>
                  <p className="text-xs text-white/40">{collab.createdAt ? format(new Date(collab.createdAt), "MMM d, yyyy HH:mm") : "—"}</p>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <Dialog open={terminateOpen} onOpenChange={(o) => !o && setTerminateOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Terminate Collaboration</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-white/70">Are you sure you want to terminate this collaboration? This action cannot be undone.</p>
            <div className="space-y-2">
              <Label>Reason</Label>
              <textarea
                className="min-h-[80px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-rose-400 focus:outline-none"
                placeholder="Provide a reason for termination…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTerminateOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleStatusChange("TERMINATED")}>Terminate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
