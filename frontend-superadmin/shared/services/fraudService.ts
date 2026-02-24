/**
 * Fraud Detection Service - Super Admin
 * Seed-backed service for fraud signals, models, patterns, responses, thresholds.
 */

import {
  seedFraudRiskMonitoring,
  seedFraudModels,
  seedFraudResponses,
  seedFraudThresholds,
} from "@/data/seed"
import type {
  FraudSignal,
  FraudModel,
  FraudPattern,
  FraudResponseRule,
  FraudThreshold,
  FraudDashboardData,
} from "@/shared/lib/types/fraud"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const getFraudDashboard = async (): Promise<FraudDashboardData> => {
  await delay(180)
  return seedFraudRiskMonitoring as FraudDashboardData
}

export const getFraudSignals = async (): Promise<FraudSignal[]> => {
  await delay(160)
  const data = seedFraudRiskMonitoring as FraudDashboardData
  return data.fraudSignals ?? []
}

export const getFraudSignalById = async (id: string): Promise<FraudSignal | undefined> => {
  await delay(100)
  const data = seedFraudRiskMonitoring as FraudDashboardData
  return data.fraudSignals?.find((s) => s.id === id)
}

export const getFraudModels = async (): Promise<FraudModel[]> => {
  await delay(150)
  return seedFraudModels as FraudModel[]
}

export const getFraudModelById = async (id: string): Promise<FraudModel | undefined> => {
  await delay(100)
  return (seedFraudModels as FraudModel[]).find((m) => m.id === id)
}

export const getFraudPatterns = async (): Promise<FraudPattern[]> => {
  await delay(150)
  const data = seedFraudRiskMonitoring as FraudDashboardData
  return data.patterns ?? []
}

export const getFraudResponses = async (): Promise<FraudResponseRule[]> => {
  await delay(140)
  return seedFraudResponses as FraudResponseRule[]
}

export const getFraudThresholds = async (): Promise<FraudThreshold[]> => {
  await delay(140)
  return seedFraudThresholds as FraudThreshold[]
}
