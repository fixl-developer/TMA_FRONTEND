"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getLeads, getAccounts, getActivities } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users2, Building2, UserPlus, Activity, ChevronRight, UserCircle2, Phone } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminTableRow,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

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
  const recentLeads = leads.slice(0, 5)

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="CRM"
        subtitle="Manage leads, accounts, contacts, and activities"
      >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Total Leads"
          value={leads.length}
          icon={Users2}
          color="purple"
          subtitle={`${qualifiedLeads.length} qualified`}
        />
        <AdminStatCard
          label="Accounts"
          value={accounts.length}
          icon={Building2}
          color="blue"
          subtitle="Active clients"
        />
        <AdminStatCard
          label="New Leads"
          value={newLeads.length}
          icon={UserPlus}
          color="yellow"
          subtitle="Awaiting qualification"
        />
        <AdminStatCard
          label="Activities"
          value={activities.length}
          icon={Activity}
          color="green"
          subtitle="Recent logged"
        />
      </AdminStatsGrid>

      {/* Quick Navigation */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Leads", href: "/admin/crm/leads", icon: Users2, color: "#0078d4" },
          { label: "Accounts", href: "/admin/crm/accounts", icon: Building2, color: "#107c10" },
          { label: "Contacts", href: "/admin/crm/contacts", icon: UserCircle2, color: "#8764b8" },
          { label: "Activities", href: "/admin/crm/activities", icon: Activity, color: "#ffb900" },
          { label: "Segments", href: "/admin/crm/segments", icon: Users2, color: "#d13438" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className="group rounded border border-[#edebe9] bg-white p-4 transition-all hover:border-[#0078d4] hover:shadow-sm cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                    <p className="text-sm font-semibold text-[#323130]">{item.label}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#a19f9d] transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Leads */}
      <AdminCard
        title="Recent Leads"
        actions={
          <Link href="/admin/crm/leads">
            <button className="text-xs font-semibold text-[#0078d4] hover:underline">
              View All
            </button>
          </Link>
        }
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </div>
        ) : recentLeads.length === 0 ? (
          <AdminEmptyState
            icon={Users2}
            title="No leads yet"
            description="Start adding leads to track your sales pipeline"
          />
        ) : (
          <AdminTable headers={["Lead", "Company", "Status", "Source", "Date"]}>
            {recentLeads.map((lead) => (
              <AdminTableRow key={lead._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0078d4] text-xs font-semibold text-white">
                      {lead.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#323130]">{lead.name}</p>
                      <p className="text-xs text-[#605e5c]">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {lead.company || "—"}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge
                    variant={
                      lead.status === "QUALIFIED"
                        ? "success"
                        : lead.status === "NEW"
                        ? "warning"
                        : "default"
                    }
                  >
                    {lead.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {lead.source || "—"}
                </td>
                <td className="px-6 py-4 text-xs text-[#a19f9d]">
                  {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
