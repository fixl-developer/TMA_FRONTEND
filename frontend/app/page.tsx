"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/shared/context/AuthContext"

export default function HomePage() {
  const { dashboardPath, isReady } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isReady) return
    router.replace(dashboardPath ?? "/login")
  }, [isReady, dashboardPath, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <p className="text-slate-400">Redirecting...</p>
    </div>
  )
}
