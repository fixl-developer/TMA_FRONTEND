"use client"

import { Provider } from "react-redux"
import type { ReactNode } from "react"
import { makeStore } from "./store"

// Create a store per request on the server, singleton on the client.
const store = makeStore()

interface ReduxProviderProps {
  children: ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>
}

