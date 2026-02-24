"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantEvents } from "@/shared/services/adminService"
import { Crown, Calendar, MapPin, Plus, ExternalLink } from "lucide-react"
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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getTenantEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  const activeCount = events.filter((e) => e.status === "ACTIVE").length
  const draftCount = events.filter((e) => e.status === "DRAFT").length
  const completedCount = events.filter((e) => e.status === "COMPLETED").length

  const filteredEvents = events.filter((e) =>
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Events"
        subtitle="Manage pageants and events"
        actions={
        <AdminButton>
          <Plus className="h-4 w-4" />
          New Event
        </AdminButton>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Events" value={events.length} icon={Crown} color="purple" />
        <AdminStatCard label="Active" value={activeCount} icon={Crown} color="green" />
        <AdminStatCard label="Draft" value={draftCount} icon={Calendar} color="yellow" />
        <AdminStatCard label="Completed" value={completedCount} icon={Crown} color="blue" />
      </AdminStatsGrid>

      {/* Events Table */}
      <AdminCard
        title="Events & Pageants"
        actions={<AdminSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search events..." />}
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <AdminEmptyState
            icon={Crown}
            title={searchQuery ? "No events found" : "No events yet"}
            description={searchQuery ? "Try adjusting your search" : "Create pageants and events"}
            action={
              !searchQuery && (
                <AdminButton>
                  <Plus className="h-4 w-4" />
                  Create Event
                </AdminButton>
              )
            }
          />
        ) : (
          <AdminTable headers={["Event", "Status", "Date", "Location", "Actions"]}>
            {filteredEvents.map((event) => (
              <AdminTableRow key={event._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#d13438] text-sm font-semibold text-white">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#323130]">{event.name}</p>
                      <p className="text-xs text-[#605e5c] truncate max-w-xs">{event.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge
                    variant={
                      event.status === "ACTIVE"
                        ? "success"
                        : event.status === "DRAFT"
                        ? "warning"
                        : event.status === "COMPLETED"
                        ? "info"
                        : "default"
                    }
                  >
                    {event.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-[#605e5c]">
                    <Calendar className="h-4 w-4" />
                    {event.date ? new Date(event.date).toLocaleDateString("en-IN") : "—"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-[#605e5c]">
                    <MapPin className="h-4 w-4" />
                    {event.location || "—"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/events/${event._id}`}>
                    <AdminButton size="sm" variant="ghost">
                      View
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </AdminButton>
                  </Link>
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
