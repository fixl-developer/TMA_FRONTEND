"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { getAuditLogsByTenant } from "@/shared/services/tenantIntegrationsService"
import type { AuditLogEntry } from "@/shared/services/tenantIntegrationsService"
import { useTenant } from "@/shared/context/TenantContext"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { useToast } from "@/shared/components/ui/toast"
import { FileText, Activity, Clock, User, Download, Filter } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
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

  useEffect(() => {
    const id = tenantId || "tenant_001"
    getAuditLogsByTenant(id).then(setLogs).finally(() => setLoading(false))
  }, [tenantId])

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (actionFilter !== "all" && l.action !== actionFilter) return false
      if (actorFilter !== "all" && l.actorType !== actorFilter) return false
      return true
    })
  }, [logs, actionFilter, actorFilter])

  const actionOptions = useMemo(() => {
    const actions = [...new Set(logs.map((l) => l.action))].sort()
    return actions
  }, [logs])

  const actorOptions = useMemo(() => {
    return [...new Set(logs.map((l) => l.actorType))].sort()
  }, [logs])

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
      <CapabilityGate capability="audit.read" fallback={
        <AdminCard>
          <p className="py-12 text-center text-white/50">You don&apos;t have permission to view the audit log.</p>
        </AdminCard>
      }>
      <AdminSectionHeader
        title="Audit Log"
        subtitle="Immutable tenant activity log"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <CapabilityGate capability="audit.read">
              <AdminButton variant="secondary" size="sm" onClick={handleExportCsv}>
                <Download className="mr-1.5 h-4 w-4" />
                Export CSV
              </AdminButton>
            </CapabilityGate>
            <Link href="/admin/reports">
              <AdminButton variant="secondary" size="sm">
                Reports
              </AdminButton>
            </Link>
            <Link href="/admin/integrations">
              <AdminButton variant="secondary" size="sm">
                Integrations
              </AdminButton>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Entries"
          value={filteredLogs.length}
          subtitle={actionFilter !== "all" || actorFilter !== "all" ? "Filtered" : "All logged events"}
          icon={FileText}
          color="purple"
        />
        <AdminStatCard
          title="Unique Actors"
          value={uniqueActors}
          subtitle="Different actor types"
          icon={User}
          color="blue"
        />
        <AdminStatCard
          title="Unique Actions"
          value={uniqueActions}
          subtitle="Different action types"
          icon={Activity}
          color="green"
        />
        <AdminStatCard
          title="Latest"
          value={filteredLogs.length > 0 ? "Today" : "—"}
          subtitle="Most recent activity"
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Audit Log Entries */}
      <AdminCard>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/50" />
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px] border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {actionOptions.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="w-[140px] border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Filter by actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actors</SelectItem>
                {actorOptions.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <AdminEmptyState
            icon={Activity}
            title={logs.length === 0 ? "No audit entries yet" : "No matching entries"}
            description={
              logs.length === 0
                ? "Activity will appear here as users perform actions in your organization."
                : "Try adjusting the filters to see more results."
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((l) => (
              <div
                key={l._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-purple-500/10 p-1.5">
                        <Activity className="h-4 w-4 text-purple-400" />
                      </div>
                      <p className="font-semibold text-white">{l.action}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {l.actorType}
                      </span>
                      <span>
                        {l.entityType}/{l.entityId}
                      </span>
                      {l.ip && <span>IP: {l.ip}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-white/50">
                      {new Date(l.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-white/40">
                      {new Date(l.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      </CapabilityGate>
    </AdminPageWrapper>
  )
}
