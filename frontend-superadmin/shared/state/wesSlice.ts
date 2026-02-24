import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type {
  WesDashboardData,
  WesScore,
  WesExecution,
  WesBottleneck,
  WesKpi,
  WesRecommendation,
} from "@/shared/lib/types/wes"
import {
  getWesDashboard,
  getWesScores,
  getWesExecutions,
  getWesBottlenecks,
  getWesKpis,
  getWesRecommendations,
} from "@/shared/services/wesService"

interface WesState {
  dashboard?: WesDashboardData
  scores: WesScore[]
  executions: WesExecution[]
  bottlenecks: WesBottleneck[]
  kpis: WesKpi[]
  recommendations: WesRecommendation[]
  loadingDashboard: boolean
  loadingScores: boolean
  loadingExecutions: boolean
  loadingBottlenecks: boolean
  loadingKpis: boolean
  error?: string
}

const initialState: WesState = {
  scores: [],
  executions: [],
  bottlenecks: [],
  kpis: [],
  recommendations: [],
  loadingDashboard: false,
  loadingScores: false,
  loadingExecutions: false,
  loadingBottlenecks: false,
  loadingKpis: false,
}

export const fetchWesDashboard = createAsyncThunk<WesDashboardData>("wes/fetchDashboard", async () => getWesDashboard())
export const fetchWesScores = createAsyncThunk<WesScore[]>("wes/fetchScores", async () => getWesScores())
export const fetchWesExecutions = createAsyncThunk<WesExecution[]>("wes/fetchExecutions", async () => getWesExecutions())
export const fetchWesBottlenecks = createAsyncThunk<WesBottleneck[]>("wes/fetchBottlenecks", async () => getWesBottlenecks())
export const fetchWesKpis = createAsyncThunk<WesKpi[]>("wes/fetchKpis", async () => getWesKpis())
export const fetchWesRecommendations = createAsyncThunk<WesRecommendation[]>("wes/fetchRecommendations", async () => getWesRecommendations())

const wesSlice = createSlice({
  name: "wes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWesDashboard.pending, (s) => { s.loadingDashboard = true; s.error = undefined })
      .addCase(fetchWesDashboard.fulfilled, (s, a) => { s.loadingDashboard = false; s.dashboard = a.payload })
      .addCase(fetchWesDashboard.rejected, (s, a) => { s.loadingDashboard = false; s.error = a.error.message })
      .addCase(fetchWesScores.pending, (s) => { s.loadingScores = true })
      .addCase(fetchWesScores.fulfilled, (s, a) => { s.loadingScores = false; s.scores = a.payload })
      .addCase(fetchWesScores.rejected, (s, a) => { s.loadingScores = false; s.error = a.error.message })
      .addCase(fetchWesExecutions.pending, (s) => { s.loadingExecutions = true })
      .addCase(fetchWesExecutions.fulfilled, (s, a) => { s.loadingExecutions = false; s.executions = a.payload })
      .addCase(fetchWesExecutions.rejected, (s, a) => { s.loadingExecutions = false; s.error = a.error.message })
      .addCase(fetchWesBottlenecks.pending, (s) => { s.loadingBottlenecks = true })
      .addCase(fetchWesBottlenecks.fulfilled, (s, a) => { s.loadingBottlenecks = false; s.bottlenecks = a.payload })
      .addCase(fetchWesBottlenecks.rejected, (s, a) => { s.loadingBottlenecks = false; s.error = a.error.message })
      .addCase(fetchWesKpis.pending, (s) => { s.loadingKpis = true })
      .addCase(fetchWesKpis.fulfilled, (s, a) => { s.loadingKpis = false; s.kpis = a.payload })
      .addCase(fetchWesKpis.rejected, (s, a) => { s.loadingKpis = false; s.error = a.error.message })
      .addCase(fetchWesRecommendations.fulfilled, (s, a) => { s.recommendations = a.payload })
  },
})

export const wesReducer = wesSlice.reducer
