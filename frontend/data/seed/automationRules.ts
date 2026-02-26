/**
 * Automation Rule Seed Data
 * 
 * 94 automation rules across 11 packs.
 * Each rule defines trigger, conditions, actions, and guardrails.
 * 
 * Source: updated.md - Automation Engine specifications
 */

export type AutomationRuleId = string

export type TriggerType = "EVENT" | "STATE" | "SCHEDULE"

export interface AutomationTrigger {
  type: TriggerType
  event?: string // For EVENT type
  state?: string // For STATE type
  schedule?: string // For SCHEDULE type (cron expression)
  entity?: string // Entity type (Booking, Contract, etc.)
}

export interface AutomationCondition {
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "exists"
  value: any
  logic?: "AND" | "OR"
}

export interface AutomationAction {
  type: "NOTIFICATION" | "WEBHOOK" | "UPDATE_FIELD" | "CREATE_TASK" | "SEND_EMAIL" | "STATE_TRANSITION"
  config: Record<string, any>
}

export interface AutomationGuardrail {
  idempotency: boolean
  maxRetries: number
  timeout: string
  compensation?: string
}

export interface AutomationRule {
  id: AutomationRuleId
  name: string
  description: string
  pack: string // Pack ID
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  guardrails: AutomationGuardrail
  enabled: boolean
  executions24h: number
  successRate: number
  category: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  createdAt: string
  updatedAt: string
}

