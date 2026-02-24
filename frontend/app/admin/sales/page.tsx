"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getQuotes, getRateCards, getQuoteTemplates, formatCurrency } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileText, DollarSign, LayoutTemplate, ChevronRight, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
} from "@/shared/components/admin/AdminPageLayout"

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
    <AdminPageWrapper>
      <AdminPageLayout
        title="Sales"
        subtitle="Quotes, rate cards, and templates"
        actions={
          <>
            <Link href="/admin/sales/quotes/create">
              <AdminButton>
                <Plus className="h-4 w-4" />
                Create quote
              </AdminButton>
            </Link>
          </>
        }
      >

        <AdminStatsGrid columns={4}>
          <AdminStatCard
            label="Quotes"
            value={loading ? "—" : quotes.length}
            subtitle={`${sentQuotes.length} sent`}
            icon={FileText}
            color="purple"
          />
          <AdminStatCard
            label="Accepted"
            value={loading ? "—" : acceptedQuotes.length}
            subtitle="Ready for contract"
            icon={DollarSign}
            color="green"
          />
          <AdminStatCard
            label="Rate cards"
            value={loading ? "—" : rateCards.length}
            subtitle="Pricing library"
            icon={DollarSign}
            color="blue"
          />
          <AdminStatCard
            label="Templates"
            value={loading ? "—" : templates.length}
            subtitle="Quote templates"
            icon={LayoutTemplate}
            color="yellow"
          />
        </AdminStatsGrid>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard
            title="Recent quotes"
            actions={
              <Link href="/admin/sales/quotes">
                <AdminButton variant="secondary" size="sm">View all</AdminButton>
              </Link>
            }
          >
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
          </AdminCard>

          <AdminCard
            title="Rate cards"
            actions={
              <Link href="/admin/sales/rate-cards">
                <AdminButton variant="secondary" size="sm">View all</AdminButton>
              </Link>
            }
          >
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
          </AdminCard>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/sales/quotes">
            <AdminButton variant="secondary">Quotes</AdminButton>
          </Link>
          <Link href="/admin/sales/rate-cards">
            <AdminButton variant="secondary">Rate cards</AdminButton>
          </Link>
          <Link href="/admin/sales/templates">
            <AdminButton variant="secondary">Templates</AdminButton>
          </Link>
        </div>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
