/**
 * Capability metadata — human-readable names and descriptions.
 * Used for tooltips and permission matrix in Roles page.
 */

export type CapabilityCategory =
  | "tenant"
  | "users"
  | "talents"
  | "jobs"
  | "bookings"
  | "contracts"
  | "wallet"
  | "ledger"
  | "credits"
  | "escrow"
  | "disputes"
  | "automations"
  | "audit"
  | "exports"
  | "pageant"
  | "casting"
  | "participants"

export interface CapabilityMeta {
  name: string
  description: string
  category: CapabilityCategory
}

export const CAPABILITY_METADATA: Record<string, CapabilityMeta> = {
  "tenant.manage_settings": {
    name: "Manage tenant settings",
    description: "Edit organization name, subdomain, branding, and tenant-wide configuration.",
    category: "tenant",
  },
  "users.invite": {
    name: "Invite users",
    description: "Send invitations to new team members with role assignment.",
    category: "users",
  },
  "users.assign_roles": {
    name: "Assign roles",
    description: "Change user roles and suspend or activate users.",
    category: "users",
  },
  "talents.read": {
    name: "View talents",
    description: "Read talent profiles, portfolios, and availability.",
    category: "talents",
  },
  "talents.write": {
    name: "Edit talents",
    description: "Create and update talent profiles and portfolios.",
    category: "talents",
  },
  "talents.delete": {
    name: "Delete talents",
    description: "Remove talent profiles from the roster.",
    category: "talents",
  },
  "jobs.read": {
    name: "View jobs",
    description: "View casting calls, job briefs, and submissions.",
    category: "jobs",
  },
  "jobs.write": {
    name: "Manage jobs",
    description: "Create and edit casting calls and job briefs.",
    category: "jobs",
  },
  "bookings.manage": {
    name: "Manage bookings",
    description: "Create, confirm, and manage talent bookings.",
    category: "bookings",
  },
  "contracts.create": {
    name: "Create contracts",
    description: "Create contract drafts and templates.",
    category: "contracts",
  },
  "contracts.read": {
    name: "View contracts",
    description: "Read contract details and status.",
    category: "contracts",
  },
  "contracts.send": {
    name: "Send contracts",
    description: "Send contracts for signature.",
    category: "contracts",
  },
  "contracts.void": {
    name: "Void contracts",
    description: "Void or cancel contracts.",
    category: "contracts",
  },
  "contracts.approve": {
    name: "Approve contracts",
    description: "Approve contract terms before sending.",
    category: "contracts",
  },
  "wallet.read": {
    name: "View wallet",
    description: "View wallet balance and transaction history.",
    category: "wallet",
  },
  "ledger.transfer": {
    name: "Ledger transfers",
    description: "Initiate transfers between ledger accounts.",
    category: "ledger",
  },
  "credits.issue": {
    name: "Issue credits",
    description: "Issue credits to accounts.",
    category: "credits",
  },
  "escrow.create": {
    name: "Create escrow",
    description: "Create escrow accounts for jobs.",
    category: "escrow",
  },
  "escrow.release": {
    name: "Release escrow",
    description: "Release escrow funds to talent.",
    category: "escrow",
  },
  "escrow.lock": {
    name: "Lock escrow",
    description: "Lock escrow in dispute or hold.",
    category: "escrow",
  },
  "disputes.raise": {
    name: "Raise disputes",
    description: "Raise disputes on escrow or booking.",
    category: "disputes",
  },
  "disputes.decide": {
    name: "Decide disputes",
    description: "Resolve disputes and assign outcomes.",
    category: "disputes",
  },
  "automations.manage": {
    name: "Manage automations",
    description: "Create and edit automation rules and workflows.",
    category: "automations",
  },
  "automations.run.retry": {
    name: "Retry automations",
    description: "Retry failed automation runs.",
    category: "automations",
  },
  "audit.read": {
    name: "View audit log",
    description: "View audit log entries for the tenant.",
    category: "audit",
  },
  "exports.generate": {
    name: "Generate exports",
    description: "Export data (CSV, reports).",
    category: "exports",
  },
  "pageant.manage": {
    name: "Manage pageants",
    description: "Create and configure pageants, stages, and scoring.",
    category: "pageant",
  },
  "judges.manage": {
    name: "Manage judges",
    description: "Assign and manage judges for pageant stages.",
    category: "pageant",
  },
  "registrations.read": {
    name: "View registrations",
    description: "View pageant registration submissions.",
    category: "pageant",
  },
  "scoring.publish": {
    name: "Publish scoring",
    description: "Publish pageant results and scores.",
    category: "pageant",
  },
  "scoring.submit": {
    name: "Submit scores",
    description: "Submit scores as a judge.",
    category: "pageant",
  },
  "participants.read": {
    name: "View participants",
    description: "View participant details and stage status.",
    category: "participants",
  },
  "casting.manage": {
    name: "Manage castings",
    description: "Create and manage casting calls.",
    category: "casting",
  },
  "shortlist.manage": {
    name: "Manage shortlist",
    description: "Manage casting shortlist and selections.",
    category: "casting",
  },
  "audition.schedule": {
    name: "Schedule auditions",
    description: "Schedule and manage audition sessions.",
    category: "casting",
  },
  "*": {
    name: "All capabilities",
    description: "Full access to all capabilities (owner).",
    category: "tenant",
  },
}

/** Get human-readable name for a capability */
export function getCapabilityName(capability: string): string {
  return CAPABILITY_METADATA[capability]?.name ?? capability
}

/** Get description for a capability */
export function getCapabilityDescription(capability: string): string {
  return CAPABILITY_METADATA[capability]?.description ?? ""
}

/** Get category for grouping */
export function getCapabilityCategory(capability: string): CapabilityCategory | undefined {
  return CAPABILITY_METADATA[capability]?.category
}
