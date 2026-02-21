"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getPolicyPacks } from "@/shared/services/automationService"
import type { PolicyPack } from "@/shared/services/automationService"
import { Shield, ChevronRight } from "lucide-react"

export default function PolicyPacksPage() {
  const [packs, setPacks] = useState<PolicyPack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPolicyPacks().then(setPacks).finally(() => setLoading(false))
  }, [])

  const enabled = packs.filter((p) => p.enabled).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Policy Packs</h1>
            <p className="mt-2 text-base text-white/60">OPS, APR, FIN, CHG, PRV, DSP, STF, PGI, CST, VND.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/admin/automation/campaigns">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">Campaigns</Button>
            </Link>
            <Link href="/admin/automation/rules">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">Rules</Button>
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total</p>
                  <p className="mt-1 text-sm text-white/60">Packs</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{packs.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Enabled</p>
                  <p className="mt-1 text-sm text-white/60">Active</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400">{enabled}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-bold text-white">Policy packs</h3>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {packs.map((p) => (
                <div
                  key={p.code}
                  className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-white">{p.code}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.enabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {p.enabled ? "ON" : "OFF"}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-white">{p.name}</p>
                    <p className="text-sm text-white/60">{p.description}</p>
                    <p className="mt-1 text-xs text-white/40">{p.policies.length} policies</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/40" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
