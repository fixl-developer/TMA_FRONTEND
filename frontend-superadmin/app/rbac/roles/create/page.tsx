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

export default function RoleCreatePage() {
  const [name, setName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [description, setDescription] = useState("")
  const [blueprint, setBlueprint] = useState("pageant")
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const handleSave = async () => {
    if (!name.trim() || !displayName.trim()) { showToast("Enter name and display name.", "warning"); return }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      showToast("Role created (UI only – backend later).", "success")
    } catch { showToast("Failed to create role.", "error") }
    finally { setSaving(false) }
  }

  return (
    <PageLayout>
      <PageHeader title="Create role" description="Role name, description, blueprint. Capability assignment coming with API." actions={<Button asChild variant="outline" size="sm"><Link href="/rbac/roles"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Roles</Link></Button>} />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">New role</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name (ID)</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. senior_judge" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display">Display name</Label>
                <Input id="display" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Senior Judge" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blueprint">Blueprint</Label>
              <select id="blueprint" value={blueprint} onChange={(e) => setBlueprint(e.target.value)} className="w-full max-w-xs rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm">
                <option value="pageant">Pageant</option>
                <option value="modelling">Modelling</option>
                <option value="influencer">Influencer</option>
                <option value="all">All</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px] w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm" placeholder="Role description" />
            </div>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5"><Save className="h-3.5 w-3.5" />{saving ? "Creating…" : "Create role"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
