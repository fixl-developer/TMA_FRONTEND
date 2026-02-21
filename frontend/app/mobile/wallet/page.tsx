"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Wallet, ChevronLeft, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react"
import { useTenant } from "@/shared/context/TenantContext"
import seedWallets from "@/data/seed/wallets.json"
import seedLedger from "@/data/seed/ledger_entries.json"

export default function MobileWalletPage() {
  const { tenantId } = useTenant()
  const [transactions, setTransactions] = useState<any[]>([])

  const wallet = useMemo(() => {
    const tid = tenantId || "tenant_001"
    return (seedWallets as any[]).find((w) => w.scope === "TENANT" && w.tenantId === tid) || null
  }, [tenantId])

  useEffect(() => {
    const tid = tenantId || "tenant_001"
    const entries = (seedLedger as any[]).filter((e) => e.tenantId === tid).slice(0, 15)
    setTransactions(entries)
  }, [tenantId])

  const balance = wallet ? wallet.balanceMinor / 100 : 0
  const totalIn = transactions.filter((t) => t.direction === "CREDIT").reduce((s, t) => s + (t.amountMinor || 0), 0) / 100
  const totalOut = transactions.filter((t) => t.direction === "DEBIT").reduce((s, t) => s + (t.amountMinor || 0), 0) / 100

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/mobile">
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
        </Link>
        <h1 className="text-lg font-bold text-slate-800">Wallet</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Balance card */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 opacity-80">
            <Wallet className="h-5 w-5" />
            <p className="text-sm">Available Balance</p>
          </div>
          <p className="mt-2 text-4xl font-bold">₹{balance.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-sm opacity-70">{wallet?.currency || "INR"}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs opacity-60">Money In</p>
              <p className="font-semibold">₹{totalIn.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Money Out</p>
              <p className="font-semibold">₹{totalOut.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Request Payout", icon: ArrowUpRight, color: "bg-emerald-50 text-emerald-700" },
            { label: "Transaction History", icon: TrendingUp, color: "bg-blue-50 text-blue-700" },
          ].map((action) => (
            <button key={action.label} className={`flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${action.color}`}>
              <action.icon className="h-5 w-5" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div>
          <h2 className="mb-3 font-bold text-slate-800">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center py-10">
              <Wallet className="h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm text-slate-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      tx.direction === "CREDIT" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    }`}>
                      {tx.direction === "CREDIT" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{tx.description || tx.type}</p>
                      <p className="text-xs text-slate-400">{new Date(tx.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${tx.direction === "CREDIT" ? "text-emerald-600" : "text-red-600"}`}>
                    {tx.direction === "CREDIT" ? "+" : "-"}₹{((tx.amountMinor || 0) / 100).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
