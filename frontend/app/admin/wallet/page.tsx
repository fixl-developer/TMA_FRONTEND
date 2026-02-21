"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantWallet, getTenantTransactions } from "@/shared/services/tenantFinanceService"
import { Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, TrendingUp, DollarSign } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

export default function AdminWalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTenantWallet(), getTenantTransactions()]).then(([w, t]) => {
      setWallet(w)
      setTransactions(t)
      setLoading(false)
    })
  }, [])

  const balance = wallet?.balanceMinor ?? 0
  const inboundTotal = transactions
    .filter((t) => t.direction === "INBOUND")
    .reduce((sum, t) => sum + t.amountMinor, 0)
  const outboundTotal = transactions
    .filter((t) => t.direction === "OUTBOUND")
    .reduce((sum, t) => sum + t.amountMinor, 0)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Wallet"
        subtitle="Cash balance, credits, and transactions"
        action={
          <Link href="/admin/payments/checkout">
            <AdminButton>
              <CreditCard className="mr-2 h-4 w-4" />
              Add Funds
            </AdminButton>
          </Link>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Cash Balance"
          value={loading ? "—" : formatCurrency(balance, wallet?.currency ?? "INR")}
          subtitle="Available funds"
          icon={Wallet}
          color="purple"
        />
        <AdminStatCard
          title="Total Inbound"
          value={loading ? "—" : formatCurrency(inboundTotal, "INR")}
          subtitle="Received"
          icon={ArrowDownLeft}
          color="green"
          trend="up"
          trendValue="+24%"
        />
        <AdminStatCard
          title="Total Outbound"
          value={loading ? "—" : formatCurrency(outboundTotal, "INR")}
          subtitle="Spent"
          icon={ArrowUpRight}
          color="blue"
        />
        <AdminStatCard
          title="Credits"
          value="0"
          subtitle="Platform credits"
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/payments/checkout">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#d4ff00]/10 p-3">
                <CreditCard className="h-6 w-6 text-[#d4ff00]" />
              </div>
              <div>
                <p className="font-semibold text-white">Add Funds</p>
                <p className="text-xs text-white/50">Top up your wallet</p>
              </div>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/wallet/transactions">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Transactions</p>
                <p className="text-xs text-white/50">View all activity</p>
              </div>
            </div>
          </AdminCard>
        </Link>
        <Link href="/admin/finance/payouts">
          <AdminCard hoverable className="h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <ArrowUpRight className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Payouts</p>
                <p className="text-xs text-white/50">Manage payouts</p>
              </div>
            </div>
          </AdminCard>
        </Link>
      </div>

      {/* Recent Transactions */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <Link href="/admin/wallet/transactions">
            <AdminButton size="sm" variant="ghost">
              View All
            </AdminButton>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-white/50">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      t.direction === "INBOUND"
                        ? "bg-emerald-500/10"
                        : "bg-rose-500/10"
                    }`}
                  >
                    {t.direction === "INBOUND" ? (
                      <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{t.description}</p>
                    <p className="text-xs text-white/50">
                      {t.type} · {new Date(t.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      t.direction === "INBOUND" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {t.direction === "INBOUND" ? "+" : "-"}
                    {formatCurrency(t.amountMinor, t.currency)}
                  </p>
                  <AdminBadge
                    variant={t.status === "SETTLED" ? "success" : "warning"}
                    className="mt-1"
                  >
                    {t.status}
                  </AdminBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
