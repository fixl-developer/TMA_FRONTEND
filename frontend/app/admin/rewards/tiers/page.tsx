"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getLoyaltyTiers } from "@/shared/services/rewardsService"
import type { LoyaltyTier } from "@/shared/lib/types/rewards"
import { Award, Check } from "lucide-react"

export default function RewardsTiersPage() {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLoyaltyTiers().then(setTiers).finally(() => setLoading(false))
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
            <h1 className="text-4xl font-bold text-white">Tiers</h1>
            <p className="mt-2 text-base text-white/60">Tier comparison, benefits, progress.</p>
          </div>
        </div>

        {/* Tiers Grid */}
        {loading ? (
          <p className="py-12 text-center text-white/60">Loading…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div key={tier._id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${tier.color}30` }}
                  >
                    <Award className="h-5 w-5" style={{ color: tier.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                </div>
                <p className="mb-4 text-sm text-white/60">
                  {tier.minCredits} – {tier.maxCredits === 99999 ? "∞" : tier.maxCredits} credits
                </p>
                <ul className="space-y-2">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
