"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getSlaConfigs } from "@/shared/services/automationService"
import type { SlaConfig } from "@/shared/services/automationService"
import { Clock, ChevronRight, AlertTriangle } from "lucide-react"

const DEMO_TENANT = "tenant_001"

export default function SlaConfigPage() {
  const [configs, setConfigs] = useState<SlaConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSlaConfigs(DEMO_TENANT).then(setConfigs).finally(() => setLoading(false))
  }, [])

  const totalBreaches = configs.reduce((s, c) => s + (c.breachesLast30d ?? 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">SLA Configuration</h1>
            <p className="mt-2 text-base text-white/60">Clocks, escalation rules.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/admin/automation/campaigns">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">Campaigns</Button>
            </Link>
            <Link href="/admin/automation/logs">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">Logs</Button>
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">SLA</p>
                  <p className="mt-1 text-sm text-white/60">Configs</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{configs.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-rose-400/20 to-red-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Breaches</p>
                  <p className="mt-1 text-sm text-white/60">Last 30 days</p>
                </div>
                <div className="rounded-lg bg-rose-500/10 p-2">
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-rose-400">{totalBreaches}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-bold text-white">SLA clocks</h3>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : (
            <div className="space-y-3">
              {configs.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{s.name}</p>
                    <p className="text-xs text-white/50">
                      {s.objectType} · Start: {s.clockStart} · Target: {s.targetHours}h
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {s.escalationSteps.length} escalation step(s) · {(s.breachesLast30d ?? 0)} breaches (30d)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {s.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
