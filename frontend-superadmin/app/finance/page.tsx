/**
 * Finance & Wallets Dashboard - Super Admin
 *
 * Overview, Revenue (Billing, Fees, Reports), Payments (Wallets, Escrow, Risk).
 * Phase 2: Revenue + Payments. Seed data only.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Wallet2, CreditCard, TrendingUp, ShieldAlert } from "lucide-react"
import {
  getRecentTransactions,
  getWalletSnapshots,
  getBillingPlans,
  getRevenueReports,
  getEscrowAccounts,
  getPaymentRiskFlags,
} from "@/shared/services/financeService"
import type {
  FinanceTransaction,
  WalletSnapshot,
} from "@/shared/lib/types/finance"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { formatCurrency } from "@/shared/lib/utils"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"
import { RechartsLine } from "@/shared/components/charts/RechartsLine"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { getTenantName } from "@/shared/services/userService"

type TxFilter = "ALL" | "INBOUND" | "OUTBOUND"
type FinanceTab = "overview" | "revenue" | "payments"

export default function FinanceDashboard() {
  const [wallets, setWallets] = useState<WalletSnapshot[]>([])
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
  const [billingPlans, setBillingPlans] = useState<any[]>([])
  const [revenueReports, setRevenueReports] = useState<any[]>([])
  const [escrowAccounts, setEscrowAccounts] = useState<any[]>([])
  const [riskFlags, setRiskFlags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [txFilter, setTxFilter] = useState<TxFilter>("ALL")
  const [activeTab, setActiveTab] = useState<FinanceTab>("overview")

  useEffect(() => {
    const load = async () => {
      try {
        const [w, tx, plans, reports, escrow, risk] = await Promise.all([
          getWalletSnapshots(),
          getRecentTransactions(),
          getBillingPlans(),
          getRevenueReports(),
          getEscrowAccounts(),
          getPaymentRiskFlags(),
        ])
        setWallets(w)
        setTransactions(tx)
        setBillingPlans(plans)
        setRevenueReports(reports)
        setEscrowAccounts(escrow)
        setRiskFlags(risk)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const escrow = wallets.find((w) => w.scope === "PLATFORM_ESCROW")
    const revenue = wallets.find((w) => w.scope === "PLATFORM_REVENUE")
    const tenantWallets = wallets.filter((w) => w.scope === "TENANT")

    const inbound = transactions
      .filter((t) => t.direction === "INBOUND")
      .reduce((sum, t) => sum + t.amountMinor, 0)

    const outbound = transactions
      .filter((t) => t.direction === "OUTBOUND")
      .reduce((sum, t) => sum + t.amountMinor, 0)

    const pendingPayouts = transactions
      .filter((t) => t.status === "PENDING" && t.direction === "OUTBOUND")
      .reduce((sum, t) => sum + t.amountMinor, 0)

    return {
      escrow,
      revenue,
      tenantWallets,
      inbound,
      outbound,
      pendingPayouts,
    }
  }, [wallets, transactions])

  const volumeByDirection = useMemo(() => {
    const byDir: Record<string, number> = {}
    transactions.forEach((t) => {
      byDir[t.direction] = (byDir[t.direction] || 0) + t.amountMinor
    })
    return byDir
  }, [transactions])

  const volumeByType = useMemo(() => {
    const byType: Record<string, number> = {}
    transactions.forEach((t) => {
      byType[t.type] = (byType[t.type] || 0) + t.amountMinor
    })
    return byType
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    if (txFilter === "ALL") return transactions
    return transactions.filter((t) => t.direction === txFilter)
  }, [transactions, txFilter])

  // Synthetic monthly transaction volume for Line chart
  const monthlyVolumeData = useMemo(() => {
    const total = transactions.reduce((s, t) => s + t.amountMinor, 0)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const avg = total / 6
    return months.map((label, i) => ({
      label,
      value: Math.round((avg * (0.7 + (i % 3) * 0.15)) / 100),
    }))
  }, [transactions])

  return (
    <PageLayout>
      <PageHeader
        title="Finance"
        description="Revenue, payments, wallets, escrow and risk. Phase 2: Billing, Fees, Reports, Escrow, Risk."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Wallet2 className="h-3.5 w-3.5 text-emerald-500" />
            Phase 2
          </span>
        }
      />

      {/* Phase 1 quick links */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/finance/wallets"><Button variant="outline" size="sm">Wallets</Button></Link>
        <Link href="/finance/escrow"><Button variant="outline" size="sm">Escrow</Button></Link>
        <Link href="/finance/ledger"><Button variant="outline" size="sm">Ledger</Button></Link>
        <Link href="/finance/commissions"><Button variant="outline" size="sm">Commissions</Button></Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {[
          { id: "overview" as const, label: "Overview", icon: <Wallet2 className="h-4 w-4" /> },
          { id: "revenue" as const, label: "Revenue", icon: <TrendingUp className="h-4 w-4" /> },
          { id: "payments" as const, label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
      <>
      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Escrow balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-600 sm:text-3xl">
                {loading || !metrics.escrow
                  ? "—"
                  : formatCurrency(
                      metrics.escrow.balanceMinor,
                      metrics.escrow.currency
                    )}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Held for pageants, campaigns and bookings until settlement.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Platform revenue wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-sky-600 sm:text-3xl">
                {loading || !metrics.revenue
                  ? "—"
                  : formatCurrency(
                      metrics.revenue.balanceMinor,
                      metrics.revenue.currency
                    )}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Commission and subscription share accumulated to date (seed).
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inbound volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-600 sm:text-3xl">
                {loading
                  ? "—"
                  : formatCurrency(metrics.inbound, "INR")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Seeded inflows from pageant fees & campaign budgets.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-amber-600 sm:text-3xl">
                {loading
                  ? "—"
                  : formatCurrency(metrics.pendingPayouts, "INR")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Outbound amounts in PENDING state (e.g. talent payouts).
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Charts">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Volume by transaction type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading seeded transactions…</p>
              ) : (
                <>
                  <RechartsBar
                    data={Object.entries(volumeByType).map(
                      ([type, value]) => ({
                        label: type
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .slice(0, 10),
                        value: Math.round(value / 100),
                      })
                    )}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Heights are based on total minor units per transaction type
                    (scaled down to major units).
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inbound vs outbound share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading seeded transactions…</p>
              ) : (
                <>
                  <RechartsPie
                    data={[
                      {
                        label: "Inbound",
                        value: volumeByDirection["INBOUND"]
                          ? Math.round(volumeByDirection["INBOUND"] / 100)
                          : 0,
                      },
                      {
                        label: "Outbound",
                        value: volumeByDirection["OUTBOUND"]
                          ? Math.round(volumeByDirection["OUTBOUND"] / 100)
                          : 0,
                      },
                      {
                        label: "Internal",
                        value: volumeByDirection["INTERNAL"]
                          ? Math.round(volumeByDirection["INTERNAL"] / 100)
                          : 0,
                      },
                    ]}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Simple split of inbound, outbound and internal movements
                    from the seeded transaction set.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Volume trend">
          <Card>
            <CardHeader>
              <CardTitle>Transaction volume trend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-600">
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <>
                  <RechartsLine data={monthlyVolumeData} />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Synthetic monthly trend from seed transactions.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
      </PageSection>

      <PageSection title="Wallets & flow">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Tenant wallet distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading wallet snapshots…</p>
              ) : metrics.tenantWallets.length === 0 ? (
                <p className="text-slate-500">
                  No tenant wallets in the current seed. Update{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/wallets.json
                  </code>{" "}
                  to simulate balances.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {metrics.tenantWallets.map((w) => (
                    <li
                      key={`${w.tenantId}-${w.currency}`}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-semibold text-slate-800">
                          Tenant{" "}
                          <span className="font-mono text-slate-600">
                            {w.tenantId}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Wallet balance · {w.currency}
                        </p>
                      </div>
                      <p className="text-[12px] font-semibold text-emerald-600">
                        {formatCurrency(w.balanceMinor, w.currency)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Money flow snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[11px] text-slate-700">
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-800">
                      Inbound (fees & budgets)
                    </p>
                    <p className="text-[10px] text-emerald-600/80">
                      Talent & brands paying into escrow.
                    </p>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-emerald-800">
                  {loading
                    ? "—"
                    : formatCurrency(metrics.inbound, "INR")}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-sky-600" />
                  <div>
                    <p className="text-[11px] font-semibold text-sky-800">
                      Outbound (payouts & refunds)
                    </p>
                    <p className="text-[10px] text-sky-600">
                      Talent payouts, tenant shares, participant refunds.
                    </p>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-sky-800">
                  {loading
                    ? "—"
                    : formatCurrency(metrics.outbound, "INR")}
                </p>
              </div>
              <p className="text-[10px] text-slate-500">
                This is a simplified aggregate over the seeded transactions to
                support early UI work. In production this would match the
                centralized ledger design in the PRD.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Recent transactions">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
              Recent transactions
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-500">Filter:</span>
              {([
                { key: "ALL", label: "All" },
                { key: "INBOUND", label: "Inbound" },
                { key: "OUTBOUND", label: "Outbound" },
              ] as { key: TxFilter; label: string }[]).map((opt) => (
                <Button
                  key={opt.key}
                  size="sm"
                  variant={txFilter === opt.key ? "default" : "outline"}
                  className={
                    txFilter === opt.key
                      ? "h-7 px-3 text-[11px]"
                      : "h-7 px-3 text-[11px] border-slate-200"
                  }
                  onClick={() => setTxFilter(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 border-slate-200 p-3 ">
            {loading ? (
              <div className="flex items-center justify-center py-14 text-slate-600">
                <span className="text-sm">
                  Loading seeded transactions for this environment…
                </span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center text-slate-600">
                <p className="text-sm font-medium">
                  No transactions match this filter in the seed.
                </p>
                <p className="max-w-md text-[11px] text-slate-500">
                  Modify{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/transactions.json
                  </code>{" "}
                  to simulate different flows.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-[11px] text-slate-700 sm:text-xs">
                {filteredTransactions.map((t) => (
                  <div
                    key={t._id}
                    className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,0.9fr)] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-semibold text-slate-800">
                        {t.description || t.type}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Tenant{" "}
                        <span className="font-mono text-slate-600">
                          {t.tenantId || "platform"}
                        </span>{" "}
                        · Type {t.type}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p
                        className={
                          t.direction === "INBOUND"
                            ? "text-[12px] font-semibold text-emerald-600"
                            : t.direction === "OUTBOUND"
                            ? "text-[12px] font-semibold text-rose-600"
                            : "text-[12px] font-semibold text-sky-600"
                        }
                      >
                        {formatCurrency(t.amountMinor, t.currency)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {t.direction === "INBOUND"
                          ? "Inbound"
                          : t.direction === "OUTBOUND"
                          ? "Outbound"
                          : "Internal split"}
                        {" · "}
                        {t.status === "PENDING"
                          ? "Pending"
                          : "Settled (seed)"}
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Unknown time"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageSection>
      </>
      )}

      {activeTab === "revenue" && (
        <>
          <PageSection title="Billing plans">
            <Card>
              <CardHeader>
                <CardTitle>Subscription tiers</CardTitle>
                <p className="text-sm text-slate-500">
                  Plans and tenant counts. Seed data.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Plan</th>
                          <th className="pb-3 pr-4 font-medium">Price</th>
                          <th className="pb-3 pr-4 font-medium">Limits</th>
                          <th className="pb-3 pr-4 font-medium">Tenants</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingPlans.map((p) => (
                          <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{p.name}</td>
                            <td className="py-3 pr-4 text-slate-600">
                              {p.priceMinor === 0 ? "Custom" : formatCurrency(p.priceMinor, p.currency) + "/" + p.interval}
                            </td>
                            <td className="py-3 pr-4 text-slate-600 text-xs">
                              {p.talentLimit === -1 ? "Unlimited" : `${p.talentLimit} talents · ${p.pageantLimit} pageants`}
                            </td>
                            <td className="py-3 pr-4 text-slate-600">{p.tenantCount}</td>
                            <td className="py-3">
                              <span className="inline-flex rounded border border-[#107c10] bg-[#107c10] px-2 py-0.5 text-xs font-medium text-white">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Platform fees">
            <Card>
              <CardHeader>
                <CardTitle>Fee configuration</CardTitle>
                <p className="text-sm text-slate-500">
                  Default platform fee: 5%. Min payout: ₹500. Payout processing: 3 days.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Platform fee</p>
                    <p className="text-lg font-semibold text-slate-800">5%</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Min payout</p>
                    <p className="text-lg font-semibold text-slate-800">₹500</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500">Payout days</p>
                    <p className="text-lg font-semibold text-slate-800">3 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Revenue reports">
            <Card>
              <CardHeader>
                <CardTitle>Monthly revenue</CardTitle>
                <p className="text-sm text-slate-500">
                  Subscription, usage, and platform fee revenue. Export-ready.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Period</th>
                          <th className="pb-3 pr-4 font-medium">Subscription</th>
                          <th className="pb-3 pr-4 font-medium">Usage</th>
                          <th className="pb-3 pr-4 font-medium">Platform fee</th>
                          <th className="pb-3 pr-4 font-medium">Tenants</th>
                          <th className="pb-3 font-medium">New / Churned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueReports.map((r) => (
                          <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-medium text-slate-800">{r.period}</td>
                            <td className="py-3 pr-4 text-slate-600">{formatCurrency(r.subscriptionRevenue, r.currency)}</td>
                            <td className="py-3 pr-4 text-slate-600">{formatCurrency(r.usageRevenue, r.currency)}</td>
                            <td className="py-3 pr-4 text-slate-600">{formatCurrency(r.platformFeeRevenue, r.currency)}</td>
                            <td className="py-3 pr-4 text-slate-600">{r.tenantCount}</td>
                            <td className="py-3 text-slate-600">+{r.newTenants} / -{r.churnedTenants}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}

      {activeTab === "payments" && (
        <>
          <PageSection title="Wallets overview">
            <MetricsGrid>
              {loading ? (
                <p className="col-span-full text-slate-500">Loading…</p>
              ) : (
                <>
                  {wallets.find((w) => w.scope === "PLATFORM_ESCROW") && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Platform escrow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-emerald-600">
                          {formatCurrency(wallets.find((w) => w.scope === "PLATFORM_ESCROW")!.balanceMinor, "INR")}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {wallets.find((w) => w.scope === "PLATFORM_REVENUE") && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Platform revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-sky-600">
                          {formatCurrency(wallets.find((w) => w.scope === "PLATFORM_REVENUE")!.balanceMinor, "INR")}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tenant wallets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold text-slate-800">
                        {wallets.filter((w) => w.scope === "TENANT").length}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">Active tenant wallets</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </MetricsGrid>
          </PageSection>

          <PageSection title="Escrow status">
            <Card>
              <CardHeader>
                <CardTitle>Escrow accounts</CardTitle>
                <p className="text-sm text-slate-500">
                  Per-booking and per-pageant escrow states.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="pb-3 pr-4 font-medium">ID</th>
                          <th className="pb-3 pr-4 font-medium">Tenant</th>
                          <th className="pb-3 pr-4 font-medium">Type</th>
                          <th className="pb-3 pr-4 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {escrowAccounts.map((e) => (
                          <tr key={e._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-mono text-xs text-slate-600">{e._id}</td>
                            <td className="py-3 pr-4 text-slate-600">{getTenantName(e.tenantId)}</td>
                            <td className="py-3 pr-4 text-slate-600">{e.referenceType}</td>
                            <td className="py-3 pr-4 text-slate-600">{formatCurrency(e.amountMinor, e.currency)}</td>
                            <td className="py-3">
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                e.status === "SETTLED" ? "bg-[#107c10] text-white border-[#107c10]" :
                                e.status === "IN_DISPUTE" ? "bg-[#d13438] text-white border-[#d13438]" :
                                "bg-[#ffb900] text-[#323130] border-[#ffb900]"
                              }`}>
                                {e.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Payment risk flags">
            <Card>
              <CardHeader>
                <CardTitle>Risk alerts</CardTitle>
                <p className="text-sm text-slate-500">
                  High volume, chargeback risk, new tenant payouts.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <div className="space-y-3">
                    {riskFlags.map((r) => (
                      <div
                        key={r._id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <ShieldAlert className="h-5 w-5 text-amber-500" />
                          <div>
                            <p className="font-medium text-slate-800">{r.type.replace(/_/g, " ")}</p>
                            <p className="text-sm text-slate-600">{r.description}</p>
                            <p className="text-[11px] text-slate-500">
                              {getTenantName(r.tenantId)} · {formatCurrency(r.amountMinor, "INR")}
                            </p>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                          r.status === "OPEN" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                          r.status === "RESOLVED" ? "bg-[#107c10] text-white border-[#107c10]" :
                          "bg-[#a19f9d] text-white border-[#a19f9d]"
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}
    </PageLayout>
  )
}

