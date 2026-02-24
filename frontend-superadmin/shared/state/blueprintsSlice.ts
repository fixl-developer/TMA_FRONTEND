import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Blueprint, BlueprintId } from "@/shared/lib/types/blueprints"
import { getBlueprints } from "@/shared/services/blueprintService"

interface BlueprintsState {
  items: Blueprint[]
  loading: boolean
  error?: string
  selectedId?: BlueprintId
}

const initialState: BlueprintsState = {
  items: [],
  loading: false,
}

export const fetchBlueprints = createAsyncThunk<Blueprint[]>(
  "blueprints/fetchAll",
  async () => {
    const data = await getBlueprints()
    return data
  }
)

const blueprintsSlice = createSlice({
  name: "blueprints",
  initialState,
  reducers: {
    setSelectedBlueprint(state, action: PayloadAction<BlueprintId | undefined>) {
      state.selectedId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlueprints.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchBlueprints.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchBlueprints.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load blueprints"
      })
  },
})

export const { setSelectedBlueprint } = blueprintsSlice.actions
export const blueprintsReducer = blueprintsSlice.reducer

