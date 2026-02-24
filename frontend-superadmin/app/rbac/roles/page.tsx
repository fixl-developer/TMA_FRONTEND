"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Shield, Plus, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchRoles, setSelectedRole } from "@/shared/state/rbacSlice"
import type { Role } from "@/shared/lib/types/rbac"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function RbacRolesPage() {
  const dispatch = useAppDispatch()
  const { roles, loadingRoles } = useAppSelector((s) => s.rbac)
  const [searchQuery, setSearchQuery] = useState("")
  const [blueprintFilter, setBlueprintFilter] = useState<string[]>([])

  useEffect(() => {
    if (!roles.length) dispatch(fetchRoles())
  }, [dispatch, roles.length])

  const blueprintOptions: FilterOption[] = useMemo(() => {
    const set = new Set<string>()
    roles.forEach((r) => set.add(r.blueprint))
    return Array.from(set).sort().map((b) => ({ value: b, label: b }))
  }, [roles])

  const filtered = useMemo(() => {
    let result = roles
    if (blueprintFilter.length > 0) result = result.filter((r) => blueprintFilter.includes(r.blueprint))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.displayName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    }
    return result
  }, [roles, blueprintFilter, searchQuery])

  const metrics = useMemo(() => {
    const total = roles.length
    const system = roles.filter((r) => r.isSystem).length
    const totalUsers = roles.reduce((s, r) => s + r.userCount, 0)
    return { total, system, totalUsers }
  }, [roles])

  const columns: Column<Role>[] = useMemo(
    () => [
      {
        key: "displayName",
        header: "Role",
        render: (_v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{row.displayName}</p>
            <p className="text-xs text-[#605e5c] font-mono">{row.id} · {row.name}</p>
          </div>
        ),
      },
      { key: "blueprint", header: "Blueprint", render: (v) => <span className="text-sm">{String(v)}</span> },
      { key: "permissionCount", header: "Permissions", render: (v) => <span className="text-sm font-medium">{Number(v)}</span> },
      { key: "userCount", header: "Users", render: (v) => <span className="text-sm">{Number(v)}</span> },
      {
        key: "isSystem",
        header: "Type",
        render: (v) => <span className={`rounded border px-2 py-0.5 text-xs font-medium ${v ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"}`}>{v ? "System" : "Custom"}</span>,
      },
      {
        key: "id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Link href={`/rbac/roles/${row.id}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]" onClick={() => dispatch(setSelectedRole(row.id))}>
              Details
            </Button>
          </Link>
        ),
      },
    ],
    [dispatch]
  )

  return (
    <PageLayout>
      <PageHeader
        title="Role management"
        description="All platform and tenant roles. Filter by blueprint. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="h-3.5 w-3.5 text-[#0078d4]" />RBAC</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/rbac/capabilities"><Button variant="outline" size="sm">Capabilities</Button></Link>
            <Link href="/rbac/policies"><Button variant="outline" size="sm">Policies</Button></Link>
            <Link href="/rbac/roles/create"><Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Create role</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total roles</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingRoles ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>System roles</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loadingRoles ? "—" : metrics.system}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total users</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingRoles ? "—" : metrics.totalUsers}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Roles" description={filtered.length !== roles.length ? `${filtered.length} of ${roles.length} shown` : undefined}>
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by name or id..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[{ key: "blueprint", label: "Blueprint", options: blueprintOptions, selected: blueprintFilter, onSelectionChange: setBlueprintFilter }]}
            onClearAll={() => { setSearchQuery(""); setBlueprintFilter([]) }}
          />
          <Card><CardContent className="p-0">
            {loadingRoles ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={filtered} columns={columns} pageSize={10} exportable exportFileName="rbac-roles" emptyMessage="No roles match the filters." />}
          </CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
