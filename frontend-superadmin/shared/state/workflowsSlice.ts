import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Workflow } from "@/shared/lib/types/workflows"
import { getWorkflows } from "@/shared/services/workflowService"

interface WorkflowsState {
  items: Workflow[]
  loading: boolean
  error?: string
  selectedId?: string
}

const initialState: WorkflowsState = {
  items: [],
  loading: false,
}

export const fetchWorkflows = createAsyncThunk<Workflow[]>(
  "workflows/fetchAll",
  async () => getWorkflows()
)

const workflowsSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    setSelectedWorkflow(state, action: PayloadAction<string | undefined>) {
      state.selectedId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load workflows"
      })
  },
})

export const { setSelectedWorkflow } = workflowsSlice.actions
export const workflowsReducer = workflowsSlice.reducer
