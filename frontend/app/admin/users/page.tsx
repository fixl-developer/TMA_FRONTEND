"use client"

import { useEffect, useState } from "react"
import { getTenantUsers, suspendUser, activateUser } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { useAuth } from "@/shared/context/AuthContext"
import { UserCircle2, Mail, UserPlus, Users, Shield, UserX, UserCheck } from "lucide-react"
import { InviteUserModal } from "@/shared/components/users/InviteUserModal"
import { BulkInviteModal } from "@/shared/components/users/BulkInviteModal"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { UserDetailModal } from "@/shared/components/users/UserDetailModal"
import { useToast } from "@/shared/components/ui/toast"
import { getInvitationsByTenant, cancelInvitation, resendInvitation } from "@/shared/services/invitationService"
import { getTenantRoles } from "@/shared/services/roleService"
import { useCapability } from "@/shared/hooks/useCapability"
import { getRoleLabel } from "@/shared/lib/roles"
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

const statusVariants: Record<string, "success" | "warning" | "danger"> = {
  ACTIVE: "success",
  SUSPENDED: "warning",
  BANNED: "danger",
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [invitationActionId, setInvitationActionId] = useState<string | null>(null)
  const [statusActionId, setStatusActionId] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [bulkInviteOpen, setBulkInviteOpen] = useState(false)
  const [detailUser, setDetailUser] = useState<any | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const canInviteUsers = useCapability("users.invite")
  const canAssignRoles = useCapability("users.assign_roles")
  const isCurrentUser = (email: string) => user?.email?.toLowerCase() === email?.toLowerCase()

  const roleNameById = (roleId: string) => {
    const roles = getTenantRoles(tenantId || "tenant_001")
    const role = roles.find((r) => r._id === roleId)
    return role?.name ?? roleId
  }

  const loadUsers = async () => {
    const [userData, inviteData] = await Promise.all([
      getTenantUsers(tenantId),
      getInvitationsByTenant(tenantId || "tenant_001"),
    ])
    setUsers(userData)
    setInvitations(inviteData)
    setLoading(false)
  }

  const copyInviteLink = async (inviteId: string) => {
    const link = `${window.location.origin}/accept-invite?token=${inviteId}`
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link)
      }
      showToast("Invitation link copied.", "success")
    } catch {
      showToast("Unable to copy link.", "error")
    }
  }

  const handleResend = async (inviteId: string) => {
    setInvitationActionId(inviteId)
    const ok = await resendInvitation(inviteId)
    if (ok) {
      showToast("Invitation resent (demo).", "success")
      await loadUsers()
    } else {
      showToast("Unable to resend invitation.", "error")
    }
    setInvitationActionId(null)
  }

  const handleCancel = async (inviteId: string) => {
    setInvitationActionId(inviteId)
    const ok = await cancelInvitation(inviteId)
    if (ok) {
      showToast("Invitation cancelled.", "success")
      await loadUsers()
    } else {
      showToast("Unable to cancel invitation.", "error")
    }
    setInvitationActionId(null)
  }

  const handleSuspend = async (u: { _id: string; email: string; name: string }) => {
    if (!tenantId || isCurrentUser(u.email)) return
    setStatusActionId(u._id)
    try {
      await suspendUser(tenantId, u._id)
      showToast(`${u.name} has been suspended.`, "success")
      await loadUsers()
    } catch {
      showToast("Unable to suspend user.", "error")
    }
    setStatusActionId(null)
  }

  const handleActivate = async (u: { _id: string; email: string; name: string }) => {
    if (!tenantId || isCurrentUser(u.email)) return
    setStatusActionId(u._id)
    try {
      await activateUser(tenantId, u._id)
      showToast(`${u.name} has been activated.`, "success")
      await loadUsers()
    } catch {
      showToast("Unable to activate user.", "error")
    }
    setStatusActionId(null)
  }

  useEffect(() => {
    loadUsers()
  }, [tenantId])

  const activeUsers = users.filter((u) => u.status === "ACTIVE").length
  const suspendedUsers = users.filter((u) => u.status === "SUSPENDED").length
  const pendingInvites = invitations.filter((i) => i.status === "PENDING").length

  return (
    <AdminPageWrapper>
      {/* Header */}
      <AdminSectionHeader
        title="Users & Roles"
        subtitle="Manage users, invitations, and role assignments"
        action={
          <CapabilityGate capability="users.invite">
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={() => setBulkInviteOpen(true)}>
                <Users className="mr-2 h-4 w-4" />
                Bulk invite
              </AdminButton>
              <AdminButton onClick={() => setInviteOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite user
              </AdminButton>
            </div>
          </CapabilityGate>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Users"
          value={users.length}
          subtitle="All users"
          icon={Users}
          color="purple"
        />
        <AdminStatCard
          title="Active"
          value={activeUsers}
          subtitle="Active users"
          icon={UserCircle2}
          color="green"
          trend="up"
          trendValue="+12%"
        />
        <AdminStatCard
          title="Suspended"
          value={suspendedUsers}
          subtitle="Suspended users"
          icon={Shield}
          color="yellow"
        />
        <AdminStatCard
          title="Pending Invites"
          value={pendingInvites}
          subtitle="Awaiting acceptance"
          icon={Mail}
          color="blue"
        />
      </div>

      {/* Users Table */}
      <AdminCard className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Users</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <AdminEmptyState
            icon={UserCircle2}
            title="No users yet"
            description="Invite team members to get started."
            action={
              <CapabilityGate capability="users.invite">
                <div className="flex gap-2">
                  <AdminButton variant="secondary" onClick={() => setBulkInviteOpen(true)}>
                    Bulk invite
                  </AdminButton>
                  <AdminButton onClick={() => setInviteOpen(true)}>Invite user</AdminButton>
                </div>
              </CapabilityGate>
            }
          />
        ) : (
          <AdminTable headers={["User", "Email", "Role", "Status", "Last Login", "Actions"]}>
            {users.map((u) => (
              <AdminTableRow
                key={u._id}
                onClick={canAssignRoles ? () => { setDetailUser(u); setDetailOpen(true) } : undefined}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                      <UserCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-white">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Mail className="h-3 w-3" />
                    {u.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-white/70">{getRoleLabel(u.role)}</span>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={statusVariants[u.status] ?? "default"}>
                    {u.status ?? "ACTIVE"}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4 text-sm text-white/50">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <AdminButton size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDetailUser(u); setDetailOpen(true) }}>
                      View
                    </AdminButton>
                    <CapabilityGate capability="users.assign_roles">
                      {u.status === "ACTIVE" || u.status === "BANNED" ? (
                        <AdminButton
                          size="sm"
                          variant="danger"
                          title="Suspend user"
                          onClick={(e) => { e.stopPropagation(); handleSuspend(u) }}
                          disabled={statusActionId === u._id || isCurrentUser(u.email)}
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </AdminButton>
                      ) : (
                        <AdminButton
                          size="sm"
                          variant="secondary"
                          title="Activate user"
                          onClick={(e) => { e.stopPropagation(); handleActivate(u) }}
                          disabled={statusActionId === u._id || isCurrentUser(u.email)}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                        </AdminButton>
                      )}
                    </CapabilityGate>
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Invitations */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Invitation Queue</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : invitations.length === 0 ? (
          <AdminEmptyState
            icon={Mail}
            title="No invitations yet"
            description="Invite team members to join your organization."
            action={
              <CapabilityGate capability="users.invite">
                <div className="flex gap-2">
                  <AdminButton variant="secondary" onClick={() => setBulkInviteOpen(true)}>
                    Bulk invite
                  </AdminButton>
                  <AdminButton onClick={() => setInviteOpen(true)}>Invite user</AdminButton>
                </div>
              </CapabilityGate>
            }
          />
        ) : (
          <div className="space-y-3">
            {invitations
              .slice()
              .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
              .map((inv) => (
                <div
                  key={inv._id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{inv.email}</p>
                    <p className="text-xs text-white/50">
                      Role: {roleNameById(inv.roleId)} · Status: {inv.status}
                      {inv.expiresAt ? ` · Expires: ${new Date(inv.expiresAt).toLocaleDateString("en-IN")}` : ""}
                      {inv.invitedByEmail ? ` · Invited by: ${inv.invitedByEmail}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CapabilityGate capability="users.invite">
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        onClick={() => copyInviteLink(inv._id)}
                      >
                        Copy link
                      </AdminButton>
                    </CapabilityGate>
                    <CapabilityGate capability="users.invite">
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        onClick={() => handleResend(inv._id)}
                        disabled={invitationActionId === inv._id}
                      >
                        Resend
                      </AdminButton>
                    </CapabilityGate>
                    <CapabilityGate capability="users.invite">
                      <AdminButton
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancel(inv._id)}
                        disabled={invitationActionId === inv._id || inv.status === "CANCELLED"}
                      >
                        Cancel
                      </AdminButton>
                    </CapabilityGate>
                  </div>
                </div>
              ))}
          </div>
        )}
      </AdminCard>

      {canInviteUsers && (
        <>
          <InviteUserModal
            open={inviteOpen}
            onOpenChange={setInviteOpen}
            onSuccess={loadUsers}
          />
          <BulkInviteModal
            open={bulkInviteOpen}
            onOpenChange={setBulkInviteOpen}
            onSuccess={loadUsers}
          />
        </>
      )}
      <UserDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        user={detailUser}
        onSuccess={loadUsers}
      />
    </AdminPageWrapper>
  )
}
