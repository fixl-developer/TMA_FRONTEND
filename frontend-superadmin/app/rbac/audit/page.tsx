/**
 * RBAC Audit Trail
 *
 * Track all role and permission changes.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Activity, User, Shield, FileText, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

interface AuditEntry {
  id: string
  timestamp: string
  action: string
  actionType: "role_created" | "role_updated" | "role_deleted" | "permission_granted" | "permission_revoked" | "policy_created" | "policy_updated" | "user_assigned" | "user_removed"
  actor: string
  actorRole: string
  targetType: "role" | "permission" | "policy" | "user"
  targetName: string
  blueprint: string
  changes: Array<{
    field: string
    oldValue: string
    newValue: string
  }>
  ipAddress: string
  userAgent: string
}

export default function RBACAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/data/seed/rbacAudit.json")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getActionIcon = (actionType: string) => {
    if (actionType.includes("role")) return <Shield className="h-4 w-4 text-blue-500" />
    if (actionType.includes("permission")) return <FileText className="h-4 w-4 text-emerald-500" />
    if (actionType.includes("policy")) return <FileText className="h-4 w-4 text-violet-500" />
    if (actionType.includes("user")) return <User className="h-4 w-4 text-amber-500" />
    return <Activity className="h-4 w-4 text-slate-500" />
  }

  const getActionColor = (actionType: string) => {
    if (actionType.includes("created")) return "bg-emerald-100 text-emerald-700 border-emerald-200"
    if (actionType.includes("updated")) return "bg-blue-100 text-blue-700 border-blue-200"
    if (actionType.includes("deleted") || actionType.includes("revoked")) return "bg-rose-100 text-rose-700 border-rose-200"
    if (actionType.includes("granted") || actionType.includes("assigned")) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-slate-100 text-slate-700 border-slate-200"
  }

  const actionTypes = ["all", "role_created", "role_updated", "permission_granted", "permission_revoked", "policy_updated", "user_assigned"]
  const filteredEntries = actionFilter === "all" 
    ? entries 
    : entries.filter(e => e.actionType === actionFilter)

  return (
    <PageLayout>
      <PageHeader
        title="RBAC Audit Trail"
        description="Track all role and permission changes"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Activity className="h-3.5 w-3.5 text-amber-500" />
            {entries.length} Events
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link
              href="/superadmin/rbac"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        }
      />

      <PageSection title="Filter by action">
        <div className="flex flex-wrap gap-2">
          {actionTypes.map((action) => (
            <button
              key={action}
              onClick={() => setActionFilter(action)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                actionFilter === action
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {action === "all" ? "All Actions" : action.replace(/_/g, " ")}
              {action !== "all" && (
                <span className="ml-2 text-xs opacity-75">
                  ({entries.filter(e => e.actionType === action).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection title="Audit log">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">Loading audit trail...</p>
            </CardContent>
          </Card>
        ) : filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">No audit entries found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:border-blue-300 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(entry.actionType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{entry.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getActionColor(entry.actionType)}>
                              {entry.actionType.replace(/_/g, " ")}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {entry.targetType}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {entry.blueprint}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-slate-500">
                            {new Date(entry.timestamp).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="text-sm">
                          <span className="text-slate-500">Actor:</span>{" "}
                          <span className="font-medium text-slate-700">{entry.actor}</span>
                          {" "}
                          <Badge variant="outline" className="text-xs ml-1">{entry.actorRole}</Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-500">Target:</span>{" "}
                          <span className="font-medium text-slate-700">{entry.targetName}</span>
                        </div>
                      </div>

                      {entry.changes.length > 0 && (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <p className="text-xs font-medium text-slate-700 mb-2">Changes</p>
                          <div className="space-y-1">
                            {entry.changes.map((change, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium text-slate-600 capitalize">
                                  {change.field.replace(/_/g, " ")}:
                                </span>
                                {" "}
                                <span className="text-rose-600 line-through">{change.oldValue}</span>
                                {" → "}
                                <span className="text-emerald-600">{change.newValue}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          IP: <span className="font-mono">{entry.ipAddress}</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {entry.userAgent}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Audit summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">{entries.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Role Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {entries.filter(e => e.actionType.includes("role")).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Permission Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                {entries.filter(e => e.actionType.includes("permission")).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">User Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {entries.filter(e => e.actionType.includes("user")).length}
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
