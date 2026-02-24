import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ModerationItem, ModerationRule, Moderator, ModerationAnalytics } from "@/shared/lib/types/moderation"
import {
  getModerationQueue,
  getModerationRules,
  getModerators,
  getModerationAnalytics,
} from "@/shared/services/moderationService"

interface ModerationState {
  queue: ModerationItem[]
  rules: ModerationRule[]
  moderators: Moderator[]
  analytics?: ModerationAnalytics
  loadingQueue: boolean
  loadingRules: boolean
  loadingModerators: boolean
  loadingAnalytics: boolean
  error?: string
  selectedItemId?: string
  selectedRuleId?: string
  selectedModeratorId?: string
}

const initialState: ModerationState = {
  queue: [],
  rules: [],
  moderators: [],
  loadingQueue: false,
  loadingRules: false,
  loadingModerators: false,
  loadingAnalytics: false,
}

export const fetchModerationQueue = createAsyncThunk<ModerationItem[]>(
  "moderation/fetchModerationQueue",
  async () => getModerationQueue()
)

export const fetchModerationRules = createAsyncThunk<ModerationRule[]>(
  "moderation/fetchModerationRules",
  async () => getModerationRules()
)

export const fetchModerators = createAsyncThunk<Moderator[]>(
  "moderation/fetchModerators",
  async () => getModerators()
)

export const fetchModerationAnalytics = createAsyncThunk<ModerationAnalytics>(
  "moderation/fetchModerationAnalytics",
  async () => getModerationAnalytics()
)

const moderationSlice = createSlice({
  name: "moderation",
  initialState,
  reducers: {
    setSelectedItem(state, action: PayloadAction<string | undefined>) {
      state.selectedItemId = action.payload
    },
    setSelectedRule(state, action: PayloadAction<string | undefined>) {
      state.selectedRuleId = action.payload
    },
    setSelectedModerator(state, action: PayloadAction<string | undefined>) {
      state.selectedModeratorId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModerationQueue.pending, (state) => {
        state.loadingQueue = true
        state.error = undefined
      })
      .addCase(fetchModerationQueue.fulfilled, (state, action) => {
        state.loadingQueue = false
        state.queue = action.payload
      })
      .addCase(fetchModerationQueue.rejected, (state, action) => {
        state.loadingQueue = false
        state.error = action.error.message || "Failed to load moderation queue"
      })
      .addCase(fetchModerationRules.pending, (state) => {
        state.loadingRules = true
        state.error = undefined
      })
      .addCase(fetchModerationRules.fulfilled, (state, action) => {
        state.loadingRules = false
        state.rules = action.payload
      })
      .addCase(fetchModerationRules.rejected, (state, action) => {
        state.loadingRules = false
        state.error = action.error.message || "Failed to load moderation rules"
      })
      .addCase(fetchModerators.pending, (state) => {
        state.loadingModerators = true
        state.error = undefined
      })
      .addCase(fetchModerators.fulfilled, (state, action) => {
        state.loadingModerators = false
        state.moderators = action.payload
      })
      .addCase(fetchModerators.rejected, (state, action) => {
        state.loadingModerators = false
        state.error = action.error.message || "Failed to load moderators"
      })
      .addCase(fetchModerationAnalytics.pending, (state) => {
        state.loadingAnalytics = true
        state.error = undefined
      })
      .addCase(fetchModerationAnalytics.fulfilled, (state, action) => {
        state.loadingAnalytics = false
        state.analytics = action.payload
      })
      .addCase(fetchModerationAnalytics.rejected, (state, action) => {
        state.loadingAnalytics = false
        state.error = action.error.message || "Failed to load moderation analytics"
      })
  },
})

export const { setSelectedItem, setSelectedRule, setSelectedModerator } = moderationSlice.actions
export const moderationReducer = moderationSlice.reducer
