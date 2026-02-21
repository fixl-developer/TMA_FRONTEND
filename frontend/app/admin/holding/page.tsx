"use client"

import { useEffect, useMemo, useState } from "react"
import { Building2, Users, Shield, BarChart3, Plus, ChevronRight } from "lucide-react"
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
import subTenantLinks from "@/data/seed/sub_tenant_links.json"
import policyPacks from "@/data/seed/policy_packs.json"
import tenants from "@/data/seed/tenants.json"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

const GROUP_ID = "tenant_023"

const POLICY_STORAGE_KEY = "talentos_holding_policy_states"
const SUB_TENANT_KEY = "talentos_holding_sub_tenants"

function getPolicyStates(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(POLICY_STORAGE_KEY) || "{}") } catch { return {} }
}
function savePolicyState(code: string, enabled: boolean) {
  const s = getPolicyStates(); s[code] = enabled
  localStorage.setItem(POLICY_STORAGE_KEY, JSON.stringify(s))
}
function getExtraSubTenants(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(SUB_TENANT_KEY) || "[]") } catch { return [] }
}
function addSubTenant(link: any) {
  const existing = getExtraSubTenants()
  existing.push(link)
  localStorage.setItem(SUB_TENANT_KEY, JSON.stringify(existing))
}

export default function HoldingGroupPage() {
  const [subTenants, setSubTenants] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "subtenants" | "policies" | "reports">("overview")
  const [addOpen, setAddOpen] = useState(false)
  const [newSubTenant, setNewSubTenant] = useState({ name: "", type: "AGENCY" })

  useEffect(() => {
    // Load sub-tenants from seed + extra
    const seedLinks = subTenantLinks.filter((l) => l.groupId === GROUP_ID)
    const extra = getExtraSubTenants()
    const allLinks = [...seedLinks, ...extra]

    // Enrich with tenant details
    const enriched = allLinks.map((link) => {
      const tenant = (tenants as any[]).find((t) => t._id === link.subTenantId) || {
        _id: link.subTenantId,
        name: link.name || link.subTenantId,
        type: link.type || "AGENCY",
        status: "ACTIVE",
      }
      return { ...link, tenant }
    })
    setSubTenants(enriched)

    // Load policies with overrides
    const overrides = getPolicyStates()
    setPolicies(
      (policyPacks as any[]).map((p) => ({
        ...p,
        enabled: p.code in overrides ? overrides[p.code] : p.enabled,
      }))
    )
  }, [])

  function togglePolicy(code: string) {
    setPolicies((prev) => prev.map((p) => p.code === code ? { ...p, enabled: !p.enabled } : p))
    const current = policies.find((p) => p.code === code)
    if (current) savePolicyState(code, !current.enabled)
  }

  function handleAddSubTenant() {
    const link = {
      groupId: GROUP_ID,
      subTenantId: `tenant_new_${Date.now()}`,
      name: newSubTenant.name,
      type: newSubTenant.type,
      linkedAt: new Date().toISOString(),
    }
    addSubTenant(link)
    setSubTenants((prev) => [...prev, {
      ...link,
      tenant: { _id: link.subTenantId, name: link.name, type: link.type, status: "ACTIVE" }
    }])
    setNewSubTenant({ name: "", type: "AGENCY" })
    setAddOpen(false)
  }

  const enabledPolicies = policies.filter((p) => p.enabled).length

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "subtenants", label: `Sub-Tenants (${subTenants.length})` },
    { id: "policies", label: `Policy Packs (${enabledPolicies}/${policies.length})` },
    { id: "reports", label: "Consolidated Reports" },
  ] as const

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Holding Group"
        subtitle="B10: Manage sub-tenants, policy packs, and consolidated reporting"
        action={
          activeTab === "subtenants" && (
            <AdminButton onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Sub-Tenant
            </AdminButton>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Sub-Tenants" value={subTenants.length} icon={Building2} />
        <AdminStatCard title="Active Policies" value={enabledPolicies} icon={Shield} />
        <AdminStatCard title="Total Tenants" value={subTenants.length + 1} icon={Users} />
        <AdminStatCard title="Policy Coverage" value={`${Math.round((enabledPolicies / policies.length) * 100)}%`} icon={BarChart3} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/5 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              activeTab === tab.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Sub-Tenant Summary</h3>
            {subTenants.length === 0 ? (
              <AdminEmptyState title="No sub-tenants" description="Add sub-tenants to this holding group." />
            ) : (
              <div className="space-y-3">
                {subTenants.map((link) => (
                  <div key={link.subTenantId} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400">
                        {(link.tenant.name || link.subTenantId).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{link.tenant.name || link.subTenantId}</p>
                        <p className="text-xs text-white/40">{link.tenant.type} · Linked {new Date(link.linkedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <AdminBadge variant="success">{link.tenant.status || "ACTIVE"}</AdminBadge>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Policy Overview</h3>
            <div className="space-y-2">
              {policies.map((p) => (
                <div key={p.code} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-white/40">{p.policies?.length || 0} policies</p>
                  </div>
                  <AdminBadge variant={p.enabled ? "success" : "default"}>{p.enabled ? "Enabled" : "Disabled"}</AdminBadge>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}

      {/* Sub-Tenants */}
      {activeTab === "subtenants" && (
        subTenants.length === 0 ? (
          <AdminEmptyState title="No sub-tenants" description="This holding group has no sub-tenants yet." />
        ) : (
          <AdminCard>
            <AdminTable headers={["Sub-Tenant", "Type", "Status", "Linked Since", ""]}>
              {subTenants.map((link) => (
                <AdminTableRow key={link.subTenantId}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400">
                        {(link.tenant.name || link.subTenantId).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{link.tenant.name || link.subTenantId}</p>
                        <p className="text-xs text-white/40">{link.subTenantId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-white/70">{link.tenant.type || "AGENCY"}</td>
                  <td className="py-3 pr-4">
                    <AdminBadge variant="success">{link.tenant.status || "ACTIVE"}</AdminBadge>
                  </td>
                  <td className="py-3 pr-4 text-sm text-white/50">{new Date(link.linkedAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">
                    <AdminButton variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </AdminButton>
                  </td>
                </AdminTableRow>
              ))}
            </AdminTable>
          </AdminCard>
        )
      )}

      {/* Policy Packs */}
      {activeTab === "policies" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {policies.map((p) => (
            <AdminCard key={p.code}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-white/70">{p.code}</span>
                    <h3 className="font-bold text-white">{p.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-white/50">{p.description}</p>
                  <p className="mt-2 text-xs text-white/30">{p.policies?.length || 0} policy rules</p>
                </div>
                <button
                  onClick={() => togglePolicy(p.code)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${p.enabled ? "bg-blue-500" : "bg-white/20"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.enabled ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
              {p.policies && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.policies.slice(0, 6).map((rule: string) => (
                    <span key={rule} className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-white/40">{rule}</span>
                  ))}
                  {p.policies.length > 6 && (
                    <span className="text-xs text-white/30">+{p.policies.length - 6} more</span>
                  )}
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}

      {/* Reports */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Consolidated Revenue (All Sub-Tenants)</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Total Revenue", value: "₹24.7L", trend: "+12%" },
                { label: "Commission Earned", value: "₹2.9L", trend: "+8%" },
                { label: "Active Deals", value: "47", trend: "+5" },
                { label: "Avg Deal Size", value: "₹52.6K", trend: "+3%" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/50">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-emerald-400">{item.trend} this quarter</p>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Sub-Tenant Performance</h3>
            <AdminTable headers={["Sub-Tenant", "Revenue", "Deals", "Compliance", "Status"]}>
              {subTenants.map((link, i) => (
                <AdminTableRow key={link.subTenantId}>
                  <td className="py-3 pr-4 font-medium text-white">{link.tenant.name || link.subTenantId}</td>
                  <td className="py-3 pr-4 text-white/70">₹{((i + 1) * 4.2).toFixed(1)}L</td>
                  <td className="py-3 pr-4 text-white/70">{(i + 1) * 7 + 5}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${75 + i * 5}%` }} />
                      </div>
                      <span className="text-xs text-white/60">{75 + i * 5}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><AdminBadge variant="success">Active</AdminBadge></td>
                </AdminTableRow>
              ))}
            </AdminTable>
          </AdminCard>
        </div>
      )}

      {/* Add Sub-Tenant Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border border-white/10 bg-slate-900 text-white">
          <DialogHeader><DialogTitle>Add Sub-Tenant</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Tenant Name</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Agency or organization name"
                value={newSubTenant.name}
                onChange={(e) => setNewSubTenant((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Type</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
                value={newSubTenant.type}
                onChange={(e) => setNewSubTenant((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="AGENCY">Agency</option>
                <option value="BRAND">Brand</option>
                <option value="TALENT_CO">Talent Company</option>
                <option value="STUDIO">Studio</option>
              </select>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setAddOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleAddSubTenant} disabled={!newSubTenant.name}>Add Sub-Tenant</AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
