"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { getContracts, getObligations, formatCurrency } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { FileSignature, AlertCircle, Plus, Download, Search } from "lucide-react"
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
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { format, isAfter, addDays } from "date-fns"

const STATUS_LABELS: Record<string, string> = {
  DRAFTED: "Drafted", NEGOTIATION: "Negotiation", APPROVAL: "Approval",
  SENT: "Sent", SIGNED: "Active", ACTIVE: "Active", EXPIRED: "Expired", TERMINATED: "Terminated",
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  DRAFTED: "default", NEGOTIATION: "warning", APPROVAL: "warning",
  SENT: "info", SIGNED: "success", ACTIVE: "success", EXPIRED: "danger", TERMINATED: "danger",
}

const NEXT_ACTIONS: Record<string, { label: string; nextStatus: string }[]> = {
  DRAFTED: [{ label: "Send for Review", nextStatus: "NEGOTIATION" }],
  NEGOTIATION: [{ label: "Send for Approval", nextStatus: "APPROVAL" }],
  APPROVAL: [{ label: "Send to Client", nextStatus: "SENT" }],
  SENT: [{ label: "Mark Signed", nextStatus: "SIGNED" }],
  SIGNED: [{ label: "Terminate", nextStatus: "TERMINATED" }],
  ACTIVE: [{ label: "Terminate", nextStatus: "TERMINATED" }],
}

const OVERRIDES_KEY = "talentos_contract_overrides"

function getContractOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}") } catch { return {} }
}

function saveContractOverride(id: string, patch: any) {
  const ov = getContractOverrides()
  ov[id] = { ...(ov[id] || {}), ...patch }
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(ov))
}

function exportCsv(contracts: any[]) {
  const csv = [
    ["ID", "Title", "Client", "Value", "Status", "Effective", "Expires"].join(","),
    ...contracts.map((c) => [c._id, `"${c.title || ""}"`, `"${c.clientName || ""}"`, (c.valueMinor || 0) / 100, c.status, c.effectiveDate || "", c.expiresAt || ""].join(","))
  ].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url; a.download = "contracts.csv"; a.click()
}

