"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Badge } from "@/shared/components/ui/badge"
import { 
  ArrowLeft, Save, Play, Zap, Filter, Settings, 
  Plus, Trash2, Copy, AlertCircle
} from "lucide-react"
import { TriggerBuilder } from "@/shared/components/automation/TriggerBuilder"
import { ConditionBuilder } from "@/shared/components/automation/ConditionBuilder"
import { ActionBuilder } from "@/shared/components/automation/ActionBuilder"
import { GuardrailsConfig } from "@/shared/components/automation/GuardrailsConfig"
import { RuleTestPanel } from "@/shared/components/automation/RuleTestPanel"

export default function RuleBuilderPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [saving, setSaving] = useState(false)

  // Rule state
  const [rule, setRule] = useState({
    name: "",
    description: "",
    pack: "",
    category: "",
    priority: "MEDIUM" as const,
    enabled: true,
    trigger: {
      type: "EVENT" as const,
      event: "",
      entity: ""
    },
    conditions: [] as any[],
    actions: [] as any[],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "30s"
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateRule() {
    const newErrors: Record<string, string> = {}

    if (!rule.name) newErrors.name = "Rule name is required"
    if (!rule.description) newErrors.description = "Description is required"
    if (!rule.pack) newErrors.pack = "Pack selection is required"
    if (!rule.trigger.event && rule.trigger.type === "EVENT") {
      newErrors.trigger = "Event name is required"
    }
    if (rule.actions.length === 0) {
      newErrors.actions = "At least one action is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSave() {
    if (!validateRule()) {
      return
    }

    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    
    router.push("/superadmin/automation/rules")
  }

  function handleTest() {
    if (!validateRule()) {
      return
    }
    setActiveTab("test")
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/automation/rules")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Rule Builder</span>
            <Badge variant="secondary">New Rule</Badge>
          </div>
        }
        description="Create a new automation rule with triggers, conditions, and actions"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="h-4 w-4 mr-2" />
              Test Rule
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Rule"}
            </Button>
          </div>
        }
      />

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <PageSection>
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(errors).map(([key, message]) => (
                    <li key={key}>• {message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </PageSection>
      )}

      {/* Tabs */}
      <PageSection>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basic">
              <Settings className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="trigger">
              <Zap className="h-4 w-4 mr-2" />
              Trigger
            </TabsTrigger>
            <TabsTrigger value="conditions">
              <Filter className="h-4 w-4 mr-2" />
              Conditions
            </TabsTrigger>
            <TabsTrigger value="actions">
              <Settings className="h-4 w-4 mr-2" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="guardrails">
              <AlertCircle className="h-4 w-4 mr-2" />
              Guardrails
            </TabsTrigger>
            <TabsTrigger value="test">
              <Play className="h-4 w-4 mr-2" />
              Test
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="mt-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Rule Name *</Label>
                    <Input
                      id="name"
                      value={rule.name}
                      onChange={(e) => setRule({ ...rule, name: e.target.value })}
                      placeholder="e.g., Notify on New Inquiry"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pack">Automation Pack *</Label>
                    <select
                      id="pack"
                      value={rule.pack}
                      onChange={(e) => setRule({ ...rule, pack: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.pack ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select a pack...</option>
                      <option value="PACK_CORE_OPS">Core Ops Pack</option>
                      <option value="PACK_APPROVALS">Approvals Pack</option>
                      <option value="PACK_FINANCE">Finance Pack</option>
                      <option value="PACK_CHANGE_CONTROL">Change Control Pack</option>
                      <option value="PACK_PRIVACY">Privacy Pack</option>
                      <option value="PACK_DISPUTES">Disputes Pack</option>
                      <option value="PACK_STAFFING">Staffing Pack</option>
                      <option value="PACK_PAGEANT_INTEGRITY">Pageant Integrity Pack</option>
                      <option value="PACK_CONTENT_SAFETY">Content Safety Pack</option>
                      <option value="PACK_VENDOR_PROCUREMENT">Vendor Procurement Pack</option>
                      <option value="PACK_LOGISTICS">Logistics Pack</option>
                    </select>
                    {errors.pack && (
                      <p className="text-sm text-red-600 mt-1">{errors.pack}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={rule.description}
                    onChange={(e) => setRule({ ...rule, description: e.target.value })}
                    placeholder="Describe what this rule does..."
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.description ? "border-red-500" : ""
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={rule.category}
                      onChange={(e) => setRule({ ...rule, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select category...</option>
                      <option value="Notifications">Notifications</option>
                      <option value="Reminders">Reminders</option>
                      <option value="Escalations">Escalations</option>
                      <option value="Approvals">Approvals</option>
                      <option value="Finance">Finance</option>
                      <option value="Audit">Audit</option>
                      <option value="Privacy">Privacy</option>
                      <option value="Disputes">Disputes</option>
                      <option value="Staffing">Staffing</option>
                      <option value="Integrity">Integrity</option>
                      <option value="Safety">Safety</option>
                      <option value="Analytics">Analytics</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={rule.priority}
                      onChange={(e) => setRule({ ...rule, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="enabled">Status</Label>
                    <select
                      id="enabled"
                      value={rule.enabled ? "enabled" : "disabled"}
                      onChange={(e) => setRule({ ...rule, enabled: e.target.value === "enabled" })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Trigger Tab */}
          <TabsContent value="trigger" className="mt-6">
            <TriggerBuilder
              trigger={rule.trigger}
              onChange={(trigger) => setRule({ ...rule, trigger })}
              error={errors.trigger}
            />
          </TabsContent>

          {/* Conditions Tab */}
          <TabsContent value="conditions" className="mt-6">
            <ConditionBuilder
              conditions={rule.conditions}
              onChange={(conditions) => setRule({ ...rule, conditions })}
            />
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="mt-6">
            <ActionBuilder
              actions={rule.actions}
              onChange={(actions) => setRule({ ...rule, actions })}
              error={errors.actions}
            />
          </TabsContent>

          {/* Guardrails Tab */}
          <TabsContent value="guardrails" className="mt-6">
            <GuardrailsConfig
              guardrails={rule.guardrails}
              onChange={(guardrails) => setRule({ ...rule, guardrails })}
            />
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test" className="mt-6">
            <RuleTestPanel rule={rule} />
          </TabsContent>
        </Tabs>
      </PageSection>
    </PageLayout>
  )
}
