import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Blueprint, BlueprintId } from "@/shared/lib/types/blueprints"
import {
  getBlueprintById,
  updateBlueprintConfig,
  type UpdateBlueprintConfigPayload,
} from "@/shared/services/blueprintService"

interface BlueprintConfigState {
  current?: Blueprint
  loading: boolean
  saving: boolean
  error?: string
  dirty: boolean
}

const initialState: BlueprintConfigState = {
  loading: false,
  saving: false,
  dirty: false,
}

export const fetchBlueprintConfig = createAsyncThunk<
  Blueprint,
  BlueprintId
>("blueprintConfig/fetch", async (id) => {
  const bp = await getBlueprintById(id)
  if (!bp) throw new Error("Blueprint not found")
  return bp
})

export const saveBlueprintConfig = createAsyncThunk<
  Blueprint,
  { id: BlueprintId; patch: Partial<UpdateBlueprintConfigPayload> }
>("blueprintConfig/save", async ({ id, patch }) => {
  return await updateBlueprintConfig(id, patch)
})

const blueprintConfigSlice = createSlice({
  name: "blueprintConfig",
  initialState,
  reducers: {
    setDirty(state, action: PayloadAction<boolean>) {
      state.dirty = action.payload
    },
    clearConfig(state) {
      state.current = undefined
      state.loading = false
      state.saving = false
      state.error = undefined
      state.dirty = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlueprintConfig.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchBlueprintConfig.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
        state.dirty = false
      })
      .addCase(fetchBlueprintConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load blueprint configuration"
      })
      .addCase(saveBlueprintConfig.pending, (state) => {
        state.saving = true
        state.error = undefined
      })
      .addCase(saveBlueprintConfig.fulfilled, (state, action) => {
        state.saving = false
        state.current = action.payload
        state.dirty = false
      })
      .addCase(saveBlueprintConfig.rejected, (state, action) => {
        state.saving = false
        state.error = action.error.message || "Failed to save blueprint configuration"
      })
  },
})

export const { setDirty, clearConfig } = blueprintConfigSlice.actions
export const blueprintConfigReducer = blueprintConfigSlice.reducer

