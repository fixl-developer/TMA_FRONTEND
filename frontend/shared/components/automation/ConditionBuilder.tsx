"use client"

import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Plus, Trash2, Filter } from "lucide-react"

interface Condition {
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "exists"
  value: any
  logic?: "AND" | "OR"
}

interface ConditionBuilderProps {
  conditions: Condition[]
  onChange: (conditions: Condition[]) => void
}

export function ConditionBuilder({ conditions, onChange }: ConditionBuilderProps) {
  function addCondition() {
    onChange([
      ...conditions,
      {
        field: "",
        operator: "equals",
        value: "",
        logic: conditions.length > 0 ? "AND" : undefined
      }
    ])
  }

  function updateCondition(index: number, updates: Partial<Condition>) {
    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], ...updates }
    onChange(newConditions)
  }

  function removeCondition(index: number) {
    const newConditions = conditions.filter((_, i) => i !== index)
    // Remove logic from first condition if it exists
    if (newConditions.length > 0 && newConditions[0].logic) {
      newConditions[0] = { ...newConditions[0], logic: undefined }
    }
    onChange(newConditions)
  }

  const operators = [
    { value: "equals", label: "Equals (=)" },
    { value: "not_equals", label: "Not Equals (≠)" },
    { value: "greater_than", label: "Greater Than (>)" },
    { value: "less_than", label: "Less Than (<)" },
    { value: "contains", label: "Contains" },
    { value: "exists", label: "Exists" }
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Conditions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Define when this rule should execute (optional)
            </p>
          </div>
          <Button onClick={addCondition} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>

        {conditions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-2">No Conditions</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This rule will execute every time the trigger fires
            </p>
            <Button onClick={addCondition} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add First Condition
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <div key={index} className="space-y-3">
                {/* Logic Operator */}
                {index > 0 && condition.logic && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t" />
                    <select
                      value={condition.logic}
                      onChange={(e) => updateCondition(index, { logic: e.target.value as any })}
                      className="px-3 py-1 border rounded-md text-sm font-medium"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                    <div className="flex-1 border-t" />
                  </div>
                )}

                {/* Condition Row */}
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Field */}
                    <div>
                      <Label className="text-xs">Field</Label>
                      <Input
                        value={condition.field}
                        onChange={(e) => updateCondition(index, { field: e.target.value })}
                        placeholder="e.g., status, amount"
                        className="mt-1"
                      />
                    </div>

                    {/* Operator */}
                    <div>
                      <Label className="text-xs">Operator</Label>
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, { operator: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-md mt-1"
                      >
                        {operators.map(op => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Value */}
                    <div>
                      <Label className="text-xs">Value</Label>
                      <Input
                        value={condition.value}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                        placeholder="e.g., PENDING, 1000"
                        className="mt-1"
                        disabled={condition.operator === "exists"}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(index)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Common Condition Templates */}
      {conditions.length === 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Common Condition Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => onChange([{ field: "status", operator: "equals", value: "PENDING" }])}
              className="p-3 border rounded-lg text-left hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium text-sm mb-1">Status Check</div>
              <code className="text-xs text-muted-foreground">status = PENDING</code>
            </button>
            <button
              onClick={() => onChange([{ field: "amount", operator: "greater_than", value: "1000" }])}
              className="p-3 border rounded-lg text-left hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium text-sm mb-1">Amount Threshold</div>
              <code className="text-xs text-muted-foreground">amount &gt; 1000</code>
            </button>
            <button
              onClick={() => onChange([
                { field: "status", operator: "equals", value: "PENDING", logic: undefined },
                { field: "createdAt", operator: "less_than", value: "NOW-24h", logic: "AND" }
              ])}
              className="p-3 border rounded-lg text-left hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium text-sm mb-1">Pending & Overdue</div>
              <code className="text-xs text-muted-foreground">status = PENDING AND createdAt &lt; NOW-24h</code>
            </button>
            <button
              onClick={() => onChange([{ field: "assignedAgent", operator: "exists", value: true }])}
              className="p-3 border rounded-lg text-left hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium text-sm mb-1">Field Exists</div>
              <code className="text-xs text-muted-foreground">assignedAgent exists</code>
            </button>
          </div>
        </Card>
      )}

      {/* Conditions Preview */}
      {conditions.length > 0 && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">Conditions Preview</h3>
          <div className="space-y-2">
            {conditions.map((condition, index) => (
              <div key={index} className="text-sm">
                {index > 0 && condition.logic && (
                  <Badge variant="outline" className="mr-2">{condition.logic}</Badge>
                )}
                <code className="px-2 py-1 bg-background rounded">
                  {condition.field} {condition.operator.replace(/_/g, " ")} {condition.value}
                </code>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
