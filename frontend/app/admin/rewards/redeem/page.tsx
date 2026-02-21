"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getRedeemableItems, getRewardByUser } from "@/shared/services/rewardsService"
import type { RedeemableItem, Reward } from "@/shared/lib/types/rewards"
import { Gift } from "lucide-react"

const DEMO_TENANT = "tenant_001"
const DEMO_USER = "user_001"

export default function RewardsRedeemPage() {
  const [items, setItems] = useState<RedeemableItem[]>([])
  const [reward, setReward] = useState<Reward | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getRedeemableItems(DEMO_TENANT), getRewardByUser(DEMO_TENANT, DEMO_USER)]).then(
      ([i, r]) => {
        setItems(i)
        setReward(r ?? null)
        setLoading(false)
      }
    )
  }, [])

  const credits = reward?.credits ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/rewards">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">← Rewards</Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white">Redeem</h1>
              <p className="mt-2 text-base text-white/60">Redemption catalog, credits checkout.</p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-2 backdrop-blur-md">
            <p className="text-sm text-white/60">Your balance</p>
            <p className="text-xl font-bold text-amber-400">{credits} credits</p>
          </div>
        </div>

        {/* Redeemable Items */}
        {loading ? (
          <p className="py-12 text-center text-white/60">Loading…</p>
        ) : items.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
            <Gift className="mx-auto mb-3 h-12 w-12 text-white/30" />
            <p className="text-white/60">No redeemable items yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const canAfford = credits >= item.creditsCost
              return (
                <div key={item._id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                      <Gift className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
                      {item.creditsCost} credits
                    </span>
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{item.name}</h3>
                  <p className="mb-4 text-sm text-white/60">{item.description}</p>
                  <Button
                    className="w-full"
                    size="sm"
                    disabled={!canAfford}
                    variant={canAfford ? "default" : "outline"}
                  >
                    {canAfford ? "Redeem" : "Insufficient credits"}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
