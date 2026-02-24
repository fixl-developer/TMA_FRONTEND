"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Wrench, Save } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchAutomationPacks } from "@/shared/state/automationSlice"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function AutomationBuilderPage() {
  const dispatch = useAppDispatch()
  const { packs } = useAppSelector((s) => s.automation)
  const [name, setName] = useState("")

  useEffect(() => {
    if (!packs.length) dispatch(fetchAutomationPacks())
  }, [dispatch, packs.length])
  const [description, setDescription] = useState("")
  const [packId, setPackId] = useState("")
  const [triggerType, setTriggerType] = useState("EVENT")
  const [triggerEvent, setTriggerEvent] = useState("")
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Enter a rule name.", "warning")
      return
    }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      showToast("Rule saved as draft (UI only – backend integration later).", "success")
    } catch {
      showToast("Failed to save rule.", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Rule builder"
        description="Configure trigger, conditions, and actions. Full visual condition builder and test mode coming with API integration."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Wrench className="h-3.5 w-3.5 text-[#0078d4]" />
            Builder
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/automation"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Overview</Link>
          </Button>
        }
      />

      <PageSection title="New rule">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic info</CardTitle>
            <p className="text-sm text-[#605e5c]">Name, description, and pack. Conditions and actions can be added in a future iteration.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Name</Label>
                <Input
                  id="rule-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Notify on contract signed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule-pack">Pack</Label>
                <select
                  id="rule-pack"
                  value={packId}
                  onChange={(e) => setPackId(e.target.value)}
                  className="w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select pack</option>
                  {packs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-desc">Description</Label>
              <textarea
                id="rule-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm"
                placeholder="What does this rule do?"
              />
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Trigger">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label>Trigger type</Label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="w-full max-w-xs rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm"
              >
                <option value="EVENT">Event</option>
                <option value="SCHEDULE">Schedule</option>
                <option value="MANUAL">Manual</option>
                <option value="WEBHOOK">Webhook</option>
              </select>
            </div>
            {triggerType === "EVENT" && (
              <div className="space-y-2">
                <Label htmlFor="trigger-event">Event name</Label>
                <Input
                  id="trigger-event"
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  placeholder="e.g. contract.signed"
                />
              </div>
            )}
            {triggerType === "SCHEDULE" && (
              <div className="space-y-2">
                <Label htmlFor="trigger-schedule">Cron expression</Label>
                <Input
                  id="trigger-schedule"
                  placeholder="e.g. 0 9 * * *"
                  className="font-mono"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Conditions & actions (coming soon)">
        <Card>
          <CardContent className="py-8 text-center text-sm text-[#605e5c]">
            Visual condition builder (AND/OR, field comparisons) and action configurator will be added with API integration.
          </CardContent>
        </Card>
      </PageSection>

      <PageSection>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving…" : "Save draft"}
        </Button>
      </PageSection>
    </PageLayout>
  )
}
