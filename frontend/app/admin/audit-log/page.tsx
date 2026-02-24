"use client"

import { useEffect, useState, useMemo } from "react"
import { getAuditLogsByTenant } from "@/shared/services/tenantIntegrationsService"
import type { AuditLogEntry } from "@/shared/services/tenantIntegrationsService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { FileText, Activity, Clock, User, Download, Filter } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminEmptyState,
  AdminSearchBar,
} from "@/shared/components/admin/AdminPageLayout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

export default function AuditLogPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [actorFilter, setActorFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const id = tenantId || "tenant_001"
    getAuditLogsByTenant(id).then(setLogs).finally(() => setLoading(false))
  }, [tenantId])

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (actionFilter !== "all" && l.action !== actionFilter) return false
      if (actorFilter !== "all" && l.actorType !== actorFilter) return false
      if (searchQuery && !l.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !l.actorId.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [logs, actionFilter, actorFilter, searchQuery])

  const actionOptions = useMemo(() => [...new Set(logs.map((l) => l.action))].sort(), [logs])
  const actorOptions = useMemo(() => [...new Set(logs.map((l) => l.actorType))].sort(), [logs])
  const uniqueActors = new Set(filteredLogs.map((l) => l.actorType)).size
  const uniqueActions = new Set(filteredLogs.map((l) => l.action)).size

  const handleExportCsv = () => {
    const headers = ["Date", "Action", "Actor Type", "Actor ID", "Entity", "IP"]
    const rows = filteredLogs.map((l) => [
      new Date(l.createdAt).toISOString(),
      l.action,
      l.actorType,
      l.actorId,
      `${l.entityType}/${l.entityId}`,
      l.ip ?? "",
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${tenantId || "tenant"}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast("Audit log exported.", "success")
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Audit Log"
        subtitle="Track all system activities and changes"
        actions={
        <AdminButton onClick={handleExportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </AdminButton>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Events" value={logs.length} icon={FileText} color="purple" />
        <AdminStatCard label="Filtered Events" value={filteredLogs.length} icon={Activity} color="blue" />
        <AdminStatCard label="Unique Actions" value={uniqueActions} icon={Activity} color="green" />
        <AdminStatCard label="Unique Actors" value={uniqueActors} icon={User} color="yellow" />
      </AdminStatsGrid>

      {/* Filters */}
      <AdminCard className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-[#605e5c] mb-2 block">Search</label>
            <AdminSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search logs..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#605e5c] mb-2 block">Action</label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionOptions.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#605e5c] mb-2 block">Actor Type</label>
            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                {actorOptions.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminCard>

      {/* Audit Log Table */}
      <AdminCard title="Activity Log">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <AdminEmptyState
            icon={FileText}
            title="No audit logs found"
            description="Try adjusting your filters"
          />
        ) : (
          <AdminTable headers={["Timestamp", "Action", "Actor", "Entity", "IP Address"]}>
            {filteredLogs.map((log) => (
              <AdminTableRow key={log._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#605e5c]" />
                    <span className="text-xs text-[#605e5c]">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-[#323130]">
                  {log.action}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-[#605e5c]">
                    <div className="font-semibold text-[#323130]">{log.actorType}</div>
                    <div className="text-[#a19f9d]">{log.actorId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {log.entityType}/{log.entityId}
                </td>
                <td className="px-6 py-4 text-xs text-[#a19f9d] font-mono">
                  {log.ip || "—"}
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