export default function ContractsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [contracts, setContracts] = useState<any[]>([])
  const [obligations, setObligations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [activeTab, setActiveTab] = useState<"contracts" | "obligations">("contracts")

  const loadData = async () => {
    const [c, o] = await Promise.all([getContracts(tenantId), getObligations(tenantId)])
    const ov = getContractOverrides()
    setContracts((c as any[]).map((x: any) => ov[x._id] ? { ...x, ...ov[x._id] } : x))
    setObligations(o as any[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleStatusChange = (contractId: string, newStatus: string) => {
    const patch: any = { status: newStatus }
    if (newStatus === "SIGNED") patch.signedAt = new Date().toISOString()
    if (newStatus === "TERMINATED") patch.terminatedAt = new Date().toISOString()
    saveContractOverride(contractId, patch)
    setContracts((prev) => prev.map((c) => c._id === contractId ? { ...c, ...patch } : c))
    showToast(`Contract updated to ${STATUS_LABELS[newStatus]}.`, "success")
  }

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!c.title?.toLowerCase().includes(q) && !c.clientName?.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [contracts, search, statusFilter])

  const signedCount = contracts.filter((c) => ["SIGNED", "ACTIVE"].includes(c.status)).length
  const pendingObligations = obligations.filter((o) => o.status === "PENDING").length
  const expiringCount = contracts.filter((c) => {
    if (c.status !== "SIGNED" && c.status !== "ACTIVE") return false
    if (!c.expiresAt) return false
    return isAfter(new Date(c.expiresAt), new Date()) && !isAfter(new Date(c.expiresAt), addDays(new Date(), 30))
  }).length

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Contracts (CLM)"
        subtitle="Contract lifecycle: DRAFTED → NEGOTIATION → APPROVAL → SENT → SIGNED → ACTIVE"
        action={
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={() => exportCsv(contracts)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </AdminButton>
            <Link href="/admin/contracts/create">
              <AdminButton>
                <Plus className="mr-2 h-4 w-4" />
                New Contract
              </AdminButton>
            </Link>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Contracts" value={contracts.length} subtitle="All statuses" icon={FileSignature} color="purple" />
        <AdminStatCard title="Active" value={signedCount} subtitle="Signed / active" icon={FileSignature} color="green" />
        <AdminStatCard title="Expiring Soon" value={expiringCount} subtitle="Within 30 days" icon={AlertCircle} color="yellow" />
        <AdminStatCard title="Pending Obligations" value={pendingObligations} subtitle="Action required" icon={AlertCircle} color="blue" />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {(["contracts", "obligations"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all capitalize ${activeTab === tab ? "bg-[#d4ff00] text-black" : "text-white/60 hover:text-white"}`}
          >
            {tab === "contracts" ? `Contracts (${contracts.length})` : `Obligations (${obligations.length})`}
          </button>
        ))}
      </div>

      {activeTab === "contracts" && (
        <AdminCard>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search contracts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs border-white/20 bg-white/5 text-white placeholder:text-white/30"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] border-white/20 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
          ) : filtered.length === 0 ? (
            <AdminEmptyState icon={FileSignature} title="No contracts" action={<Link href="/admin/contracts/create"><AdminButton>New Contract</AdminButton></Link>} />
          ) : (
            <AdminTable headers={["Contract", "Client", "Value", "Effective", "Expires", "Status", "Actions"]}>
              {filtered.map((c) => (
                <AdminTableRow key={c._id}>
                  <td className="px-6 py-4">
                    <Link href={`/admin/contracts/${c._id}`}>
                      <p className="font-medium text-white hover:text-purple-300 transition-colors">{c.title || c._id}</p>
                    </Link>
                    <p className="text-xs text-white/40">{c._id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{c.clientName || c.partyAName || "—"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {c.valueMinor ? formatCurrency(c.valueMinor, c.currency || "INR") : "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-white/50">{c.effectiveDate ? format(new Date(c.effectiveDate), "MMM d, yyyy") : "—"}</td>
                  <td className="px-6 py-4 text-xs text-white/50">{c.expiresAt ? format(new Date(c.expiresAt), "MMM d, yyyy") : "—"}</td>
                  <td className="px-6 py-4">
                    <AdminBadge variant={STATUS_VARIANT[c.status] ?? "default"}>
                      {STATUS_LABELS[c.status] ?? c.status}
                    </AdminBadge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(NEXT_ACTIONS[c.status] ?? []).map((action) => (
                        <AdminButton
                          key={action.nextStatus}
                          size="sm"
                          variant={action.nextStatus === "TERMINATED" ? "danger" : "secondary"}
                          onClick={() => handleStatusChange(c._id, action.nextStatus)}
                        >
                          {action.label}
                        </AdminButton>
                      ))}
                    </div>
                  </td>
                </AdminTableRow>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      )}

      {activeTab === "obligations" && (
        <AdminCard>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />)}</div>
          ) : obligations.length === 0 ? (
            <AdminEmptyState icon={AlertCircle} title="No obligations" description="Contract obligations are tracked here." />
          ) : (
            <AdminTable headers={["Obligation", "Contract", "Due Date", "Status"]}>
              {obligations.map((o) => (
                <AdminTableRow key={o._id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{o.title}</p>
                    <p className="text-xs text-white/40">{o.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">{o.contractId}</td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {o.dueDate ? format(new Date(o.dueDate), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <AdminBadge variant={o.status === "FULFILLED" ? "success" : o.status === "OVERDUE" ? "danger" : "warning"}>
                      {o.status}
                    </AdminBadge>
                  </td>
                </AdminTableRow>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      )}
    </AdminPageWrapper>
  )
}
