"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getRegistrationById,
  type Registration,
} from "@/shared/services/pageantDataService"
import { getPageantById } from "@/shared/services/pageantService"
import { UserPlus, Mail, ArrowLeft, Calendar } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  PENDING: "bg-amber-100 text-amber-600 border-amber-500/40",
}

export default function RegistrationDetailPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const params = useParams()
  const id = params.id as string
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [pageantName, setPageantName] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRegistrationById(id).then((reg) => {
      setRegistration(reg ?? null)
      if (reg?.pageantId) {
        getPageantById(reg.pageantId).then((p) => setPageantName(p?.name ?? ""))
      }
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <AgenciesPage>
        <p className="py-12 text-center" style={{ color: colors.textSoft }}>Loading…</p>
      </AgenciesPage>
    )
  }

  if (!registration) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: colors.textSoft }}>Registration not found</p>
          <Link href="/pageant/registration">
            <Button variant="outline" className="mt-4">
              Back to registrations
            </Button>
          </Link>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="mb-6">
        <Link
          href="/pageant/registration"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to registrations
        </Link>
      </div>
      <PageantPageHeader title={registration.contestantName} subtitle={pageantName || "Registration detail"} />
      <section className="mt-8 min-w-0">
        <Card variant={cardVariant}>
          <CardHeader>
            <CardTitle>Contestant details</CardTitle>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                statusColors[registration.status] ??
                "bg-[#E7E5E4]/60 text-[#57534E] border-[#E7E5E4]"
              }`}
            >
              {registration.status}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                <UserPlus className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <p className="font-semibold" style={{ color: colors.text }}>{registration.contestantName}</p>
                <p className="flex items-center gap-1 text-sm" style={{ color: colors.textSoft }}>
                  <Mail className="h-4 w-4" /> {registration.email}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium" style={{ color: colors.textSoft }}>Stage</p>
                <p className="text-sm" style={{ color: colors.text }}>{registration.stage}</p>
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: colors.textSoft }}>Registered</p>
                <p className="flex items-center gap-1 text-sm" style={{ color: colors.text }}>
                  <Calendar className="h-4 w-4" />
                  {new Date(registration.registeredAt).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <Link href={`/pageant/builder/${registration.pageantId}`}>
                <Button variant="outline" className="transition-colors" style={{ borderColor: colors.border, color: colors.text }}>
                  View process
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
