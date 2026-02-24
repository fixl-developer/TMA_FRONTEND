/**
 * WES (Workflow Execution System) Service - Super Admin
 */

import {
  seedWesAnalytics,
  seedWesScores,
  seedWesRecommendations,
  seedWesExecutions,
  seedWesBottlenecks,
  seedWesKpis,
} from "@/data/seed"
import type {
  WesDashboardData,
  WesScore,
  WesExecution,
  WesBottleneck,
  WesKpi,
  WesRecommendation,
} from "@/shared/lib/types/wes"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const getWesDashboard = async (): Promise<WesDashboardData> => {
  await delay(180)
  return seedWesAnalytics as WesDashboardData
}

export const getWesScores = async (): Promise<WesScore[]> => {
  await delay(150)
  return seedWesScores as WesScore[]
}

export const getWesExecutions = async (): Promise<WesExecution[]> => {
  await delay(160)
  return seedWesExecutions as WesExecution[]
}

export const getWesBottlenecks = async (): Promise<WesBottleneck[]> => {
  await delay(140)
  return seedWesBottlenecks as WesBottleneck[]
}

export const getWesKpis = async (): Promise<WesKpi[]> => {
  await delay(130)
  return seedWesKpis as WesKpi[]
}

export const getWesRecommendations = async (): Promise<WesRecommendation[]> => {
  await delay(140)
  const analytics = seedWesAnalytics as WesDashboardData
  if (analytics?.recommendations?.length) return analytics.recommendations
  return seedWesRecommendations as WesRecommendation[]
}
