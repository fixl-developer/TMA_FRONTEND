"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getAutomations, toggleAutomation, type Automation } from "@/shared/services/modellingAutomationService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { Zap, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function ModellingAutomationsPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const { showToast } = useToast()
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }

  const load = () => {
    getAutomations(tenantId).then((data) => {
      setAutomations(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [tenantId])

  const handleToggle = async (a: Automation) => {
    await toggleAutomation(a._id, tenantId)
    const next = a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    setAutomations((prev) =>
      prev.map((x) => (x._id === a._id ? { ...x, status: next } : x))
    )
    showToast(`Automation ${next === "ACTIVE" ? "enabled" : "disabled"} (mock)`, "success")
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Automations</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Workflow triggers and actions</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle style={{ color: theme.text }}>Automations</CardTitle>
              <Button asChild className="bg-[#B8860B] hover:bg-[#9A7209]">
                <Link href="/modelling/automations/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New automation
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <LoadingSkeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : automations.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <Zap className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No automations yet.</p>
                <Button asChild className="mt-4 bg-[#B8860B] hover:bg-[#9A7209]">
                  <Link href="/modelling/automations/new">Create automation</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {automations.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between rounded-xl border p-5 transition-all hover:border-[#B8860B]/30"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <Link
                      href={`/modelling/automations/${a._id}`}
                      className="flex flex-1 items-center gap-4 min-w-0"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7]">
                        <Zap className="h-5 w-5 text-[#B8860B]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium" style={{ color: theme.text }}>{a.name}</p>
                        <p className="text-sm" style={{ color: theme.textSecondary }}>Trigger: {a.trigger}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          a.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {a.status}
                      </span>
                      <span className="hidden sm:inline text-sm" style={{ color: theme.textSecondary }}>
                        {a.runsLast24h ?? 0} runs (24h)
                      </span>
                    </Link>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={a.status === "ACTIVE"}
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggle(a)
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                          a.status === "ACTIVE"
                            ? "border-[#B8860B] bg-[#B8860B]"
                            : isDark ? "border-[#3f3f46] bg-[#27272a]" : "border-[#E7E5E4] bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                            a.status === "ACTIVE" ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/modelling/automations/${a._id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
