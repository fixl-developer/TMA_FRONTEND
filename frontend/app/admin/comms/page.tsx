"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getThreads,
  getObjectTypeLabel,
} from "@/shared/services/commsService"
import { useTenant } from "@/shared/context/TenantContext"
import { MessageSquare, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { format } from "date-fns"

export default function CommsPage() {
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
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
    <AgenciesPage>
      <PageBanner
        title="Communications"
        subtitle="Threads per workspace object"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/portal">
          <Button variant="ghost" size="sm">
            Client portal
          </Button>
        </Link>
        <Link href="/portal/approvals">
          <Button variant="outline" size="sm">
            Pending approvals
          </Button>
        </Link>
      </div>

      <div className="mb-6 mt-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === null ? "default" : "outline"}
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        {objectTypes.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={filter === t ? "default" : "outline"}
            onClick={() => setFilter(t)}
          >
            {getObjectTypeLabel(t)}
          </Button>
        ))}
      </div>

      <Card style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Thread list
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : threads.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No threads.</p>
          ) : (
            <div className="space-y-3">
              {threads.map((t) => (
                <Link key={t._id} href={`/admin/comms/thread/${t._id}`}>
                  <div
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-slate-50"
                    style={{ borderColor: page.border }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                        <MessageSquare className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: page.text }}>
                          {t.subject}
                        </p>
                        <p className="text-sm text-slate-500">
                          {getObjectTypeLabel(t.objectType)} · {t.messageCount} messages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {t.lastMessageAt &&
                          format(new Date(t.lastMessageAt), "MMM d")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
