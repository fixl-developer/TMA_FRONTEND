"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Workflow, Users, Award, LayoutTemplate, ChevronRight, Trophy, ArrowUpRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useTenant } from "@/shared/context/TenantContext"
import { getPageants } from "@/shared/services/pageantService"
import { getPageantLiveData } from "@/shared/services/pageantLiveService"
import { seedPageantResults } from "@/data/seed"

const LIVE_STAGES = ["PRELIMS", "SEMI_FINALS", "FINALS"]

export default function PageantDashboard() {
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const { tenantId } = useTenant()
  const [pageants, setPageants] = useState<any[]>([])
  const [livePageants, setLivePageants] = useState<{ id: string; name: string }[]>([])
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    getPageants(tenantId ?? undefined).then(setPageants)
  }, [tenantId])

  useEffect(() => {
    if (pageants.length === 0) return
    const live: { id: string; name: string }[] = []
    Promise.all(pageants.map((p) => getPageantLiveData(p._id))).then((datas) => {
      datas.forEach((d, i) => {
        if (d && LIVE_STAGES.includes(d.currentStage)) {
          live.push({ id: pageants[i]._id, name: pageants[i].name })
        }
      })
      setLivePageants(live)
    })
    const pageantIds = new Set(pageants.map((p) => p._id))
    const rid = (seedPageantResults as any[]).filter((r) => pageantIds.has(r.pageantId)).slice(0, 5)
    setResults(rid)
  }, [pageants])

  const tid = tenantId || "tenant_002"
  const tenantPageants = pageants.filter((p) => p.tenantId === tid)
  const activePageants = tenantPageants.filter((p) => p.status === "ACTIVE")
  const totalRegistrations = 3
  const totalJudges = 3
  const totalTemplates = 2
  const totalStages = 4
  const ui = isDark
    ? {
        heading: "#f8fafc",
        cardBg: "#111827",
        cardBorder: "#334155",
        primaryText: "#e2e8f0",
        secondaryText: "#94a3b8",
        mutedText: "#64748b",
        softBlueBg: "#172554",
        softBlueBorder: "#1d4ed8",
        rowHover: "#1e293b",
        iconShellBg: "#1f2937",
        iconShellBorder: "#334155",
        iconAccent: "#cbd5e1",
      }
    : {
        heading: "#0f172a",
        cardBg: "#ffffff",
        cardBorder: "#e2e8f0",
        primaryText: "#0f172a",
        secondaryText: "#475569",
        mutedText: "#64748b",
        softBlueBg: "rgba(239, 246, 255, 0.7)",
        softBlueBorder: "#dbeafe",
        rowHover: "#f8fafc",
        iconShellBg: "#f8fafc",
        iconShellBorder: "#e2e8f0",
        iconAccent: "#475569",
      }

  const metricCards = [
    {
      title: "Stages",
      value: totalStages,
      subtitle: "Configured in process flow",
      icon: Workflow,
      toneBg: "bg-blue-500/15",
      toneText: "text-blue-600",
    },
    {
      title: "Registrations",
      value: totalRegistrations,
      subtitle: "Total active participants",
      icon: Users,
      toneBg: "bg-emerald-500/15",
      toneText: "text-emerald-600",
    },
    {
      title: "Judges",
      value: totalJudges,
      subtitle: "Assigned for scoring",
      icon: Award,
      toneBg: "bg-violet-500/15",
      toneText: "text-violet-600",
    },
    {
      title: "Templates",
      value: totalTemplates,
      subtitle: "Ready to launch formats",
      icon: LayoutTemplate,
      toneBg: "bg-amber-500/15",
      toneText: "text-amber-600",
    },
  ]

  return (
    <AgenciesPage>
      <section className="mt-2">
        <h1 className="text-2xl font-semibold" style={{ color: ui.heading }}>
          Dashboard
        </h1>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3.5 xl:grid-cols-12">
        <div className="grid auto-rows-fr grid-cols-1 gap-3.5 sm:grid-cols-2 xl:col-span-8 xl:grid-cols-4">
            {metricCards.map((metric) => {
              const Icon = metric.icon
              return (
                <Card key={metric.title} className="rounded-3xl border shadow-sm" style={{ borderColor: ui.cardBorder, backgroundColor: ui.cardBg }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${metric.toneBg} ${metric.toneText}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border"
                        style={{ borderColor: ui.iconShellBorder, backgroundColor: ui.iconShellBg, color: ui.iconAccent }}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <p className="mt-2.5 text-[14px] font-bold" style={{ color: ui.secondaryText }}>{metric.title}</p>
                    <p className="mt-1 text-[32px] font-semibold leading-none tracking-tight" style={{ color: ui.primaryText }}>
                      {metric.value}
                    </p>
                    <p className="mt-1.5 text-[11px]" style={{ color: ui.mutedText }}>{metric.subtitle}</p>
                  </CardContent>
                </Card>
              )
            })}
        </div>
        <Card className="rounded-3xl border shadow-sm xl:col-span-4 xl:row-span-2" style={{ borderColor: ui.cardBorder, backgroundColor: ui.cardBg }}>
          <CardContent className="flex h-full flex-col p-4 pb-5">
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: ui.primaryText }}>
                <Trophy className="h-4 w-4 text-amber-600" />
                Results status
              </h2>
              <Link href="/pageant/results" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                Open
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mb-4 text-sm" style={{ color: ui.secondaryText }}>
              {results.length} recent result record{results.length !== 1 ? "s" : ""} available for review.
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border p-3" style={{ borderColor: ui.cardBorder }}>
                <p className="text-[11px]" style={{ color: ui.mutedText }}>Active pageants</p>
                <p className="mt-1 text-xl font-semibold" style={{ color: ui.primaryText }}>
                  {activePageants.length}
                </p>
              </div>
              <div className="rounded-lg border p-3" style={{ borderColor: ui.cardBorder }}>
                <p className="text-[11px]" style={{ color: ui.mutedText }}>Total pageants</p>
                <p className="mt-1 text-xl font-semibold" style={{ color: ui.primaryText }}>
                  {tenantPageants.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-12">
        <Card className="rounded-3xl border shadow-sm xl:col-span-8" style={{ borderColor: ui.cardBorder, backgroundColor: ui.cardBg }}>
          <CardContent className="p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold" style={{ color: ui.primaryText }}>Live and recent results</h2>
              <Link href="/pageant/results" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mb-3 rounded-xl border p-3" style={{ borderColor: ui.softBlueBorder, backgroundColor: ui.softBlueBg }}>
              <Link href="/pageant/live" className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Live
                  </span>
                  <p className="text-sm" style={{ color: ui.secondaryText }}>
                    {livePageants.length} pageant{livePageants.length !== 1 ? "s" : ""} in progress
                  </p>
                </div>
                <ChevronRight className="h-4 w-4" style={{ color: ui.mutedText }} />
              </Link>
            </div>
            <ul className="space-y-1.5">
              {results.slice(0, 5).map((r) => (
                <li key={r._id}>
                  <Link
                    href="/pageant/results"
                    className="flex items-center justify-between rounded-lg border px-3 py-1.5 text-[13px] transition-colors"
                    style={{ borderColor: ui.cardBorder, color: ui.secondaryText }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = ui.rowHover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    <span className="truncate">
                      {r.contestantName} - {r.title}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: ui.mutedText }} />
                  </Link>
                </li>
              ))}
            </ul>
            {results.length === 0 && (
              <p className="text-sm" style={{ color: ui.mutedText }}>No recent results yet. Publish from Results module.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3.5 xl:col-span-4">
          <Card className="rounded-3xl border shadow-sm" style={{ borderColor: ui.cardBorder, backgroundColor: ui.cardBg }}>
            <CardContent className="p-4">
              <h3 className="mb-3 text-[15px] font-semibold" style={{ color: ui.primaryText }}>Quick actions</h3>
              <div className="space-y-1.5">
                <Link href="/pageant/process" className="flex items-center justify-between rounded-lg border px-3 py-1.5 text-[13px] font-medium" style={{ borderColor: ui.cardBorder, color: ui.secondaryText }}>
                  <span>Process Builder</span>
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: ui.mutedText }} />
                </Link>
                <Link href="/pageant/live" className="flex items-center justify-between rounded-lg border px-3 py-1.5 text-[13px] font-medium" style={{ borderColor: ui.cardBorder, color: ui.secondaryText }}>
                  <span>Live dashboard</span>
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: ui.mutedText }} />
                </Link>
                <Link href="/pageant/templates" className="flex items-center justify-between rounded-lg border px-3 py-1.5 text-[13px] font-medium" style={{ borderColor: ui.cardBorder, color: ui.secondaryText }}>
                  <span>Templates</span>
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: ui.mutedText }} />
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-3 text-[15px] font-semibold">Operations queue</h3>
              <p className="text-sm text-blue-100">
                Active pageants: <span className="font-semibold text-white">{activePageants.length}</span>
              </p>
              <p className="text-sm text-blue-100">
                Total pageants: <span className="font-semibold text-white">{tenantPageants.length}</span>
              </p>
              <p className="mt-3 text-xs text-blue-100">
                Monitor live progress, then review final outcomes in the results queue.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" className="border-0 bg-blue-700 text-white hover:bg-blue-800">
                  <Link href="/pageant/registration">Registration</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                  <Link href="/pageant/judges">Judges</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AgenciesPage>
  )
}
