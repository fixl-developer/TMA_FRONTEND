/**
 * Action Panel Component
 * 
 * Configuration panel for workflow states, transitions, actions, and guardrails.
 * Displays in a side panel when a node or edge is selected.
 */

"use client"

import { useState } from "react"
import { Node, Edge } from "reactflow"
import {
  X,
  Settings,
  GitBranch,
  Shield,
  Clock,
  Bell,
  Webhook,
  Mail,
  CheckSquare,
  Plus,
  Trash2
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Switch } from "@/shared/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"

interface ActionPanelProps {
  selectedNode: Node | null
  selectedEdge: Edge | null
  onClose: () => void
  onUpdateNode?: (nodeId: string, data: any) => void
  onUpdateEdge?: (edgeId: string, data: any) => void
}

export function ActionPanel({
  selectedNode,
  selectedEdge,
  onClose,
  onUpdateNode,
  onUpdateEdge
}: ActionPanelProps) {
  const [nodeData, setNodeData] = useState(selectedNode?.data || {})
  const [edgeData, setEdgeData] = useState(selectedEdge?.data || {})

  if (!selectedNode && !selectedEdge) {
    return null
  }

  const handleNodeUpdate = (field: string, value: any) => {
    const updated = { ...nodeData, [field]: value }
    setNodeData(updated)
    if (selectedNode && onUpdateNode) {
      onUpdateNode(selectedNode.id, updated)
    }
  }

  const handleEdgeUpdate = (field: string, value: any) => {
    const updated = { ...edgeData, [field]: value }
    setEdgeData(updated)
    if (selectedEdge && onUpdateEdge) {
      onUpdateEdge(selectedEdge.id, updated)
    }
  }

  return (
    <div className="absolute right-0 top-0 z-20 h-full w-96 overflow-y-auto border-l border-slate-200 bg-white shadow-lg">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h3 className="font-semibold text-slate-800">
          {selectedNode ? "State Configuration" : "Transition Configuration"}
        </h3>
        <button
          onClick={onClose}
          className="rounded p-1 hover:bg-slate-100"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Node Configuration */}
        {selectedNode && (
          <>
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="node-label">State Name</Label>
                  <Input
                    id="node-label"
                    value={nodeData.label || ""}
                    onChange={(e) => handleNodeUpdate("label", e.target.value)}
                    placeholder="Enter state name"
                  />
                </div>
                <div>
                  <Label htmlFor="node-description">Description</Label>
                  <Textarea
                    id="node-description"
                    value={nodeData.description || ""}
                    onChange={(e) => handleNodeUpdate("description", e.target.value)}
                    placeholder="Describe this state"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>State Type</Label>
                  <Badge className="mt-1">
                    {nodeData.type || "PROCESS"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* SLA Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  SLA Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sla-enabled">Enable SLA</Label>
                  <Switch
                    id="sla-enabled"
                    checked={!!nodeData.sla}
                    onCheckedChange={(checked) => {
                      handleNodeUpdate("sla", checked ? { duration: "24h", escalation: "" } : undefined)
                    }}
                  />
                </div>
                {nodeData.sla && (
                  <>
                    <div>
                      <Label htmlFor="sla-duration">Duration</Label>
                      <Input
                        id="sla-duration"
                        value={nodeData.sla.duration || ""}
                        onChange={(e) => handleNodeUpdate("sla", { ...nodeData.sla, duration: e.target.value })}
                        placeholder="e.g., 24h, 48h, 7d"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sla-escalation">Escalation Action</Label>
                      <Input
                        id="sla-escalation"
                        value={nodeData.sla.escalation || ""}
                        onChange={(e) => handleNodeUpdate("sla", { ...nodeData.sla, escalation: e.target.value })}
                        placeholder="What happens on breach"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Actions
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const actions = nodeData.actions || []
                      handleNodeUpdate("actions", [...actions, "new_action"])
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(!nodeData.actions || nodeData.actions.length === 0) ? (
                  <p className="text-sm text-slate-500">No actions configured</p>
                ) : (
                  <div className="space-y-2">
                    {nodeData.actions.map((action: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={action}
                          onChange={(e) => {
                            const updated = [...nodeData.actions]
                            updated[index] = e.target.value
                            handleNodeUpdate("actions", updated)
                          }}
                          placeholder="Action name"
                        />
                        <button
                          onClick={() => {
                            const updated = nodeData.actions.filter((_: any, i: number) => i !== index)
                            handleNodeUpdate("actions", updated)
                          }}
                          className="rounded p-1 hover:bg-slate-100"
                        >
                          <Trash2 className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Edge Configuration */}
        {selectedEdge && (
          <>
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <GitBranch className="h-4 w-4" />
                  Transition Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="edge-label">Transition Label</Label>
                  <Input
                    id="edge-label"
                    value={selectedEdge.label || ""}
                    onChange={(e) => {
                      if (selectedEdge && onUpdateEdge) {
                        onUpdateEdge(selectedEdge.id, { ...edgeData, label: e.target.value })
                      }
                    }}
                    placeholder="Enter transition label"
                  />
                </div>
                <div>
                  <Label htmlFor="edge-condition">Condition (optional)</Label>
                  <Textarea
                    id="edge-condition"
                    value={edgeData.condition || ""}
                    onChange={(e) => handleEdgeUpdate("condition", e.target.value)}
                    placeholder="e.g., payment.status === 'COMPLETED'"
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Approval Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  Approval Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requires-approval">Requires Approval</Label>
                  <Switch
                    id="requires-approval"
                    checked={edgeData.requiresApproval || false}
                    onCheckedChange={(checked) => handleEdgeUpdate("requiresApproval", checked)}
                  />
                </div>
                {edgeData.requiresApproval && (
                  <div>
                    <Label htmlFor="approvers">Approvers (comma-separated)</Label>
                    <Input
                      id="approvers"
                      value={edgeData.approvers?.join(", ") || ""}
                      onChange={(e) => {
                        const approvers = e.target.value.split(",").map(a => a.trim()).filter(Boolean)
                        handleEdgeUpdate("approvers", approvers)
                      }}
                      placeholder="e.g., Admin, Finance Manager"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transition Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">From:</span>
                  <Badge variant="outline">{selectedEdge.source}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">To:</span>
                  <Badge variant="outline">{selectedEdge.target}</Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
