import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { FraudSignal, FraudModel, FraudPattern, FraudResponseRule, FraudThreshold, FraudDashboardData } from "@/shared/lib/types/fraud"
import {
  getFraudDashboard,
  getFraudSignals,
  getFraudModels,
  getFraudPatterns,
  getFraudResponses,
  getFraudThresholds,
} from "@/shared/services/fraudService"

interface FraudState {
  dashboard?: FraudDashboardData
  signals: FraudSignal[]
  models: FraudModel[]
  patterns: FraudPattern[]
  responses: FraudResponseRule[]
  thresholds: FraudThreshold[]
  loadingDashboard: boolean
  loadingSignals: boolean
  loadingModels: boolean
  loadingPatterns: boolean
  loadingResponses: boolean
  loadingThresholds: boolean
  error?: string
  selectedSignalId?: string
}

const initialState: FraudState = {
  signals: [],
  models: [],
  patterns: [],
  responses: [],
  thresholds: [],
  loadingDashboard: false,
  loadingSignals: false,
  loadingModels: false,
  loadingPatterns: false,
  loadingResponses: false,
  loadingThresholds: false,
}

export const fetchFraudDashboard = createAsyncThunk<FraudDashboardData>("fraud/fetchDashboard", async () => getFraudDashboard())
export const fetchFraudSignals = createAsyncThunk<FraudSignal[]>("fraud/fetchSignals", async () => getFraudSignals())
export const fetchFraudModels = createAsyncThunk<FraudModel[]>("fraud/fetchModels", async () => getFraudModels())
export const fetchFraudPatterns = createAsyncThunk<FraudPattern[]>("fraud/fetchPatterns", async () => getFraudPatterns())
export const fetchFraudResponses = createAsyncThunk<FraudResponseRule[]>("fraud/fetchResponses", async () => getFraudResponses())
export const fetchFraudThresholds = createAsyncThunk<FraudThreshold[]>("fraud/fetchThresholds", async () => getFraudThresholds())

const fraudSlice = createSlice({
  name: "fraud",
  initialState,
  reducers: {
    setSelectedSignal(state, action: PayloadAction<string | undefined>) {
      state.selectedSignalId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFraudDashboard.pending, (s) => { s.loadingDashboard = true; s.error = undefined })
      .addCase(fetchFraudDashboard.fulfilled, (s, a) => { s.loadingDashboard = false; s.dashboard = a.payload; s.signals = a.payload.fraudSignals ?? [] })
      .addCase(fetchFraudDashboard.rejected, (s, a) => { s.loadingDashboard = false; s.error = a.error.message })

      .addCase(fetchFraudSignals.pending, (s) => { s.loadingSignals = true })
      .addCase(fetchFraudSignals.fulfilled, (s, a) => { s.loadingSignals = false; s.signals = a.payload })
      .addCase(fetchFraudSignals.rejected, (s, a) => { s.loadingSignals = false; s.error = a.error.message })

      .addCase(fetchFraudModels.pending, (s) => { s.loadingModels = true })
      .addCase(fetchFraudModels.fulfilled, (s, a) => { s.loadingModels = false; s.models = a.payload })
      .addCase(fetchFraudModels.rejected, (s, a) => { s.loadingModels = false; s.error = a.error.message })

      .addCase(fetchFraudPatterns.pending, (s) => { s.loadingPatterns = true })
      .addCase(fetchFraudPatterns.fulfilled, (s, a) => { s.loadingPatterns = false; s.patterns = a.payload })
      .addCase(fetchFraudPatterns.rejected, (s, a) => { s.loadingPatterns = false; s.error = a.error.message })

      .addCase(fetchFraudResponses.pending, (s) => { s.loadingResponses = true })
      .addCase(fetchFraudResponses.fulfilled, (s, a) => { s.loadingResponses = false; s.responses = a.payload })
      .addCase(fetchFraudResponses.rejected, (s, a) => { s.loadingResponses = false; s.error = a.error.message })

      .addCase(fetchFraudThresholds.pending, (s) => { s.loadingThresholds = true })
      .addCase(fetchFraudThresholds.fulfilled, (s, a) => { s.loadingThresholds = false; s.thresholds = a.payload })
      .addCase(fetchFraudThresholds.rejected, (s, a) => { s.loadingThresholds = false; s.error = a.error.message })
  },
})

export const { setSelectedSignal } = fraudSlice.actions
export const fraudReducer = fraudSlice.reducer
