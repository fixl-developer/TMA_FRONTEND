"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getInvitationByToken, acceptInvitation } from "@/shared/services/invitationService"
import { useAuth, DASHBOARD_PATH } from "@/shared/context/AuthContext"
import { seedTenants } from "@/data/seed"
import { getTenantRoles } from "@/shared/services/roleService"
import { Button } from "@/shared/components/ui/button"
import { CheckCircle2, XCircle, Mail } from "lucide-react"

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()
  const token = searchParams?.get("token")
  const [invite, setInvite] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError("Invalid or missing invitation link.")
      return
    }
    getInvitationByToken(token)
      .then((i) => {
        setInvite(i)
        setError(i ? null : "Invitation not found or expired.")
      })
      .catch(() => setError("Failed to load invitation."))
      .finally(() => setLoading(false))
  }, [token])

  const handleAccept = async () => {
    if (!invite) return
    if (invite.status !== "PENDING") {
      setError("This invitation is no longer active.")
      return
    }
    if (invite.expiresAt && new Date(invite.expiresAt).getTime() < Date.now()) {
      setError("This invitation link has expired.")
      return
    }
    setAccepting(true)
    try {
      await acceptInvitation(invite._id)
      setAccepted(true)
      // Demo: log in as admin for that tenant and redirect
      login("admin@talentos.io", "demo123")
      setTimeout(() => router.push(DASHBOARD_PATH.admin), 2000)
    } catch {
      setError("Failed to accept invitation.")
    } finally {
      setAccepting(false)
    }
  }

  const tenant = invite
    ? (seedTenants as any[]).find((t) => t._id === invite.tenantId)
    : null
  const role = invite
    ? getTenantRoles(invite.tenantId).find((r) => r._id === invite.roleId)
    : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading invitation…</p>
      </div>
    )
  }

  if (error || !invite) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-white">Invalid invitation</h1>
        <p className="mt-2 text-center text-slate-400">{error}</p>
        <Button asChild className="mt-6">
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    )
  }

  if (invite.status && invite.status !== "PENDING") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
          <XCircle className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-white">Invitation unavailable</h1>
        <p className="mt-2 text-center text-slate-400">
          This invitation is currently marked as {invite.status.toLowerCase()}.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-white">Invitation accepted!</h1>
        <p className="mt-2 text-slate-400">Redirecting to your dashboard…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20">
            <Mail className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">You&apos;re invited</h1>
            <p className="text-sm text-slate-400">
              {tenant?.name ?? "An organization"} has invited you to join.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-lg border border-slate-700/80 bg-slate-800/50 p-4">
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Organization:</span> {tenant?.name ?? invite.tenantId}
          </p>
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Role:</span> {role?.name ?? "Member"}
          </p>
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Email:</span> {invite.email}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={handleAccept}
            disabled={accepting}
            className="flex-1 bg-teal-500 text-slate-900 hover:bg-teal-400"
          >
            {accepting ? "Accepting…" : "Accept invitation"}
          </Button>
          <Button asChild variant="outline" className="border-slate-600 text-slate-300">
            <Link href="/login">Decline</Link>
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          By accepting, you agree to join this organization on TalentOS.
        </p>
      </div>
    </div>
  )
}
