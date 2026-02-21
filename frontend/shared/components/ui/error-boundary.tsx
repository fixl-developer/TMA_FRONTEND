"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "./button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 py-12 px-6 text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500" aria-hidden />
          <h3 className="mt-4 text-base font-semibold text-red-800">Something went wrong</h3>
          <p className="mt-2 max-w-md text-sm text-red-600">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-6 border-red-200 text-red-700 hover:bg-red-100"
            onClick={this.handleReset}
          >
            Try again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
