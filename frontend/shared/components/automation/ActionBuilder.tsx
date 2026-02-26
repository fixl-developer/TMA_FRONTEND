"use client"

import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Plus, Trash2, Bell, Webhook, Edit, CheckSquare, Mail, GitBranch } from "lucide-react"

interface Action {
  type: "NOTIFICATION" | "WEBHOOK" | "UPDATE_FIELD" | "CREATE_TASK" | "SEND_EMAIL" | "STATE_TRANSITION"
  config: Record<string, any>
}

interface ActionBuilderProps {
  actions: Action[]
  onChange: (actions: Action[]) => void
  error?: string
}

export function ActionBuilder({ actions, onChange, error }: ActionBuilderProps) {
  function addAction(type: Action["type"]) {
    const defaultConfigs = {
      NOTIFICATION: { template: "", recipients: [], priority: "MEDIUM" },
      WEBHOOK: { url: "", method: "POST" },
      UPDATE_FIELD: { field: "", value: "" },
      CREATE_TASK: { title: "", assignee: "" },
      SEND_EMAIL: { template: "", to: "" },
      STATE_TRANSITION: { toState: "" }
    }

    onChange([...actions, { type, config: defaultConfigs[type] }])
  }

  function updateAction(index: number, updates: Partial<Action>) {
    const newActions = [...actions]
    newActions[index] = { ...newActions[index], ...updates }
    onChange(newActions)
  }

  function removeAction(index: number) {
    onChange(actions.filter((_, i) => i !== index))
  }

  const actionTypes = [
    { value: "NOTIFICATION", label: "Notification", icon: Bell, color: "blue" },
    { value: "WEBHOOK", label: "Webhook", icon: Webhook, color: "purple" },
    { value: "UPDATE_FIELD", label: "Update Field", icon: Edit, color: "green" },
    { value: "CREATE_TASK", label: "Create Task", icon: CheckSquare, color: "orange" },
    { value: "SEND_EMAIL", label: "Send Email", icon: Mail, color: "red" },
    { value: "STATE_TRANSITION", label: "State Transition", icon: GitBranch, color: "indigo" }
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Actions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Define what happens when this rule executes
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Action Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {actionTypes.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.value}
                onClick={() => addAction(type.value as any)}
                className="p-3 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{type.label}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Actions List */}
        {actions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-2">No Actions</h4>
            <p className="text-sm text-muted-foreground">
              Add at least one action to define what this rule does
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((action, index) => {
              const actionType = actionTypes.find(t => t.value === action.type)
              const Icon = actionType?.icon || CheckSquare

              return (
                <div key={index} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <Badge>{actionType?.label}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>

                  {/* Action Configuration */}
                  <div className="space-y-3">
                    {action.type === "NOTIFICATION" && (
                      <>
                        <div>
                          <Label className="text-xs">Template</Label>
                          <Input
                            value={action.config.template || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, template: e.target.value }
                            })}
                            placeholder="e.g., new_inquiry"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Recipients (comma-separated)</Label>
                          <Input
                            value={Array.isArray(action.config.recipients) ? action.config.recipients.join(", ") : ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, recipients: e.target.value.split(",").map(r => r.trim()) }
                            })}
                            placeholder="e.g., agent, client"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Priority</Label>
                          <select
                            value={action.config.priority || "MEDIUM"}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, priority: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                          </select>
                        </div>
                      </>
                    )}

                    {action.type === "WEBHOOK" && (
                      <>
                        <div>
                          <Label className="text-xs">URL</Label>
                          <Input
                            value={action.config.url || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, url: e.target.value }
                            })}
                            placeholder="/api/endpoint"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Method</Label>
                          <select
                            value={action.config.method || "POST"}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, method: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                      </>
                    )}

                    {action.type === "UPDATE_FIELD" && (
                      <>
                        <div>
                          <Label className="text-xs">Field</Label>
                          <Input
                            value={action.config.field || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, field: e.target.value }
                            })}
                            placeholder="e.g., status"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Value</Label>
                          <Input
                            value={action.config.value || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, value: e.target.value }
                            })}
                            placeholder="e.g., APPROVED"
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    {action.type === "CREATE_TASK" && (
                      <>
                        <div>
                          <Label className="text-xs">Task Title</Label>
                          <Input
                            value={action.config.title || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, title: e.target.value }
                            })}
                            placeholder="e.g., Review booking"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Assignee</Label>
                          <Input
                            value={action.config.assignee || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, assignee: e.target.value }
                            })}
                            placeholder="e.g., manager"
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    {action.type === "SEND_EMAIL" && (
                      <>
                        <div>
                          <Label className="text-xs">Email Template</Label>
                          <Input
                            value={action.config.template || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, template: e.target.value }
                            })}
                            placeholder="e.g., booking_confirmation"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">To</Label>
                          <Input
                            value={action.config.to || ""}
                            onChange={(e) => updateAction(index, {
                              config: { ...action.config, to: e.target.value }
                            })}
                            placeholder="e.g., client.email"
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    {action.type === "STATE_TRANSITION" && (
                      <div>
                        <Label className="text-xs">To State</Label>
                        <Input
                          value={action.config.toState || ""}
                          onChange={(e) => updateAction(index, {
                            config: { ...action.config, toState: e.target.value }
                          })}
                          placeholder="e.g., APPROVED"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Actions Preview */}
      {actions.length > 0 && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">Actions Preview</h3>
          <div className="space-y-2">
            {actions.map((action, index) => (
              <div key={index} className="text-sm flex items-start gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <div>
                  <span className="font-medium">{action.type}</span>
                  <div className="text-muted-foreground text-xs mt-1">
                    {JSON.stringify(action.config, null, 2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
