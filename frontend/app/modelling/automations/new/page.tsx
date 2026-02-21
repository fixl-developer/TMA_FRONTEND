"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { saveAutomation } from "@/shared/services/modellingAutomationService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const TRIGGERS = [
  "contract.signed",
  "escrow.funded",
  "escrow.released",
  "booking.confirmed",
  "delivery.approved",
  "payout.requested",
  "invoice.paid",
  "pageant.registered",
]

export default function NewAutomationPage() {
  const router = useRouter()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [name, setName] = useState("")
  const [trigger, setTrigger] = useState("contract.signed")
  const [conditions, setConditions] = useState("")
  const [actions, setActions] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const a = await saveAutomation(
      { name: name.trim(), trigger, conditions, actions },
      undefined,
      tenantId
    )
    showToast("Automation created (mock)", "success")
    router.push(`/modelling/automations/${a._id}`)
    setSaving(false)
  }

  return (
    <AgenciesPage>
      <PageBanner
        title="New automation"
        subtitle="Create a workflow trigger"
        variant="modelling"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-[#57534E] hover:text-[#1C1917]">
          <Link href="/modelling/automations" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to automations
          </Link>
        </Button>
      </div>

      <section className="mt-6">
        <Card className="border-[#E7E5E4] max-w-2xl">
          <CardHeader>
            <CardTitle className="text-[#1C1917]">Automation details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Contract signed → Create escrow"
                  className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-[#1C1917]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">Trigger</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-[#1C1917]"
                >
                  {TRIGGERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">Conditions (optional)</label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. amount > 10000"
                  className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-[#1C1917]"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">Actions (optional)</label>
                <textarea
                  value={actions}
                  onChange={(e) => setActions(e.target.value)}
                  placeholder="e.g. create_escrow, notify_talent"
                  className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-[#1C1917]"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-[#B8860B] hover:bg-[#9A7209]"
                  disabled={saving || !name.trim()}
                >
                  Create
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/modelling/automations">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
