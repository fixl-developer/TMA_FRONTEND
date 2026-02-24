"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Workflow, Plus, Trash2 } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton } from "@/shared/components/admin/AdminPageLayout"

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
    <AdminPageWrapper>
      <AdminPageLayout
        title="Create automation campaign"
        subtitle="Wizard: stages, actions, targeting."
        actions={
          <Link href="/admin/automation/campaigns">
            <AdminButton variant="outline">← Campaigns</AdminButton>
          </Link>
        }
      >
        <AdminCard>
          <div className="flex items-center gap-2 mb-6">
            <Workflow className="h-5 w-5 text-[#d4ff00]" />
            <h3 className="text-lg font-semibold text-white">Campaign details</h3>
          </div>
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white">Campaign name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pageant Registration Flow"
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-white">Stages</Label>
                <AdminButton type="button" variant="outline" size="sm" onClick={addStage}>
                  <Plus className="mr-1 h-4 w-4" /> Add stage
                </AdminButton>
              </div>
              <div className="space-y-4">
                {stages.map((stage, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-xs text-white/60">Stage name</Label>
                      <Input
                        value={stage.name}
                        onChange={(e) => updateStage(i, "name", e.target.value)}
                        placeholder="e.g. Registration received"
                        className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-xs text-white/60">Trigger</Label>
                      <Input
                        value={stage.trigger}
                        onChange={(e) => updateStage(i, "trigger", e.target.value)}
                        placeholder="e.g. pageant.registered"
                        className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-xs text-white/60">Actions (comma-separated)</Label>
                      <Input
                        value={stage.actions}
                        onChange={(e) => updateStage(i, "actions", e.target.value)}
                        placeholder="e.g. send_email, notify"
                        className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="flex items-end">
                      <AdminButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStage(i)}
                        disabled={stages.length <= 1}
                        className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <AdminButton disabled>
                Create (UI only)
              </AdminButton>
              <Link href="/admin/automation/campaigns">
                <AdminButton variant="outline">Cancel</AdminButton>
              </Link>
            </div>
          </div>
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
