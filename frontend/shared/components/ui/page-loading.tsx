import { Loader2 } from "lucide-react"

export function PageLoading({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}
