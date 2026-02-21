"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getLeads, getAccounts, getActivities } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users2, Building2, UserPlus, Activity, ChevronRight } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

export default function CrmPage() {
  const { tenantId } = useTenant()
  const [leads, setLeads] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getLeads(tenantId),
      getAccounts(tenantId),
      getActivities(tenantId, 5),
    ]).then(([l, a, act]) => {
      setLeads(l)
      setAccounts(a)
      setActivities(act)
      setLoading(false)
    })
  }, [tenantId])

  const qualifiedLeads = leads.filter((l) => l.status === "QUALIFIED")
  const newLeads = leads.filter((l) => l.status === "NEW")

  const getLeadBadgeVariant = (status: string) => {
    switch (status) {
      case "QUALIFIED":
        return "success"
      case "NEW":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="CRM"
        subtitle="Leads, accounts, contacts, and activities"
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Leads"
          value={leads.length}
          subtitle={`${qualifiedLeads.length} qualified`}
          icon={Users2}
          color="purple"
        />
        <AdminStatCard
          title="Accounts"
          value={accounts.length}
          subtitle="Active clients & brands"
          icon={Building2}
          color="blue"
        />
        <AdminStatCard
          title="New Leads"
          value={newLeads.length}
          subtitle="Awaiting qualification"
          icon={UserPlus}
          color="yellow"
        />
        <AdminStatCard
          title="Recent Activity"
          value={activities.length}
          subtitle="Last 5 logged"
          icon={Activity}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/crm/leads">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#d4ff00]/10 p-2">
                <Users2 className="h-5 w-5 text-[#d4ff00]" />
              </div>
              <p className="font-semibold text-white">Leads</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/crm/accounts">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Building2 className="h-5 w-5 text-purple-400" />
              </div>
              <p className="font-semibold text-white">Accounts</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/crm/contacts">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <UserPlus className="h-5 w-5 text-blue-400" />
              </div>
              <p className="font-semibold text-white">Contacts</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/crm/activities">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              <p className="font-semibold text-white">Activities</p>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/crm/segments">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-pink-500/10 p-2">
                <Users2 className="h-5 w-5 text-pink-400" />
              </div>
              <p className="font-semibold text-white">Segments</p>
            </div>
          </AdminCard>
        </Link>
      </div>

      {/* Leads and Accounts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leads */}
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Leads</h3>
            <Link href="/admin/crm/leads">
              <AdminButton size="sm" variant="ghost">
                View All
              </AdminButton>
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <p className="py-8 text-center text-white/50">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 5).map((l) => (
                <Link key={l._id} href={`/admin/crm/leads?highlight=${l._id}`}>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="flex-1">
                      <p className="font-medium text-white">{l.name}</p>
                      <p className="text-sm text-white/60">{l.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AdminBadge variant={getLeadBadgeVariant(l.status) as any}>
                        {l.status}
                      </AdminBadge>
                      <ChevronRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Accounts */}
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Accounts</h3>
            <Link href="/admin/crm/accounts">
              <AdminButton size="sm" variant="ghost">
                View All
              </AdminButton>
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <p className="py-8 text-center text-white/50">No accounts yet.</p>
          ) : (
            <div className="space-y-3">
              {accounts.slice(0, 5).map((a) => (
                <Link key={a._id} href={`/admin/crm/accounts/${a._id}`}>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="flex-1">
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-sm text-white/60">
                        {a.type} · {a.industry}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPageWrapper>
  )
}
