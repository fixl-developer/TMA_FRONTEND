"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTenantWallet, getTenantTransactions } from "@/shared/services/tenantFinanceService"
import { Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, TrendingUp, DollarSign, ExternalLink } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

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

  const recentTransactions = transactions.slice(0, 10)

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Wallet"
        subtitle="Manage your cash balance, credits, and transactions"
        actions={
        <Link href="/admin/payments/checkout">
          <AdminButton>
            <CreditCard className="h-4 w-4" />
            Add Funds
          </AdminButton>
        </Link>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Cash Balance"
          value={loading ? "—" : formatCurrency(balance, wallet?.currency ?? "INR")}
          icon={Wallet}
          color="purple"
          subtitle="Available funds"
        />
        <AdminStatCard
          label="Total Inbound"
          value={loading ? "—" : formatCurrency(inboundTotal, "INR")}
          icon={ArrowDownLeft}
          color="green"
          subtitle="Received"
          trend={{ value: "+24%", direction: "up" }}
        />
        <AdminStatCard
          label="Total Outbound"
          value={loading ? "—" : formatCurrency(outboundTotal, "INR")}
          icon={ArrowUpRight}
          color="blue"
          subtitle="Spent"
        />
        <AdminStatCard
          label="Credits"
          value="0"
          icon={DollarSign}
          color="yellow"
          subtitle="Platform credits"
        />
      </AdminStatsGrid>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/payments/checkout">
          <div className="group rounded border border-gray-200 bg-white p-4 transition-all hover:border-blue-600 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded bg-blue-50 p-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Add Funds</p>
                <p className="text-xs text-gray-600">Top up your wallet</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/admin/wallet/transactions">
          <div className="group rounded border border-gray-200 bg-white p-4 transition-all hover:border-blue-600 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded bg-green-50 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Transactions</p>
                <p className="text-xs text-gray-600">View all activity</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/admin/finance/invoices">
          <div className="group rounded border border-gray-200 bg-white p-4 transition-all hover:border-blue-600 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded bg-yellow-50 p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Invoices</p>
                <p className="text-xs text-gray-600">View billing history</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Transactions */}
      <AdminCard
        title="Recent Transactions"
        actions={
          <Link href="/admin/wallet/transactions">
            <AdminButton size="sm" variant="ghost">
              View All
              <ExternalLink className="h-3 w-3 ml-1" />
            </AdminButton>
          </Link>
        }
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-gray-50" />
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <AdminEmptyState
            icon={Wallet}
            title="No transactions yet"
            description="Your transaction history will appear here"
          />
        ) : (
          <AdminTable headers={["Date", "Description", "Type", "Amount", "Status"]}>
            {recentTransactions.map((txn) => (
              <AdminTableRow key={txn._id}>
                <td className="px-6 py-4 text-xs text-gray-600">
                  {new Date(txn.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                  {txn.description || "Transaction"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {txn.direction === "INBOUND" ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs text-gray-600">{txn.direction}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                  {formatCurrency(txn.amountMinor, txn.currency)}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={txn.status === "COMPLETED" ? "success" : "warning"}>
                    {txn.status}
                  </AdminBadge>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
