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

export default function LegalHoldCreatePage() {
  const [tenantId, setTenantId] = useState("")
  const [reason, setReason] = useState("")
  const [entityTypes, setEntityTypes] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const handleSave = async () => {
    if (!tenantId.trim() || !reason.trim()) { showToast("Enter tenant ID and reason.", "warning"); return }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      showToast("Legal hold created (UI only – backend later).", "success")
    } catch { showToast("Failed to create hold.", "error") }
    finally { setSaving(false) }
  }

  return (
    <PageLayout>
      <PageHeader title="Create legal hold" description="Hold details, scope definition, data selection. Seed/UI only." actions={<Button asChild variant="outline" size="sm"><Link href="/compliance/legal-holds"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Legal Holds</Link></Button>} />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">New legal hold</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tenant">Tenant ID</Label>
                <Input id="tenant" value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="e.g. tenant_001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires">Expires at</Label>
                <Input id="expires" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Litigation - contract dispute" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entities">Entity types (comma-separated)</Label>
              <Input id="entities" value={entityTypes} onChange={(e) => setEntityTypes(e.target.value)} placeholder="e.g. contracts, audit_logs, communications" />
            </div>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5"><Save className="h-3.5 w-3.5" />{saving ? "Creating…" : "Create hold"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
