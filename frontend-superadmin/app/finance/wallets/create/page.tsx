"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function WalletCreatePage() {
  const [type, setType] = useState("TENANT")
  const [ownerId, setOwnerId] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const handleSave = async () => {
    if (!ownerId.trim()) { showToast("Enter owner ID.", "warning"); return }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      showToast("Wallet created (UI only – backend later).", "success")
    } catch { showToast("Failed to create wallet.", "error") }
    finally { setSaving(false) }
  }

  return (
    <PageLayout>
      <PageHeader title="Create wallet" description="Wallet type, owner, currency. Seed/UI only." actions={<Button asChild variant="outline" size="sm"><Link href="/finance/wallets"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Wallets</Link></Button>} />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">New wallet</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm">
                  <option value="PLATFORM_ESCROW">Platform Escrow</option>
                  <option value="PLATFORM_REVENUE">Platform Revenue</option>
                  <option value="TENANT">Tenant</option>
                  <option value="TALENT">Talent</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner ID</Label>
                <Input id="owner" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} placeholder="tenant_001 or platform" />
              </div>
            </div>
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5"><Save className="h-3.5 w-3.5" />{saving ? "Creating…" : "Create wallet"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
