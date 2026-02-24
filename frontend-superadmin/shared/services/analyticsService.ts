/**
 * Platform Analytics Service - Super Admin
 */

import {
  seedPlatformAnalytics,
  seedTenantAnalytics,
  seedRevenueReports,
  seedAnalyticsReports,
  seedRevenueAnalytics,
} from "@/data/seed"
import type { PlatformMetrics, TenantAnalytics, ReportDefinition } from "@/shared/lib/types/analytics"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const getPlatformMetrics = async (): Promise<PlatformMetrics> => {
  await delay(160)
  return seedPlatformAnalytics as PlatformMetrics
}

export const getTenantAnalytics = async (): Promise<TenantAnalytics[]> => {
  await delay(170)
  return seedTenantAnalytics as TenantAnalytics[]
}

export const getRevenueReports = async () => {
  await delay(150)
  return seedRevenueReports as any[]
}

export const getRevenueAnalytics = async () => {
  await delay(140)
  return seedRevenueAnalytics as any
}

export const getAnalyticsReports = async (): Promise<ReportDefinition[]> => {
  await delay(130)
  return seedAnalyticsReports as ReportDefinition[]
}
