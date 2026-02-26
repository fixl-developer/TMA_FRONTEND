/**
 * Automation Pack Seed Data
 * 
 * 11 automation packs containing 94 rules total.
 * Packs group related automation rules by domain/function.
 * 
 * Source: updated.md - Automation Engine specifications
 */

export type AutomationPackId = string

export type PackStatus = "ACTIVE" | "BETA"

export interface AutomationPack {
  id: AutomationPackId
  name: string
  description: string
  category: string
  rules: string[] // Rule IDs
  blueprints: string[] // Compatible blueprint IDs
  status: PackStatus
  installCount: number
  icon: string
  color: string
  version: string
  createdAt: string
  updatedAt: string
}

export const seedAutomationPacks: AutomationPack[] = [
  // Pack 1: Core Ops Pack (10 rules)
  {
    id: "PACK_CORE_OPS",
    name: "Core Ops Pack",
    description: "Essential operational automations for all agency types. Handles notifications, reminders, escalations, and basic workflow automation.",
    category: "Operations",
    rules: [
      "RULE_NOTIFY_NEW_INQUIRY",
      "RULE_REMINDER_PENDING_APPROVAL",
      "RULE_ESCALATE_OVERDUE_TASK",
      "RULE_AUTO_ASSIGN_AGENT",
      "RULE_NOTIFY_STATUS_CHANGE",
      "RULE_REMINDER_EXPIRING_HOLD",
      "RULE_AUTO_CLOSE_STALE_INQUIRY",
      "RULE_NOTIFY_MILESTONE_REACHED",
      "RULE_REMINDER_INCOMPLETE_PROFILE",
      "RULE_AUTO_TAG_PRIORITY"
    ],
    blueprints: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    status: "ACTIVE",
    installCount: 85,
    icon: "Settings",
    color: "blue",
    version: "1.0.0",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 2: Approvals Pack (8 rules)
  {
    id: "PACK_APPROVALS",
    name: "Approvals Pack",
    description: "Multi-level approval workflows with escalation, delegation, and timeout handling. Ensures proper authorization for critical operations.",
    category: "Governance",
    rules: [
      "RULE_REQUIRE_MANAGER_APPROVAL",
      "RULE_REQUIRE_DUAL_APPROVAL",
      "RULE_AUTO_APPROVE_LOW_VALUE",
      "RULE_ESCALATE_APPROVAL_TIMEOUT",
      "RULE_DELEGATE_APPROVAL",
      "RULE_NOTIFY_APPROVAL_PENDING",
      "RULE_REQUIRE_FINANCE_APPROVAL",
      "RULE_PARALLEL_APPROVAL_CHAIN"
    ],
    blueprints: ["B1", "B2", "B3", "B4", "B6", "B7", "B9"],
    status: "ACTIVE",
    installCount: 72,
    icon: "Shield",
    color: "amber",
    version: "1.0.0",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 3: Finance Pack (12 rules)
  {
    id: "PACK_FINANCE",
    name: "Finance Pack",
    description: "Financial automation including escrow management, payment processing, commission splits, and reconciliation. Ensures financial integrity.",
    category: "Finance",
    rules: [
      "RULE_AUTO_CREATE_ESCROW",
      "RULE_RELEASE_ESCROW_ON_APPROVAL",
      "RULE_AUTO_SPLIT_COMMISSION",
      "RULE_NOTIFY_PAYMENT_RECEIVED",
      "RULE_REMINDER_OVERDUE_INVOICE",
      "RULE_AUTO_RECONCILE_PAYMENT",
      "RULE_FREEZE_ON_DISPUTE",
      "RULE_AUTO_PAYOUT_THRESHOLD",
      "RULE_NOTIFY_LOW_BALANCE",
      "RULE_AUTO_GENERATE_INVOICE",
      "RULE_REQUIRE_DEPOSIT_GATING",
      "RULE_AUTO_REFUND_CANCELLATION"
    ],
    blueprints: ["B1", "B2", "B3", "B4", "B6", "B7", "B9"],
    status: "ACTIVE",
    installCount: 68,
    icon: "DollarSign",
    color: "emerald",
    version: "1.0.0",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 4: Change Control Pack (6 rules)
  {
    id: "PACK_CHANGE_CONTROL",
    name: "Change Control Pack",
    description: "Audit trail and change control for sensitive operations. Tracks all modifications with immutable logs and requires approval for critical changes.",
    category: "Compliance",
    rules: [
      "RULE_LOG_SENSITIVE_CHANGE",
      "RULE_REQUIRE_APPROVAL_CRITICAL_CHANGE",
      "RULE_NOTIFY_ADMIN_CHANGE",
      "RULE_PREVENT_RETROACTIVE_EDIT",
      "RULE_VERSION_CONTROL_DOCUMENT",
      "RULE_AUDIT_PERMISSION_CHANGE"
    ],
    blueprints: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    status: "ACTIVE",
    installCount: 45,
    icon: "FileText",
    color: "purple",
    version: "1.0.0",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 5: Privacy Pack (8 rules)
  {
    id: "PACK_PRIVACY",
    name: "Privacy Pack",
    description: "Privacy and data protection automation. Handles consent management, data redaction, retention policies, and GDPR compliance.",
    category: "Compliance",
    rules: [
      "RULE_REQUIRE_CONSENT",
      "RULE_REQUIRE_GUARDIAN_CONSENT",
      "RULE_AUTO_REDACT_PII",
      "RULE_ENFORCE_DATA_RETENTION",
      "RULE_NOTIFY_CONSENT_EXPIRY",
      "RULE_AUTO_ANONYMIZE_DATA",
      "RULE_BLOCK_UNDERAGE_ACCESS",
      "RULE_AUDIT_DATA_ACCESS"
    ],
    blueprints: ["B1", "B2", "B3", "B4", "B5", "B8"],
    status: "ACTIVE",
    installCount: 52,
    icon: "Lock",
    color: "indigo",
    version: "1.0.0",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 6: Disputes Pack (10 rules)
  {
    id: "PACK_DISPUTES",
    name: "Disputes Pack",
    description: "Dispute resolution automation with evidence collection, mediation workflows, and escalation paths. Ensures fair and transparent dispute handling.",
    category: "Operations",
    rules: [
      "RULE_AUTO_CREATE_DISPUTE",
      "RULE_FREEZE_FUNDS_ON_DISPUTE",
      "RULE_NOTIFY_PARTIES_DISPUTE",
      "RULE_COLLECT_EVIDENCE",
      "RULE_ESCALATE_UNRESOLVED_DISPUTE",
      "RULE_AUTO_MEDIATE_LOW_VALUE",
      "RULE_REQUIRE_ADMIN_REVIEW",
      "RULE_NOTIFY_RESOLUTION",
      "RULE_AUTO_CLOSE_RESOLVED",
      "RULE_TRACK_DISPUTE_METRICS"
    ],
    blueprints: ["B1", "B2", "B3", "B4", "B6", "B7", "B9"],
    status: "ACTIVE",
    installCount: 38,
    icon: "AlertTriangle",
    color: "red",
    version: "1.0.0",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 7: Staffing Pack (8 rules)
  {
    id: "PACK_STAFFING",
    name: "Staffing Pack",
    description: "Staffing and resource management automation. Handles shift assignments, attendance tracking, no-show detection, and timesheet processing.",
    category: "Operations",
    rules: [
      "RULE_AUTO_ASSIGN_SHIFT",
      "RULE_NOTIFY_SHIFT_REMINDER",
      "RULE_DETECT_NO_SHOW",
      "RULE_AUTO_FIND_REPLACEMENT",
      "RULE_APPROVE_TIMESHEET",
      "RULE_CALCULATE_OVERTIME",
      "RULE_NOTIFY_SHIFT_CONFLICT",
      "RULE_AUTO_PAYOUT_SHIFT"
    ],
    blueprints: ["B7"],
    status: "ACTIVE",
    installCount: 12,
    icon: "Users",
    color: "cyan",
    version: "1.0.0",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 8: Pageant Integrity Pack (12 rules)
  {
    id: "PACK_PAGEANT_INTEGRITY",
    name: "Pageant Integrity Pack",
    description: "Pageant and competition integrity controls. Prevents fraud, ensures fair judging, locks results, and maintains transparency.",
    category: "Integrity",
    rules: [
      "RULE_VERIFY_CONTESTANT_IDENTITY",
      "RULE_PREVENT_DUPLICATE_REGISTRATION",
      "RULE_LOCK_SCORES_ON_SUBMIT",
      "RULE_REQUIRE_JUDGE_COMPLETION",
      "RULE_DETECT_SCORE_ANOMALY",
      "RULE_FREEZE_RESULTS",
      "RULE_REQUIRE_DUAL_APPROVAL_PUBLISH",
      "RULE_AUDIT_SCORE_CHANGE",
      "RULE_PREVENT_JUDGE_CONFLICT",
      "RULE_NOTIFY_INTEGRITY_BREACH",
      "RULE_AUTO_DISQUALIFY_VIOLATION",
      "RULE_TRACK_INTEGRITY_METRICS"
    ],
    blueprints: ["B3"],
    status: "ACTIVE",
    installCount: 15,
    icon: "Shield",
    color: "amber",
    version: "1.0.0",
    createdAt: "2025-02-05T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 9: Content Safety Pack (10 rules)
  {
    id: "PACK_CONTENT_SAFETY",
    name: "Content Safety Pack",
    description: "Content moderation and safety automation. Detects inappropriate content, enforces community guidelines, and manages reports.",
    category: "Safety",
    rules: [
      "RULE_AUTO_MODERATE_CONTENT",
      "RULE_FLAG_INAPPROPRIATE_CONTENT",
      "RULE_REQUIRE_MANUAL_REVIEW",
      "RULE_AUTO_REMOVE_VIOLATION",
      "RULE_NOTIFY_USER_VIOLATION",
      "RULE_ESCALATE_SERIOUS_VIOLATION",
      "RULE_TRACK_MODERATION_METRICS",
      "RULE_AUTO_WARN_USER",
      "RULE_SUSPEND_REPEAT_OFFENDER",
      "RULE_AUDIT_MODERATION_ACTION"
    ],
    blueprints: ["B8"],
    status: "ACTIVE",
    installCount: 8,
    icon: "Shield",
    color: "red",
    version: "1.0.0",
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 10: Vendor Procurement Pack (6 rules)
  {
    id: "PACK_VENDOR_PROCUREMENT",
    name: "Vendor Procurement Pack",
    description: "Vendor management and procurement automation. Handles vendor onboarding, RFQ processing, PO generation, and payment approval.",
    category: "Operations",
    rules: [
      "RULE_AUTO_SEND_RFQ",
      "RULE_COMPARE_VENDOR_QUOTES",
      "RULE_AUTO_GENERATE_PO",
      "RULE_REQUIRE_VENDOR_APPROVAL",
      "RULE_NOTIFY_DELIVERY_DUE",
      "RULE_AUTO_APPROVE_VENDOR_PAYMENT"
    ],
    blueprints: ["B6", "B7"],
    status: "BETA",
    installCount: 5,
    icon: "Package",
    color: "slate",
    version: "0.9.0",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  },

  // Pack 11: Logistics Pack (4 rules)
  {
    id: "PACK_LOGISTICS",
    name: "Logistics Pack",
    description: "Logistics and shipping automation. Tracks shipments, manages proof of delivery, and handles logistics notifications.",
    category: "Operations",
    rules: [
      "RULE_AUTO_TRACK_SHIPMENT",
      "RULE_NOTIFY_DELIVERY_STATUS",
      "RULE_REQUIRE_PROOF_DELIVERY",
      "RULE_AUTO_UPDATE_INVENTORY"
    ],
    blueprints: ["B6", "B9"],
    status: "BETA",
    installCount: 3,
    icon: "Truck",
    color: "orange",
    version: "0.8.0",
    createdAt: "2025-02-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z"
  }
]

// Helper functions
export function getAutomationPackById(id: AutomationPackId): AutomationPack | undefined {
  return seedAutomationPacks.find(p => p.id === id)
}

export function getAutomationPacksByStatus(status: PackStatus): AutomationPack[] {
  return seedAutomationPacks.filter(p => p.status === status)
}

export function getAutomationPacksByCategory(category: string): AutomationPack[] {
  return seedAutomationPacks.filter(p => p.category === category)
}

export function getAutomationPacksByBlueprint(blueprintId: string): AutomationPack[] {
  return seedAutomationPacks.filter(p => p.blueprints.includes(blueprintId))
}

export function getAutomationPackStats() {
  return {
    total: seedAutomationPacks.length,
    active: seedAutomationPacks.filter(p => p.status === "ACTIVE").length,
    beta: seedAutomationPacks.filter(p => p.status === "BETA").length,
    totalRules: seedAutomationPacks.reduce((sum, p) => sum + p.rules.length, 0),
    totalInstalls: seedAutomationPacks.reduce((sum, p) => sum + p.installCount, 0),
    avgRulesPerPack: Math.round(
      seedAutomationPacks.reduce((sum, p) => sum + p.rules.length, 0) / seedAutomationPacks.length
    )
  }
}

export function getPackCategories(): string[] {
  return Array.from(new Set(seedAutomationPacks.map(p => p.category)))
}
