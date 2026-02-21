"use client"

import * as React from "react"
import { ChevronDown, Building2, Check, Search, Crown } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { useTenant } from "@/shared/context/TenantContext"
import { useAuth } from "@/shared/context/AuthContext"
import { seedUsers, seedStaff } from "@/data/seed"
import { AGENCY_TYPE_LABELS } from "@/shared/lib/constants/agencyBlueprints"
import type { Tenant } from "@/shared/lib/types/tenants"
import { cn } from "@/shared/lib/utils"

const STAFF_ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  AGENT: "Agent",
  TALENT_MANAGER: "Talent Manager",
  FINANCE: "Finance",
}

function getAgencyTypeBadge(tenant: Tenant): string {
  if (tenant.agencyType && tenant.agencyType in AGENCY_TYPE_LABELS) {
    return AGENCY_TYPE_LABELS[tenant.agencyType as keyof typeof AGENCY_TYPE_LABELS]
  }
  return tenant.type
}

export function TenantSwitcher() {
  const { user } = useAuth()
  const { currentTenant, tenants, switchTenant } = useTenant()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  const userId = React.useMemo(() => {
    if (!user?.email) return null
    const u = (seedUsers as { email?: string; _id?: string }[]).find(
      (x) => x.email?.toLowerCase() === user.email?.toLowerCase()
    )
    return u?._id ?? null
  }, [user?.email])

  const tenantRoleMap = React.useMemo(() => {
    const map: Record<string, string> = {}
    if (!userId) return map
    const staffList = seedStaff as { tenantId: string; userId: string; role: string }[]
    staffList.forEach((s) => {
      if (s.userId === userId) map[s.tenantId] = s.role
    })
    return map
  }, [userId])

  const getTenantRole = (tenantId: string) => tenantRoleMap[tenantId]
  const isOwner = (tenantId: string) => getTenantRole(tenantId) === "OWNER"

  const showSearch = tenants.length > 10
  const filteredTenants = React.useMemo(() => {
    if (!search.trim()) return tenants
    const q = search.trim().toLowerCase()
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug?.toLowerCase().includes(q) ||
        getAgencyTypeBadge(t).toLowerCase().includes(q)
    )
  }, [tenants, search])

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (!open) setSearch("")
  }, [open])

  if (tenants.length === 0) return null
  if (tenants.length === 1) {
    const role = currentTenant ? getTenantRole(currentTenant._id) : null
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 admin-dark-theme:border-white/10 admin-dark-theme:bg-white/5">
        <Building2 className="h-4 w-4 text-[#B8860B] admin-dark-theme:text-[#d4ff00]" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-[#1C1917] admin-dark-theme:text-white">{currentTenant?.name ?? "—"}</span>
            {role === "OWNER" && (
              <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 admin-dark-theme:bg-amber-500/20 admin-dark-theme:text-amber-300">
                <Crown className="h-2.5 w-2.5" /> Owner
              </span>
            )}
          </div>
          {currentTenant?.agencyType && (
            <span className="text-xs text-[#78716C] admin-dark-theme:text-white/60">{getAgencyTypeBadge(currentTenant)}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-[#E7E5E4] bg-white text-[#1C1917] hover:bg-[#F5F0E8] hover:border-[#B8860B]/40 admin-dark-theme:border-white/10 admin-dark-theme:bg-white/5 admin-dark-theme:text-white admin-dark-theme:hover:bg-white/10"
        onClick={() => setOpen((v) => !v)}
      >
        <Building2 className="h-4 w-4 text-[#B8860B] admin-dark-theme:text-[#d4ff00]" />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1.5">
            <span className="max-w-[120px] truncate">{currentTenant?.name ?? "Select tenant"}</span>
            {currentTenant && isOwner(currentTenant._id) && (
              <Crown className="h-3 w-3 shrink-0 text-amber-500" title="Owner" />
            )}
          </div>
          {currentTenant && (
            <span className="text-xs text-[#78716C] admin-dark-theme:text-white/60">
              {[
                getTenantRole(currentTenant._id) && (STAFF_ROLE_LABELS[getTenantRole(currentTenant._id)] ?? getTenantRole(currentTenant._id)),
                currentTenant?.agencyType && getAgencyTypeBadge(currentTenant),
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
      </Button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[240px] max-h-[320px] flex flex-col rounded-lg border border-[#E7E5E4] bg-white shadow-lg overflow-hidden admin-dark-theme:border-white/10 admin-dark-theme:bg-[#1e1b2e]">
          {showSearch && (
            <div className="relative p-2 border-b border-[#E7E5E4] admin-dark-theme:border-white/10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
              <Input
                placeholder="Search tenants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          )}
          <div className="overflow-y-auto py-1">
            {filteredTenants.length === 0 ? (
              <div className="px-3 py-4 text-sm text-[#78716C] text-center">No tenants match</div>
            ) : (
              filteredTenants.map((t) => {
                const role = getTenantRole(t._id)
                const owner = role === "OWNER"
                return (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => {
                      switchTenant(t._id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                      currentTenant?._id === t._id
                        ? "bg-[#FEF3C7] font-medium text-[#B8860B] admin-dark-theme:bg-[#d4ff00]/10 admin-dark-theme:text-[#d4ff00]"
                        : "text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917] admin-dark-theme:text-white/70 admin-dark-theme:hover:bg-white/5 admin-dark-theme:hover:text-white"
                    )}
                  >
                    {currentTenant?._id === t._id ? <Check className="h-4 w-4 shrink-0" /> : <span className="w-4" />}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{t.name}</span>
                        {owner && (
                          <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-medium text-amber-800 admin-dark-theme:bg-amber-500/20 admin-dark-theme:text-amber-300">
                            <Crown className="h-2.5 w-2.5" /> Owner
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#78716C] admin-dark-theme:text-white/50">
                        {[role && (STAFF_ROLE_LABELS[role] ?? role), t.agencyType && getAgencyTypeBadge(t)].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
