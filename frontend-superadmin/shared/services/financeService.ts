/**
 * Finance Service - Super Admin
 *
 * Mock service for platform finance snapshots using seed data.
 */

import {
  seedTransactions,
  seedWallets,
  seedBillingPlans,
  seedRevenueReports,
  seedEscrowAccounts,
  seedPaymentRiskFlags,
} from "@/data/seed"
import type {
  FinanceTransaction,
  WalletSnapshot,
} from "@/shared/lib/types/finance"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getWalletSnapshots = async (): Promise<WalletSnapshot[]> => {
  await delay(220)
  return seedWallets as WalletSnapshot[]
}

export const getRecentTransactions = async (): Promise<FinanceTransaction[]> => {
  await delay(260)
  return seedTransactions as FinanceTransaction[]
}

export const getBillingPlans = async () => {
  await delay(200)
  return seedBillingPlans
}

export const getRevenueReports = async () => {
  await delay(200)
  return seedRevenueReports
}

export const getEscrowAccounts = async () => {
  await delay(200)
  return seedEscrowAccounts
}

export const getPaymentRiskFlags = async () => {
  await delay(200)
  return seedPaymentRiskFlags
}

