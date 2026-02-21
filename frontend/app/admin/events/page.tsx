"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantEvents } from "@/shared/services/adminService"
import { Crown } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  const activeCount = events.filter((e) => e.status === "ACTIVE").length
  const draftCount = events.filter((e) => e.status === "DRAFT").length

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "success"
      case "DRAFT": return "default"
      case "COMPLETED": return "info"
      default: return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Events"
        subtitle="Pageants & events management"
        action={<AdminButton>New Event</AdminButton>}
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              title="Total Events"
              value={events.length}
              subtitle="All pageants & events"
              icon={Crown}
              color="purple"
            />
            <AdminStatCard
              title="Active Events"
              value={activeCount}
              subtitle={`${draftCount} drafts`}
              icon={Crown}
              color="green"
            />
          </>
        )}
      </div>

      {/* Events List */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
          Events & Pageants
        </h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <AdminEmptyState
            icon={Crown}
            title="No events yet"
            description="Create pageants and events to manage competitions and shows"
            action={<AdminButton>Create Event</AdminButton>}
          />
        ) : (
          <div className="space-y-4">
            {events.map((e) => (
              <Link key={e._id} href={`/admin/events/${e._id}/run-of-show`}>
                <div className="rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md border-white/10 bg-white/5 hover:bg-white/10">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 admin-light-theme:bg-pink-100 admin-light-theme:text-pink-600 transition-colors">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white admin-light-theme:text-slate-900 transition-colors">{e.name}</h3>
                        <AdminBadge variant={getStatusVariant(e.status)}>{e.status}</AdminBadge>
                      </div>
                      {e.description && (
                        <p className="mt-1 text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">{e.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
