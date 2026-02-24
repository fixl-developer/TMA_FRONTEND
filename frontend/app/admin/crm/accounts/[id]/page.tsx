"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getAccountById, getContactsByAccount, getActivitiesByObject } from "@/shared/services/crmService"
import { Building2, Mail, Phone, User, Calendar, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

const activityTypeLabels: Record<string, string> = {
  CALL: "Call",
  EMAIL: "Email",
  MEETING: "Meeting",
}

export default function CrmAccountDetailPage() {
  const params = useParams()
  const id = params?.id as string
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading account…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={account.name}
        subtitle={`${account.type} · ${account.industry}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/crm/accounts">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Accounts
              </AdminButton>
            </Link>
            <Link href="/admin/crm">
              <AdminButton variant="ghost" size="sm">CRM</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Account details</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AdminBadge variant={
                account.type === "BRAND" ? "info" :
                account.type === "CLIENT" ? "success" : "default"
              }>
                {account.type}
              </AdminBadge>
              <AdminBadge variant="default">{account.status}</AdminBadge>
            </div>
            <p className="text-sm text-white/70">Payment terms: {account.paymentTerms}</p>
            <p className="text-sm text-white/70">NDA: {account.ndaStatus}</p>
            {account.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {account.tags.map((t: string) => (
                  <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{t}</span>
                ))}
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Contacts ({contacts.length})</h2>
          </div>
          {contacts.length === 0 ? (
            <p className="text-sm text-white/60">No contacts yet.</p>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <div key={c._id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/20">
                    <User className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{c.name}</p>
                    <p className="flex items-center gap-1 text-sm text-white/60">
                      <Mail className="h-3 w-3" /> {c.email}
                    </p>
                    {c.phone && (
                      <p className="flex items-center gap-1 text-sm text-white/60">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                    )}
                    <p className="text-xs text-white/50">{c.role}{c.isPrimary && " · Primary"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Activity timeline</h2>
        </div>
        {activities.length === 0 ? (
          <p className="text-sm text-white/60">No activities logged yet.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((a) => (
              <div key={a._id} className="flex gap-4 border-l-2 border-white/10 pl-4">
                <div className="flex shrink-0 flex-col">
                  <span className="text-xs font-medium text-white/60">{activityTypeLabels[a.type] ?? a.type}</span>
                  <span className="text-xs text-white/40">
                    {new Date(a.occurredAt).toLocaleDateString()} {new Date(a.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{a.subject}</p>
                  <p className="text-sm text-white/60">{a.notes}</p>
                  <AdminBadge variant={
                    a.outcome === "POSITIVE" ? "success" :
                    a.outcome === "PENDING" ? "warning" : "default"
                  } className="mt-1">
                    {a.outcome}
                  </AdminBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
