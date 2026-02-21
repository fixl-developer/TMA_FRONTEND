"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  getRegistrations,
  type Registration,
} from "@/shared/services/pageantDataService"
import { getPageants } from "@/shared/services/pageantService"
import { UserPlus, Mail, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { useTenant } from "@/shared/context/TenantContext"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  PENDING: "bg-amber-100 text-amber-600 border-amber-500/40",
}

export default function PageantRegistrationPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const { tenantId } = useTenant()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [pageants, setPageants] = useState<{ _id: string; name: string }[]>([])
  const [selectedPageantId, setSelectedPageantId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [formData, setFormData] = useState({
    contestantName: "",
    email: "",
    pageantId: "pageant_001",
  })

  useEffect(() => {
    Promise.all([
      getRegistrations(),
      getPageants(tenantId ?? "tenant_002"),
    ]).then(([regs, pgs]) => {
      setRegistrations(regs)
      setPageants(pgs)
      if (!selectedPageantId && pgs.length) setSelectedPageantId(pgs[0]._id)
      setLoading(false)
    })
  }, [tenantId])

  useEffect(() => {
    if (!selectedPageantId && pageants.length) setSelectedPageantId(pageants[0]._id)
  }, [pageants, selectedPageantId])

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock: add to list (in-memory only for demo)
    const newReg: Registration = {
      _id: `reg_${Date.now()}`,
      pageantId: formData.pageantId,
      contestantName: formData.contestantName,
      email: formData.email,
      status: "PENDING",
      stage: "REGISTRATION",
      registeredAt: new Date().toISOString(),
    }
    setRegistrations((prev) => [newReg, ...prev])
    setFormData({ contestantName: "", email: "", pageantId: formData.pageantId })
    setAddOpen(false)
  }

  const filteredRegistrations = selectedPageantId
    ? registrations.filter((r) => r.pageantId === selectedPageantId)
    : registrations

  return (
    <AgenciesPage>
      <PageantPageHeader title="Registration" subtitle="Forms, payments, contestants." />
      <section className="mt-6 min-w-0">
        <Card variant={cardVariant}>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <CardTitle>Registrations</CardTitle>
              {pageants.length > 1 && (
                <select
                  value={selectedPageantId}
                  onChange={(e) => setSelectedPageantId(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }}
                >
                  <option value="">All pageants</option>
                  {pageants.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <Dialog
              open={addOpen}
              onOpenChange={(open) => {
                setAddOpen(open)
                if (open) setFormData((prev) => ({ ...prev, pageantId: selectedPageantId || pageants[0]?._id || "pageant_001" }))
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-violet-500 text-white hover:bg-violet-400">
                  <UserPlus className="mr-1.5 h-4 w-4" /> Add contestant
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add contestant</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="pageant">Pageant</Label>
                    <select
                      id="pageant"
                      value={formData.pageantId}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, pageantId: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{ borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }}
                    >
                      {pageants.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.contestantName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contestantName: e.target.value }))
                      }
                      placeholder="Contestant name"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="email@example.com"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-violet-500 text-white hover:bg-violet-400">
                      Add
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <p className="py-8 text-center" style={{ color: colors.textSoft }}>Loading registrations…</p>
            ) : filteredRegistrations.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <UserPlus className="h-12 w-12" style={{ color: colors.textMuted }} />
                <p className="mt-4 font-medium" style={{ color: colors.textMuted }}>No registrations yet</p>
                <p className="mt-1 text-sm" style={{ color: colors.textSoft }}>
                  Add a contestant or select a different pageant.
                </p>
                <Button
                  className="mt-4 bg-violet-500 text-white hover:bg-violet-400"
                  onClick={() => setAddOpen(true)}
                >
                  Add contestant
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRegistrations.map((r) => (
                  <Link key={r._id} href={`/pageant/registration/${r._id}`}>
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all hover:shadow-md"
                      style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                          <UserPlus className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold" style={{ color: colors.text }}>{r.contestantName}</p>
                          <p className="flex items-center gap-1 truncate text-xs" style={{ color: colors.textSoft }}>
                            <Mail className="h-3 w-3 shrink-0" />
                            {r.email}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
                            statusColors[r.status] ??
                            "bg-[#E7E5E4]/60 text-[#57534E] border-[#E7E5E4]"
                          }`}
                        >
                          {r.status}
                        </span>
                        <span className="shrink-0 text-xs" style={{ color: colors.textSoft }}>{r.stage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: colors.textSoft }}>
                          {new Date(r.registeredAt).toLocaleDateString("en-IN")}
                        </span>
                        <ChevronRight className="h-4 w-4" style={{ color: colors.textSoft }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
