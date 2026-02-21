"use client"

import Link from "next/link"
import { ShieldX } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <ShieldX className="mb-4 h-16 w-16 text-amber-500/80" />
      <h1 className="text-xl font-semibold text-white">Access denied</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-400">
        You don&apos;t have permission to view this page.
      </p>
      <Button asChild className="mt-6">
        <Link href="/login">Sign in</Link>
      </Button>
    </div>
  )
}
