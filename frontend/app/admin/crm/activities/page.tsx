"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getActivities } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { Activity, Phone, Mail, Calendar, ArrowLeft } from "lucide-react"

const typeLabels: Record<string, string> = {
  CALL: "Call",
  EMAIL: "Email",
  MEETING: "Meeting",
}

export default function CrmActivitiesPage() {
  const { tenantId } = useTenant()
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActivities(tenantId, 30).then((data) => {
      setActivities(data)
      setLoading(false)
    })
  }, [tenantId])

  const Icon = ({ type }: { type: string }) => {
    if (type === "CALL") return <Phone className="h-4 w-4" />
    if (type === "EMAIL") return <Mail className="h-4 w-4" />
    if (type === "MEETING") return <Calendar className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/crm">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              CRM
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Activities</h1>
            <p className="mt-2 text-base text-white/60">Calls, emails, and meetings</p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Activity timeline</h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">No activities logged yet</p>
              <p className="mt-1 text-sm text-white/40">Start logging calls, emails, and meetings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div
                  key={a._id}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Icon type={a.type} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{a.subject}</p>
                    <p className="text-sm text-white/60">{a.notes}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-white/50">{typeLabels[a.type] ?? a.type}</span>
                      <span className="text-xs text-white/50">
                        {new Date(a.occurredAt).toLocaleDateString()}{" "}
                        {new Date(a.occurredAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          a.outcome === "POSITIVE"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : a.outcome === "PENDING"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {a.outcome}
                      </span>
                    </div>
                  </div>
                  {(a.objectType === "ACCOUNT" || a.objectType === "LEAD") && a.objectId && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white"
                    >
                      <Link
                        href={
                          a.objectType === "ACCOUNT"
                            ? `/admin/crm/accounts/${a.objectId}`
                            : "/admin/crm/leads"
                        }
                      >
                        View
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
