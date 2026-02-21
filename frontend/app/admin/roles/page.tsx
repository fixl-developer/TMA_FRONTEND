"use client"

import { useEffect, useState } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { seedRolePacks } from "@/data/seed"
import { getTenantRoles } from "@/shared/services/roleService"
import { getCapabilityName, getCapabilityDescription, CAPABILITY_METADATA } from "@/shared/lib/constants/capabilities"
import { ShieldCheck, Users, Grid3X3, Shield, Lock, HelpCircle, ShieldPlus, FlaskConical } from "lucide-react"
import { cn } from "@/shared/lib/utils"
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
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { RoleEditorModal } from "@/shared/components/roles/RoleEditorModal"

type TabId = "roles" | "matrix" | "reference" | "permission-test"

export default function AdminRolesPage() {
  const { tenantId } = useTenant()
  const [roles, setRoles] = useState<any[]>([])
  const [rolePacks, setRolePacks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<TabId>("roles")
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorTemplateId, setEditorTemplateId] = useState<string | null>(null)
  const [testRoleId, setTestRoleId] = useState<string>("")

  const loadRoles = () => {
    const id = tenantId || "tenant_001"
    setRoles(getTenantRoles(id))
    setRolePacks(seedRolePacks as any[])
  }

  useEffect(() => {
    loadRoles()
  }, [tenantId])

  const openCreateFromTemplate = (templateId: string | null) => {
    setEditorTemplateId(templateId)
    setEditorOpen(true)
  }

  const systemRoles = roles.filter((r) => r.isSystem).length
  const customRoles = roles.filter((r) => !r.isSystem).length
  const totalCapabilities = roles.reduce((sum, r) => sum + (r.capabilities?.length || 0), 0)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Roles & Capabilities"
        subtitle="View role definitions and create custom roles from templates."
        action={
          <CapabilityGate capability="tenant.manage_settings">
            <AdminButton onClick={() => openCreateFromTemplate(null)}>
              <ShieldPlus className="mr-2 h-4 w-4" />
              Create from template
            </AdminButton>
          </CapabilityGate>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Roles"
          value={roles.length}
          subtitle="All roles"
          icon={ShieldCheck}
          color="purple"
        />
        <AdminStatCard
          title="System Roles"
          value={systemRoles}
          subtitle="Built-in roles"
          icon={Shield}
          color="blue"
        />
        <AdminStatCard
          title="Custom Roles"
          value={customRoles}
          subtitle="Tenant-specific"
          icon={Users}
          color="green"
        />
        <AdminStatCard
          title="Capabilities"
          value={totalCapabilities}
          subtitle="Total permissions"
          icon={Lock}
          color="yellow"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <AdminButton
          variant={activeTab === "roles" ? "primary" : "ghost"}
          onClick={() => setActiveTab("roles")}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Roles
        </AdminButton>
        <AdminButton
          variant={activeTab === "matrix" ? "primary" : "ghost"}
          onClick={() => setActiveTab("matrix")}
        >
          <Grid3X3 className="mr-2 h-4 w-4" />
          Permission Matrix
        </AdminButton>
        <AdminButton
          variant={activeTab === "reference" ? "primary" : "ghost"}
          onClick={() => setActiveTab("reference")}
        >
          <Lock className="mr-2 h-4 w-4" />
          Capability Reference
        </AdminButton>
        <AdminButton
          variant={activeTab === "permission-test" ? "primary" : "ghost"}
          onClick={() => setActiveTab("permission-test")}
        >
          <FlaskConical className="mr-2 h-4 w-4" />
          Permission Test
        </AdminButton>
      </div>

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Roles</h3>
            <CapabilityGate capability="tenant.manage_settings">
              <AdminButton variant="secondary" size="sm" onClick={() => openCreateFromTemplate(null)}>
                <ShieldPlus className="mr-1 h-3.5 w-3.5" />
                Create role
              </AdminButton>
            </CapabilityGate>
          </div>
          {roles.length === 0 ? (
            <AdminEmptyState
              icon={ShieldCheck}
              title="No custom roles yet"
              description="Create roles from templates to assign specific permissions to your team."
              action={
                <CapabilityGate capability="tenant.manage_settings">
                  <AdminButton onClick={() => openCreateFromTemplate(null)}>
                    <ShieldPlus className="mr-2 h-4 w-4" />
                    Create from template
                  </AdminButton>
                </CapabilityGate>
              }
            />
          ) : (
            <div className="space-y-4">
              {roles.map((r) => (
                <div
                  key={r._id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20">
                        <Users className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{r.name}</p>
                        <p className="text-xs text-white/50">
                          {r.isSystem ? "System role" : "Custom role"}
                        </p>
                      </div>
                    </div>
                    <AdminBadge variant={r.isSystem ? "info" : "success"}>
                      {r.capabilities?.length || 0} capabilities
                    </AdminBadge>
                  </div>
                  {r.capabilities?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.capabilities.map((c: string) => {
                        const desc = getCapabilityDescription(c)
                        const name = getCapabilityName(c)
                        const displayName = name !== c ? name : c
                        const title = desc ? `${displayName}: ${desc}` : c
                        return (
                          <span
                            key={c}
                            title={title}
                            className="inline-flex cursor-help items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white/70"
                          >
                            {displayName}
                            {desc && <HelpCircle className="h-3 w-3 shrink-0 text-white/40" />}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Matrix Tab */}
      {activeTab === "matrix" && (
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Role Pack → Capabilities</h3>
            <CapabilityGate capability="tenant.manage_settings">
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => openCreateFromTemplate(null)}
              >
                <ShieldPlus className="mr-1 h-3.5 w-3.5" />
                Create from template
              </AdminButton>
            </CapabilityGate>
          </div>
          <AdminTable headers={["Role Pack", "Code", "Capabilities"]}>
            {rolePacks.map((rp) => (
              <AdminTableRow key={rp._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{rp.name}</span>
                    <CapabilityGate capability="tenant.manage_settings">
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={() => openCreateFromTemplate(rp._id)}
                        className="h-7 px-2 text-xs"
                      >
                        Use as template
                      </AdminButton>
                    </CapabilityGate>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant="info">{rp.code}</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {rp.capabilities?.map((c: string) => {
                      const desc = getCapabilityDescription(c)
                      const name = getCapabilityName(c)
                      const displayName = name !== c ? name : c
                      const title = desc ? `${displayName}: ${desc}` : c
                      return (
                        <span
                          key={c}
                          title={title}
                          className="inline-flex cursor-help items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs text-white/70"
                        >
                          {displayName}
                          {desc && <HelpCircle className="h-3 w-3 shrink-0 text-white/40" />}
                        </span>
                      )
                    })}
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        </AdminCard>
      )}

      {/* Permission Test Tab */}
      {activeTab === "permission-test" && (
        <AdminCard>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Simulate role permissions</h3>
            <p className="mt-1 text-sm text-white/60">
              Select a role to see what capabilities and actions they can perform.
            </p>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-white/80">Role</label>
            <Select value={testRoleId} onValueChange={setTestRoleId}>
              <SelectTrigger className="w-[280px] border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Select a role to test" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r._id} value={r._id}>
                    {r.name} {r.isSystem ? "(system)" : "(custom)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {testRoleId ? (
            (() => {
              const role = roles.find((r) => r._id === testRoleId)
              const caps = role?.capabilities || []
              const hasAll = caps.includes("*")
              const effectiveCaps = hasAll ? Object.keys(CAPABILITY_METADATA) : caps
              return (
                <div className="space-y-4">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">
                      {effectiveCaps.length} capability(ies) — allowed actions
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {effectiveCaps.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300"
                        >
                          {getCapabilityName(c)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/50">
                    Users with this role can access admin features gated by these capabilities
                    (e.g. Invite user, Edit settings, View audit log).
                  </p>
                </div>
              )
            })()
          ) : (
            <AdminEmptyState
              icon={FlaskConical}
              title="Select a role"
              description="Choose a role above to preview what permissions it grants."
            />
          )}
        </AdminCard>
      )}

      {/* Capability Reference Tab */}
      {activeTab === "reference" && (
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Capability Reference</h3>
            <p className="text-sm text-white/60">Human-readable names and descriptions for all capabilities</p>
          </div>
          <AdminTable headers={["Capability", "Name", "Description"]}>
            {Object.entries(CAPABILITY_METADATA)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, meta]) => (
                <AdminTableRow key={key}>
                  <td className="px-6 py-4 font-mono text-xs text-white/70">{key}</td>
                  <td className="px-6 py-4 font-medium text-white">{meta.name}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{meta.description}</td>
                </AdminTableRow>
              ))}
          </AdminTable>
        </AdminCard>
      )}

      <RoleEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSuccess={loadRoles}
        templateId={editorTemplateId}
      />
    </AdminPageWrapper>
  )
}
