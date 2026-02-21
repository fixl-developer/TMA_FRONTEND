"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCollaborations } from "@/shared/services/collaborationService"
import type { Collaboration } from "@/shared/services/collaborationService"
import { useToast } from "@/shared/components/ui/toast"
import { Link2, Plus, Users2, CheckCircle, Clock, XCircle, Download } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import { format } from "date-fns"

const DEMO_TENANT = "tenant_001"

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  ACTIVE: "success", PENDING: "warning", TERMINATED: "danger",
  COMPLETED: "info", DRAFT: "default",
}

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

export default function CollaborationsPage() {
  const { showToast } = useToast()
  const [collabs, setCollabs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("ALL")

  const loadData = async () => {
    const raw = await getCollaborations(DEMO_TENANT) as any[]
    const ov = getCollabOverrides()
    setCollabs(raw.map((c: any) => ov[c._id] ? { ...c, ...ov[c._id] } : c))
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleStatusChange = (id: string, newStatus: string) => {
    saveCollabOverride(id, { status: newStatus })
    setCollabs((prev) => prev.map((c) => c._id === id ? { ...c, status: newStatus } : c))
    showToast(`Collaboration updated to ${newStatus}.`, "success")
  }

  const types = Array.from(new Set(collabs.map((c) => c.type).filter(Boolean)))
  const filtered = typeFilter === "ALL" ? collabs : collabs.filter((c) => c.type === typeFilter)

  const activeCount = collabs.filter((c) => c.status === "ACTIVE").length
  const pendingCount = collabs.filter((c) => c.status === "PENDING").length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Collaborations"
        subtitle="Cross-tenant deals and revenue splits"
        action={
          <div className="flex gap-2">
            <Link href="/admin/collaboration/initiate">
              <AdminButton>
                <Plus className="mr-2 h-4 w-4" />
                Initiate
              </AdminButton>
            </Link>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Total" value={collabs.length} subtitle="All collaborations" icon={Link2} color="purple" />
        <AdminStatCard title="Active" value={activeCount} subtitle="In progress" icon={CheckCircle} color="green" />
        <AdminStatCard title="Pending" value={pendingCount} subtitle="Awaiting action" icon={Clock} color="yellow" />
      </div>

      <AdminCard>
        <div className="mb-4 flex flex-wrap gap-2">
          {["ALL", ...types].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${typeFilter === t ? "bg-purple-500 text-white" : "bg-white/10 text-white/50 hover:text-white"}`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState icon={Link2} title="No collaborations" action={<Link href="/admin/collaboration/initiate"><AdminButton>Initiate Collaboration</AdminButton></Link>} />
        ) : (
          <AdminTable headers={["Title", "Partner", "Type", "Revenue Split", "Status", "Actions"]}>
            {filtered.map((c) => (
              <AdminTableRow key={c._id}>
                <td className="px-6 py-4">
                  <Link href={`/admin/collaboration/${c._id}`}>
                    <p className="font-medium text-white hover:text-purple-300 transition-colors">{c.title}</p>
                    {c.createdAt && <p className="text-xs text-white/40">{format(new Date(c.createdAt), "MMM d, yyyy")}</p>}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-white/70">{c.partnerName}</td>
                <td className="px-6 py-4">
                  <AdminBadge variant="default">{c.type?.replace("_", " ")}</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  {c.revenueSplit && (
                    <div className="space-y-0.5 text-xs">
                      {Object.entries(c.revenueSplit).map(([tid, pct]) => (
                        <div key={tid} className="flex gap-2">
                          <span className="text-white/40">{tid === DEMO_TENANT ? "Us" : c.partnerName}:</span>
                          <span className="font-semibold text-white">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={STATUS_VARIANT[c.status] ?? "default"}>{c.status}</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {c.status === "PENDING" && (
                      <AdminButton size="sm" variant="secondary" onClick={() => handleStatusChange(c._id, "ACTIVE")}>Activate</AdminButton>
                    )}
                    {c.status === "ACTIVE" && (
                      <AdminButton size="sm" variant="danger" onClick={() => handleStatusChange(c._id, "TERMINATED")}>Terminate</AdminButton>
                    )}
                    <Link href={`/admin/collaboration/${c._id}`}>
                      <AdminButton size="sm" variant="ghost">View</AdminButton>
                    </Link>
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
