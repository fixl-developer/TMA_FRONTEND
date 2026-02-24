import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { DsrRequest, LegalHold, RetentionPolicy } from "@/shared/lib/types/compliance"
import { getDsrRequests } from "@/shared/services/complianceService"
import { getLegalHolds } from "@/shared/services/complianceService"
import { getRetentionPolicies } from "@/shared/services/complianceService"

interface ComplianceState {
  dsrRequests: DsrRequest[]
  legalHolds: LegalHold[]
  retentionPolicies: RetentionPolicy[]
  loadingDsr: boolean
  loadingHolds: boolean
  loadingPolicies: boolean
  error?: string
  selectedDsrId?: string
  selectedHoldId?: string
  selectedPolicyId?: string
}

const initialState: ComplianceState = {
  dsrRequests: [],
  legalHolds: [],
  retentionPolicies: [],
  loadingDsr: false,
  loadingHolds: false,
  loadingPolicies: false,
}

export const fetchDsrRequests = createAsyncThunk<DsrRequest[]>(
  "compliance/fetchDsrRequests",
  async () => getDsrRequests()
)

export const fetchLegalHolds = createAsyncThunk<LegalHold[]>(
  "compliance/fetchLegalHolds",
  async () => getLegalHolds()
)

export const fetchRetentionPolicies = createAsyncThunk<RetentionPolicy[]>(
  "compliance/fetchRetentionPolicies",
  async () => getRetentionPolicies()
)

const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {
    setSelectedDsr(state, action: PayloadAction<string | undefined>) {
      state.selectedDsrId = action.payload
    },
    setSelectedHold(state, action: PayloadAction<string | undefined>) {
      state.selectedHoldId = action.payload
    },
    setSelectedPolicy(state, action: PayloadAction<string | undefined>) {
      state.selectedPolicyId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDsrRequests.pending, (state) => {
        state.loadingDsr = true
        state.error = undefined
      })
      .addCase(fetchDsrRequests.fulfilled, (state, action) => {
        state.loadingDsr = false
        state.dsrRequests = action.payload
      })
      .addCase(fetchDsrRequests.rejected, (state, action) => {
        state.loadingDsr = false
        state.error = action.error.message || "Failed to load DSR requests"
      })
      .addCase(fetchLegalHolds.pending, (state) => {
        state.loadingHolds = true
        state.error = undefined
      })
      .addCase(fetchLegalHolds.fulfilled, (state, action) => {
        state.loadingHolds = false
        state.legalHolds = action.payload
      })
      .addCase(fetchLegalHolds.rejected, (state, action) => {
        state.loadingHolds = false
        state.error = action.error.message || "Failed to load legal holds"
      })
      .addCase(fetchRetentionPolicies.pending, (state) => {
        state.loadingPolicies = true
        state.error = undefined
      })
      .addCase(fetchRetentionPolicies.fulfilled, (state, action) => {
        state.loadingPolicies = false
        state.retentionPolicies = action.payload
      })
      .addCase(fetchRetentionPolicies.rejected, (state, action) => {
        state.loadingPolicies = false
        state.error = action.error.message || "Failed to load retention policies"
      })
  },
})

export const { setSelectedDsr, setSelectedHold, setSelectedPolicy } = complianceSlice.actions
export const complianceReducer = complianceSlice.reducer
