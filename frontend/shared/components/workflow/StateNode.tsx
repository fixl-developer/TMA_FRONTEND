/**
 * State Node Component
 * 
 * Custom node component for React Flow workflow designer.
 * Renders different node types with appropriate styling.
 */

"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import {
  Play,
  Settings,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"

const iconMap = {
  START: Play,
  PROCESS: Settings,
  DECISION: GitBranch,
  END: CheckCircle,
  ERROR: AlertCircle
}

const colorMap = {
  START: {
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-700",
    icon: "text-emerald-600"
  },
  PROCESS: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-700",
    icon: "text-blue-600"
  },
  DECISION: {
    bg: "bg-amber-100",
    border: "border-amber-300",
    text: "text-amber-700",
    icon: "text-amber-600"
  },
  END: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-700",
    icon: "text-purple-600"
  },
  ERROR: {
    bg: "bg-red-100",
    border: "border-red-300",
    text: "text-red-700",
    icon: "text-red-600"
  }
}

export const StateNode = memo(({ data, selected }: NodeProps) => {
  const type = data.type || "PROCESS"
  const Icon = iconMap[type as keyof typeof iconMap] || Settings
  const colors = colorMap[type as keyof typeof colorMap] || colorMap.PROCESS

  return (
    <div
      className={`
        min-w-[200px] rounded-lg border-2 bg-white shadow-md transition-all
        ${selected ? "ring-2 ring-blue-400 ring-offset-2" : ""}
        ${colors.border}
      `}
    >
      {/* Input Handle */}
      {type !== "START" && (
        <Handle
          type="target"
          position={Position.Top}
          className="!h-3 !w-3 !bg-slate-400"
        />
      )}

      {/* Node Content */}
      <div className={`rounded-t-lg ${colors.bg} px-3 py-2`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${colors.icon}`} />
          <span className={`text-xs font-semibold uppercase ${colors.text}`}>
            {type}
          </span>
        </div>
      </div>

      <div className="px-3 py-2">
        <p className="font-semibold text-slate-800 text-sm">
          {data.label}
        </p>
        {data.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {data.description}
          </p>
        )}
        
        {/* SLA Indicator */}
        {data.sla && (
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
            <Clock className="h-3 w-3" />
            <span>SLA: {data.sla.duration}</span>
          </div>
        )}

        {/* Actions Count */}
        {data.actions && data.actions.length > 0 && (
          <div className="mt-2 text-xs text-slate-500">
            {data.actions.length} action{data.actions.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Output Handle */}
      {type !== "END" && type !== "ERROR" && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-3 !w-3 !bg-slate-400"
        />
      )}
    </div>
  )
})

StateNode.displayName = "StateNode"
