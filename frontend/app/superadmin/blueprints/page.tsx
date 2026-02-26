/**
 * Blueprints - Super Admin
 *
 * Redirect to Blueprint Catalog
 */

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BlueprintsPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/superadmin/blueprints/catalog")
  }, [router])

  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-slate-500">Redirecting to Blueprint Catalog...</p>
    </div>
  )
}
