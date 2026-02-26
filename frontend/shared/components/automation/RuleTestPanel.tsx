"use client"

import { useState } from "react"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

interface RuleTestPanelProps {
  rule: any
}

export function RuleTestPanel({ rule }: RuleTestPanelProps) {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  async function runTest() {
    setTesting(true)
    setTestResult(null)

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock test result
    const success = Math.random() > 0.3
    setTestResult({
      success,
      executionId: `test_${Date.now()}`,
      duration: `${Math.floor(Math.random() * 2000) + 500}ms`,
      timestamp: new Date().toISOString(),
      logs: [
        { level: "INFO", message: "Rule execution started", timestamp: new Date().toISOString() },
        { level: "INFO", message: "Trigger validated successfully", timestamp: new Date().toISOString() },
        { level: "INFO", message: `Evaluating ${rule.conditions.length} conditions`, timestamp: new Date().toISOString() },
        success
          ? { level: "INFO", message: "All conditions passed", timestamp: new Date().toISOString() }
          : { level: "ERROR", message: "Condition evaluation failed", timestamp: new Date().toISOString() },
        success
          ? { level: "INFO", message: `Executing ${rule.actions.length} actions`, timestamp: new Date().toISOString() }
          : { level: "WARN", message: "Skipping actions due to condition failure", timestamp: new Date().toISOString() },
        success
          ? { level: "INFO", message: "Rule execution completed successfully", timestamp: new Date().toISOString() }
          : { level: "ERROR", message: "Rule execution failed", timestamp: new Date().toISOString() }
      ]
    })

    setTesting(false)
  }

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Test Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Test Data (JSON)</label>
            <textarea
              className="w-full mt-2 px-3 py-2 border rounded-md font-mono text-sm"
              rows={8}
              placeholder={JSON.stringify({
                entityId: "test_123",
                entityType: rule.trigger.entity || "Entity",
                data: {
                  status: "PENDING",
                  amount: 1500,
                  createdAt: new Date().toISOString()
                }
              }, null, 2)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Provide test data that matches your trigger and conditions
            </p>
          </div>

          <Button onClick={runTest} disabled={testing} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            {testing ? "Running Test..." : "Run Test"}
          </Button>
        </div>
      </Card>

      {/* Test Result */}
      {testResult && (
        <>
          <Card className={`p-6 ${testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex items-start gap-3">
              {testResult.success ? (
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold ${testResult.success ? "text-green-900" : "text-red-900"}`}>
                  {testResult.success ? "Test Passed" : "Test Failed"}
                </h3>
                <p className={`text-sm mt-1 ${testResult.success ? "text-green-700" : "text-red-700"}`}>
                  {testResult.success
                    ? "Rule executed successfully with test data"
                    : "Rule execution failed - check logs below"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{testResult.duration}</span>
                  </div>
                  <Badge variant="outline">{testResult.executionId}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Execution Logs */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Execution Logs</h3>
            <div className="space-y-2 font-mono text-sm">
              {testResult.logs.map((log: any, index: number) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.level === "ERROR"
                      ? "bg-red-50 text-red-900"
                      : log.level === "WARN"
                      ? "bg-yellow-50 text-yellow-900"
                      : "bg-muted"
                  }`}
                >
                  <span className="font-semibold">[{log.level}]</span> {log.message}
                </div>
              ))}
            </div>
          </Card>

          {/* Rule Summary */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-4">Rule Summary</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Trigger:</span>{" "}
                <Badge>{rule.trigger.type}</Badge>
                {rule.trigger.event && (
                  <code className="ml-2 px-2 py-1 bg-background rounded">{rule.trigger.event}</code>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">Conditions:</span>{" "}
                <span className="font-medium">{rule.conditions.length} condition(s)</span>
              </div>
              <div>
                <span className="text-muted-foreground">Actions:</span>{" "}
                <span className="font-medium">{rule.actions.length} action(s)</span>
              </div>
              <div>
                <span className="text-muted-foreground">Guardrails:</span>{" "}
                <span className="font-medium">
                  {rule.guardrails.idempotency ? "Idempotent" : "Non-idempotent"}, 
                  {rule.guardrails.maxRetries} retries, 
                  {rule.guardrails.timeout} timeout
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Test Tips */}
      {!testResult && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Testing Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Provide realistic test data that matches your entity structure</li>
                <li>• Test both success and failure scenarios</li>
                <li>• Verify that conditions evaluate correctly</li>
                <li>• Check that actions execute in the expected order</li>
                <li>• Review execution logs for any warnings or errors</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
