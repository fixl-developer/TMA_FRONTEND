// Remaining automation rules for Packs 4-11 (to be merged with automationRules.ts)

export const remainingRules = [
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
  }
]

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
  }
]
