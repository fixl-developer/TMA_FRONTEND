import { configureStore } from "@reduxjs/toolkit"
import { blueprintsReducer } from "./blueprintsSlice"
import { blueprintConfigReducer } from "./blueprintConfigSlice"
import { templatesReducer } from "./templatesSlice"
import { workflowsReducer } from "./workflowsSlice"
import { automationReducer } from "./automationSlice"
import { rbacReducer } from "./rbacSlice"

// In a larger system, slices are registered here.
// Keep the store lean and feature-agnostic.
export const makeStore = () =>
  configureStore({
    reducer: {
      blueprints: blueprintsReducer,
      blueprintConfig: blueprintConfigReducer,
      templates: templatesReducer,
      workflows: workflowsReducer,
      automation: automationReducer,
      rbac: rbacReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore["getState"]>

