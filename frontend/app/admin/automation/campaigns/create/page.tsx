"use client"

import { useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Workflow, Plus, Trash2 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function CreateAutomationCampaignPage() {
  const [name, setName] = useState("")
  const [stages, setStages] = useState<{ name: string; trigger: string; actions: string }[]>([
    { name: "", trigger: "", actions: "" },
  ])

  const addStage = () => {
    setStages((s) => [...s, { name: "", trigger: "", actions: "" }])
  }

  const removeStage = (i: number) => {
    setStages((s) => s.filter((_, idx) => idx !== i))
  }

  const updateStage = (i: number, field: "name" | "trigger" | "actions", value: string) => {
    setStages((s) => {
      const next = [...s]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/automation/campaigns">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
            ← Campaigns
          </Button>
        </Link>
        <PageBanner
          title="Create automation campaign"
          subtitle="Wizard: stages, actions, targeting."
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" /> Campaign details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Campaign name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pageant Registration Flow"
              className="mt-1"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Stages</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStage}>
                <Plus className="mr-1 h-4 w-4" /> Add stage
              </Button>
            </div>
            <div className="space-y-4">
              {stages.map((stage, i) => (
                <div
                  key={i}
                  className="flex flex-wrap gap-4 rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs">Stage name</Label>
                    <Input
                      value={stage.name}
                      onChange={(e) => updateStage(i, "name", e.target.value)}
                      placeholder="e.g. Registration received"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs">Trigger</Label>
                    <Input
                      value={stage.trigger}
                      onChange={(e) => updateStage(i, "trigger", e.target.value)}
                      placeholder="e.g. pageant.registered"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs">Actions (comma-separated)</Label>
                    <Input
                      value={stage.actions}
                      onChange={(e) => updateStage(i, "actions", e.target.value)}
                      placeholder="e.g. send_email, notify"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStage(i)}
                      disabled={stages.length <= 1}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" disabled>
              Create (UI only)
            </Button>
            <Link href="/admin/automation/campaigns">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
