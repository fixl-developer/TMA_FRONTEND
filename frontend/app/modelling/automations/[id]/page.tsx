"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import {
  getAutomationById,
  getAutomationRuns,
  toggleAutomation,
  type Automation,
  type AutomationRun,
} from "@/shared/services/modellingAutomationService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft, Zap, CheckCircle2, XCircle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function AutomationDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }
  const id = params.id as string
  const [automation, setAutomation] = useState<Automation | null>(null)
  const [runs, setRuns] = useState<AutomationRun[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!id) return
    Promise.all([
      getAutomationById(id, tenantId),
      getAutomationRuns(id, tenantId),
    ]).then(([a, r]) => {
      setAutomation(a ?? null)
      setRuns(r)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [id, tenantId])

  const handleToggle = async () => {
    if (!automation) return
    await toggleAutomation(id, tenantId)
    const next = automation.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    setAutomation((prev) => (prev ? { ...prev, status: next } : null))
    showToast(`Automation ${next === "ACTIVE" ? "enabled" : "disabled"} (mock)`, "success")
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!automation) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Automation not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/automations">Back to automations</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>{automation.name}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Trigger: {automation.trigger}</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/automations" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to automations
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: theme.text }}>Details</CardTitle>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      automation.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {automation.status}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={automation.status === "ACTIVE"}
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                      automation.status === "ACTIVE"
                        ? "border-[#B8860B] bg-[#B8860B]"
                        : "bg-slate-200"
                    }`}
                    style={automation.status !== "ACTIVE" ? { borderColor: theme.border } : {}}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        automation.status === "ACTIVE" ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <Button asChild variant="outline" size="sm" className="border" style={{ borderColor: theme.border }}>
                    <Link href={`/modelling/automations/${id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Trigger</p>
                  <p style={{ color: theme.text }}>{automation.trigger}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Runs (24h)</p>
                  <p style={{ color: theme.text }}>{automation.runsLast24h ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Last run</p>
                  <p style={{ color: theme.text }}>
                    {automation.lastRunAt
                      ? new Date(automation.lastRunAt).toLocaleString("en-IN")
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Recent runs</CardTitle>
            </CardHeader>
            <CardContent>
              {runs.length === 0 ? (
                <p className="py-4 text-sm" style={{ color: theme.textSecondary }}>No runs yet.</p>
              ) : (
                <div className="space-y-2">
                  {runs.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between rounded-lg border p-3"
                      style={{ borderColor: theme.border }}
                    >
                      <div className="flex items-center gap-3">
                        {r.status === "SUCCESS" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.text }}>{r.status}</p>
                          <p className="text-xs" style={{ color: theme.textSecondary }}>
                            {r.triggeredBy && `Triggered by ${r.triggeredBy}`}
                            {r.durationMs != null && ` · ${r.durationMs}ms`}
                          </p>
                          {r.error && (
                            <p className="mt-1 text-xs text-rose-600">{r.error}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: theme.textSecondary }}>
                        {new Date(r.runAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>Status</span>
                  <span className="font-medium" style={{ color: theme.text }}>{automation.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>Runs (24h)</span>
                  <span className="font-medium" style={{ color: theme.text }}>{automation.runsLast24h ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>Last run</span>
                  <span className="font-medium" style={{ color: theme.text }}>
                    {automation.lastRunAt
                      ? new Date(automation.lastRunAt).toLocaleDateString("en-IN")
                      : "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
