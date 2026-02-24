"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getThreads,
  getObjectTypeLabel,
} from "@/shared/services/commsService"
import { useTenant } from "@/shared/context/TenantContext"
import { MessageSquare, ChevronRight } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"
import { format } from "date-fns"

export default function CommsPage() {
  const { tenantId } = useTenant()
  const [threads, setThreads] = useState<any[]>([])
  const [filter, setFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getThreads(tenantId, filter ? { objectType: filter } : undefined).then((data) => {
      setThreads(data)
      setLoading(false)
    })
  }, [tenantId, filter])

  const objectTypes = ["BOOKING", "CASTING", "DEAL", "PROJECT", "EVENT"]

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Communications"
        subtitle="Threads per workspace object"
        actions={
        <>
          <Link href="/portal">
            <AdminButton variant="ghost">Client portal</AdminButton>
          </Link>
          <Link href="/portal/approvals">
            <AdminButton variant="secondary">Pending approvals</AdminButton>
          </Link>
        </>
      }
    >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Total Threads"
          value={threads.length}
          subtitle="All conversations"
          icon={MessageSquare}
          color="purple"
        />
        <AdminStatCard
          label="Bookings"
          value={threads.filter((t) => t.objectType === "BOOKING").length}
          subtitle="Booking threads"
          icon={MessageSquare}
          color="blue"
        />
        <AdminStatCard
          label="Castings"
          value={threads.filter((t) => t.objectType === "CASTING").length}
          subtitle="Casting threads"
          icon={MessageSquare}
          color="green"
        />
        <AdminStatCard
          label="Deals"
          value={threads.filter((t) => t.objectType === "DEAL").length}
          subtitle="Deal threads"
          icon={MessageSquare}
          color="yellow"
        />
      </AdminStatsGrid>

      <div className="mb-6 flex flex-wrap gap-2">
        <AdminButton
          size="sm"
          variant={filter === null ? "primary" : "secondary"}
          onClick={() => setFilter(null)}
        >
          All
        </AdminButton>
        {objectTypes.map((t) => (
          <AdminButton
            key={t}
            size="sm"
            variant={filter === t ? "primary" : "secondary"}
            onClick={() => setFilter(t)}
          >
            {getObjectTypeLabel(t)}
          </AdminButton>
        ))}
      </div>

      <AdminCard title="Thread List" subtitle={`${threads.length} total threads`}>
        {loading ? (
          <AdminLoading rows={5} />
        ) : threads.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#605e5c]">No threads.</p>
        ) : (
          <div className="space-y-2">
            {threads.map((t) => (
              <Link key={t._id} href={`/admin/comms/thread/${t._id}`}>
                <div className="flex items-center justify-between rounded border border-[#edebe9] bg-white p-4 transition-all hover:bg-[#f3f2f1] hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#ffb900] text-white">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#323130]">{t.subject}</p>
                      <p className="text-xs text-[#605e5c]">
                        {getObjectTypeLabel(t.objectType)} · {t.messageCount} messages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#a19f9d]">
                      {t.lastMessageAt && format(new Date(t.lastMessageAt), "MMM d")}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#a19f9d]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
