"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getEarnActivities } from "@/shared/services/rewardsService"
import { CheckCircle2, Circle, Gift, UserPlus } from "lucide-react"

const DEMO_TENANT = "tenant_001"

export default function RewardsEarnPage() {
  const [activities, setActivities] = useState<{ id: string; label: string; credits: number; done: boolean }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEarnActivities(DEMO_TENANT).then(setActivities).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/rewards">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">← Rewards</Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Earn credits</h1>
            <p className="mt-2 text-base text-white/60">Activity checklist, referral program.</p>
          </div>
        </div>

        {/* Activity Checklist */}
        <div className="mb-6 relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-2 text-lg font-bold text-white">Activity checklist</h3>
          <p className="mb-4 text-sm text-white/50">Complete activities to earn credits</p>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    a.done ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {a.done ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-white/30" />
                    )}
                    <div>
                      <p className={`font-medium ${a.done ? "text-white/60 line-through" : "text-white"}`}>
                        {a.label}
                      </p>
                      <p className="text-sm text-amber-400">+{a.credits} credits</p>
                    </div>
                  </div>
                  {a.done ? (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                      Done
                    </span>
                  ) : (
                    <Button size="sm" className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referral Program */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <UserPlus className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Referral program</h3>
          </div>
          <p className="mb-4 text-sm text-white/60">Share your link, earn 250 credits per referral</p>
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <code className="flex-1 rounded bg-black/30 px-3 py-2 text-sm text-white/80">
              https://talentos.io/ref/demo123
            </code>
            <Button size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Copy link
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
