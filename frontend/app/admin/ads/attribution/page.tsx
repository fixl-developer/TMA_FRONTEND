"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getTrackingLinks, getAttributionReport } from "@/shared/services/adsService"
import type { AdTrackingLink, AttributionOutcome } from "@/shared/lib/types/ads"
import { Link2, TrendingUp, Copy, Check, BarChart3, ArrowLeft } from "lucide-react"

const DEMO_TENANT = "tenant_001"

export default function AdsAttributionPage() {
  const [links, setLinks] = useState<AdTrackingLink[]>([])
  const [report, setReport] = useState<AttributionOutcome[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getTrackingLinks(DEMO_TENANT), getAttributionReport(DEMO_TENANT)])
      .then(([l, r]) => {
        setLinks(l)
        setReport(r)
      })
      .finally(() => setLoading(false))
  }, [])

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Attribution</h1>
            <p className="mt-2 text-base text-white/60">Tracking links, UTM parameters, spend → outcomes</p>
          </div>
          <Link href="/admin/ads">
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Campaigns
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Tracking links</p>
                  <p className="mt-1 text-sm text-white/60">Total links</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Link2 className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{links.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total conversions</p>
                  <p className="mt-1 text-sm text-white/60">All campaigns</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {links.reduce((s, l) => s + l.conversions, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total revenue</p>
                  <p className="mt-1 text-sm text-white/60">Generated</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400">
                ₹{(links.reduce((s, l) => s + (l.revenueMinor ?? 0), 0) / 100).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Avg ROI</p>
                  <p className="mt-1 text-sm text-white/60">Return on investment</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {report.length ? Math.round(report.reduce((s, r) => s + r.roiPercent, 0) / report.length) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ROI by Campaign */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-6 text-lg font-bold text-white">Spend → Outcomes (ROI by campaign)</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : report.length === 0 ? (
              <p className="py-8 text-center text-white/50">No attribution data yet</p>
            ) : (
              <div className="space-y-3">
                {report.map((r) => (
                  <div
                    key={r.campaignId}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{r.campaignName}</p>
                      <p className="mt-1 text-xs text-white/60">
                        Spend: ₹{(r.spendMinor / 100).toLocaleString("en-IN")} · Rev: ₹
                        {(r.revenueMinor / 100).toLocaleString("en-IN")} · {r.conversions} conv.
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${
                        r.roiPercent >= 0
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {r.roiPercent >= 0 ? "+" : ""}
                      {r.roiPercent}% ROI
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tracking Links */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-6 text-lg font-bold text-white">Tracking links & UTM</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : links.length === 0 ? (
              <p className="py-8 text-center text-white/50">No tracking links yet</p>
            ) : (
              <div className="space-y-3">
                {links.map((l) => (
                  <div
                    key={l._id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="mb-1 font-medium text-white">{l.name}</p>
                    <p className="mb-2 text-xs text-white/60">
                      {l.utmSource} / {l.utmMedium} / {l.utmCampaign}
                      {l.utmContent ? ` / ${l.utmContent}` : ""}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 truncate rounded bg-white/10 px-2 py-1 text-xs text-white/70">
                        {l.fullUrl}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-white/70 hover:text-white"
                        onClick={() => copyUrl(l._id, l.fullUrl)}
                      >
                        {copiedId === l._id ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-white/50">
                      {l.clicks} clicks · {l.conversions} conversions · ₹
                      {((l.revenueMinor ?? 0) / 100).toLocaleString("en-IN")} revenue
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
