"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getQuotes, getRateCards, getQuoteTemplates, formatCurrency } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileText, DollarSign, LayoutTemplate, ChevronRight, Plus } from "lucide-react"

export default function SalesPage() {
  const { tenantId } = useTenant()
  const [quotes, setQuotes] = useState<any[]>([])
  const [rateCards, setRateCards] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getQuotes(tenantId), getRateCards(tenantId), getQuoteTemplates(tenantId)]).then(
      ([q, r, t]) => {
        setQuotes(q)
        setRateCards(r)
        setTemplates(t)
        setLoading(false)
      }
    )
  }, [tenantId])

  const sentQuotes = quotes.filter((q) => q.status === "SENT")
  const acceptedQuotes = quotes.filter((q) => q.status === "ACCEPTED")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Sales</h1>
          <p className="mt-2 text-base text-white/60">Quotes, rate cards, and templates</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Quotes</p>
                  <p className="mt-1 text-sm text-white/60">{sentQuotes.length} sent</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : quotes.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Accepted</p>
                  <p className="mt-1 text-sm text-white/60">Ready for contract</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : acceptedQuotes.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Rate cards</p>
                  <p className="mt-1 text-sm text-white/60">Pricing library</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : rateCards.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Templates</p>
                  <p className="mt-1 text-sm text-white/60">Quote templates</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <LayoutTemplate className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? "—" : templates.length}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Recent Quotes */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Recent quotes</h3>
              <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Link href="/admin/sales/quotes">View all</Link>
              </Button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : quotes.length === 0 ? (
              <p className="py-8 text-center text-white/50">No quotes yet</p>
            ) : (
              <div className="space-y-3">
                {quotes.slice(0, 5).map((q) => (
                  <Link key={q._id} href={`/admin/sales/quotes/${q._id}`}>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                      <div>
                        <p className="font-medium text-white">{q.quoteNumber}</p>
                        <p className="text-sm text-white/60">Valid until {q.validUntil}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-400">
                          {formatCurrency(q.totalMinor, q.currency)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            q.status === "ACCEPTED"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : q.status === "SENT"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {q.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-white/40" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Rate Cards */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Rate cards</h3>
              <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Link href="/admin/sales/rate-cards">View all</Link>
              </Button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : rateCards.length === 0 ? (
              <p className="py-8 text-center text-white/50">No rate cards yet</p>
            ) : (
              <div className="space-y-3">
                {rateCards.slice(0, 5).map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                  >
                    <div>
                      <p className="font-medium text-white">{r.name}</p>
                      <p className="text-sm text-white/60">
                        {r.category} · {r.unit}
                      </p>
                    </div>
                    <span className="font-semibold text-emerald-400">
                      {formatCurrency(r.rateMinor, r.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">
            <Link href="/admin/sales/quotes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create quote
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            <Link href="/admin/sales/quotes">Quotes</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            <Link href="/admin/sales/rate-cards">Rate cards</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            <Link href="/admin/sales/templates">Templates</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
