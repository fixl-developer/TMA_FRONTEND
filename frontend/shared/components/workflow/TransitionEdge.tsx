/**
 * Transition Edge Component
 * 
 * Custom edge component for React Flow workflow designer.
 * Displays transition labels, conditions, and approval requirements.
 */

"use client"

import { memo } from "react"
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge
} from "reactflow"
import { Shield, GitBranch } from "lucide-react"

export const TransitionEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
  selected
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? "#3b82f6" : "#94a3b8",
          strokeWidth: selected ? 3 : 2
        }}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all"
          }}
          className="nodrag nopan"
        >
          <div
            className={`
              rounded-md border bg-white px-2 py-1 text-xs font-medium shadow-sm
              ${selected ? "border-blue-400 ring-2 ring-blue-200" : "border-slate-200"}
            `}
          >
            <div className="flex items-center gap-1">
              {data?.requiresApproval && (
                <Shield className="h-3 w-3 text-amber-500" />
              )}
              {data?.condition && (
                <GitBranch className="h-3 w-3 text-blue-500" />
              )}
              <span className="text-slate-700">{label}</span>
            </div>
            
            {/* Condition */}
            {data?.condition && (
              <div className="mt-1 text-xs text-slate-500 font-mono">
                {data.condition}
              </div>
            )}
            
            {/* Approvers */}
            {data?.requiresApproval && data?.approvers && (
              <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                <Shield className="h-3 w-3" />
                <span>{data.approvers.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
})

TransitionEdge.displayName = "TransitionEdge"
