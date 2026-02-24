import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AutomationPack, AutomationRule } from "@/shared/lib/types/automation"
import { getAutomationPacks } from "@/shared/services/automationService"
import { getAutomationRules } from "@/shared/services/automationService"

interface AutomationState {
  packs: AutomationPack[]
  rules: AutomationRule[]
  loadingPacks: boolean
  loadingRules: boolean
  error?: string
  selectedPackId?: string
  selectedRuleId?: string
}

const initialState: AutomationState = {
  packs: [],
  rules: [],
  loadingPacks: false,
  loadingRules: false,
}

export const fetchAutomationPacks = createAsyncThunk<AutomationPack[]>(
  "automation/fetchPacks",
  async () => getAutomationPacks()
)

export const fetchAutomationRules = createAsyncThunk<AutomationRule[]>(
  "automation/fetchRules",
  async () => getAutomationRules()
)

const automationSlice = createSlice({
  name: "automation",
  initialState,
  reducers: {
    setSelectedPack(state, action: PayloadAction<string | undefined>) {
      state.selectedPackId = action.payload
    },
    setSelectedRule(state, action: PayloadAction<string | undefined>) {
      state.selectedRuleId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutomationPacks.pending, (state) => {
        state.loadingPacks = true
        state.error = undefined
      })
      .addCase(fetchAutomationPacks.fulfilled, (state, action) => {
        state.loadingPacks = false
        state.packs = action.payload
      })
      .addCase(fetchAutomationPacks.rejected, (state, action) => {
        state.loadingPacks = false
        state.error = action.error.message || "Failed to load automation packs"
      })
      .addCase(fetchAutomationRules.pending, (state) => {
        state.loadingRules = true
        state.error = undefined
      })
      .addCase(fetchAutomationRules.fulfilled, (state, action) => {
        state.loadingRules = false
        state.rules = action.payload
      })
      .addCase(fetchAutomationRules.rejected, (state, action) => {
        state.loadingRules = false
        state.error = action.error.message || "Failed to load automation rules"
      })
  },
})

export const { setSelectedPack, setSelectedRule } = automationSlice.actions
export const automationReducer = automationSlice.reducer
