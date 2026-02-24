import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Role, Policy } from "@/shared/lib/types/rbac"
import { getRoles } from "@/shared/services/rbacService"
import { getPolicies } from "@/shared/services/rbacService"

interface RbacState {
  roles: Role[]
  policies: Policy[]
  loadingRoles: boolean
  loadingPolicies: boolean
  error?: string
  selectedRoleId?: string
  selectedPolicyId?: string
}

const initialState: RbacState = {
  roles: [],
  policies: [],
  loadingRoles: false,
  loadingPolicies: false,
}

export const fetchRoles = createAsyncThunk<Role[]>(
  "rbac/fetchRoles",
  async () => getRoles()
)

export const fetchPolicies = createAsyncThunk<Policy[]>(
  "rbac/fetchPolicies",
  async () => getPolicies()
)

const rbacSlice = createSlice({
  name: "rbac",
  initialState,
  reducers: {
    setSelectedRole(state, action: PayloadAction<string | undefined>) {
      state.selectedRoleId = action.payload
    },
    setSelectedPolicy(state, action: PayloadAction<string | undefined>) {
      state.selectedPolicyId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loadingRoles = true
        state.error = undefined
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loadingRoles = false
        state.roles = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loadingRoles = false
        state.error = action.error.message || "Failed to load roles"
      })
      .addCase(fetchPolicies.pending, (state) => {
        state.loadingPolicies = true
        state.error = undefined
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loadingPolicies = false
        state.policies = action.payload
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loadingPolicies = false
        state.error = action.error.message || "Failed to load policies"
      })
  },
})

export const { setSelectedRole, setSelectedPolicy } = rbacSlice.actions
export const rbacReducer = rbacSlice.reducer
