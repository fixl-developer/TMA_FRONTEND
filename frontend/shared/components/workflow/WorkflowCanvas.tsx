/**
 * Workflow Canvas Component
 * 
 * React Flow-based visual workflow designer.
 * Allows drag-and-drop creation of state machine workflows.
 */

"use client"

import { useCallback, useState } from "react"
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeTypes,
  EdgeTypes
} from "reactflow"
import "reactflow/dist/style.css"
import { StateNode } from "./StateNode"
import { TransitionEdge } from "./TransitionEdge"
import type { WorkflowState, WorkflowTransition } from "@/data/seed/workflows"

interface WorkflowCanvasProps {
  initialStates?: WorkflowState[]
  initialTransitions?: WorkflowTransition[]
  onStatesChange?: (states: WorkflowState[]) => void
  onTransitionsChange?: (transitions: WorkflowTransition[]) => void
  onNodeSelect?: (node: Node | null) => void
  onEdgeSelect?: (edge: Edge | null) => void
  readOnly?: boolean
}

// Convert workflow states to React Flow nodes
function statesToNodes(states: WorkflowState[]): Node[] {
  return states.map((state, index) => ({
    id: state.id,
    type: state.type.toLowerCase(),
    position: { x: 250 + (index % 3) * 300, y: 100 + Math.floor(index / 3) * 200 },
    data: {
      label: state.name,
      description: state.description,
      type: state.type,
      actions: state.actions,
      sla: state.sla
    }
  }))
}

// Convert workflow transitions to React Flow edges
function transitionsToEdges(transitions: WorkflowTransition[]): Edge[] {
  return transitions.map((transition) => ({
    id: transition.id,
    source: transition.from,
    target: transition.to,
    type: "custom",
    label: transition.label,
    data: {
      condition: transition.condition,
      requiresApproval: transition.requiresApproval,
      approvers: transition.approvers
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20
    }
  }))
}

// Custom node types
const nodeTypes: NodeTypes = {
  start: StateNode,
  process: StateNode,
  decision: StateNode,
  end: StateNode,
  error: StateNode
}

// Custom edge types
const edgeTypes: EdgeTypes = {
  custom: TransitionEdge
}

export function WorkflowCanvas({
  initialStates = [],
  initialTransitions = [],
  onStatesChange,
  onTransitionsChange,
  onNodeSelect,
  onEdgeSelect,
  readOnly = false
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(statesToNodes(initialStates))
  const [edges, setEdges, onEdgesChange] = useEdgesState(transitionsToEdges(initialTransitions))
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return
      
      const newEdge = {
        ...params,
        id: `T${edges.length + 1}`,
        type: "custom",
        label: "New Transition",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20
        }
      }
      
      setEdges((eds) => addEdge(newEdge, eds))
      
      // Notify parent
      if (onTransitionsChange) {
        const transitions: WorkflowTransition[] = [...edges, newEdge].map((edge) => ({
          id: edge.id,
          from: edge.source,
          to: edge.target,
          label: edge.label as string || "Transition",
          condition: edge.data?.condition,
          requiresApproval: edge.data?.requiresApproval,
          approvers: edge.data?.approvers
        }))
        onTransitionsChange(transitions)
      }
    },
    [edges, setEdges, onTransitionsChange, readOnly]
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
      setSelectedEdge(null)
      onNodeSelect?.(node)
    },
    [onNodeSelect]
  )

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge)
      setSelectedNode(null)
      onEdgeSelect?.(edge)
    },
    [onEdgeSelect]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    onNodeSelect?.(null)
    onEdgeSelect?.(null)
  }, [onNodeSelect, onEdgeSelect])

  const addNode = useCallback(
    (type: string) => {
      if (readOnly) return

      const newNode: Node = {
        id: `state_${Date.now()}`,
        type: type.toLowerCase(),
        position: { x: 250 + nodes.length * 50, y: 100 + nodes.length * 50 },
        data: {
          label: `New ${type} State`,
          description: "",
          type: type.toUpperCase(),
          actions: [],
          sla: undefined
        }
      }

      setNodes((nds) => [...nds, newNode])

      // Notify parent
      if (onStatesChange) {
        const states: WorkflowState[] = [...nodes, newNode].map((node) => ({
          id: node.id,
          name: node.data.label,
          type: node.data.type,
          description: node.data.description || "",
          actions: node.data.actions,
          sla: node.data.sla
        }))
        onStatesChange(states)
      }
    },
    [nodes, setNodes, onStatesChange, readOnly]
  )

  const deleteSelected = useCallback(() => {
    if (readOnly) return

    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
      setSelectedNode(null)
      onNodeSelect?.(null)
    }

    if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id))
      setSelectedEdge(null)
      onEdgeSelect?.(null)
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges, onNodeSelect, onEdgeSelect, readOnly])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-50"
      >
        <Background color="#94a3b8" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "start":
                return "#10b981"
              case "process":
                return "#3b82f6"
              case "decision":
                return "#f59e0b"
              case "end":
                return "#8b5cf6"
              case "error":
                return "#ef4444"
              default:
                return "#64748b"
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>

      {/* Toolbar */}
      {!readOnly && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <button
            onClick={() => addNode("START")}
            className="rounded bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
          >
            + Start
          </button>
          <button
            onClick={() => addNode("PROCESS")}
            className="rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
          >
            + Process
          </button>
          <button
            onClick={() => addNode("DECISION")}
            className="rounded bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200"
          >
            + Decision
          </button>
          <button
            onClick={() => addNode("END")}
            className="rounded bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-200"
          >
            + End
          </button>
          <button
            onClick={() => addNode("ERROR")}
            className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
          >
            + Error
          </button>
          {(selectedNode || selectedEdge) && (
            <button
              onClick={deleteSelected}
              className="ml-2 rounded bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
