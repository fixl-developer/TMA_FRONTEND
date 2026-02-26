"use client"

import { Card } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Shield } from "lucide-react"

interface GuardrailsConfigProps {
  guardrails: {
    idempotency: boolean
    maxRetries: number
    timeout: string
    compensation?: string
  }
  onChange: (guardrails: any) => void
}

export function GuardrailsConfig({ guardrails, onChange }: GuardrailsConfigProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-semibold">Guardrails</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure reliability and safety mechanisms for this rule
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Idempotency */}
          <div>
            <Label htmlFor="idempotency">Idempotency</Label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="idempotency"
                checked={guardrails.idempotency}
                onChange={(e) => onChange({ ...guardrails, idempotency: e.target.checked })}
                className="h-4 w-4"
              />
              <div className="text-sm text-muted-foreground">
                Ensure this rule executes only once for the same trigger event
              </div>
            </div>
          </div>

          {/* Max Retries */}
          <div>
            <Label htmlFor="maxRetries">Max Retries</Label>
            <Input
              id="maxRetries"
              type="number"
              min="0"
              max="10"
              value={guardrails.maxRetries}
              onChange={(e) => onChange({ ...guardrails, maxRetries: parseInt(e.target.value) || 0 })}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Number of times to retry if execution fails (0-10)
            </p>
          </div>

          {/* Timeout */}
          <div>
            <Label htmlFor="timeout">Timeout</Label>
            <Input
              id="timeout"
              value={guardrails.timeout}
              onChange={(e) => onChange({ ...guardrails, timeout: e.target.value })}
              placeholder="e.g., 30s, 1m, 2m"
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Maximum execution time (e.g., 30s, 1m, 2m)
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onChange({ ...guardrails, timeout: "30s" })}
                className="px-2 py-1 text-xs border rounded hover:bg-muted"
              >
                30s
              </button>
              <button
                onClick={() => onChange({ ...guardrails, timeout: "60s" })}
                className="px-2 py-1 text-xs border rounded hover:bg-muted"
              >
                60s
              </button>
              <button
                onClick={() => onChange({ ...guardrails, timeout: "90s" })}
                className="px-2 py-1 text-xs border rounded hover:bg-muted"
              >
                90s
              </button>
              <button
                onClick={() => onChange({ ...guardrails, timeout: "120s" })}
                className="px-2 py-1 text-xs border rounded hover:bg-muted"
              >
                120s
              </button>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <Label htmlFor="compensation">Compensation Action (Optional)</Label>
            <Input
              id="compensation"
              value={guardrails.compensation || ""}
              onChange={(e) => onChange({ ...guardrails, compensation: e.target.value })}
              placeholder="e.g., rollback_transaction"
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Action to execute if this rule fails (for rollback scenarios)
            </p>
          </div>
        </div>
      </Card>

      {/* Guardrails Preview */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">Guardrails Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Idempotency:</span>
            <span className="font-medium">{guardrails.idempotency ? "Enabled" : "Disabled"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Max Retries:</span>
            <span className="font-medium">{guardrails.maxRetries}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Timeout:</span>
            <span className="font-medium">{guardrails.timeout}</span>
          </div>
          {guardrails.compensation && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Compensation:</span>
              <code className="px-2 py-1 bg-background rounded text-xs">{guardrails.compensation}</code>
            </div>
          )}
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h4 className="font-semibold text-blue-900 mb-2">Best Practices</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enable idempotency for all rules to prevent duplicate executions</li>
          <li>• Set appropriate retry counts based on action criticality</li>
          <li>• Use shorter timeouts for simple operations (30s)</li>
          <li>• Use longer timeouts for complex operations (90s-120s)</li>
          <li>• Define compensation actions for financial transactions</li>
        </ul>
      </Card>
    </div>
  )
}
