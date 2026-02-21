"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getActivityLogs } from "@/shared/services/rewardsService"
import type { ActivityLog } from "@/shared/lib/types/rewards"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

const DEMO_TENANT = "tenant_001"
const DEMO_USER = "user_001"

const typeLabels: Record<string, string> = {
  REGISTRATION: "Registration",
  REFERRAL: "Referral",
  COURSE_COMPLETE: "Course complete",
  REDEMPTION: "Redemption",
  MILESTONE: "Milestone",
}

export default function RewardsActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActivityLogs(DEMO_TENANT, DEMO_USER).then(setLogs).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/rewards">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">← Rewards</Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Activity</h1>
            <p className="mt-2 text-base text-white/60">Activity timeline, credit transactions.</p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-bold text-white">Activity timeline</h3>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : logs.length === 0 ? (
            <p className="py-8 text-center text-white/60">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const isEarn = !!log.creditsEarned
                return (
                  <div
                    key={log._id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          isEarn ? "bg-emerald-500/10" : "bg-rose-500/10"
                        }`}
                      >
                        {isEarn ? (
                          <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-rose-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{log.description}</p>
                        <p className="text-xs text-white/50">
                          {typeLabels[log.type] ?? log.type} · {new Date(log.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${
                        isEarn ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isEarn ? `+${log.creditsEarned}` : `-${log.creditsSpent}`} credits
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
