/**
 * Workflow Seed Data
 * 
 * State machine workflows for different blueprints.
 * Each workflow defines states, transitions, actions, guardrails, and SLAs.
 * 
 * Source: updated.md - Section 8. Workflow Lifecycles (State Machines)
 */

export type WorkflowId = string

export type WorkflowTrigger = "EVENT" | "STATE" | "SCHEDULE"
export type WorkflowStatus = "ACTIVE" | "DRAFT" | "ARCHIVED"
export type StateType = "START" | "PROCESS" | "DECISION" | "END" | "ERROR"

export interface WorkflowState {
  id: string
  name: string
  type: StateType
  description: string
  actions?: string[] // Actions to execute when entering this state
  sla?: {
    duration: string
    escalation?: string
  }
}

export interface WorkflowTransition {
  id: string
  from: string // State ID
  to: string // State ID
  label: string
  condition?: string // Condition expression
  requiresApproval?: boolean
  approvers?: string[] // Role names
}

export interface WorkflowAction {
  id: string
  type: "NOTIFICATION" | "WEBHOOK" | "UPDATE_FIELD" | "CREATE_TASK" | "SEND_EMAIL"
  config: Record<string, any>
}

export interface WorkflowGuardrail {
  type: "APPROVAL_REQUIRED" | "DEPOSIT_GATING" | "VERIFICATION_REQUIRED" | "DUAL_CONTROL"
  condition: string
  config: Record<string, any>
}

export interface WorkflowSLA {
  state: string
  duration: string // e.g., "24h", "48h", "7d"
  escalation: string // What happens on breach
}

export interface Workflow {
  id: WorkflowId
  name: string
  description: string
  blueprint: string // Blueprint ID (B1-B10)
  trigger: WorkflowTrigger
  states: WorkflowState[]
  transitions: WorkflowTransition[]
  actions: WorkflowAction[]
  guardrails: WorkflowGuardrail[]
  slas: WorkflowSLA[]
  status: WorkflowStatus
  version: string
  createdAt: string
  updatedAt: string
  executions24h: number
  successRate: number
  avgDuration: string
  category: string
}

