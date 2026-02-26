"use client"

import { Card } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Zap, Calendar, Activity } from "lucide-react"

interface TriggerBuilderProps {
  trigger: {
    type: "EVENT" | "STATE" | "SCHEDULE"
    event?: string
    state?: string
    schedule?: string
    entity?: string
  }
  onChange: (trigger: any) => void
  error?: string
}

export function TriggerBuilder({ trigger, onChange, error }: TriggerBuilderProps) {
  const triggerTypes = [
    { value: "EVENT", label: "Event", icon: Zap, description: "Triggered when a specific event occurs" },
    { value: "STATE", label: "State Change", icon: Activity, description: "Triggered when entity state changes" },
    { value: "SCHEDULE", label: "Schedule", icon: Calendar, description: "Triggered on a schedule (cron)" }
  ]

  return (
    <div className="space-y-6">
      {/* Trigger Type Selection */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Trigger Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {triggerTypes.map((type) => {
            const Icon = type.icon
            const isSelected = trigger.type === type.value
            return (
              <button
                key={type.value}
                onClick={() => onChange({ ...trigger, type: type.value as any })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Trigger Configuration */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Trigger Configuration</h3>
        <div className="space-y-4">
          {/* Entity */}
          <div>
            <Label htmlFor="entity">Entity Type *</Label>
            <Input
              id="entity"
              value={trigger.entity || ""}
              onChange={(e) => onChange({ ...trigger, entity: e.target.value })}
              placeholder="e.g., Booking, Contract, User"
            />
            <p className="text-sm text-muted-foreground mt-1">
              The type of entity this rule applies to
            </p>
          </div>

          {/* Event Trigger */}
          {trigger.type === "EVENT" && (
            <div>
              <Label htmlFor="event">Event Name *</Label>
              <Input
                id="event"
                value={trigger.event || ""}
                onChange={(e) => onChange({ ...trigger, event: e.target.value })}
                placeholder="e.g., booking.created, payment.received"
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              <p className="text-sm text-muted-foreground mt-1">
                The event that triggers this rule (use dot notation)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, event: "booking.created" })}>
                  booking.created
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, event: "payment.received" })}>
                  payment.received
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, event: "contract.signed" })}>
                  contract.signed
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, event: "user.registered" })}>
                  user.registered
                </Badge>
              </div>
            </div>
          )}

          {/* State Trigger */}
          {trigger.type === "STATE" && (
            <div>
              <Label htmlFor="state">State Name *</Label>
              <Input
                id="state"
                value={trigger.state || ""}
                onChange={(e) => onChange({ ...trigger, state: e.target.value })}
                placeholder="e.g., status_changed, approved"
              />
              <p className="text-sm text-muted-foreground mt-1">
                The state change that triggers this rule
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, state: "status_changed" })}>
                  status_changed
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, state: "approved" })}>
                  approved
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, state: "completed" })}>
                  completed
                </Badge>
              </div>
            </div>
          )}

          {/* Schedule Trigger */}
          {trigger.type === "SCHEDULE" && (
            <div>
              <Label htmlFor="schedule">Cron Expression *</Label>
              <Input
                id="schedule"
                value={trigger.schedule || ""}
                onChange={(e) => onChange({ ...trigger, schedule: e.target.value })}
                placeholder="e.g., 0 9 * * * (daily at 9 AM)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Cron expression for scheduling (minute hour day month weekday)
              </p>
              <div className="mt-3 space-y-2">
                <div className="text-sm font-medium">Common Schedules:</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, schedule: "0 * * * *" })}>
                    Every hour
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, schedule: "0 9 * * *" })}>
                    Daily at 9 AM
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, schedule: "0 0 * * *" })}>
                    Daily at midnight
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, schedule: "0 0 * * 0" })}>
                    Weekly (Sunday)
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => onChange({ ...trigger, schedule: "*/15 * * * *" })}>
                    Every 15 minutes
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Trigger Preview */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">Trigger Preview</h3>
        <div className="text-sm space-y-2">
          <div>
            <span className="text-muted-foreground">Type:</span>{" "}
            <Badge>{trigger.type}</Badge>
          </div>
          {trigger.entity && (
            <div>
              <span className="text-muted-foreground">Entity:</span>{" "}
              <code className="px-2 py-1 bg-background rounded">{trigger.entity}</code>
            </div>
          )}
          {trigger.event && (
            <div>
              <span className="text-muted-foreground">Event:</span>{" "}
              <code className="px-2 py-1 bg-background rounded">{trigger.event}</code>
            </div>
          )}
          {trigger.state && (
            <div>
              <span className="text-muted-foreground">State:</span>{" "}
              <code className="px-2 py-1 bg-background rounded">{trigger.state}</code>
            </div>
          )}
          {trigger.schedule && (
            <div>
              <span className="text-muted-foreground">Schedule:</span>{" "}
              <code className="px-2 py-1 bg-background rounded">{trigger.schedule}</code>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
