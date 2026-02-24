"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import type { Role, RbacAuditLog } from "@/shared/lib/types/rbac"
import { getRoleById } from "@/shared/services/rbacService"
import { getRbacAuditLogsByRoleId } from "@/shared/services/rbacService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { format } from "date-fns"

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [role, setRole] = useState<Role | undefined>(undefined)
  const [auditLogs, setAuditLogs] = useState<RbacAuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([getRoleById(id), getRbacAuditLogsByRoleId(id)]).then(([r, logs]) => {
      setRole(r)
      setAuditLogs(logs)
    }).finally(() => setLoading(false))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Role" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/rbac/roles">Back</Link></Button></PageLayout>
  if (!role && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/rbac/roles">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={role?.displayName ?? id}
        description={role?.description ?? "Role details. Seed data only."}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{role?.blueprint ?? "—"}</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/rbac/roles"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Roles</Link></Button>}
      />
      <PageSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Permissions</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#323130]">{role?.permissionCount ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Users</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#0078d4]">{role?.userCount ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Type</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${role?.isSystem ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]" : "border-[#edebe9] bg-[#f3f2f1]"}`}>{role?.isSystem ? "System" : "Custom"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Blueprint</CardTitle></CardHeader><CardContent><p className="text-sm font-medium">{role?.blueprint ?? "—"}</p></CardContent></Card>
        </div>
      </PageSection>
      {role?.permissions && role.permissions.length > 0 && (
        <PageSection title="Assigned capabilities">
          <Card><CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((p) => <span key={p} className="rounded border border-[#edebe9] bg-[#faf9f8] px-2 py-1 text-xs font-mono">{p}</span>)}
            </div>
          </CardContent></Card>
        </PageSection>
      )}
      <PageSection title="Audit log">
        <Card><CardContent className="p-0">
          {loading ? <div className="py-8 text-center text-sm text-[#605e5c]">Loading…</div> : auditLogs.length === 0 ? <p className="p-4 text-sm text-[#605e5c]">No audit logs in seed for this role.</p> : (
            <ul className="divide-y divide-[#edebe9]">
              {auditLogs.slice(0, 10).map((log) => <li key={log.id} className="px-4 py-3 text-sm"><p className="font-medium">{log.action}</p><p className="text-xs text-[#605e5c]">{log.actor} · {format(new Date(log.timestamp), "PPp")}</p></li>)}
            </ul>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
