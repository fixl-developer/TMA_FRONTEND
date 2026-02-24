"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { getContracts, getObligations, formatCurrency } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { FileSignature, AlertCircle, Plus, Download } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminSearchBar,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"
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
      <AdminPageLayout
        title="Contracts"
        subtitle="Contract lifecycle management: DRAFTED → NEGOTIATION → APPROVAL → SENT → SIGNED → ACTIVE"
        actions={
        <>
          <AdminButton variant="secondary" onClick={() => exportCsv(contracts)}>
            <Download className="h-4 w-4" />
            Export
          </AdminButton>
          <Link href="/admin/contracts/create">
            <AdminButton>
              <Plus className="h-4 w-4" />
              New Contract
            </AdminButton>
          </Link>
        </>
      }
    >
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Contracts" value={contracts.length} subtitle="All statuses" icon={FileSignature} color="purple" />
        <AdminStatCard label="Active" value={signedCount} subtitle="Signed / active" icon={FileSignature} color="green" />
        <AdminStatCard label="Expiring Soon" value={expiringCount} subtitle="Within 30 days" icon={AlertCircle} color="yellow" />
        <AdminStatCard label="Pending Obligations" value={pendingObligations} subtitle="Action required" icon={AlertCircle} color="blue" />
      </AdminStatsGrid>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-[#edebe9]">
        {(["contracts", "obligations"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-[#0078d4] text-[#0078d4]"
                : "text-[#605e5c] hover:text-[#323130]"
            }`}
          >
            {tab === "contracts" ? `Contracts (${contracts.length})` : `Obligations (${obligations.length})`}
          </button>
        ))}
      </div>

      {activeTab === "contracts" && (
        <AdminCard
          title="All Contracts"
          subtitle={`${filtered.length} of ${contracts.length} contracts`}
          actions={
            <div className="flex items-center gap-3">
              <AdminSearchBar value={search} onChange={setSearch} placeholder="Search contracts..." />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-[160px] border-[#edebe9] bg-white text-xs">
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
          }
        >
          {loading ? (
            <AdminLoading rows={5} />
          ) : filtered.length === 0 ? (
            <AdminEmptyState
              icon={FileSignature}
              title="No contracts found"
              description="Try adjusting your search or add a new contract"
              action={
                <Link href="/admin/contracts/create">
                  <AdminButton>
                    <Plus className="h-4 w-4" />
                    New Contract
                  </AdminButton>
                </Link>
              }
            />
          ) : (
            <AdminTable headers={["Contract", "Client", "Value", "Effective", "Expires", "Status", "Actions"]}>
              {filtered.map((c) => (
                <AdminTableRow key={c._id}>
                  <td className="px-6 py-4">
                    <Link href={`/admin/contracts/${c._id}`}>
                      <p className="text-xs font-semibold text-[#0078d4] hover:underline">{c.title || c._id}</p>
                    </Link>
                    <p className="text-xs text-[#a19f9d]">{c._id}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#605e5c]">{c.clientName || c.partyAName || "—"}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-[#323130]">
                    {c.valueMinor ? formatCurrency(c.valueMinor, c.currency || "INR") : "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#605e5c]">
                    {c.effectiveDate ? format(new Date(c.effectiveDate), "MMM d, yyyy", { locale: undefined }) : "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#605e5c]">
                    {c.expiresAt ? format(new Date(c.expiresAt), "MMM d, yyyy", { locale: undefined }) : "—"}
                  </td>
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
        <AdminCard title="Contract Obligations" subtitle={`${obligations.length} total obligations`}>
          {loading ? (
            <AdminLoading rows={4} />
          ) : obligations.length === 0 ? (
            <AdminEmptyState
              icon={AlertCircle}
              title="No obligations"
              description="Contract obligations are tracked here."
            />
          ) : (
            <AdminTable headers={["Obligation", "Contract", "Due Date", "Status"]}>
              {obligations.map((o) => (
                <AdminTableRow key={o._id}>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-[#323130]">{o.title}</p>
                    <p className="text-xs text-[#605e5c]">{o.description}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#605e5c]">{o.contractId}</td>
                  <td className="px-6 py-4 text-xs text-[#605e5c]">
                    {o.dueDate ? format(new Date(o.dueDate), "MMM d, yyyy", { locale: undefined }) : "—"}
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
    </AdminPageLayout>
  )
}
