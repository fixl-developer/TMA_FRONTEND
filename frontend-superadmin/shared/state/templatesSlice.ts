import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { TenantTemplate, TemplateId } from "@/shared/lib/types/templates"
import { getTemplates } from "@/shared/services/templateService"

interface TemplatesState {
  items: TenantTemplate[]
  loading: boolean
  error?: string
  selectedId?: TemplateId
}

const initialState: TemplatesState = {
  items: [],
  loading: false,
}

export const fetchTemplates = createAsyncThunk<TenantTemplate[]>(
  "templates/fetchAll",
  async () => getTemplates()
)

const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    setSelectedTemplate(state, action: PayloadAction<TemplateId | undefined>) {
      state.selectedId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load templates"
      })
  },
})

export const { setSelectedTemplate } = templatesSlice.actions
export const templatesReducer = templatesSlice.reducer
