import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PlatformMetrics, TenantAnalytics, ReportDefinition } from "@/shared/lib/types/analytics"
import {
  getPlatformMetrics,
  getTenantAnalytics,
  getRevenueReports,
  getRevenueAnalytics,
  getAnalyticsReports,
} from "@/shared/services/analyticsService"

interface AnalyticsState {
  platformMetrics?: PlatformMetrics
  tenantAnalytics: TenantAnalytics[]
  revenueReports: any[]
  revenueAnalytics: any
  reports: ReportDefinition[]
  loadingPlatform: boolean
  loadingTenants: boolean
  loadingRevenue: boolean
  loadingReports: boolean
  error?: string
}

const initialState: AnalyticsState = {
  tenantAnalytics: [],
  revenueReports: [],
  revenueAnalytics: null,
  reports: [],
  loadingPlatform: false,
  loadingTenants: false,
  loadingRevenue: false,
  loadingReports: false,
}

export const fetchPlatformMetrics = createAsyncThunk<PlatformMetrics>("analytics/fetchPlatform", async () => getPlatformMetrics())
export const fetchTenantAnalytics = createAsyncThunk<TenantAnalytics[]>("analytics/fetchTenants", async () => getTenantAnalytics())
export const fetchRevenueReports = createAsyncThunk("analytics/fetchRevenue", async () => getRevenueReports())
export const fetchRevenueAnalytics = createAsyncThunk("analytics/fetchRevenueAnalytics", async () => getRevenueAnalytics())
export const fetchAnalyticsReports = createAsyncThunk<ReportDefinition[]>("analytics/fetchReports", async () => getAnalyticsReports())

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformMetrics.pending, (s) => { s.loadingPlatform = true })
      .addCase(fetchPlatformMetrics.fulfilled, (s, a) => { s.loadingPlatform = false; s.platformMetrics = a.payload })
      .addCase(fetchPlatformMetrics.rejected, (s, a) => { s.loadingPlatform = false; s.error = a.error.message })
      .addCase(fetchTenantAnalytics.pending, (s) => { s.loadingTenants = true })
      .addCase(fetchTenantAnalytics.fulfilled, (s, a) => { s.loadingTenants = false; s.tenantAnalytics = a.payload })
      .addCase(fetchTenantAnalytics.rejected, (s, a) => { s.loadingTenants = false; s.error = a.error.message })
      .addCase(fetchRevenueReports.pending, (s) => { s.loadingRevenue = true })
      .addCase(fetchRevenueReports.fulfilled, (s, a) => { s.loadingRevenue = false; s.revenueReports = a.payload })
      .addCase(fetchRevenueReports.rejected, (s, a) => { s.loadingRevenue = false; s.error = a.error.message })
      .addCase(fetchRevenueAnalytics.fulfilled, (s, a) => { s.revenueAnalytics = a.payload })
      .addCase(fetchAnalyticsReports.pending, (s) => { s.loadingReports = true })
      .addCase(fetchAnalyticsReports.fulfilled, (s, a) => { s.loadingReports = false; s.reports = a.payload })
      .addCase(fetchAnalyticsReports.rejected, (s, a) => { s.loadingReports = false; s.error = a.error.message })
  },
})

export const analyticsReducer = analyticsSlice.reducer
