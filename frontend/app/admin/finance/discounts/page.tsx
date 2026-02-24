"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getDiscountCodes } from "@/shared/services/rewardsService"
import type { DiscountCode } from "@/shared/lib/types/rewards"
import { Tag, Plus } from "lucide-react"

const DEMO_TENANT = "tenant_001"

function formatCurrency(amountMinor: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amountMinor / 100)
}

export default function AdminDiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDiscountCodes(DEMO_TENANT).then(setCodes).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/wallet">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">← Finance</Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white">Discount codes</h1>
              <p className="mt-2 text-base text-white/60">Create, manage, usage.</p>
            </div>
          </div>
          <Button className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">
            <Plus className="mr-1.5 h-4 w-4" /> Create code
          </Button>
        </div>

        {/* Discount Codes List */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-bold text-white">Discount codes</h3>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : codes.length === 0 ? (
            <div className="py-12 text-center">
              <Tag className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">No discount codes yet.</p>
              <Button className="mt-4 bg-[#d4ff00] text-black hover:bg-[#b8e600]">Create code</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {codes.map((dc) => (
                <div
                  key={dc._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-amber-400/40 hover:bg-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <Tag className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-semibold text-white">{dc.code}</p>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          dc.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-300" :
                          dc.status === "EXPIRED" ? "bg-slate-500/20 text-slate-300" :
                          dc.status === "DISABLED" ? "bg-rose-500/20 text-rose-300" :
                          "bg-slate-500/20 text-slate-300"
                        }`}>
                          {dc.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/60">
                        {dc.type === "PERCENTAGE"
                          ? `${dc.value}% off`
                          : `${formatCurrency((dc.valueMinor ?? 0))} off`}
                        {" · "}
                        Min order {formatCurrency(dc.minOrderMinor)}
                      </p>
                      <p className="text-xs text-white/40">
                        {dc.usedCount} / {dc.maxUses} uses · Valid {dc.validFrom} – {dc.validTo}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
