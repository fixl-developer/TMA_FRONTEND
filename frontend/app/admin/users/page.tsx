"use client"

import { useEffect, useState } from "react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { getTenantUsers, suspendUser, activateUser } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { useAuth } from "@/shared/context/AuthContext"
import { UserCircle2, Mail, UserPlus, Users, Shield, UserX, UserCheck, Search, Filter } from "lucide-react"
import { InviteUserModal } from "@/shared/components/users/InviteUserModal"
import { BulkInviteModal } from "@/shared/components/users/BulkInviteModal"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { UserDetailModal } from "@/shared/components/users/UserDetailModal"
import { useToast } from "@/shared/components/ui/toast"
import { getInvitationsByTenant, cancelInvitation, resendInvitation } from "@/shared/services/invitationService"
import { getTenantRoles } from "@/shared/services/roleService"
import { useCapability } from "@/shared/hooks/useCapability"
import { getRoleLabel } from "@/shared/lib/roles"

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
  const [searchQuery, setSearchQuery] = useState("")
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

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageWrapper>
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="text-xs text-gray-600 mt-1">Manage users, invitations, and role assignments</p>
          </div>
          <CapabilityGate capability="users.invite">
            <div className="flex gap-2">
              <button
                onClick={() => setBulkInviteOpen(true)}
                className="flex items-center gap-2 rounded border border-blue-600 bg-white px-4 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                Bulk invite
              </button>
              <button
                onClick={() => setInviteOpen(true)}
                className="flex items-center gap-2 rounded border border-blue-600 bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#106ebe]"
              >
                <UserPlus className="h-4 w-4" />
                Invite user
              </button>
            </div>
          </CapabilityGate>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded bg-white border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Total Users</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="rounded bg-white border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Active</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{activeUsers}</p>
              </div>
              <UserCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="rounded bg-white border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Suspended</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{suspendedUsers}</p>
              </div>
              <Shield className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="rounded bg-white border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">Pending Invites</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{pendingInvites}</p>
              </div>
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="mb-6 rounded bg-white border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Users</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <input
                  type="search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-64 rounded border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded bg-gray-50" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <UserCircle2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm font-semibold text-gray-900 mb-1">No users found</p>
                <p className="text-xs text-gray-600">
                  {searchQuery ? "Try adjusting your search" : "Invite team members to get started"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <tr
                      key={u._id}
                      className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${canAssignRoles ? "cursor-pointer" : ""}`}
                      onClick={canAssignRoles ? () => { setDetailUser(u); setDetailOpen(true) } : undefined}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                            {u.name?.charAt(0)?.toUpperCase() ?? "U"}
                          </div>
                          <span className="text-xs font-semibold text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{getRoleLabel(u.role)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold ${
                            u.status === "ACTIVE"
                              ? "border-[#107c10] bg-green-50 text-green-600"
                              : u.status === "SUSPENDED"
                              ? "border-[#ffb900] bg-yellow-50 text-[#797673]"
                              : "border-[#d13438] bg-red-50 text-red-600"
                          }`}
                        >
                          {u.status ?? "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailUser(u); setDetailOpen(true) }}
                            className="rounded px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-gray-50"
                          >
                            View
                          </button>
                          <CapabilityGate capability="users.assign_roles">
                            {u.status === "ACTIVE" || u.status === "BANNED" ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSuspend(u) }}
                                disabled={statusActionId === u._id || isCurrentUser(u.email)}
                                className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                                title="Suspend user"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleActivate(u) }}
                                disabled={statusActionId === u._id || isCurrentUser(u.email)}
                                className="rounded p-1.5 text-green-600 transition-colors hover:bg-green-50 disabled:opacity-50"
                                title="Activate user"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                          </CapabilityGate>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Invitations */}
        <div className="rounded bg-white border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Pending Invitations</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded bg-gray-50" />
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <div className="py-8 text-center">
                <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm font-semibold text-gray-900 mb-1">No pending invitations</p>
                <p className="text-xs text-gray-600 mb-4">Invite team members to join your organization</p>
                <CapabilityGate capability="users.invite">
                  <button
                    onClick={() => setInviteOpen(true)}
                    className="rounded border border-blue-600 bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#106ebe]"
                  >
                    Invite user
                  </button>
                </CapabilityGate>
              </div>
            ) : (
              <div className="space-y-3">
                {invitations
                  .slice()
                  .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
                  .map((inv) => (
                    <div
                      key={inv._id}
                      className="flex flex-col gap-3 rounded border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{inv.email}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Role: {roleNameById(inv.roleId)} · Status: {inv.status}
                          {inv.expiresAt ? ` · Expires: ${new Date(inv.expiresAt).toLocaleDateString("en-IN")}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CapabilityGate capability="users.invite">
                          <button
                            onClick={() => copyInviteLink(inv._id)}
                            className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                          >
                            Copy link
                          </button>
                          <button
                            onClick={() => handleResend(inv._id)}
                            disabled={invitationActionId === inv._id}
                            className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-50"
                          >
                            Resend
                          </button>
                          <button
                            onClick={() => handleCancel(inv._id)}
                            disabled={invitationActionId === inv._id || inv.status === "CANCELLED"}
                            className="rounded border border-[#d13438] bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </CapabilityGate>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