export const seedWorkflows: Workflow[] = [
  // B1: Roster + Booking Workflow
  {
    id: "WF_B1_BOOKING",
    name: "Booking Lifecycle",
    description: "Complete booking workflow from inquiry to payout with escrow protection",
    blueprint: "B1",
    trigger: "EVENT",
    category: "Commercial",
    version: "1.0.0",
    status: "ACTIVE",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z",
    executions24h: 145,
    successRate: 94,
    avgDuration: "5.2d",
    states: [
      {
        id: "START",
        name: "Inquiry Received",
        type: "START",
        description: "Client inquiry received",
        actions: ["notify_agent", "create_lead"]
      },
      {
        id: "HOLD",
        name: "Option Hold",
        type: "PROCESS",
        description: "Talent placed on hold for client",
        sla: { duration: "24h", escalation: "notify_manager" }
      },
      {
        id: "QUOTE",
        name: "Quote Sent",
        type: "PROCESS",
        description: "Quote sent to client",
        sla: { duration: "48h", escalation: "follow_up" }
      },
      {
        id: "CONTRACT",
        name: "Contract Signed",
        type: "PROCESS",
        description: "Contract signed by all parties"
      },
      {
        id: "ESCROW_PENDING",
        name: "Awaiting Deposit",
        type: "DECISION",
        description: "Waiting for escrow deposit",
        sla: { duration: "48h", escalation: "payment_reminder" }
      },
      {
        id: "ESCROW_FUNDED",
        name: "Deposit Received",
        type: "PROCESS",
        description: "Escrow funded, work can begin"
      },
      {
        id: "IN_PROGRESS",
        name: "Work In Progress",
        type: "PROCESS",
        description: "Talent performing work"
      },
      {
        id: "DELIVERY_SUBMITTED",
        name: "Proof Submitted",
        type: "PROCESS",
        description: "Proof of delivery submitted",
        sla: { duration: "48h", escalation: "client_review_reminder" }
      },
      {
        id: "DELIVERY_APPROVED",
        name: "Client Approved",
        type: "PROCESS",
        description: "Client approved delivery"
      },
      {
        id: "SETTLED",
        name: "Payout Complete",
        type: "END",
        description: "All parties paid, booking complete"
      },
      {
        id: "CANCELLED",
        name: "Cancelled",
        type: "END",
        description: "Booking cancelled"
      },
      {
        id: "DISPUTED",
        name: "In Dispute",
        type: "ERROR",
        description: "Dispute raised, requires resolution"
      }
    ],
    transitions: [
      { id: "T1", from: "START", to: "HOLD", label: "Place Hold" },
      { id: "T2", from: "HOLD", to: "QUOTE", label: "Send Quote" },
      { id: "T3", from: "QUOTE", to: "CONTRACT", label: "Accept Quote" },
      { id: "T4", from: "CONTRACT", to: "ESCROW_PENDING", label: "Request Deposit" },
      { id: "T5", from: "ESCROW_PENDING", to: "ESCROW_FUNDED", label: "Deposit Received", condition: "payment.status === 'COMPLETED'" },
      { id: "T6", from: "ESCROW_FUNDED", to: "IN_PROGRESS", label: "Start Work" },
      { id: "T7", from: "IN_PROGRESS", to: "DELIVERY_SUBMITTED", label: "Submit Proof" },
      { id: "T8", from: "DELIVERY_SUBMITTED", to: "DELIVERY_APPROVED", label: "Approve", requiresApproval: true, approvers: ["Client"] },
      { id: "T9", from: "DELIVERY_APPROVED", to: "SETTLED", label: "Release Payment" },
      { id: "T10", from: "HOLD", to: "CANCELLED", label: "Cancel Hold" },
      { id: "T11", from: "QUOTE", to: "CANCELLED", label: "Decline Quote" },
      { id: "T12", from: "DELIVERY_SUBMITTED", to: "DISPUTED", label: "Raise Dispute" },
      { id: "T13", from: "DISPUTED", to: "SETTLED", label: "Resolve Dispute", requiresApproval: true, approvers: ["Admin", "Finance Manager"] }
    ],
    actions: [
      { id: "A1", type: "NOTIFICATION", config: { template: "booking_inquiry", recipients: ["agent"] } },
      { id: "A2", type: "SEND_EMAIL", config: { template: "quote_sent", to: "client" } },
      { id: "A3", type: "WEBHOOK", config: { url: "/api/escrow/create", method: "POST" } },
      { id: "A4", type: "CREATE_TASK", config: { title: "Review proof of delivery", assignee: "client" } }
    ],
    guardrails: [
      {
        type: "DEPOSIT_GATING",
        condition: "state === 'ESCROW_FUNDED'",
        config: { message: "Cannot start work until deposit is received" }
      },
      {
        type: "APPROVAL_REQUIRED",
        condition: "state === 'DELIVERY_SUBMITTED'",
        config: { approvers: ["Client"], timeout: "48h" }
      },
      {
        type: "DUAL_CONTROL",
        condition: "amount > 50000",
        config: { approvers: ["Finance Manager", "Tenant Admin"] }
      }
    ],
    slas: [
      { state: "HOLD", duration: "24h", escalation: "Notify manager if hold not converted" },
      { state: "QUOTE", duration: "48h", escalation: "Follow up with client" },
      { state: "ESCROW_PENDING", duration: "48h", escalation: "Send payment reminder" },
      { state: "DELIVERY_SUBMITTED", duration: "48h", escalation: "Remind client to review" }
    ]
  },

  // B2: Casting Pipeline Workflow
  {
    id: "WF_B2_CASTING",
    name: "Casting Pipeline",
    description: "End-to-end casting workflow from call to booking",
    blueprint: "B2",
    trigger: "EVENT",
    category: "Casting",
    version: "1.0.0",
    status: "ACTIVE",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z",
    executions24h: 89,
    successRate: 91,
    avgDuration: "8.5d",
    states: [
      {
        id: "START",
        name: "Casting Call Created",
        type: "START",
        description: "New casting call published"
      },
      {
        id: "SUBMISSIONS_OPEN",
        name: "Accepting Submissions",
        type: "PROCESS",
        description: "Talent can submit applications",
        sla: { duration: "24h", escalation: "promote_casting_call" }
      },
      {
        id: "SHORTLIST",
        name: "Shortlisting",
        type: "PROCESS",
        description: "Reviewing and shortlisting candidates"
      },
      {
        id: "AUDITION_SCHEDULED",
        name: "Auditions Scheduled",
        type: "PROCESS",
        description: "Audition slots assigned"
      },
      {
        id: "AUDITION_COMPLETE",
        name: "Auditions Complete",
        type: "PROCESS",
        description: "All auditions conducted"
      },
      {
        id: "OFFER_SENT",
        name: "Offer Extended",
        type: "DECISION",
        description: "Offer sent to selected talent",
        sla: { duration: "72h", escalation: "follow_up_offer" }
      },
      {
        id: "OFFER_ACCEPTED",
        name: "Offer Accepted",
        type: "PROCESS",
        description: "Talent accepted offer"
      },
      {
        id: "BOOKED",
        name: "Booking Confirmed",
        type: "END",
        description: "Talent booked for role"
      },
      {
        id: "CLOSED",
        name: "Casting Closed",
        type: "END",
        description: "Casting call closed"
      }
    ],
    transitions: [
      { id: "T1", from: "START", to: "SUBMISSIONS_OPEN", label: "Publish" },
      { id: "T2", from: "SUBMISSIONS_OPEN", to: "SHORTLIST", label: "Close Submissions" },
      { id: "T3", from: "SHORTLIST", to: "AUDITION_SCHEDULED", label: "Schedule Auditions" },
      { id: "T4", from: "AUDITION_SCHEDULED", to: "AUDITION_COMPLETE", label: "Complete Auditions" },
      { id: "T5", from: "AUDITION_COMPLETE", to: "OFFER_SENT", label: "Send Offer" },
      { id: "T6", from: "OFFER_SENT", to: "OFFER_ACCEPTED", label: "Accept Offer" },
      { id: "T7", from: "OFFER_ACCEPTED", to: "BOOKED", label: "Confirm Booking" },
      { id: "T8", from: "OFFER_SENT", to: "CLOSED", label: "Decline Offer" },
      { id: "T9", from: "SHORTLIST", to: "CLOSED", label: "Cancel Casting" }
    ],
    actions: [
      { id: "A1", type: "NOTIFICATION", config: { template: "casting_published", recipients: ["talent_pool"] } },
      { id: "A2", type: "SEND_EMAIL", config: { template: "audition_invite", to: "shortlisted_talent" } },
      { id: "A3", type: "CREATE_TASK", config: { title: "Review audition tapes", assignee: "casting_director" } }
    ],
    guardrails: [
      {
        type: "VERIFICATION_REQUIRED",
        condition: "state === 'OFFER_SENT'",
        config: { documents: ["NDA", "Contract"] }
      }
    ],
    slas: [
      { state: "SUBMISSIONS_OPEN", duration: "24h", escalation: "Promote casting call if no submissions" },
      { state: "SHORTLIST", duration: "72h", escalation: "Remind casting director" },
      { state: "OFFER_SENT", duration: "72h", escalation: "Follow up with talent" }
    ]
  },

  // B3: Pageant Season Workflow
  {
    id: "WF_B3_PAGEANT",
    name: "Pageant Season Lifecycle",
    description: "Complete pageant workflow with integrity controls",
    blueprint: "B3",
    trigger: "EVENT",
    category: "Competition",
    version: "1.0.0",
    status: "ACTIVE",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z",
    executions24h: 12,
    successRate: 96,
    avgDuration: "45d",
    states: [
      {
        id: "START",
        name: "Season Created",
        type: "START",
        description: "New pageant season initialized"
      },
      {
        id: "REGISTRATION_OPEN",
        name: "Registration Open",
        type: "PROCESS",
        description: "Accepting contestant registrations"
      },
      {
        id: "VERIFICATION",
        name: "Verification In Progress",
        type: "PROCESS",
        description: "Verifying contestant documents",
        sla: { duration: "72h", escalation: "verification_backlog_alert" }
      },
      {
        id: "ROUND_1",
        name: "Round 1 - Judging",
        type: "PROCESS",
        description: "First round judging in progress"
      },
      {
        id: "ROUND_2",
        name: "Round 2 - Judging",
        type: "PROCESS",
        description: "Second round judging in progress"
      },
      {
        id: "FINALS",
        name: "Finals - Judging",
        type: "PROCESS",
        description: "Final round judging in progress"
      },
      {
        id: "RESULTS_LOCKED",
        name: "Results Locked",
        type: "DECISION",
        description: "Results finalized, awaiting approval to publish",
        sla: { duration: "24h", escalation: "results_pending_alert" }
      },
      {
        id: "RESULTS_PUBLISHED",
        name: "Results Published",
        type: "PROCESS",
        description: "Results publicly announced"
      },
      {
        id: "PAYOUT_PENDING",
        name: "Prize Payout Pending",
        type: "PROCESS",
        description: "Processing prize payouts"
      },
      {
        id: "COMPLETED",
        name: "Season Complete",
        type: "END",
        description: "All payouts complete, season closed"
      }
    ],
    transitions: [
      { id: "T1", from: "START", to: "REGISTRATION_OPEN", label: "Open Registration" },
      { id: "T2", from: "REGISTRATION_OPEN", to: "VERIFICATION", label: "Close Registration" },
      { id: "T3", from: "VERIFICATION", to: "ROUND_1", label: "Start Round 1" },
      { id: "T4", from: "ROUND_1", to: "ROUND_2", label: "Advance to Round 2" },
      { id: "T5", from: "ROUND_2", to: "FINALS", label: "Advance to Finals" },
      { id: "T6", from: "FINALS", to: "RESULTS_LOCKED", label: "Lock Results" },
      { id: "T7", from: "RESULTS_LOCKED", to: "RESULTS_PUBLISHED", label: "Publish Results", requiresApproval: true, approvers: ["Pageant Director", "Admin"] },
      { id: "T8", from: "RESULTS_PUBLISHED", to: "PAYOUT_PENDING", label: "Process Payouts" },
      { id: "T9", from: "PAYOUT_PENDING", to: "COMPLETED", label: "Complete Season" }
    ],
    actions: [
      { id: "A1", type: "NOTIFICATION", config: { template: "registration_open", recipients: ["all_users"] } },
      { id: "A2", type: "SEND_EMAIL", config: { template: "round_results", to: "contestants" } },
      { id: "A3", type: "WEBHOOK", config: { url: "/api/integrity/lock-scores", method: "POST" } }
    ],
    guardrails: [
      {
        type: "DUAL_CONTROL",
        condition: "state === 'RESULTS_LOCKED'",
        config: { approvers: ["Pageant Director", "Admin"], message: "Results require dual approval before publishing" }
      },
      {
        type: "VERIFICATION_REQUIRED",
        condition: "state === 'VERIFICATION'",
        config: { documents: ["ID", "Age Proof", "Guardian Consent"] }
      }
    ],
    slas: [
      { state: "VERIFICATION", duration: "72h", escalation: "Alert if verification backlog" },
      { state: "RESULTS_LOCKED", duration: "24h", escalation: "Remind approvers to publish results" }
    ]
  },

  // B4: Brand Deals Workflow
  {
    id: "WF_B4_BRAND_DEAL",
    name: "Brand Deal Lifecycle",
    description: "Influencer brand deal workflow with deliverables tracking",
    blueprint: "B4",
    trigger: "EVENT",
    category: "Commercial",
    version: "1.0.0",
    status: "ACTIVE",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z",
    executions24h: 67,
    successRate: 89,
    avgDuration: "12d",
    states: [
      {
        id: "START",
        name: "Brief Received",
        type: "START",
        description: "Brand brief received"
      },
      {
        id: "NEGOTIATION",
        name: "Negotiating Terms",
        type: "PROCESS",
        description: "Negotiating deal terms",
        sla: { duration: "48h", escalation: "negotiation_timeout" }
      },
      {
        id: "CONTRACT_SENT",
        name: "Contract Sent",
        type: "PROCESS",
        description: "Contract sent for signature"
      },
      {
        id: "CONTRACT_SIGNED",
        name: "Contract Signed",
        type: "PROCESS",
        description: "All parties signed"
      },
      {
        id: "DELIVERABLES_IN_PROGRESS",
        name: "Creating Content",
        type: "PROCESS",
        description: "Influencer creating deliverables"
      },
      {
        id: "INTERNAL_REVIEW",
        name: "Internal Review",
        type: "PROCESS",
        description: "Agency reviewing content",
        sla: { duration: "24h", escalation: "review_reminder" }
      },
      {
        id: "BRAND_APPROVAL",
        name: "Brand Approval",
        type: "DECISION",
        description: "Awaiting brand approval",
        sla: { duration: "48h", escalation: "brand_approval_reminder" }
      },
      {
        id: "APPROVED",
        name: "Content Approved",
        type: "PROCESS",
        description: "Brand approved content"
      },
      {
        id: "PUBLISHED",
        name: "Content Published",
        type: "PROCESS",
        description: "Content live on platforms"
      },
      {
        id: "PAYOUT_COMPLETE",
        name: "Payout Complete",
        type: "END",
        description: "Influencer paid"
      }
    ],
    transitions: [
      { id: "T1", from: "START", to: "NEGOTIATION", label: "Start Negotiation" },
      { id: "T2", from: "NEGOTIATION", to: "CONTRACT_SENT", label: "Send Contract" },
      { id: "T3", from: "CONTRACT_SENT", to: "CONTRACT_SIGNED", label: "Sign Contract" },
      { id: "T4", from: "CONTRACT_SIGNED", to: "DELIVERABLES_IN_PROGRESS", label: "Start Work" },
      { id: "T5", from: "DELIVERABLES_IN_PROGRESS", to: "INTERNAL_REVIEW", label: "Submit for Review" },
      { id: "T6", from: "INTERNAL_REVIEW", to: "BRAND_APPROVAL", label: "Send to Brand" },
      { id: "T7", from: "BRAND_APPROVAL", to: "APPROVED", label: "Approve", requiresApproval: true, approvers: ["Brand Manager"] },
      { id: "T8", from: "APPROVED", to: "PUBLISHED", label: "Publish Content" },
      { id: "T9", from: "PUBLISHED", to: "PAYOUT_COMPLETE", label: "Process Payout" },
      { id: "T10", from: "BRAND_APPROVAL", to: "INTERNAL_REVIEW", label: "Request Changes" }
    ],
    actions: [
      { id: "A1", type: "NOTIFICATION", config: { template: "deal_brief", recipients: ["deals_manager"] } },
      { id: "A2", type: "CREATE_TASK", config: { title: "Review deliverables", assignee: "brand_manager" } },
      { id: "A3", type: "WEBHOOK", config: { url: "/api/analytics/track-performance", method: "POST" } }
    ],
    guardrails: [
      {
        type: "APPROVAL_REQUIRED",
        condition: "state === 'BRAND_APPROVAL'",
        config: { approvers: ["Brand Manager"], timeout: "48h" }
      }
    ],
    slas: [
      { state: "NEGOTIATION", duration: "48h", escalation: "Escalate if negotiation stalls" },
      { state: "INTERNAL_REVIEW", duration: "24h", escalation: "Remind reviewer" },
      { state: "BRAND_APPROVAL", duration: "48h", escalation: "Follow up with brand" }
    ]
  },

  // B7: Shift Staffing Workflow
  {
    id: "WF_B7_SHIFT",
    name: "Shift Staffing Lifecycle",
    description: "Event staffing workflow from assignment to payout",
    blueprint: "B7",
    trigger: "EVENT",
    category: "Operations",
    version: "1.0.0",
    status: "ACTIVE",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z",
    executions24h: 234,
    successRate: 92,
    avgDuration: "2d",
    states: [
      {
        id: "START",
        name: "Shift Created",
        type: "START",
        description: "New shift requirement created"
      },
      {
        id: "STAFF_ASSIGNED",
        name: "Staff Assigned",
        type: "PROCESS",
        description: "Staff member assigned to shift",
        sla: { duration: "24h", escalation: "assignment_urgent" }
      },
      {
        id: "CONFIRMED",
        name: "Staff Confirmed",
        type: "PROCESS",
        description: "Staff confirmed availability",
        sla: { duration: "12h", escalation: "confirmation_reminder" }
      },
      {
        id: "CHECKED_IN",
        name: "Checked In",
        type: "PROCESS",
        description: "Staff checked in at location"
      },
      {
        id: "IN_PROGRESS",
        name: "Shift In Progress",
        type: "PROCESS",
        description: "Staff working shift"
      },
      {
        id: "CHECKED_OUT",
        name: "Checked Out",
        type: "PROCESS",
        description: "Staff checked out"
      },
      {
        id: "TIMESHEET_SUBMITTED",
        name: "Timesheet Submitted",
        type: "PROCESS",
        description: "Timesheet submitted for approval",
        sla: { duration: "24h", escalation: "timesheet_approval_reminder" }
      },
      {
        id: "APPROVED",
        name: "Timesheet Approved",
        type: "PROCESS",
        description: "Manager approved timesheet"
      },
      {
        id: "PAYOUT_COMPLETE",
        name: "Payout Complete",
        type: "END",
        description: "Staff paid for shift"
      },
      {
        id: "NO_SHOW",
        name: "No Show",
        type: "ERROR",
        description: "Staff did not show up"
      }
    ],
    transitions: [
      { id: "T1", from: "START", to: "STAFF_ASSIGNED", label: "Assign Staff" },
      { id: "T2", from: "STAFF_ASSIGNED", to: "CONFIRMED", label: "Confirm" },
      { id: "T3", from: "CONFIRMED", to: "CHECKED_IN", label: "Check In" },
      { id: "T4", from: "CHECKED_IN", to: "IN_PROGRESS", label: "Start Shift" },
      { id: "T5", from: "IN_PROGRESS", to: "CHECKED_OUT", label: "Check Out" },
      { id: "T6", from: "CHECKED_OUT", to: "TIMESHEET_SUBMITTED", label: "Submit Timesheet" },
      { id: "T7", from: "TIMESHEET_SUBMITTED", to: "APPROVED", label: "Approve", requiresApproval: true, approvers: ["Operations Manager"] },
      { id: "T8", from: "APPROVED", to: "PAYOUT_COMPLETE", label: "Process Payout" },
      { id: "T9", from: "CONFIRMED", to: "NO_SHOW", label: "Mark No Show", condition: "checkin_time > shift_start + 30min" }
    ],
    actions: [
      { id: "A1", type: "NOTIFICATION", config: { template: "shift_assigned", recipients: ["staff"] } },
      { id: "A2", type: "SEND_EMAIL", config: { template: "shift_reminder", to: "staff" } },
      { id: "A3", type: "UPDATE_FIELD", config: { field: "attendance_record", value: "NO_SHOW" } }
    ],
    guardrails: [
      {
        type: "APPROVAL_REQUIRED",
        condition: "state === 'TIMESHEET_SUBMITTED'",
        config: { approvers: ["Operations Manager"], timeout: "24h" }
      }
    ],
    slas: [
      { state: "STAFF_ASSIGNED", duration: "24h", escalation: "Urgent: Shift needs assignment" },
      { state: "CONFIRMED", duration: "12h", escalation: "Send confirmation reminder" },
      { state: "TIMESHEET_SUBMITTED", duration: "24h", escalation: "Remind manager to approve" }
    ]
  }
]

// Helper functions
export function getWorkflowById(id: WorkflowId): Workflow | undefined {
  return seedWorkflows.find(w => w.id === id)
}

export function getWorkflowsByBlueprint(blueprintId: string): Workflow[] {
  return seedWorkflows.filter(w => w.blueprint === blueprintId)
}

export function getWorkflowsByStatus(status: WorkflowStatus): Workflow[] {
  return seedWorkflows.filter(w => w.status === status)
}

export function getWorkflowsByCategory(category: string): Workflow[] {
  return seedWorkflows.filter(w => w.category === category)
}

export function getWorkflowStats() {
  return {
    total: seedWorkflows.length,
    active: seedWorkflows.filter(w => w.status === "ACTIVE").length,
    draft: seedWorkflows.filter(w => w.status === "DRAFT").length,
    archived: seedWorkflows.filter(w => w.status === "ARCHIVED").length,
    totalExecutions24h: seedWorkflows.reduce((sum, w) => sum + w.executions24h, 0),
    avgSuccessRate: Math.round(
      seedWorkflows.reduce((sum, w) => sum + w.successRate, 0) / seedWorkflows.length
    )
  }
}
