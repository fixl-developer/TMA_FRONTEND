"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getAutomationLogs } from "@/shared/services/automationService"
import type { AutomationRun } from "@/shared/services/automationService"
import { FileText, ChevronRight, CheckCircle, XCircle } from "lucide-react"

const DEMO_TENANT = "tenant_001"

export default function AutomationLogsPage() {
  const [runs, setRuns] = useState<AutomationRun[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAutomationLogs(DEMO_TENANT).then(setRuns).finally(() => setLoading(false))
  }, [])

  const success = runs.filter((r) => r.status === "SUCCESS").length
  const failed = runs.filter((r) => r.status === "FAILED").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Automation Logs</h1>
            <p className="mt-2 text-base text-white/60">Execution log.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/admin/automation/campaigns">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">Campaigns</Button>
            </Link>
            <Link href="/admin/automation/sla">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">SLA</Button>
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total</p>
                  <p className="mt-1 text-sm text-white/60">Runs</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{runs.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Success</p>
                  <p className="mt-1 text-sm text-white/60">Completed</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400">{success}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-rose-400/20 to-red-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Failed</p>
                  <p className="mt-1 text-sm text-white/60">Errors</p>
                </div>
                <div className="rounded-lg bg-rose-500/10 p-2">
                  <XCircle className="h-5 w-5 text-rose-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-rose-400">{failed}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-bold text-white">Recent runs</h3>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : (
            <div className="space-y-3">
              {runs.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {r.automationId} {r.triggeredBy ? `· ${r.triggeredBy}` : ""}
                    </p>
                    <p className="text-xs text-white/50">
                      {r.runAt ? new Date(r.runAt).toLocaleString() : "—"} · {r.durationMs ?? 0}ms
                    </p>
                    {r.error && (
                      <p className="mt-1 text-xs text-rose-400">{r.error}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      r.status === "SUCCESS" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
