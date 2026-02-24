"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getContacts, getAccounts } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { User, Mail, Phone, Building2, ArrowLeft } from "lucide-react"

export default function CrmContactsPage() {
  const { tenantId } = useTenant()
  const [contacts, setContacts] = useState<any[]>([])
  const [accounts, setAccounts] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getContacts(tenantId), getAccounts(tenantId)]).then(([c, a]) => {
      setContacts(c)
      const map: Record<string, any> = {}
      a.forEach((acc) => {
        map[acc._id] = acc
      })
      setAccounts(map)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/crm">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              CRM
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Contacts</h1>
            <p className="mt-2 text-base text-white/60">Contact list across accounts</p>
          </div>
        </div>

        {/* Contact List */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-bold text-white">Contact list</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center">
              <User className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">No contacts yet</p>
              <p className="mt-1 text-sm text-white/40">Add contacts to your accounts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <div
                  key={c._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{c.name}</p>
                      <p className="flex items-center gap-1 text-sm text-white/60">
                        <Mail className="h-3 w-3" /> {c.email}
                      </p>
                      {c.phone && (
                        <p className="flex items-center gap-1 text-sm text-white/60">
                          <Phone className="h-3 w-3" /> {c.phone}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <Link
                          href={`/admin/crm/accounts/${c.accountId}`}
                          className="flex items-center gap-1 text-sm text-purple-400 hover:underline"
                        >
                          <Building2 className="h-3 w-3" /> {accounts[c.accountId]?.name ?? "Account"}
                        </Link>
                        {c.isPrimary && (
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Link href={`/admin/crm/accounts/${c.accountId}`}>View account</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
