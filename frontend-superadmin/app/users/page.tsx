/**
 * Users Management - Super Admin
 *
 * Platform-level user identity, roles, and abuse management.
 * Seed data only. Tabs: Identity, Roles, Abuse.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { UserCircle2, Shield, AlertTriangle } from "lucide-react"
import { getUsers, getAbuseReports, getTenantName } from "@/shared/services/userService"
import type { PlatformUser, UserStatus } from "@/shared/lib/types/users"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"

type TabId = "identity" | "roles" | "abuse"

const statusColors: Record<UserStatus, string> = {
  ACTIVE: "bg-[#dff6dd] text-[#107c10] border-[#107c10]",
  SUSPENDED: "bg-[#fff4ce] text-[#797673] border-[#797673]",
  BANNED: "bg-[#fde7e9] text-[#a80000] border-[#a80000]",
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  TENANT_OWNER: "Tenant Owner",
  ADMIN: "Admin",
  AGENT: "Agent",
  TALENT_MANAGER: "Talent Manager",
  TALENT: "Talent",
  JUDGE: "Judge",
  BRAND: "Brand",
}

export default function UsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [abuseReports, setAbuseReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("identity")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const [u, a] = await Promise.all([getUsers(), getAbuseReports()])
        setUsers(u)
        setAbuseReports(a)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.status === "ACTIVE").length
    const suspended = users.filter((u) => u.status === "SUSPENDED").length
    const banned = users.filter((u) => u.status === "BANNED").length
    const byRole = users.reduce<Record<string, number>>((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1
      return acc
    }, {})
    const pendingAbuse = abuseReports.filter((a) => a.status === "PENDING").length
    return { total, active, suspended, banned, byRole, pendingAbuse }
  }, [users, abuseReports])

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users
    const q = searchQuery.toLowerCase()
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u._id.toLowerCase().includes(q)
    )
  }, [users, searchQuery])

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "identity", label: "Identity", icon: <UserCircle2 className="h-4 w-4" /> },
    { id: "roles", label: "Roles", icon: <Shield className="h-4 w-4" /> },
    { id: "abuse", label: "Abuse", icon: <AlertTriangle className="h-4 w-4" /> },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Users"
        description="Platform-level user identity, roles, and abuse management. Cross-tenant view."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#e1e1e1] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <UserCircle2 className="h-3.5 w-3.5 text-[#0078d4]" />
            Platform
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded border border-[#8a8886] bg-white px-3 py-2 text-sm text-[#323130] placeholder:text-[#a19f9d] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
            />
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Cross-tenant platform users.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : metrics.active}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Users in good standing.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suspended / Banned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.suspended + metrics.banned}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Users under restriction.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Abuse pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#d13438]">
                {loading ? "—" : metrics.pendingAbuse}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Reports awaiting review.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded border border-[#e1e1e1] bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-[#f3f2f1] text-[#0078d4] border-l-2 border-[#0078d4]"
                : "text-[#605e5c] hover:bg-[#faf9f8]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Identity */}
      {activeTab === "identity" && (
        <PageSection title="Identity">
          <Card>
            <CardHeader>
              <CardTitle>User directory</CardTitle>
              <p className="text-sm text-slate-500">
                Cross-tenant user lookup. Email, name, status, tenants.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-[#605e5c]">Loading…</p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-[#605e5c]">No users match your search.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e1e1e1] bg-[#faf9f8] text-left text-[#323130]">
                        <th className="pb-3 pr-4 font-semibold">User</th>
                        <th className="pb-3 pr-4 font-semibold">Email</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 pr-4 font-semibold">Role</th>
                        <th className="pb-3 pr-4 font-semibold">Tenants</th>
                        <th className="pb-3 font-semibold">Last login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, idx) => (
                        <tr
                          key={u._id}
                          className={`border-b border-[#e1e1e1] transition-colors ${
                            idx % 2 === 0 ? "bg-white hover:bg-[#f3f2f1]" : "bg-[#faf9f8] hover:bg-[#f3f2f1]"
                          }`}
                        >
                          <td className="py-3 pr-4">
                            <span className="font-medium text-[#323130]">{u.name}</span>
                            <p className="text-[11px] text-[#a19f9d]">{u._id}</p>
                          </td>
                          <td className="py-3 pr-4 text-[#605e5c]">{u.email}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${statusColors[u.status]}`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-[#605e5c]">
                            {roleLabels[u.role] ?? u.role}
                          </td>
                          <td className="py-3 pr-4 text-[#605e5c]">
                            {u.tenantIds.length === 0
                              ? "—"
                              : u.tenantIds.map(getTenantName).join(", ")}
                          </td>
                          <td className="py-3 text-[#605e5c]">
                            {u.lastLoginAt
                              ? new Date(u.lastLoginAt).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </PageSection>
      )}

      {/* Tab: Roles */}
      {activeTab === "roles" && (
        <PageSection title="Roles">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Users by role</CardTitle>
                <p className="text-sm text-slate-500">
                  Distribution of platform roles.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : Object.keys(metrics.byRole).length === 0 ? (
                  <p className="text-slate-500">No role data.</p>
                ) : (
                  <RechartsPie
                    data={Object.entries(metrics.byRole).map(([role, count]) => ({
                      label: roleLabels[role] ?? role,
                      value: count,
                    }))}
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Role summary</CardTitle>
                <p className="text-sm text-slate-500">
                  Count per role from seed data.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <ul className="space-y-2">
                    {Object.entries(metrics.byRole)
                      .sort(([, a], [, b]) => b - a)
                      .map(([role, count]) => (
                        <li
                          key={role}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2"
                        >
                          <span className="text-sm font-medium text-slate-800">
                            {roleLabels[role] ?? role}
                          </span>
                          <span className="text-sm text-slate-600">{count}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </PageSection>
      )}

      {/* Tab: Abuse */}
      {activeTab === "abuse" && (
        <PageSection title="Abuse">
          <Card>
            <CardHeader>
              <CardTitle>Abuse reports</CardTitle>
              <p className="text-sm text-slate-500">
                Reports, suspensions, and appeals. Seed data.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-[#605e5c]">Loading…</p>
              ) : abuseReports.length === 0 ? (
                <p className="text-[#605e5c]">No abuse reports in seed.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e1e1e1] bg-[#faf9f8] text-left text-[#323130]">
                        <th className="pb-3 pr-4 font-semibold">Report</th>
                        <th className="pb-3 pr-4 font-semibold">User</th>
                        <th className="pb-3 pr-4 font-semibold">Tenant</th>
                        <th className="pb-3 pr-4 font-semibold">Reason</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {abuseReports.map((r, idx) => {
                        const user = users.find((u) => u._id === r.userId)
                        return (
                          <tr
                            key={r._id}
                            className={`border-b border-[#e1e1e1] transition-colors ${
                              idx % 2 === 0 ? "bg-white hover:bg-[#f3f2f1]" : "bg-[#faf9f8] hover:bg-[#f3f2f1]"
                            }`}
                          >
                            <td className="py-3 pr-4">
                              <span className="font-medium text-[#323130]">{r._id}</span>
                            </td>
                            <td className="py-3 pr-4">
                              {user ? (
                                <>
                                  <span className="text-[#323130]">{user.name}</span>
                                  <p className="text-[11px] text-[#a19f9d]">{user.email}</p>
                                </>
                              ) : (
                                r.userId
                              )}
                            </td>
                            <td className="py-3 pr-4 text-[#605e5c]">
                              {getTenantName(r.tenantId)}
                            </td>
                            <td className="py-3 pr-4 text-[#605e5c] max-w-[200px] truncate">
                              {r.reason}
                            </td>
                            <td className="py-3 pr-4">
                              <span
                                className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                  r.status === "PENDING"
                                    ? "bg-[#fff4ce] text-[#797673] border-[#797673]"
                                    : r.status === "ACTION_TAKEN"
                                    ? "bg-[#fde7e9] text-[#a80000] border-[#a80000]"
                                    : "bg-[#f3f2f1] text-[#323130] border-[#8a8886]"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="py-3 text-[#605e5c]">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
