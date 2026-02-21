"use client"

import { useEffect, useState } from "react"
import {
  getBlueprintConfigs,
  getTenantBlueprintConfigs,
  type BlueprintConfig,
} from "@/shared/services/blueprintService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import {
  Layers,
  ToggleLeft,
  ToggleRight,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  ChevronRight,
  Puzzle,
  Lock,
} from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

const STORAGE_KEY_PREFIX = "talentos_blueprint_state_"
const REQUESTS_KEY = "talentos_blueprint_requests"

function getBlueprintState(tenantId: string): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + tenantId) || "{}") } catch { return {} }
}

function saveBlueprintState(tenantId: string, state: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY_PREFIX + tenantId, JSON.stringify(state))
}

interface BlueprintRequest {
  id: string
  blueprintId: string
  tenantId: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  requestedAt: string
  reason?: string
}

function getBlueprintRequests(tenantId: string): BlueprintRequest[] {
  if (typeof window === "undefined") return []
  try {
    const all: BlueprintRequest[] = JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]")
    return all.filter((r) => r.tenantId === tenantId)
  } catch { return [] }
}

function saveBlueprintRequest(req: BlueprintRequest) {
  const all: BlueprintRequest[] = JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]")
  all.push(req)
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all))
}

type TabId = "active" | "available" | "pending"

const BLUEPRINT_DESCRIPTIONS: Record<string, { shortDesc: string; color: string; icon: string }> = {
  B1: { shortDesc: "Talent profiles, bookings, availability, contracts", color: "bg-blue-500/20 text-blue-400", icon: "🎭" },
  B2: { shortDesc: "Casting calls, submissions, shortlist, deals", color: "bg-purple-500/20 text-purple-400", icon: "🎬" },
  B3: { shortDesc: "Pageant seasons, rounds, scoring, judges, results", color: "bg-yellow-500/20 text-yellow-400", icon: "👑" },
  B4: { shortDesc: "Creator roster, deal rooms, deliverables, content approvals", color: "bg-pink-500/20 text-pink-400", icon: "🤝" },
  B5: { shortDesc: "Courses, cohorts, attendance, certificates, payments", color: "bg-green-500/20 text-green-400", icon: "📚" },
  B6: { shortDesc: "Projects, asset delivery, revisions, client approvals", color: "bg-orange-500/20 text-orange-400", icon: "🗂️" },
  B7: { shortDesc: "Shift rosters, check-ins, timesheets, payouts", color: "bg-teal-500/20 text-teal-400", icon: "👷" },
  B8: { shortDesc: "Community feed, groups, moderation, monetization", color: "bg-rose-500/20 text-rose-400", icon: "👥" },
  B9: { shortDesc: "Marketplace listings, matching, escrow, settlements", color: "bg-cyan-500/20 text-cyan-400", icon: "🏪" },
  B10: { shortDesc: "Multi-tenant management, sub-tenants, consolidated reports", color: "bg-indigo-500/20 text-indigo-400", icon: "🏢" },
}

