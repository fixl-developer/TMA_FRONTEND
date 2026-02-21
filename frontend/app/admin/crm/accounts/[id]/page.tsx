"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getAccountById, getContactsByAccount, getActivitiesByObject } from "@/shared/services/crmService"
import { Building2, Mail, Phone, User, Calendar } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

const typeColors: Record<string, string> = {
  BRAND: "bg-purple-100 text-purple-700",
  CLIENT: "bg-blue-100 text-blue-700",
  PARTNER: "bg-emerald-100 text-emerald-700",
}

const activityTypeLabels: Record<string, string> = {
  CALL: "Call",
  EMAIL: "Email",
  MEETING: "Meeting",
}

export default function CrmAccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { page } = useDashboardTheme()
  const [account, setAccount] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getAccountById(id),
      getContactsByAccount(id),
      getActivitiesByObject("ACCOUNT", id),
    ]).then(([a, c, act]) => {
      setAccount(a)
      setContacts(c)
      setActivities(act)
      setLoading(false)
    })
  }, [id])

  if (loading || !account) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading account…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={account.name}
        subtitle={`${account.type} · ${account.industry}`}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/crm/accounts">
          <Button variant="ghost" size="sm">← Accounts</Button>
        </Link>
        <Link href="/admin/crm">
          <Button variant="ghost" size="sm">CRM</Button>
        </Link>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Account details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[account.type] ?? "bg-slate-100"}`}>
                {account.type}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{account.status}</span>
            </div>
            <p className="text-sm text-slate-600">Payment terms: {account.paymentTerms}</p>
            <p className="text-sm text-slate-600">NDA: {account.ndaStatus}</p>
            {account.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {account.tags.map((t: string) => (
                  <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs">{t}</span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contacts ({contacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-sm text-slate-500">No contacts yet.</p>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => (
                  <div key={c._id} className="flex items-start gap-3 rounded-lg border p-3" style={{ borderColor: page.border }}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: page.text }}>{c.name}</p>
                      <p className="flex items-center gap-1 text-sm text-slate-500">
                        <Mail className="h-3 w-3" /> {c.email}
                      </p>
                      {c.phone && (
                        <p className="flex items-center gap-1 text-sm text-slate-500">
                          <Phone className="h-3 w-3" /> {c.phone}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">{c.role}{c.isPrimary && " · Primary"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-slate-500">No activities logged yet.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((a) => (
                <div key={a._id} className="flex gap-4 border-l-2 pl-4" style={{ borderColor: page.border }}>
                  <div className="flex shrink-0 flex-col">
                    <span className="text-xs font-medium text-slate-500">{activityTypeLabels[a.type] ?? a.type}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(a.occurredAt).toLocaleDateString()} {new Date(a.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: page.text }}>{a.subject}</p>
                    <p className="text-sm text-slate-500">{a.notes}</p>
                    <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${a.outcome === "POSITIVE" ? "bg-emerald-100 text-emerald-700" : a.outcome === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {a.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
