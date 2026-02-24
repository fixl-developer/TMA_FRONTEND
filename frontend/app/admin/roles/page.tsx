"use client"

import { useEffect, useState } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { getTenantRoles } from "@/shared/services/roleService"
import { ShieldCheck, Users, Shield, ShieldPlus, Edit } from "lucide-react"
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
} from "@/shared/components/admin/AdminPageLayout"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { RoleEditorModal } from "@/shared/components/roles/RoleEditorModal"

export default function AdminRolesPage() {
  const { tenantId } = useTenant()
  const [roles, setRoles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorTemplateId, setEditorTemplateId] = useState<string | null>(null)

  const loadRoles = () => {
    const id = tenantId || "tenant_001"
    setRoles(getTenantRoles(id))
  }

  useEffect(() => {
    loadRoles()
  }, [tenantId])

  const systemRoles = roles.filter((r) => r.isSystem).length
  const customRoles = roles.filter((r) => !r.isSystem).length
  const totalCapabilities = roles.reduce((sum, r) => sum + (r.capabilities?.length || 0), 0)

  const filteredRoles = roles.filter((r) =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Roles & Permissions"
        subtitle="Manage roles and their capabilities"
        actions={
        <CapabilityGate capability="tenant.manage_settings">
          <AdminButton onClick={() => { setEditorTemplateId(null); setEditorOpen(true) }}>
            <ShieldPlus className="h-4 w-4" />
            Create Role
          </AdminButton>
        </CapabilityGate>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Roles" value={roles.length} icon={ShieldCheck} color="purple" subtitle="All roles" />
        <AdminStatCard label="System Roles" value={systemRoles} icon={Shield} color="blue" subtitle="Built-in roles" />
        <AdminStatCard label="Custom Roles" value={customRoles} icon={Users} color="green" subtitle="Tenant-specific" />
        <AdminStatCard label="Capabilities" value={totalCapabilities} icon={ShieldCheck} color="purple" subtitle="Total permissions" />
      </AdminStatsGrid>

      {/* Roles Table */}
      <AdminCard
        title="Roles"
        actions={<AdminSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search roles..." />}
      >
        {filteredRoles.length === 0 ? (
          <AdminEmptyState
            icon={ShieldCheck}
            title={searchQuery ? "No roles found" : "No roles yet"}
            description={searchQuery ? "Try adjusting your search" : "Create roles to manage permissions"}
            action={
              !searchQuery && (
                <CapabilityGate capability="tenant.manage_settings">
                  <AdminButton onClick={() => { setEditorTemplateId(null); setEditorOpen(true) }}>
                    <ShieldPlus className="h-4 w-4" />
                    Create Role
                  </AdminButton>
                </CapabilityGate>
              )
            }
          />
        ) : (
          <AdminTable headers={["Role", "Type", "Capabilities", "Description", "Actions"]}>
            {filteredRoles.map((role) => (
              <AdminTableRow key={role._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8764b8] text-xs font-semibold text-white">
                      {role.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-[#323130]">{role.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={role.isSystem ? "info" : "default"}>
                    {role.isSystem ? "System" : "Custom"}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {role.capabilities?.length || 0} permissions
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c] max-w-md truncate">
                  {role.description || "—"}
                </td>
                <td className="px-6 py-4">
                  <CapabilityGate capability="tenant.manage_settings">
                    <AdminButton size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                      Edit
                    </AdminButton>
                  </CapabilityGate>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <RoleEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        templateId={editorTemplateId}
        onSuccess={loadRoles}
      />
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