export default function AdminBlueprintsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<TabId>("active")
  const [allBlueprints, setAllBlueprints] = useState<BlueprintConfig[]>([])
  const [activeBlueprints, setActiveBlueprints] = useState<BlueprintConfig[]>([])
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({})
  const [requests, setRequests] = useState<BlueprintRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintConfig | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [requestBp, setRequestBp] = useState<BlueprintConfig | null>(null)
  const [requestReason, setRequestReason] = useState("")

  const tid = tenantId || "tenant_001"

  const loadData = async () => {
    const [all, active] = await Promise.all([
      getBlueprintConfigs(),
      getTenantBlueprintConfigs(tenantId),
    ])
    setAllBlueprints(all)
    setActiveBlueprints(active)
    setModuleStates(getBlueprintState(tid))
    setRequests(getBlueprintRequests(tid))
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const activeBlueprintIds = new Set(activeBlueprints.map((b) => b._id))
  const pendingIds = new Set(requests.filter((r) => r.status === "PENDING").map((r) => r.blueprintId))
  const availableBlueprints = allBlueprints.filter((b) => !activeBlueprintIds.has(b._id))

  const toggleModule = (blueprintId: string, module: string) => {
    const key = `${blueprintId}:${module}`
    const newState = { ...moduleStates, [key]: !moduleStates[key] }
    setModuleStates(newState)
    saveBlueprintState(tid, newState)
    showToast(`Module ${module} ${!moduleStates[key] ? "enabled" : "disabled"}.`, "success")
  }

  const handleRequest = (bp: BlueprintConfig) => {
    if (pendingIds.has(bp._id)) {
      showToast("A request for this blueprint is already pending.", "info")
      return
    }
    setRequestBp(bp)
    setRequestOpen(true)
  }

  const submitRequest = () => {
    if (!requestBp) return
    const req: BlueprintRequest = {
      id: `req_${Date.now()}`,
      blueprintId: requestBp._id,
      tenantId: tid,
      status: "PENDING",
      requestedAt: new Date().toISOString(),
      reason: requestReason,
    }
    saveBlueprintRequest(req)
    setRequests((prev) => [...prev, req])
    setRequestOpen(false)
    setRequestBp(null)
    setRequestReason("")
    showToast(`Blueprint ${requestBp.name} requested. Awaiting platform approval.`, "success")
  }

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "active", label: "Active", count: activeBlueprints.length },
    { id: "available", label: "Available", count: availableBlueprints.length },
    { id: "pending", label: "Pending", count: requests.filter((r) => r.status === "PENDING").length },
  ]

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Blueprints"
        subtitle="B1–B10 domain workflow packages. Enable modules, request new blueprints."
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-[#d4ff00] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab.id ? "bg-black/20 text-black" : "bg-white/10 text-white/50"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/5" />)}
        </div>
      ) : (
        <>
          {/* Active tab */}
          {activeTab === "active" && (
            activeBlueprints.length === 0 ? (
              <AdminEmptyState
                icon={Layers}
                title="No active blueprints"
                description="Request blueprints from the Available tab to expand your platform capabilities."
                action={<AdminButton onClick={() => setActiveTab("available")}>Browse Available</AdminButton>}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeBlueprints.map((bp) => {
                  const meta = BLUEPRINT_DESCRIPTIONS[bp._id] ?? { shortDesc: bp.description, color: "bg-white/10 text-white", icon: "📦" }
                  return (
                    <AdminCard key={bp._id} hoverable onClick={() => { setSelectedBlueprint(bp); setDetailOpen(true) }}>
                      <div className="mb-3 flex items-start justify-between">
                        <div className={`rounded-xl px-3 py-1.5 text-2xl ${meta.color.split(" ")[0]}`}>{meta.icon}</div>
                        <AdminBadge variant="success">Active</AdminBadge>
                      </div>
                      <p className="font-bold text-white">{bp._id} · {bp.name}</p>
                      <p className="mt-1 text-xs text-white/50 line-clamp-2">{meta.shortDesc}</p>
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/30">Modules</p>
                        <div className="flex flex-wrap gap-1">
                          {bp.modules.slice(0, 4).map((m) => {
                            const key = `${bp._id}:${m}`
                            const enabled = moduleStates[key] !== false
                            return (
                              <button
                                key={m}
                                onClick={(e) => { e.stopPropagation(); toggleModule(bp._id, m) }}
                                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                  enabled ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-white/30"
                                }`}
                              >
                                {enabled ? <ToggleRight className="h-2.5 w-2.5" /> : <ToggleLeft className="h-2.5 w-2.5" />}
                                {m.replace(/_/g, " ")}
                              </button>
                            )
                          })}
                          {bp.modules.length > 4 && <span className="text-xs text-white/30">+{bp.modules.length - 4} more</span>}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Users className="h-3 w-3 text-white/30" />
                        <span className="text-xs text-white/40">{bp.rolePacks.length} role packs</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-white/20" />
                      </div>
                    </AdminCard>
                  )
                })}
              </div>
            )
          )}

          {/* Available tab */}
          {activeTab === "available" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableBlueprints.map((bp) => {
                const meta = BLUEPRINT_DESCRIPTIONS[bp._id] ?? { shortDesc: bp.description, color: "bg-white/10 text-white", icon: "📦" }
                const isPending = pendingIds.has(bp._id)
                return (
                  <AdminCard key={bp._id}>
                    <div className="mb-3 flex items-start justify-between">
                      <div className={`rounded-xl px-3 py-1.5 text-2xl ${meta.color.split(" ")[0]}`}>{meta.icon}</div>
                      {isPending ? (
                        <AdminBadge variant="warning">Requested</AdminBadge>
                      ) : (
                        <div className="rounded-full border border-white/10 bg-white/5 p-1">
                          <Lock className="h-4 w-4 text-white/30" />
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-white">{bp._id} · {bp.name}</p>
                    <p className="mt-1 text-xs text-white/50">{meta.shortDesc}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {bp.modules.slice(0, 3).map((m) => (
                        <span key={m} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">{m.replace(/_/g, " ")}</span>
                      ))}
                      {bp.modules.length > 3 && <span className="text-[10px] text-white/30">+{bp.modules.length - 3}</span>}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-white/40">{bp.rolePacks.length} role packs</span>
                      <AdminButton
                        size="sm"
                        variant={isPending ? "ghost" : "secondary"}
                        disabled={isPending}
                        onClick={() => handleRequest(bp)}
                      >
                        {isPending ? "Pending" : (
                          <><Plus className="mr-1 h-3.5 w-3.5" />Request</>
                        )}
                      </AdminButton>
                    </div>
                  </AdminCard>
                )
              })}
            </div>
          )}

          {/* Pending tab */}
          {activeTab === "pending" && (
            requests.filter((r) => r.status === "PENDING").length === 0 ? (
              <AdminEmptyState
                icon={Clock}
                title="No pending requests"
                description="Request blueprints from the Available tab. They will appear here pending platform approval."
                action={<AdminButton onClick={() => setActiveTab("available")}>Browse Available</AdminButton>}
              />
            ) : (
              <div className="space-y-3">
                {requests.filter((r) => r.status === "PENDING").map((req) => {
                  const bp = allBlueprints.find((b) => b._id === req.blueprintId)
                  if (!bp) return null
                  const meta = BLUEPRINT_DESCRIPTIONS[bp._id]
                  return (
                    <AdminCard key={req.id}>
                      <div className="flex items-start gap-4">
                        <div className={`shrink-0 rounded-xl px-3 py-2 text-xl ${meta?.color.split(" ")[0] ?? "bg-white/10"}`}>
                          {meta?.icon ?? "📦"}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white">{bp._id} · {bp.name}</p>
                          {req.reason && <p className="mt-1 text-sm text-white/60">{req.reason}</p>}
                          <p className="mt-1 text-xs text-white/40">Requested {new Date(req.requestedAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <AdminBadge variant="warning">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending Approval
                        </AdminBadge>
                      </div>
                    </AdminCard>
                  )
                })}
              </div>
            )
          )}
        </>
      )}

      {/* Blueprint Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={(o) => { if (!o) setDetailOpen(false) }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedBlueprint?.name}</DialogTitle>
          </DialogHeader>
          {selectedBlueprint && (() => {
            const meta = BLUEPRINT_DESCRIPTIONS[selectedBlueprint._id]
            return (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl px-3 py-2 text-2xl ${meta?.color.split(" ")[0] ?? "bg-white/10"}`}>{meta?.icon ?? "📦"}</div>
                  <div>
                    <p className="text-sm text-white/60">{meta?.shortDesc ?? selectedBlueprint.description}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-white/50">Modules</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlueprint.modules.map((m) => {
                      const key = `${selectedBlueprint._id}:${m}`
                      const enabled = moduleStates[key] !== false
                      return (
                        <button
                          key={m}
                          onClick={() => toggleModule(selectedBlueprint._id, m)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            enabled ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-white/30"
                          }`}
                        >
                          {enabled ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                          {m.replace(/_/g, " ")}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-white/50">Role Packs</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlueprint.rolePacks.map((r) => (
                      <span key={r} className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Request Modal */}
      <Dialog open={requestOpen} onOpenChange={(o) => { if (!o) { setRequestOpen(false); setRequestBp(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Blueprint: {requestBp?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-white/60">
              Requesting this blueprint will notify the TalentOS platform team for approval. Once approved, the blueprint modules will be unlocked for your tenant.
            </p>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Reason (optional)</label>
              <textarea
                className="min-h-[80px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-400 focus:outline-none"
                placeholder="Why do you need this blueprint?"
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <AdminButton variant="ghost" onClick={() => { setRequestOpen(false); setRequestBp(null) }}>Cancel</AdminButton>
              <AdminButton onClick={submitRequest}>Submit Request</AdminButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
