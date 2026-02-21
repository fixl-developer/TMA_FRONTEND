import { AlertCircle } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 py-12 px-6 text-center ${className}`}
    >
      <AlertCircle className="h-10 w-10 text-red-500" aria-hidden />
      <h3 className="mt-4 text-sm font-medium text-red-800">{title}</h3>
      <p className="mt-1 text-sm text-red-600 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4 border-red-200 text-red-700 hover:bg-red-100" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
