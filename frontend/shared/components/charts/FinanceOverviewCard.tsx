"use client"

/**
 * Finance Overview – Wallet, Escrow, Payouts
 * From overall2.md §4.11: dashboards/finance – Wallet, escrow, payouts.
 * Uses AGENCIES_DESIGN_SPEC palette.
 */

import { Wallet, Lock, CreditCard } from "lucide-react"
import { formatCurrency } from "@/shared/services/dashboardService"

interface FinanceOverviewCardProps {
  walletBalance: number
  walletCurrency?: string
  escrowByStatus: { created: number; funded: number; locked: number; released: number; disputed: number }
  escrowAmounts: { created: number; funded: number; locked: number }
  payoutPending: number
  payoutSettled: number
  payoutCount: number
}

export function FinanceOverviewCard({
  walletBalance,
  walletCurrency = "INR",
  escrowByStatus,
  escrowAmounts,
  payoutPending,
  payoutSettled,
  payoutCount,
}: FinanceOverviewCardProps) {
  const totalEscrowHeld = escrowAmounts.created + escrowAmounts.funded + escrowAmounts.locked

  return (
    <div className="grid gap-6 rounded-xl border border-[#E7E5E4] bg-white p-5 shadow-sm lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[#B8860B]" />
          <h3 className="text-base font-semibold text-[#1C1917]">Wallet</h3>
        </div>
        <p className="text-2xl font-bold text-[#1C1917]">
          {formatCurrency(walletBalance, walletCurrency)}
        </p>
        <p className="text-xs text-[#78716C]">Available balance</p>
      </div>

      <div className="flex flex-col gap-4 border-l border-[#E7E5E4] pl-6">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#0D9488]" />
          <h3 className="text-base font-semibold text-[#1C1917]">Escrow</h3>
        </div>
        <p className="text-2xl font-bold text-[#1C1917]">
          {formatCurrency(totalEscrowHeld, walletCurrency)}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-[#57534E]">
          <span>Created: {escrowByStatus.created}</span>
          <span>Funded: {escrowByStatus.funded}</span>
          <span>Locked: {escrowByStatus.locked}</span>
          <span>Released: {escrowByStatus.released}</span>
          {escrowByStatus.disputed > 0 && (
            <span className="text-[#E07C5C]">Disputed: {escrowByStatus.disputed}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-l border-[#E7E5E4] pl-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#E4A853]" />
          <h3 className="text-base font-semibold text-[#1C1917]">Payouts</h3>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-bold text-[#1C1917]">
            {formatCurrency(payoutPending, walletCurrency)}{" "}
            <span className="text-sm font-normal text-[#78716C]">pending</span>
          </p>
          <p className="text-sm text-[#57534E]">
            {formatCurrency(payoutSettled, walletCurrency)} settled · {payoutCount} total
          </p>
        </div>
      </div>
    </div>
  )
}
