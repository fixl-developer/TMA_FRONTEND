"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Workflow as WorkflowIcon, Save } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function WorkflowDesignerPage() {
  const { showToast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Enter a workflow name.", "warning")
      return
    }
    setSaving(true)
    try {
      // Mock: no backend yet
      await new Promise((r) => setTimeout(r, 500))
      showToast("Workflow saved (UI only – backend integration later).", "success")
    } catch {
      showToast("Failed to save workflow.", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Workflow designer"
        description="Visual workflow builder: states, transitions, conditions. Full drag-and-drop and test mode coming with React Flow integration. This is a minimal form for Phase 1."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <WorkflowIcon className="h-3.5 w-3.5 text-[#0078d4]" />
            Designer
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/workflows"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Back to list</Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save draft"}
            </Button>
          </div>
        }
      />

      <PageSection title="New workflow">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic info</CardTitle>
            <p className="text-sm text-[#605e5c]">Name and description. State machine editor (drag-and-drop) will be added in a later iteration.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wf-name">Name</Label>
              <Input
                id="wf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Booking confirmation flow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wf-desc">Description</Label>
              <textarea
                id="wf-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="What does this workflow do?"
              />
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="State machine (coming soon)">
        <Card>
          <CardContent className="py-12 text-center text-sm text-[#605e5c]">
            <p className="font-medium text-[#323130]">Visual state machine designer</p>
            <p className="mt-1">Drag-and-drop states and transitions, condition/action configurator, validation rules, and test mode will be added with React Flow (or similar) in a future phase.</p>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
