import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CollaborationRequest, CollaborationRoom } from "@/shared/lib/types/collaboration"
import { getCollaborationRequests } from "@/shared/services/collaborationService"
import { getCollaborationRooms } from "@/shared/services/collaborationService"

interface CollaborationState {
  requests: CollaborationRequest[]
  rooms: CollaborationRoom[]
  loadingRequests: boolean
  loadingRooms: boolean
  error?: string
  selectedRequestId?: string
  selectedRoomId?: string
}

const initialState: CollaborationState = {
  requests: [],
  rooms: [],
  loadingRequests: false,
  loadingRooms: false,
}

export const fetchCollaborationRequests = createAsyncThunk<CollaborationRequest[]>(
  "collaboration/fetchRequests",
  async () => getCollaborationRequests()
)

export const fetchCollaborationRooms = createAsyncThunk<CollaborationRoom[]>(
  "collaboration/fetchRooms",
  async () => getCollaborationRooms()
)

const collaborationSlice = createSlice({
  name: "collaboration",
  initialState,
  reducers: {
    setSelectedRequest(state, action: PayloadAction<string | undefined>) {
      state.selectedRequestId = action.payload
    },
    setSelectedRoom(state, action: PayloadAction<string | undefined>) {
      state.selectedRoomId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollaborationRequests.pending, (state) => {
        state.loadingRequests = true
        state.error = undefined
      })
      .addCase(fetchCollaborationRequests.fulfilled, (state, action) => {
        state.loadingRequests = false
        state.requests = action.payload
      })
      .addCase(fetchCollaborationRequests.rejected, (state, action) => {
        state.loadingRequests = false
        state.error = action.error.message || "Failed to load collaboration requests"
      })
      .addCase(fetchCollaborationRooms.pending, (state) => {
        state.loadingRooms = true
        state.error = undefined
      })
      .addCase(fetchCollaborationRooms.fulfilled, (state, action) => {
        state.loadingRooms = false
        state.rooms = action.payload
      })
      .addCase(fetchCollaborationRooms.rejected, (state, action) => {
        state.loadingRooms = false
        state.error = action.error.message || "Failed to load collaboration rooms"
      })
  },
})

export const { setSelectedRequest, setSelectedRoom } = collaborationSlice.actions
export const collaborationReducer = collaborationSlice.reducer