export const seedAutomationRules: AutomationRule[] = [
  // PACK 1: Core Ops Pack (10 rules)
  {
    id: "RULE_NOTIFY_NEW_INQUIRY",
    name: "Notify on New Inquiry",
    description: "Send notification to assigned agent when new inquiry is received",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "EVENT",
      event: "inquiry.created",
      entity: "Inquiry"
    },
    conditions: [
      { field: "status", operator: "equals", value: "NEW", logic: "AND" },
      { field: "assignedAgent", operator: "exists", value: true }
    ],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "new_inquiry",
          recipients: ["assignedAgent"],
          priority: "HIGH"
        }
      },
      {
        type: "SEND_EMAIL",
        config: {
          template: "inquiry_notification",
          to: "assignedAgent.email"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 145,
    successRate: 98,
    category: "Notifications",
    priority: "HIGH",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REMINDER_PENDING_APPROVAL",
    name: "Reminder for Pending Approvals",
    description: "Send reminder if approval is pending for more than 24 hours",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 */6 * * *", // Every 6 hours
      entity: "Approval"
    },
    conditions: [
      { field: "status", operator: "equals", value: "PENDING", logic: "AND" },
      { field: "createdAt", operator: "less_than", value: "NOW-24h" }
    ],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "approval_reminder",
          recipients: ["approver"],
          priority: "MEDIUM"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 89,
    successRate: 96,
    category: "Reminders",
    priority: "MEDIUM",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_ESCALATE_OVERDUE_TASK",
    name: "Escalate Overdue Tasks",
    description: "Escalate task to manager if overdue by more than 48 hours",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 9 * * *", // Daily at 9 AM
      entity: "Task"
    },
    conditions: [
      { field: "status", operator: "not_equals", value: "COMPLETED", logic: "AND" },
      { field: "dueDate", operator: "less_than", value: "NOW-48h" }
    ],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "task_escalation",
          recipients: ["manager"],
          priority: "HIGH"
        }
      },
      {
        type: "UPDATE_FIELD",
        config: {
          field: "escalated",
          value: true
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "45s"
    },
    enabled: true,
    executions24h: 34,
    successRate: 94,
    category: "Escalations",
    priority: "HIGH",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_ASSIGN_AGENT",
    name: "Auto-Assign Agent",
    description: "Automatically assign agent based on workload and availability",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "EVENT",
      event: "inquiry.created",
      entity: "Inquiry"
    },
    conditions: [
      { field: "assignedAgent", operator: "not_equals", value: null }
    ],
    actions: [
      {
        type: "UPDATE_FIELD",
        config: {
          field: "assignedAgent",
          value: "AUTO_ASSIGN_LOGIC"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "agent_assigned",
          recipients: ["assignedAgent"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 67,
    successRate: 92,
    category: "Assignment",
    priority: "MEDIUM",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_STATUS_CHANGE",
    name: "Notify on Status Change",
    description: "Notify relevant parties when entity status changes",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "STATE",
      state: "status_changed",
      entity: "Booking"
    },
    conditions: [],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "status_change",
          recipients: ["client", "talent", "agent"],
          priority: "MEDIUM"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 234,
    successRate: 97,
    category: "Notifications",
    priority: "MEDIUM",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REMINDER_EXPIRING_HOLD",
    name: "Reminder for Expiring Hold",
    description: "Send reminder 2 hours before option hold expires",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 * * * *", // Every hour
      entity: "Hold"
    },
    conditions: [
      { field: "status", operator: "equals", value: "ACTIVE", logic: "AND" },
      { field: "expiresAt", operator: "less_than", value: "NOW+2h" }
    ],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "hold_expiring",
          recipients: ["agent", "client"],
          priority: "HIGH"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 45,
    successRate: 95,
    category: "Reminders",
    priority: "HIGH",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_CLOSE_STALE_INQUIRY",
    name: "Auto-Close Stale Inquiries",
    description: "Automatically close inquiries with no activity for 30 days",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 2 * * *", // Daily at 2 AM
      entity: "Inquiry"
    },
    conditions: [
      { field: "status", operator: "equals", value: "OPEN", logic: "AND" },
      { field: "lastActivityAt", operator: "less_than", value: "NOW-30d" }
    ],
    actions: [
      {
        type: "UPDATE_FIELD",
        config: {
          field: "status",
          value: "CLOSED_STALE"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "inquiry_closed",
          recipients: ["agent"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 12,
    successRate: 98,
    category: "Cleanup",
    priority: "LOW",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_MILESTONE_REACHED",
    name: "Notify on Milestone Reached",
    description: "Send notification when project milestone is reached",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "EVENT",
      event: "milestone.completed",
      entity: "Project"
    },
    conditions: [],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "milestone_reached",
          recipients: ["projectManager", "client", "team"],
          priority: "MEDIUM"
        }
      },
      {
        type: "CREATE_TASK",
        config: {
          title: "Review milestone completion",
          assignee: "projectManager"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "45s"
    },
    enabled: true,
    executions24h: 28,
    successRate: 96,
    category: "Notifications",
    priority: "MEDIUM",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REMINDER_INCOMPLETE_PROFILE",
    name: "Reminder for Incomplete Profile",
    description: "Send reminder to complete profile if incomplete after 7 days",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 10 * * *", // Daily at 10 AM
      entity: "Profile"
    },
    conditions: [
      { field: "completionPercentage", operator: "less_than", value: 80, logic: "AND" },
      { field: "createdAt", operator: "less_than", value: "NOW-7d" }
    ],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "profile_incomplete",
          recipients: ["user"],
          priority: "LOW"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 56,
    successRate: 94,
    category: "Reminders",
    priority: "LOW",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_TAG_PRIORITY",
    name: "Auto-Tag Priority Items",
    description: "Automatically tag high-value or urgent items as priority",
    pack: "PACK_CORE_OPS",
    trigger: {
      type: "EVENT",
      event: "booking.created",
      entity: "Booking"
    },
    conditions: [
      { field: "value", operator: "greater_than", value: 50000, logic: "OR" },
      { field: "urgent", operator: "equals", value: true }
    ],
    actions: [
      {
        type: "UPDATE_FIELD",
        config: {
          field: "tags",
          value: "PRIORITY"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "priority_item",
          recipients: ["manager"],
          priority: "HIGH"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 23,
    successRate: 97,
    category: "Classification",
    priority: "MEDIUM",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 2: Approvals Pack (8 rules)
  {
    id: "RULE_REQUIRE_MANAGER_APPROVAL",
    name: "Require Manager Approval",
    description: "Require manager approval for high-value transactions",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "EVENT",
      event: "transaction.created",
      entity: "Transaction"
    },
    conditions: [
      { field: "amount", operator: "greater_than", value: 10000 }
    ],
    actions: [
      {
        type: "CREATE_TASK",
        config: {
          title: "Approve transaction",
          assignee: "manager",
          priority: "HIGH"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "approval_required",
          recipients: ["manager"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 42,
    successRate: 98,
    category: "Approvals",
    priority: "HIGH",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_DUAL_APPROVAL",
    name: "Require Dual Approval",
    description: "Require two approvers for critical operations",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "EVENT",
      event: "contract.created",
      entity: "Contract"
    },
    conditions: [
      { field: "value", operator: "greater_than", value: 50000 }
    ],
    actions: [
      {
        type: "CREATE_TASK",
        config: {
          title: "First approval required",
          assignee: "manager1"
        }
      },
      {
        type: "CREATE_TASK",
        config: {
          title: "Second approval required",
          assignee: "manager2"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "120s"
    },
    enabled: true,
    executions24h: 18,
    successRate: 97,
    category: "Approvals",
    priority: "CRITICAL",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_APPROVE_LOW_VALUE",
    name: "Auto-Approve Low Value",
    description: "Automatically approve low-value transactions",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "EVENT",
      event: "transaction.created",
      entity: "Transaction"
    },
    conditions: [
      { field: "amount", operator: "less_than", value: 500 }
    ],
    actions: [
      {
        type: "UPDATE_FIELD",
        config: {
          field: "status",
          value: "APPROVED"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "auto_approved",
          recipients: ["requester"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 156,
    successRate: 99,
    category: "Approvals",
    priority: "LOW",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_ESCALATE_APPROVAL_TIMEOUT",
    name: "Escalate Approval Timeout",
    description: "Escalate to senior manager if approval times out",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 */4 * * *",
      entity: "Approval"
    },
    conditions: [
      { field: "status", operator: "equals", value: "PENDING", logic: "AND" },
      { field: "createdAt", operator: "less_than", value: "NOW-48h" }
    ],
    actions: [
      {
        type: "CREATE_TASK",
        config: {
          title: "Escalated approval",
          assignee: "seniorManager"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "approval_escalated",
          recipients: ["seniorManager", "originalApprover"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "45s"
    },
    enabled: true,
    executions24h: 12,
    successRate: 95,
    category: "Escalations",
    priority: "HIGH",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_DELEGATE_APPROVAL",
    name: "Delegate Approval",
    description: "Allow approval delegation when approver is unavailable",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "EVENT",
      event: "approval.delegated",
      entity: "Approval"
    },
    conditions: [],
    actions: [
      {
        type: "CREATE_TASK",
        config: {
          title: "Delegated approval",
          assignee: "delegate"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "approval_delegated",
          recipients: ["delegate", "originalApprover"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 8,
    successRate: 96,
    category: "Approvals",
    priority: "MEDIUM",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_APPROVAL_PENDING",
    name: "Notify Approval Pending",
    description: "Send daily digest of pending approvals",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 9 * * *",
      entity: "Approval"
    },
    conditions: [
      { field: "status", operator: "equals", value: "PENDING" }
    ],
    actions: [
      {
        type: "SEND_EMAIL",
        config: {
          template: "pending_approvals_digest",
          to: "approver.email"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 45,
    successRate: 97,
    category: "Notifications",
    priority: "LOW",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_FINANCE_APPROVAL",
    name: "Require Finance Approval",
    description: "Require finance team approval for budget changes",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "EVENT",
      event: "budget.modified",
      entity: "Budget"
    },
    conditions: [
      { field: "changeAmount", operator: "greater_than", value: 5000 }
    ],
    actions: [
      {
        type: "CREATE_TASK",
        config: {
          title: "Finance approval required",
          assignee: "financeTeam"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 23,
    successRate: 98,
    category: "Approvals",
    priority: "HIGH",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_PARALLEL_APPROVAL_CHAIN",
    name: "Parallel Approval Chain",
    description: "Execute parallel approval workflow for complex operations",
    pack: "PACK_APPROVALS",
    trigger: {
      type: "EVENT",
      event: "project.created",
      entity: "Project"
    },
    conditions: [
      { field: "budget", operator: "greater_than", value: 100000 }
    ],
    actions: [
      {
        type: "CREATE_TASK",
        config: {
          title: "Finance approval",
          assignee: "financeManager"
        }
      },
      {
        type: "CREATE_TASK",
        config: {
          title: "Legal approval",
          assignee: "legalTeam"
        }
      },
      {
        type: "CREATE_TASK",
        config: {
          title: "Executive approval",
          assignee: "executive"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "120s"
    },
    enabled: true,
    executions24h: 6,
    successRate: 94,
    category: "Approvals",
    priority: "CRITICAL",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 3: Finance Pack (12 rules)
  {
    id: "RULE_AUTO_CREATE_ESCROW",
    name: "Auto-Create Escrow",
    description: "Automatically create escrow account for new contracts",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "contract.signed",
      entity: "Contract"
    },
    conditions: [
      { field: "requiresEscrow", operator: "equals", value: true }
    ],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/escrow/create",
          method: "POST",
          payload: { contractId: "{{contractId}}", amount: "{{amount}}" }
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "escrow_created",
          recipients: ["client", "talent"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "60s",
      compensation: "rollback_escrow"
    },
    enabled: true,
    executions24h: 34,
    successRate: 97,
    category: "Finance",
    priority: "HIGH",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_RELEASE_ESCROW_ON_APPROVAL",
    name: "Release Escrow on Approval",
    description: "Release escrow funds when all parties approve",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "escrow.approved",
      entity: "Escrow"
    },
    conditions: [
      { field: "allPartiesApproved", operator: "equals", value: true }
    ],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/escrow/release",
          method: "POST"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "escrow_released",
          recipients: ["client", "talent", "agent"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "90s"
    },
    enabled: true,
    executions24h: 28,
    successRate: 99,
    category: "Finance",
    priority: "CRITICAL",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_SPLIT_COMMISSION",
    name: "Auto-Split Commission",
    description: "Automatically split commission based on agreement",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "payment.received",
      entity: "Payment"
    },
    conditions: [
      { field: "type", operator: "equals", value: "COMMISSION" }
    ],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/finance/split-commission",
          method: "POST"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "commission_split",
          recipients: ["agent", "agency"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 67,
    successRate: 98,
    category: "Finance",
    priority: "HIGH",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_PAYMENT_RECEIVED",
    name: "Notify Payment Received",
    description: "Send notification when payment is received",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "payment.received",
      entity: "Payment"
    },
    conditions: [],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "payment_received",
          recipients: ["client", "agent"],
          priority: "MEDIUM"
        }
      },
      {
        type: "SEND_EMAIL",
        config: {
          template: "payment_receipt",
          to: "client.email"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 89,
    successRate: 99,
    category: "Notifications",
    priority: "MEDIUM",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REMINDER_OVERDUE_INVOICE",
    name: "Reminder for Overdue Invoice",
    description: "Send reminder for invoices overdue by 7 days",
    pack: "PACK_FINANCE",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 10 * * *",
      entity: "Invoice"
    },
    conditions: [
      { field: "status", operator: "equals", value: "UNPAID", logic: "AND" },
      { field: "dueDate", operator: "less_than", value: "NOW-7d" }
    ],
    actions: [
      {
        type: "SEND_EMAIL",
        config: {
          template: "invoice_overdue",
          to: "client.email"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "invoice_reminder",
          recipients: ["client", "accountsReceivable"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "45s"
    },
    enabled: true,
    executions24h: 45,
    successRate: 96,
    category: "Reminders",
    priority: "MEDIUM",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_RECONCILE_PAYMENT",
    name: "Auto-Reconcile Payment",
    description: "Automatically reconcile payment with invoice",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "payment.received",
      entity: "Payment"
    },
    conditions: [
      { field: "invoiceId", operator: "exists", value: true }
    ],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/finance/reconcile",
          method: "POST"
        }
      },
      {
        type: "UPDATE_FIELD",
        config: {
          field: "invoice.status",
          value: "PAID"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 78,
    successRate: 97,
    category: "Finance",
    priority: "HIGH",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_FREEZE_ON_DISPUTE",
    name: "Freeze Funds on Dispute",
    description: "Freeze escrow funds when dispute is filed",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "dispute.created",
      entity: "Dispute"
    },
    conditions: [
      { field: "escrowId", operator: "exists", value: true }
    ],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/escrow/freeze",
          method: "POST"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "funds_frozen",
          recipients: ["client", "talent", "admin"],
          priority: "HIGH"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "45s"
    },
    enabled: true,
    executions24h: 8,
    successRate: 99,
    category: "Finance",
    priority: "CRITICAL",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_PAYOUT_THRESHOLD",
    name: "Auto-Payout at Threshold",
    description: "Automatically payout when balance reaches threshold",
    pack: "PACK_FINANCE",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 0 * * *",
      entity: "Account"
    },
    conditions: [
      { field: "balance", operator: "greater_than", value: 1000 }
    ],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/finance/payout",
          method: "POST"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "payout_initiated",
          recipients: ["accountHolder"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "90s"
    },
    enabled: true,
    executions24h: 34,
    successRate: 98,
    category: "Finance",
    priority: "HIGH",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_LOW_BALANCE",
    name: "Notify Low Balance",
    description: "Send notification when account balance is low",
    pack: "PACK_FINANCE",
    trigger: {
      type: "SCHEDULE",
      schedule: "0 9 * * *",
      entity: "Account"
    },
    conditions: [
      { field: "balance", operator: "less_than", value: 100 }
    ],
    actions: [
      {
        type: "NOTIFICATION",
        config: {
          template: "low_balance",
          recipients: ["accountHolder"],
          priority: "MEDIUM"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 23,
    successRate: 97,
    category: "Notifications",
    priority: "LOW",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_GENERATE_INVOICE",
    name: "Auto-Generate Invoice",
    description: "Automatically generate invoice when booking is confirmed",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "booking.confirmed",
      entity: "Booking"
    },
    conditions: [],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/finance/generate-invoice",
          method: "POST"
        }
      },
      {
        type: "SEND_EMAIL",
        config: {
          template: "invoice_generated",
          to: "client.email"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "60s"
    },
    enabled: true,
    executions24h: 56,
    successRate: 98,
    category: "Finance",
    priority: "MEDIUM",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_DEPOSIT_GATING",
    name: "Require Deposit Gating",
    description: "Block booking confirmation until deposit is received",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "booking.confirm_requested",
      entity: "Booking"
    },
    conditions: [
      { field: "depositReceived", operator: "equals", value: false }
    ],
    actions: [
      {
        type: "UPDATE_FIELD",
        config: {
          field: "status",
          value: "PENDING_DEPOSIT"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "deposit_required",
          recipients: ["client"],
          priority: "HIGH"
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 2,
      timeout: "30s"
    },
    enabled: true,
    executions24h: 42,
    successRate: 99,
    category: "Finance",
    priority: "HIGH",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_REFUND_CANCELLATION",
    name: "Auto-Refund on Cancellation",
    description: "Automatically process refund when booking is cancelled",
    pack: "PACK_FINANCE",
    trigger: {
      type: "EVENT",
      event: "booking.cancelled",
      entity: "Booking"
    },
    conditions: [
      { field: "refundEligible", operator: "equals", value: true }
    ],
    actions: [
      {
        type: "WEBHOOK",
        config: {
          url: "/api/finance/refund",
          method: "POST"
        }
      },
      {
        type: "NOTIFICATION",
        config: {
          template: "refund_processed",
          recipients: ["client"]
        }
      }
    ],
    guardrails: {
      idempotency: true,
      maxRetries: 3,
      timeout: "90s",
      compensation: "reverse_refund"
    },
    enabled: true,
    executions24h: 19,
    successRate: 96,
    category: "Finance",
    priority: "HIGH",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 4: Change Control Pack (6 rules)
  {
    id: "RULE_LOG_SENSITIVE_CHANGE",
    name: "Log Sensitive Change",
    description: "Create immutable audit log for sensitive data changes",
    pack: "PACK_CHANGE_CONTROL",
    trigger: { type: "EVENT", event: "data.modified", entity: "SensitiveData" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/audit/log", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "change_logged", recipients: ["admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 234,
    successRate: 99,
    category: "Audit",
    priority: "CRITICAL",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_APPROVAL_CRITICAL_CHANGE",
    name: "Require Approval for Critical Change",
    description: "Require admin approval before critical system changes",
    pack: "PACK_CHANGE_CONTROL",
    trigger: { type: "EVENT", event: "system.change_requested", entity: "System" },
    conditions: [{ field: "criticality", operator: "equals", value: "HIGH" }],
    actions: [
      { type: "CREATE_TASK", config: { title: "Approve critical change", assignee: "admin" } },
      { type: "UPDATE_FIELD", config: { field: "status", value: "PENDING_APPROVAL" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 12,
    successRate: 98,
    category: "Approvals",
    priority: "CRITICAL",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_ADMIN_CHANGE",
    name: "Notify Admin of Change",
    description: "Notify administrators of important system changes",
    pack: "PACK_CHANGE_CONTROL",
    trigger: { type: "EVENT", event: "system.changed", entity: "System" },
    conditions: [],
    actions: [
      { type: "NOTIFICATION", config: { template: "system_changed", recipients: ["admin"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "30s" },
    enabled: true,
    executions24h: 45,
    successRate: 97,
    category: "Notifications",
    priority: "HIGH",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_PREVENT_RETROACTIVE_EDIT",
    name: "Prevent Retroactive Edit",
    description: "Block attempts to edit historical records",
    pack: "PACK_CHANGE_CONTROL",
    trigger: { type: "EVENT", event: "record.edit_attempted", entity: "Record" },
    conditions: [{ field: "createdAt", operator: "less_than", value: "NOW-30d" }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "editBlocked", value: true } },
      { type: "NOTIFICATION", config: { template: "edit_blocked", recipients: ["user", "admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 8,
    successRate: 99,
    category: "Compliance",
    priority: "HIGH",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_VERSION_CONTROL_DOCUMENT",
    name: "Version Control Document",
    description: "Create version snapshot when document is modified",
    pack: "PACK_CHANGE_CONTROL",
    trigger: { type: "EVENT", event: "document.modified", entity: "Document" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/documents/version", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 156,
    successRate: 98,
    category: "Audit",
    priority: "MEDIUM",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUDIT_PERMISSION_CHANGE",
    name: "Audit Permission Change",
    description: "Log all permission and role changes",
    pack: "PACK_CHANGE_CONTROL",
    trigger: { type: "EVENT", event: "permission.changed", entity: "Permission" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/audit/permission", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "permission_changed", recipients: ["admin", "securityTeam"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 67,
    successRate: 99,
    category: "Audit",
    priority: "CRITICAL",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 5: Privacy Pack (8 rules)
  {
    id: "RULE_REQUIRE_CONSENT",
    name: "Require Consent",
    description: "Require explicit consent before data collection",
    pack: "PACK_PRIVACY",
    trigger: { type: "EVENT", event: "data.collect_requested", entity: "PersonalData" },
    conditions: [{ field: "consentGiven", operator: "equals", value: false }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "BLOCKED" } },
      { type: "NOTIFICATION", config: { template: "consent_required", recipients: ["user"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 89,
    successRate: 99,
    category: "Privacy",
    priority: "CRITICAL",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_GUARDIAN_CONSENT",
    name: "Require Guardian Consent",
    description: "Require guardian consent for minors",
    pack: "PACK_PRIVACY",
    trigger: { type: "EVENT", event: "minor.registration", entity: "User" },
    conditions: [{ field: "age", operator: "less_than", value: 18 }],
    actions: [
      { type: "CREATE_TASK", config: { title: "Guardian consent required", assignee: "guardian" } },
      { type: "UPDATE_FIELD", config: { field: "status", value: "PENDING_GUARDIAN_CONSENT" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 23,
    successRate: 98,
    category: "Privacy",
    priority: "CRITICAL",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_REDACT_PII",
    name: "Auto-Redact PII",
    description: "Automatically redact PII in logs and exports",
    pack: "PACK_PRIVACY",
    trigger: { type: "EVENT", event: "data.exported", entity: "Data" },
    conditions: [{ field: "containsPII", operator: "equals", value: true }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/privacy/redact", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 145,
    successRate: 97,
    category: "Privacy",
    priority: "HIGH",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_ENFORCE_DATA_RETENTION",
    name: "Enforce Data Retention",
    description: "Automatically delete data after retention period",
    pack: "PACK_PRIVACY",
    trigger: { type: "SCHEDULE", schedule: "0 2 * * *", entity: "Data" },
    conditions: [{ field: "createdAt", operator: "less_than", value: "NOW-365d" }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/privacy/delete", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "data_deleted", recipients: ["admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "120s" },
    enabled: true,
    executions24h: 234,
    successRate: 96,
    category: "Privacy",
    priority: "HIGH",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_CONSENT_EXPIRY",
    name: "Notify Consent Expiry",
    description: "Notify user when consent is about to expire",
    pack: "PACK_PRIVACY",
    trigger: { type: "SCHEDULE", schedule: "0 9 * * *", entity: "Consent" },
    conditions: [{ field: "expiresAt", operator: "less_than", value: "NOW+30d" }],
    actions: [
      { type: "NOTIFICATION", config: { template: "consent_expiring", recipients: ["user"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 45,
    successRate: 97,
    category: "Privacy",
    priority: "MEDIUM",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_ANONYMIZE_DATA",
    name: "Auto-Anonymize Data",
    description: "Anonymize data for analytics and reporting",
    pack: "PACK_PRIVACY",
    trigger: { type: "EVENT", event: "analytics.requested", entity: "Data" },
    conditions: [{ field: "containsPII", operator: "equals", value: true }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/privacy/anonymize", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 178,
    successRate: 98,
    category: "Privacy",
    priority: "HIGH",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_BLOCK_UNDERAGE_ACCESS",
    name: "Block Underage Access",
    description: "Block access to age-restricted content for minors",
    pack: "PACK_PRIVACY",
    trigger: { type: "EVENT", event: "content.access_requested", entity: "Content" },
    conditions: [
      { field: "ageRestricted", operator: "equals", value: true, logic: "AND" },
      { field: "user.age", operator: "less_than", value: 18 }
    ],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "accessBlocked", value: true } },
      { type: "NOTIFICATION", config: { template: "access_denied", recipients: ["user"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 34,
    successRate: 99,
    category: "Privacy",
    priority: "CRITICAL",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUDIT_DATA_ACCESS",
    name: "Audit Data Access",
    description: "Log all access to sensitive personal data",
    pack: "PACK_PRIVACY",
    trigger: { type: "EVENT", event: "data.accessed", entity: "PersonalData" },
    conditions: [{ field: "sensitivity", operator: "equals", value: "HIGH" }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/audit/access", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 567,
    successRate: 99,
    category: "Audit",
    priority: "CRITICAL",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 6: Disputes Pack (10 rules)
  {
    id: "RULE_AUTO_CREATE_DISPUTE",
    name: "Auto-Create Dispute",
    description: "Automatically create dispute case when flagged",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "issue.flagged", entity: "Issue" },
    conditions: [{ field: "severity", operator: "equals", value: "HIGH" }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/disputes/create", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "dispute_created", recipients: ["client", "talent", "admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 12,
    successRate: 98,
    category: "Disputes",
    priority: "HIGH",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_FREEZE_FUNDS_ON_DISPUTE",
    name: "Freeze Funds on Dispute",
    description: "Freeze escrow funds when dispute is opened",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.opened", entity: "Dispute" },
    conditions: [{ field: "escrowId", operator: "exists", value: true }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/escrow/freeze", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "funds_frozen", recipients: ["client", "talent"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 8,
    successRate: 99,
    category: "Finance",
    priority: "CRITICAL",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_PARTIES_DISPUTE",
    name: "Notify Parties of Dispute",
    description: "Notify all parties when dispute is filed",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.filed", entity: "Dispute" },
    conditions: [],
    actions: [
      { type: "NOTIFICATION", config: { template: "dispute_filed", recipients: ["client", "talent", "mediator"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "30s" },
    enabled: true,
    executions24h: 12,
    successRate: 97,
    category: "Notifications",
    priority: "HIGH",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_COLLECT_EVIDENCE",
    name: "Collect Evidence",
    description: "Request evidence from parties in dispute",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.evidence_requested", entity: "Dispute" },
    conditions: [],
    actions: [
      { type: "CREATE_TASK", config: { title: "Submit evidence", assignee: "client" } },
      { type: "CREATE_TASK", config: { title: "Submit evidence", assignee: "talent" } },
      { type: "NOTIFICATION", config: { template: "evidence_requested", recipients: ["client", "talent"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "45s" },
    enabled: true,
    executions24h: 10,
    successRate: 96,
    category: "Disputes",
    priority: "MEDIUM",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_ESCALATE_UNRESOLVED_DISPUTE",
    name: "Escalate Unresolved Dispute",
    description: "Escalate dispute if not resolved within 14 days",
    pack: "PACK_DISPUTES",
    trigger: { type: "SCHEDULE", schedule: "0 10 * * *", entity: "Dispute" },
    conditions: [
      { field: "status", operator: "equals", value: "OPEN", logic: "AND" },
      { field: "createdAt", operator: "less_than", value: "NOW-14d" }
    ],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "escalated", value: true } },
      { type: "NOTIFICATION", config: { template: "dispute_escalated", recipients: ["seniorMediator", "admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 3,
    successRate: 98,
    category: "Escalations",
    priority: "HIGH",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_MEDIATE_LOW_VALUE",
    name: "Auto-Mediate Low Value",
    description: "Automatically mediate low-value disputes",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.created", entity: "Dispute" },
    conditions: [{ field: "amount", operator: "less_than", value: 500 }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/disputes/auto-mediate", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "auto_mediation", recipients: ["client", "talent"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 5,
    successRate: 94,
    category: "Disputes",
    priority: "MEDIUM",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_ADMIN_REVIEW",
    name: "Require Admin Review",
    description: "Require admin review for high-value disputes",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.created", entity: "Dispute" },
    conditions: [{ field: "amount", operator: "greater_than", value: 10000 }],
    actions: [
      { type: "CREATE_TASK", config: { title: "Review high-value dispute", assignee: "admin" } },
      { type: "NOTIFICATION", config: { template: "admin_review_required", recipients: ["admin"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 2,
    successRate: 99,
    category: "Disputes",
    priority: "CRITICAL",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_RESOLUTION",
    name: "Notify Resolution",
    description: "Notify parties when dispute is resolved",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.resolved", entity: "Dispute" },
    conditions: [],
    actions: [
      { type: "NOTIFICATION", config: { template: "dispute_resolved", recipients: ["client", "talent", "mediator"] } },
      { type: "SEND_EMAIL", config: { template: "resolution_details", to: "client.email" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "30s" },
    enabled: true,
    executions24h: 9,
    successRate: 98,
    category: "Notifications",
    priority: "MEDIUM",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_CLOSE_RESOLVED",
    name: "Auto-Close Resolved",
    description: "Automatically close dispute after resolution acceptance",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.resolution_accepted", entity: "Dispute" },
    conditions: [],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "CLOSED" } },
      { type: "WEBHOOK", config: { url: "/api/escrow/release", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 8,
    successRate: 99,
    category: "Disputes",
    priority: "HIGH",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_TRACK_DISPUTE_METRICS",
    name: "Track Dispute Metrics",
    description: "Track and report dispute resolution metrics",
    pack: "PACK_DISPUTES",
    trigger: { type: "EVENT", event: "dispute.closed", entity: "Dispute" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/analytics/dispute-metrics", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 9,
    successRate: 97,
    category: "Analytics",
    priority: "LOW",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 7: Staffing Pack (8 rules)
  {
    id: "RULE_AUTO_ASSIGN_SHIFT",
    name: "Auto-Assign Shift",
    description: "Automatically assign shifts based on availability",
    pack: "PACK_STAFFING",
    trigger: { type: "EVENT", event: "shift.created", entity: "Shift" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/staffing/assign", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "shift_assigned", recipients: ["staff"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 78,
    successRate: 96,
    category: "Staffing",
    priority: "MEDIUM",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_SHIFT_REMINDER",
    name: "Notify Shift Reminder",
    description: "Send reminder 2 hours before shift starts",
    pack: "PACK_STAFFING",
    trigger: { type: "SCHEDULE", schedule: "0 * * * *", entity: "Shift" },
    conditions: [
      { field: "startTime", operator: "less_than", value: "NOW+2h", logic: "AND" },
      { field: "startTime", operator: "greater_than", value: "NOW+1h" }
    ],
    actions: [
      { type: "NOTIFICATION", config: { template: "shift_reminder", recipients: ["staff"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 156,
    successRate: 98,
    category: "Reminders",
    priority: "MEDIUM",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_DETECT_NO_SHOW",
    name: "Detect No-Show",
    description: "Detect and flag no-shows for shifts",
    pack: "PACK_STAFFING",
    trigger: { type: "SCHEDULE", schedule: "*/15 * * * *", entity: "Shift" },
    conditions: [
      { field: "startTime", operator: "less_than", value: "NOW-15m", logic: "AND" },
      { field: "checkedIn", operator: "equals", value: false }
    ],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "NO_SHOW" } },
      { type: "NOTIFICATION", config: { template: "no_show_detected", recipients: ["manager"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "30s" },
    enabled: true,
    executions24h: 23,
    successRate: 97,
    category: "Staffing",
    priority: "HIGH",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_FIND_REPLACEMENT",
    name: "Auto-Find Replacement",
    description: "Automatically find replacement for no-shows",
    pack: "PACK_STAFFING",
    trigger: { type: "EVENT", event: "shift.no_show", entity: "Shift" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/staffing/find-replacement", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "replacement_needed", recipients: ["availableStaff"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 12,
    successRate: 89,
    category: "Staffing",
    priority: "HIGH",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_APPROVE_TIMESHEET",
    name: "Approve Timesheet",
    description: "Auto-approve timesheets matching scheduled hours",
    pack: "PACK_STAFFING",
    trigger: { type: "EVENT", event: "timesheet.submitted", entity: "Timesheet" },
    conditions: [
      { field: "hoursWorked", operator: "equals", value: "scheduledHours" }
    ],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "APPROVED" } },
      { type: "NOTIFICATION", config: { template: "timesheet_approved", recipients: ["staff"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 145,
    successRate: 98,
    category: "Staffing",
    priority: "MEDIUM",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_CALCULATE_OVERTIME",
    name: "Calculate Overtime",
    description: "Automatically calculate overtime pay",
    pack: "PACK_STAFFING",
    trigger: { type: "EVENT", event: "timesheet.approved", entity: "Timesheet" },
    conditions: [
      { field: "hoursWorked", operator: "greater_than", value: 40 }
    ],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/payroll/calculate-overtime", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "overtime_calculated", recipients: ["staff", "payroll"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 34,
    successRate: 97,
    category: "Payroll",
    priority: "MEDIUM",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_SHIFT_CONFLICT",
    name: "Notify Shift Conflict",
    description: "Notify manager of scheduling conflicts",
    pack: "PACK_STAFFING",
    trigger: { type: "EVENT", event: "shift.conflict_detected", entity: "Shift" },
    conditions: [],
    actions: [
      { type: "NOTIFICATION", config: { template: "shift_conflict", recipients: ["manager"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 8,
    successRate: 96,
    category: "Notifications",
    priority: "HIGH",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_PAYOUT_SHIFT",
    name: "Auto-Payout Shift",
    description: "Automatically process payout after shift completion",
    pack: "PACK_STAFFING",
    trigger: { type: "EVENT", event: "shift.completed", entity: "Shift" },
    conditions: [
      { field: "timesheetApproved", operator: "equals", value: true }
    ],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/payroll/payout", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "payout_processed", recipients: ["staff"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "90s" },
    enabled: true,
    executions24h: 134,
    successRate: 98,
    category: "Payroll",
    priority: "HIGH",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 8: Pageant Integrity Pack (12 rules)
  {
    id: "RULE_VERIFY_CONTESTANT_IDENTITY",
    name: "Verify Contestant Identity",
    description: "Verify contestant identity before registration",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "contestant.registration", entity: "Contestant" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/verification/identity", method: "POST" } },
      { type: "UPDATE_FIELD", config: { field: "verificationStatus", value: "PENDING" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 45,
    successRate: 98,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_PREVENT_DUPLICATE_REGISTRATION",
    name: "Prevent Duplicate Registration",
    description: "Block duplicate contestant registrations",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "contestant.registration", entity: "Contestant" },
    conditions: [{ field: "existingRegistration", operator: "equals", value: true }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "BLOCKED" } },
      { type: "NOTIFICATION", config: { template: "duplicate_registration", recipients: ["admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 3,
    successRate: 99,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_LOCK_SCORES_ON_SUBMIT",
    name: "Lock Scores on Submit",
    description: "Lock scores immediately after judge submission",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "scores.submitted", entity: "Scores" },
    conditions: [],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "locked", value: true } },
      { type: "WEBHOOK", config: { url: "/api/audit/lock-scores", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 234,
    successRate: 99,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_JUDGE_COMPLETION",
    name: "Require Judge Completion",
    description: "Require all judges to complete scoring before results",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "results.requested", entity: "Competition" },
    conditions: [{ field: "allJudgesCompleted", operator: "equals", value: false }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "resultsBlocked", value: true } },
      { type: "NOTIFICATION", config: { template: "incomplete_judging", recipients: ["admin"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 12,
    successRate: 98,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_DETECT_SCORE_ANOMALY",
    name: "Detect Score Anomaly",
    description: "Detect and flag anomalous scoring patterns",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "scores.submitted", entity: "Scores" },
    conditions: [{ field: "anomalyDetected", operator: "equals", value: true }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "flagged", value: true } },
      { type: "NOTIFICATION", config: { template: "score_anomaly", recipients: ["admin", "integrityOfficer"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 8,
    successRate: 96,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_FREEZE_RESULTS",
    name: "Freeze Results",
    description: "Freeze results after publication to prevent tampering",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "results.published", entity: "Results" },
    conditions: [],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "frozen", value: true } },
      { type: "WEBHOOK", config: { url: "/api/audit/freeze-results", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 15,
    successRate: 99,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_DUAL_APPROVAL_PUBLISH",
    name: "Require Dual Approval to Publish",
    description: "Require two approvals before publishing results",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "results.publish_requested", entity: "Results" },
    conditions: [],
    actions: [
      { type: "CREATE_TASK", config: { title: "Approve results publication", assignee: "admin1" } },
      { type: "CREATE_TASK", config: { title: "Approve results publication", assignee: "admin2" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 15,
    successRate: 98,
    category: "Approvals",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUDIT_SCORE_CHANGE",
    name: "Audit Score Change",
    description: "Log any attempts to modify scores",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "scores.modified", entity: "Scores" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/audit/score-change", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "score_modified", recipients: ["admin", "integrityOfficer"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 5,
    successRate: 99,
    category: "Audit",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_PREVENT_JUDGE_CONFLICT",
    name: "Prevent Judge Conflict",
    description: "Block judges from scoring contestants with conflicts",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "judge.assignment", entity: "Judge" },
    conditions: [{ field: "conflictOfInterest", operator: "equals", value: true }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "assignmentBlocked", value: true } },
      { type: "NOTIFICATION", config: { template: "conflict_detected", recipients: ["admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 2,
    successRate: 99,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_INTEGRITY_BREACH",
    name: "Notify Integrity Breach",
    description: "Immediately notify of integrity violations",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "integrity.breach_detected", entity: "Competition" },
    conditions: [],
    actions: [
      { type: "NOTIFICATION", config: { template: "integrity_breach", recipients: ["admin", "integrityOfficer", "legal"], priority: "CRITICAL" } },
      { type: "WEBHOOK", config: { url: "/api/audit/integrity-breach", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 1,
    successRate: 99,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_DISQUALIFY_VIOLATION",
    name: "Auto-Disqualify on Violation",
    description: "Automatically disqualify contestants for rule violations",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "EVENT", event: "violation.confirmed", entity: "Contestant" },
    conditions: [{ field: "severity", operator: "equals", value: "HIGH" }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "DISQUALIFIED" } },
      { type: "NOTIFICATION", config: { template: "disqualification", recipients: ["contestant", "admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 1,
    successRate: 98,
    category: "Integrity",
    priority: "CRITICAL",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_TRACK_INTEGRITY_METRICS",
    name: "Track Integrity Metrics",
    description: "Track and report integrity metrics",
    pack: "PACK_PAGEANT_INTEGRITY",
    trigger: { type: "SCHEDULE", schedule: "0 0 * * *", entity: "Competition" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/analytics/integrity-metrics", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "60s" },
    enabled: true,
    executions24h: 1,
    successRate: 97,
    category: "Analytics",
    priority: "MEDIUM",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 9: Content Safety Pack (10 rules)
  {
    id: "RULE_AUTO_MODERATE_CONTENT",
    name: "Auto-Moderate Content",
    description: "Automatically moderate user-generated content",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "content.submitted", entity: "Content" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/moderation/auto-moderate", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 456,
    successRate: 97,
    category: "Safety",
    priority: "HIGH",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_FLAG_INAPPROPRIATE_CONTENT",
    name: "Flag Inappropriate Content",
    description: "Flag content that violates community guidelines",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "content.analyzed", entity: "Content" },
    conditions: [{ field: "violatesGuidelines", operator: "equals", value: true }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "flagged", value: true } },
      { type: "NOTIFICATION", config: { template: "content_flagged", recipients: ["moderator"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "30s" },
    enabled: true,
    executions24h: 67,
    successRate: 98,
    category: "Safety",
    priority: "HIGH",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_MANUAL_REVIEW",
    name: "Require Manual Review",
    description: "Require manual review for borderline content",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "content.flagged", entity: "Content" },
    conditions: [{ field: "confidence", operator: "less_than", value: 80 }],
    actions: [
      { type: "CREATE_TASK", config: { title: "Review flagged content", assignee: "moderator" } },
      { type: "UPDATE_FIELD", config: { field: "status", value: "PENDING_REVIEW" } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 34,
    successRate: 96,
    category: "Safety",
    priority: "MEDIUM",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_REMOVE_VIOLATION",
    name: "Auto-Remove Violation",
    description: "Automatically remove content with clear violations",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "content.analyzed", entity: "Content" },
    conditions: [
      { field: "violatesGuidelines", operator: "equals", value: true, logic: "AND" },
      { field: "confidence", operator: "greater_than", value: 95 }
    ],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "REMOVED" } },
      { type: "NOTIFICATION", config: { template: "content_removed", recipients: ["user", "moderator"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "30s" },
    enabled: true,
    executions24h: 23,
    successRate: 99,
    category: "Safety",
    priority: "HIGH",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_USER_VIOLATION",
    name: "Notify User of Violation",
    description: "Notify user when content is removed",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "content.removed", entity: "Content" },
    conditions: [],
    actions: [
      { type: "SEND_EMAIL", config: { template: "violation_notice", to: "user.email" } },
      { type: "NOTIFICATION", config: { template: "content_violation", recipients: ["user"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 23,
    successRate: 97,
    category: "Notifications",
    priority: "MEDIUM",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_ESCALATE_SERIOUS_VIOLATION",
    name: "Escalate Serious Violation",
    description: "Escalate serious violations to senior moderators",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "content.flagged", entity: "Content" },
    conditions: [{ field: "severity", operator: "equals", value: "CRITICAL" }],
    actions: [
      { type: "CREATE_TASK", config: { title: "Review critical violation", assignee: "seniorModerator" } },
      { type: "NOTIFICATION", config: { template: "critical_violation", recipients: ["seniorModerator", "admin"], priority: "HIGH" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "30s" },
    enabled: true,
    executions24h: 5,
    successRate: 98,
    category: "Escalations",
    priority: "CRITICAL",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_TRACK_MODERATION_METRICS",
    name: "Track Moderation Metrics",
    description: "Track and report content moderation metrics",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "SCHEDULE", schedule: "0 0 * * *", entity: "Content" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/analytics/moderation-metrics", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "60s" },
    enabled: true,
    executions24h: 1,
    successRate: 97,
    category: "Analytics",
    priority: "LOW",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_WARN_USER",
    name: "Auto-Warn User",
    description: "Automatically warn users for minor violations",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "content.flagged", entity: "Content" },
    conditions: [{ field: "severity", operator: "equals", value: "LOW" }],
    actions: [
      { type: "NOTIFICATION", config: { template: "content_warning", recipients: ["user"] } },
      { type: "UPDATE_FIELD", config: { field: "warningIssued", value: true } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 45,
    successRate: 98,
    category: "Safety",
    priority: "LOW",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_SUSPEND_REPEAT_OFFENDER",
    name: "Suspend Repeat Offender",
    description: "Suspend users with multiple violations",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "violation.recorded", entity: "User" },
    conditions: [{ field: "violationCount", operator: "greater_than", value: 3 }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "status", value: "SUSPENDED" } },
      { type: "NOTIFICATION", config: { template: "account_suspended", recipients: ["user", "admin"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 3,
    successRate: 99,
    category: "Safety",
    priority: "HIGH",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUDIT_MODERATION_ACTION",
    name: "Audit Moderation Action",
    description: "Log all moderation actions for audit trail",
    pack: "PACK_CONTENT_SAFETY",
    trigger: { type: "EVENT", event: "moderation.action_taken", entity: "Content" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/audit/moderation", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 5, timeout: "30s" },
    enabled: true,
    executions24h: 89,
    successRate: 99,
    category: "Audit",
    priority: "HIGH",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 10: Vendor Procurement Pack (6 rules)
  {
    id: "RULE_AUTO_SEND_RFQ",
    name: "Auto-Send RFQ",
    description: "Automatically send RFQ to qualified vendors",
    pack: "PACK_VENDOR_PROCUREMENT",
    trigger: { type: "EVENT", event: "rfq.created", entity: "RFQ" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/procurement/send-rfq", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "rfq_sent", recipients: ["vendors"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 12,
    successRate: 97,
    category: "Procurement",
    priority: "MEDIUM",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_COMPARE_VENDOR_QUOTES",
    name: "Compare Vendor Quotes",
    description: "Automatically compare and rank vendor quotes",
    pack: "PACK_VENDOR_PROCUREMENT",
    trigger: { type: "EVENT", event: "quotes.received", entity: "RFQ" },
    conditions: [{ field: "quoteCount", operator: "greater_than", value: 2 }],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/procurement/compare-quotes", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "quotes_compared", recipients: ["buyer"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 8,
    successRate: 96,
    category: "Procurement",
    priority: "MEDIUM",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_GENERATE_PO",
    name: "Auto-Generate PO",
    description: "Automatically generate purchase order after approval",
    pack: "PACK_VENDOR_PROCUREMENT",
    trigger: { type: "EVENT", event: "quote.approved", entity: "Quote" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/procurement/generate-po", method: "POST" } },
      { type: "SEND_EMAIL", config: { template: "po_generated", to: "vendor.email" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 6,
    successRate: 98,
    category: "Procurement",
    priority: "HIGH",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_VENDOR_APPROVAL",
    name: "Require Vendor Approval",
    description: "Require approval for high-value vendor contracts",
    pack: "PACK_VENDOR_PROCUREMENT",
    trigger: { type: "EVENT", event: "quote.selected", entity: "Quote" },
    conditions: [{ field: "amount", operator: "greater_than", value: 10000 }],
    actions: [
      { type: "CREATE_TASK", config: { title: "Approve vendor contract", assignee: "procurementManager" } },
      { type: "NOTIFICATION", config: { template: "approval_required", recipients: ["procurementManager"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 4,
    successRate: 97,
    category: "Approvals",
    priority: "HIGH",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_DELIVERY_DUE",
    name: "Notify Delivery Due",
    description: "Send reminder when delivery is due",
    pack: "PACK_VENDOR_PROCUREMENT",
    trigger: { type: "SCHEDULE", schedule: "0 9 * * *", entity: "PurchaseOrder" },
    conditions: [
      { field: "deliveryDate", operator: "less_than", value: "NOW+3d", logic: "AND" },
      { field: "status", operator: "equals", value: "PENDING" }
    ],
    actions: [
      { type: "NOTIFICATION", config: { template: "delivery_reminder", recipients: ["vendor", "buyer"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 5,
    successRate: 96,
    category: "Reminders",
    priority: "MEDIUM",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_APPROVE_VENDOR_PAYMENT",
    name: "Auto-Approve Vendor Payment",
    description: "Auto-approve payment after delivery confirmation",
    pack: "PACK_VENDOR_PROCUREMENT",
    trigger: { type: "EVENT", event: "delivery.confirmed", entity: "PurchaseOrder" },
    conditions: [{ field: "amount", operator: "less_than", value: 5000 }],
    actions: [
      { type: "UPDATE_FIELD", config: { field: "paymentStatus", value: "APPROVED" } },
      { type: "WEBHOOK", config: { url: "/api/finance/process-payment", method: "POST" } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "60s" },
    enabled: true,
    executions24h: 5,
    successRate: 98,
    category: "Finance",
    priority: "MEDIUM",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // PACK 11: Logistics Pack (4 rules)
  {
    id: "RULE_AUTO_TRACK_SHIPMENT",
    name: "Auto-Track Shipment",
    description: "Automatically track shipment status",
    pack: "PACK_LOGISTICS",
    trigger: { type: "EVENT", event: "shipment.created", entity: "Shipment" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/logistics/track", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "tracking_started", recipients: ["recipient"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 34,
    successRate: 97,
    category: "Logistics",
    priority: "MEDIUM",
    createdAt: "2025-02-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_NOTIFY_DELIVERY_STATUS",
    name: "Notify Delivery Status",
    description: "Send notifications on delivery status changes",
    pack: "PACK_LOGISTICS",
    trigger: { type: "EVENT", event: "shipment.status_changed", entity: "Shipment" },
    conditions: [],
    actions: [
      { type: "NOTIFICATION", config: { template: "delivery_update", recipients: ["recipient", "sender"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 89,
    successRate: 98,
    category: "Notifications",
    priority: "MEDIUM",
    createdAt: "2025-02-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_REQUIRE_PROOF_DELIVERY",
    name: "Require Proof of Delivery",
    description: "Require proof of delivery before payment release",
    pack: "PACK_LOGISTICS",
    trigger: { type: "EVENT", event: "delivery.completed", entity: "Shipment" },
    conditions: [{ field: "proofOfDelivery", operator: "exists", value: false }],
    actions: [
      { type: "CREATE_TASK", config: { title: "Upload proof of delivery", assignee: "carrier" } },
      { type: "UPDATE_FIELD", config: { field: "paymentHeld", value: true } }
    ],
    guardrails: { idempotency: true, maxRetries: 2, timeout: "30s" },
    enabled: true,
    executions24h: 34,
    successRate: 96,
    category: "Logistics",
    priority: "HIGH",
    createdAt: "2025-02-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  {
    id: "RULE_AUTO_UPDATE_INVENTORY",
    name: "Auto-Update Inventory",
    description: "Automatically update inventory on delivery",
    pack: "PACK_LOGISTICS",
    trigger: { type: "EVENT", event: "delivery.confirmed", entity: "Shipment" },
    conditions: [],
    actions: [
      { type: "WEBHOOK", config: { url: "/api/inventory/update", method: "POST" } },
      { type: "NOTIFICATION", config: { template: "inventory_updated", recipients: ["warehouseManager"] } }
    ],
    guardrails: { idempotency: true, maxRetries: 3, timeout: "45s" },
    enabled: true,
    executions24h: 34,
    successRate: 98,
    category: "Logistics",
    priority: "MEDIUM",
    createdAt: "2025-02-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  }
]

// Helper functions
export function getAutomationRuleById(id: AutomationRuleId): AutomationRule | undefined {
  return seedAutomationRules.find(r => r.id === id)
}

export function getAutomationRulesByPack(packId: string): AutomationRule[] {
  return seedAutomationRules.filter(r => r.pack === packId)
}

export function getAutomationRulesByCategory(category: string): AutomationRule[] {
  return seedAutomationRules.filter(r => r.category === category)
}

export function getAutomationRulesByPriority(priority: string): AutomationRule[] {
  return seedAutomationRules.filter(r => r.priority === priority)
}

export function getEnabledAutomationRules(): AutomationRule[] {
  return seedAutomationRules.filter(r => r.enabled)
}

export function getAutomationRuleStats() {
  return {
    total: seedAutomationRules.length,
    enabled: seedAutomationRules.filter(r => r.enabled).length,
    disabled: seedAutomationRules.filter(r => !r.enabled).length,
    totalExecutions24h: seedAutomationRules.reduce((sum, r) => sum + r.executions24h, 0),
    avgSuccessRate: Math.round(
      seedAutomationRules.reduce((sum, r) => sum + r.successRate, 0) / seedAutomationRules.length
    ),
    byPriority: {
      critical: seedAutomationRules.filter(r => r.priority === "CRITICAL").length,
      high: seedAutomationRules.filter(r => r.priority === "HIGH").length,
      medium: seedAutomationRules.filter(r => r.priority === "MEDIUM").length,
      low: seedAutomationRules.filter(r => r.priority === "LOW").length
    }
  }
}

export function getRuleCategories(): string[] {
  return Array.from(new Set(seedAutomationRules.map(r => r.category)))
}
