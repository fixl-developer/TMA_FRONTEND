/**
 * Workflow Designer Page - Super Admin
 * 
 * Visual workflow designer using React Flow.
 * Create and edit state machine workflows with drag-and-drop interface.
 */

"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Play,
  Download,
  Upload,
  Eye,
  AlertCircle
} from "lucide-react"
import { Node, Edge } from "reactflow"
import { WorkflowCanvas } from "@/shared/components/workflow/WorkflowCanvas"
import { ActionPanel } from "@/shared/components/workflow/ActionPanel"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { PageLayout, PageHeader } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select"
import type { WorkflowState, WorkflowTransition } from "@/data/seed/workflows"

export default function WorkflowDesignerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const [workflowName, setWorkflowName] = useState("New Workflow")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [blueprint, setBlueprint] = useState("B1")
  const [category, setCategory] = useState("Commercial")
  const [trigger, setTrigger] = useState<"EVENT" | "STATE" | "SCHEDULE">("EVENT")
  
  const [states, setStates] = useState<WorkflowState[]>([])
  const [transitions, setTransitions] = useState<WorkflowTransition[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [showPanel, setShowPanel] = useState(false)

  const handleNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node)
    setSelectedEdge(null)
    setShowPanel(!!node)
  }, [])

  const handleEdgeSelect = useCallback((edge: Edge | null) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
    setShowPanel(!!edge)
  }, [])

  const handleSave = async () => {
    if (!workflowName.trim()) {
      showToast("Please enter a workflow name", "error")
      return
    }

    if (states.length === 0) {
      showToast("Please add at least one state", "error")
      return
    }

    // Validate workflow
    const hasStart = states.some(s => s.type === "START")
    const hasEnd = states.some(s => s.type === "END")

    if (!hasStart) {
      showToast("Workflow must have a START state", "error")
      return
    }

    if (!hasEnd) {
      showToast("Workflow must have at least one END state", "error")
      return
    }

    // In real implementation, this would save to backend
    showToast("Workflow saved successfully", "success")
  }

  const handleExport = () => {
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      blueprint,
      category,
      trigger,
      states,
      transitions,
      version: "1.0.0",
      createdAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, "_")}.json`
    a.click()
    URL.revokeObjectURL(url)

    showToast("Workflow exported successfully", "success")
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const workflow = JSON.parse(event.target?.result as string)
          setWorkflowName(workflow.name || "Imported Workflow")
          setWorkflowDescription(workflow.description || "")
          setBlueprint(workflow.blueprint || "B1")
          setCategory(workflow.category || "Commercial")
          setTrigger(workflow.trigger || "EVENT")
          setStates(workflow.states || [])
          setTransitions(workflow.transitions || [])
          showToast("Workflow imported successfully", "success")
        } catch (error) {
          showToast("Failed to import workflow", "error")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleTest = () => {
    showToast("Test execution started", "info")
    // In real implementation, this would trigger a test execution
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/workflows")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Workflow Designer</span>
          </div>
        }
        description="Visual state machine designer with drag-and-drop interface"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="mr-1.5 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="mr-1.5 h-4 w-4" />
              Test
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-1.5 h-4 w-4" />
              Save
            </Button>
          </div>
        }
      />

      {/* Workflow Configuration */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <Label htmlFor="workflow-description">Description</Label>
                <Input
                  id="workflow-description"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label htmlFor="blueprint">Blueprint</Label>
                <Select value={blueprint} onValueChange={setBlueprint}>
                  <SelectTrigger id="blueprint">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B1">B1 - Roster + Booking</SelectItem>
                    <SelectItem value="B2">B2 - Casting Pipeline</SelectItem>
                    <SelectItem value="B3">B3 - Pageant Season</SelectItem>
                    <SelectItem value="B4">B4 - Brand Deals</SelectItem>
                    <SelectItem value="B5">B5 - Course / Cohort</SelectItem>
                    <SelectItem value="B6">B6 - Project + Assets</SelectItem>
                    <SelectItem value="B7">B7 - Shift / Staffing</SelectItem>
                    <SelectItem value="B8">B8 - Community</SelectItem>
                    <SelectItem value="B9">B9 - Marketplace</SelectItem>
                    <SelectItem value="B10">B10 - Holding / Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Casting">Casting</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trigger">Trigger Type</Label>
                <Select value={trigger} onValueChange={(v) => setTrigger(v as any)}>
                  <SelectTrigger id="trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="STATE">State Change</SelectItem>
                    <SelectItem value="SCHEDULE">Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="mb-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">How to use the designer:</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>Click buttons at the bottom to add states (Start, Process, Decision, End, Error)</li>
                <li>Drag from the bottom of one state to the top of another to create transitions</li>
                <li>Click on a state or transition to configure it in the side panel</li>
                <li>Use the minimap (bottom-right) to navigate large workflows</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas */}
      <div className="relative h-[600px] overflow-hidden rounded-lg border border-slate-200 bg-white">
        <WorkflowCanvas
          initialStates={states}
          initialTransitions={transitions}
          onStatesChange={setStates}
          onTransitionsChange={setTransitions}
          onNodeSelect={handleNodeSelect}
          onEdgeSelect={handleEdgeSelect}
        />

        {/* Action Panel */}
        {showPanel && (
          <ActionPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onClose={() => {
              setShowPanel(false)
              setSelectedNode(null)
              setSelectedEdge(null)
            }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-500">States:</span>
                  <span className="ml-2 font-semibold text-slate-800">{states.length}</span>
                </div>
                <div>
                  <span className="text-slate-500">Transitions:</span>
                  <span className="ml-2 font-semibold text-slate-800">{transitions.length}</span>
                </div>
                <div>
                  <span className="text-slate-500">Start States:</span>
                  <span className="ml-2 font-semibold text-emerald-600">
                    {states.filter(s => s.type === "START").length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">End States:</span>
                  <span className="ml-2 font-semibold text-purple-600">
                    {states.filter(s => s.type === "END").length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {states.length > 0 && (
                  <span className="text-xs text-emerald-600">
                    ✓ Workflow has states
                  </span>
                )}
                {states.some(s => s.type === "START") && (
                  <span className="text-xs text-emerald-600">
                    ✓ Has START state
                  </span>
                )}
                {states.some(s => s.type === "END") && (
                  <span className="text-xs text-emerald-600">
                    ✓ Has END state
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
