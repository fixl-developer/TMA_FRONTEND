/**
 * Blueprint Seed Data (B1-B10)
 * 
 * Blueprints define domain-specific workflows by combining modules + default roles + 
 * permissions + dashboards + automations. Tenants choose a blueprint bundle during 
 * onboarding and can add more blueprints later as safe add-ons.
 * 
 * Source: updated.md - Section 3. Blueprint System
 */

export type BlueprintId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8" | "B9" | "B10"

export type BlueprintCategory = "CORE" | "SPECIALIZED" | "ADVANCED"

export type BlueprintStatus = "ACTIVE" | "BETA" | "DEPRECATED"

export interface Blueprint {
  id: BlueprintId
  name: string
  description: string
  category: BlueprintCategory
  usedBy: string[] // Agency types that typically use this blueprint
  keyWorkflows: string[]
  defaultModules: string[]
  defaultRoles: string[]
  defaultPermissions: string[]
  defaultDashboards: string[]
  kpiTargets: {
    timing: Record<string, string>
    cash: Record<string, string>
    quality: Record<string, string>
  }
  dependencies: BlueprintId[] // Other blueprints this depends on
  adoptionRate: number // Percentage of tenants using this
  tenantCount: number // Number of tenants using this blueprint
  status: BlueprintStatus
  version: string
  lastUpdated: string
  icon: string // Icon name for UI
  color: string // Color theme for UI
}

export const seedBlueprints: Blueprint[] = [
  // B1: Roster + Booking
  {
    id: "B1",
    name: "Roster + Booking",
    description: "Talent roster management with booking workflow. Inquiry → Hold → Contract → Escrow → Delivery → Payout. For modeling agencies, talent agencies, speaker bureaus.",
    category: "CORE",
    usedBy: [
      "Modeling agencies",
      "Talent agencies",
      "Speaker bureaus",
      "Artist management"
    ],
    keyWorkflows: [
      "Inquiry → Hold → Contract → Escrow → Delivery → Payout",
      "Availability management",
      "Option holds",
      "Commission splits"
    ],
    defaultModules: [
      "Talent CRM",
      "Booking Management",
      "Contract Lifecycle Management (CLM)",
      "Escrow System",
      "Finance Ops (Ledger-based)",
      "Resource & Capacity Planning"
    ],
    defaultRoles: [
      "Agent / Booker",
      "Operations Manager",
      "Finance Manager",
      "Talent Manager"
    ],
    defaultPermissions: [
      "talent.read",
      "talent.write",
      "booking.create",
      "booking.manage",
      "contract.create",
      "escrow.view",
      "finance.view"
    ],
    defaultDashboards: [
      "Booking pipeline",
      "Talent utilization",
      "Finance overview",
      "Commission tracking"
    ],
    kpiTargets: {
      timing: {
        "Hold→Quote": "24h",
        "Signed→Escrow": "48h",
        "Proof→Client accept": "48h",
        "Accept→Payout": "24h"
      },
      cash: {
        "Deposit funded": "≥70%",
        "Cash Conversion Cycle": "≤14d",
        "Overdue invoices": "≤10%"
      },
      quality: {
        "Cancellation rate": "≤5%",
        "Dispute rate": "≤2%",
        "Double booking": "≤1%"
      }
    },
    dependencies: [],
    adoptionRate: 87,
    tenantCount: 28,
    status: "ACTIVE",
    version: "2.1.0",
    lastUpdated: "2026-02-15",
    icon: "Users",
    color: "blue"
  },

  // B2: Casting Pipeline
  {
    id: "B2",
    name: "Casting Pipeline",
    description: "Casting workflow for production houses and casting agencies. Casting call → Submissions → Shortlist → Audition → Offer → Booking.",
    category: "CORE",
    usedBy: [
      "Casting agencies",
      "Production houses",
      "Recruitment-style operators",
      "Creative agencies"
    ],
    keyWorkflows: [
      "Casting call → Submissions → Shortlist → Audition → Offer → Booking",
      "Audition scheduling",
      "Client approval workflow",
      "NDA gating"
    ],
    defaultModules: [
      "Casting/Jobs",
      "Auditions",
      "Contract Lifecycle Management (CLM)",
      "Work Management",
      "Communications & Client Portal"
    ],
    defaultRoles: [
      "Casting Director",
      "Casting Associate",
      "Producer / Project Manager",
      "Operations Manager"
    ],
    defaultPermissions: [
      "casting.create",
      "casting.publish",
      "submission.review",
      "audition.schedule",
      "shortlist.manage",
      "contract.create"
    ],
    defaultDashboards: [
      "Casting funnel",
      "Audition console",
      "Submission analytics",
      "Client approval queue"
    ],
    kpiTargets: {
      timing: {
        "Role posted→1st submission": "24h",
        "Submission→review": "72h",
        "Audition→decision": "72h"
      },
      cash: {
        "Deposit funded": "≥50%",
        "Cash Conversion Cycle": "≤21d"
      },
      quality: {
        "No-show rate": "≤8%",
        "Dispute rate": "≤1%"
      }
    },
    dependencies: [],
    adoptionRate: 38,
    tenantCount: 12,
    status: "ACTIVE",
    version: "2.0.0",
    lastUpdated: "2026-02-10",
    icon: "Video",
    color: "purple"
  },

  // B3: Season / Competition Workflow
  {
    id: "B3",
    name: "Season / Competition Workflow",
    description: "Pageant and competition management. Registration → Rounds → Scoring → Results freeze → Publish. For pageant organizers.",
    category: "SPECIALIZED",
    usedBy: [
      "Pageant organizers",
      "Competition organizers",
      "Talent hunt operators"
    ],
    keyWorkflows: [
      "Registration → Rounds → Scoring → Results (freeze) → Published → Archived",
      "Judge scoring with integrity",
      "Sponsor integration",
      "Ticketing"
    ],
    defaultModules: [
      "Events/Pageants",
      "Scoring Engine",
      "Integrity Pack",
      "Sponsors Management",
      "Ticketing (optional)"
    ],
    defaultRoles: [
      "Pageant Director",
      "Judge",
      "Moderator",
      "Sponsor Manager"
    ],
    defaultPermissions: [
      "pageant.create",
      "pageant.stage.configure",
      "pageant.results.freeze",
      "pageant.results.publish",
      "judge.assign",
      "score.submit"
    ],
    defaultDashboards: [
      "Season control center",
      "Judging console",
      "Sponsor dashboard",
      "Integrity monitoring"
    ],
    kpiTargets: {
      timing: {
        "Registration→verified": "≤72h",
        "Score lock→publish": "≤24h"
      },
      cash: {
        "Payment success": "≥95%",
        "Refund time": "≤7d"
      },
      quality: {
        "Dispute rate": "≤2%",
        "Judge completion": "≥95%"
      }
    },
    dependencies: [],
    adoptionRate: 38,
    tenantCount: 12,
    status: "ACTIVE",
    version: "2.2.0",
    lastUpdated: "2026-02-18",
    icon: "Trophy",
    color: "amber"
  },

  // B4: Brand Deals + Deliverables
  {
    id: "B4",
    name: "Brand Deals + Deliverables",
    description: "Influencer and brand campaign management. Brief → Negotiate → Contract → Deliverables → Approval → Payout.",
    category: "SPECIALIZED",
    usedBy: [
      "Influencer agencies",
      "Brand agencies",
      "Ad agencies",
      "Creator networks"
    ],
    keyWorkflows: [
      "Brief → Negotiate → Contract → Execute → Report → Settled",
      "Deliverable tracking",
      "Content approval",
      "Performance reporting"
    ],
    defaultModules: [
      "Campaigns",
      "Approvals",
      "Measurement & Attribution",
      "Escrow System",
      "Contract Lifecycle Management (CLM)"
    ],
    defaultRoles: [
      "Campaign / Deals Manager",
      "Brand Manager",
      "Operations Manager",
      "Finance Manager"
    ],
    defaultPermissions: [
      "campaign.create",
      "campaign.deal.create",
      "campaign.deliverable.approve",
      "campaign.report.view",
      "contract.create",
      "escrow.view"
    ],
    defaultDashboards: [
      "Deals dashboard",
      "Deliverables dashboard",
      "Campaign performance",
      "ROI reporting"
    ],
    kpiTargets: {
      timing: {
        "Lead→Quote": "≤48h",
        "Draft→internal approval": "≤24h",
        "Brand approval": "≤48h"
      },
      cash: {
        "Deposit funded": "≥80%",
        "Cash Conversion Cycle": "≤21d"
      },
      quality: {
        "Late deliverables": "≤10%",
        "Dispute rate": "≤2%"
      }
    },
    dependencies: [],
    adoptionRate: 25,
    tenantCount: 8,
    status: "ACTIVE",
    version: "2.0.0",
    lastUpdated: "2026-02-12",
    icon: "Megaphone",
    color: "pink"
  },

  // B5: Course / Cohort
  {
    id: "B5",
    name: "Course / Cohort",
    description: "Academy and training management. Enrollment → Training → Assessment → Certification.",
    category: "SPECIALIZED",
    usedBy: [
      "Academies",
      "Training providers",
      "Grooming institutes",
      "Skill development centers"
    ],
    keyWorkflows: [
      "Enrollment → Training → Assessment → Certification",
      "Cohort management",
      "Trainer assignment",
      "Progress tracking"
    ],
    defaultModules: [
      "Courses",
      "Cohorts",
      "Assessments",
      "Certificates",
      "Finance Ops (Ledger-based)"
    ],
    defaultRoles: [
      "Academy Manager",
      "Trainer",
      "Operations Manager",
      "Finance Manager"
    ],
    defaultPermissions: [
      "course.create",
      "cohort.manage",
      "assessment.grade",
      "certificate.issue",
      "finance.view"
    ],
    defaultDashboards: [
      "Cohort dashboard",
      "Trainer dashboard",
      "Student progress",
      "Revenue tracking"
    ],
    kpiTargets: {
      timing: {
        "Enrollment→confirmed": "≤3d",
        "Submission→graded": "≤5d",
        "Completion→certificate": "≤7d"
      },
      cash: {
        "Payment success": "≥95%"
      },
      quality: {
        "Completion rate": "≥60%",
        "Dispute rate": "≤1%"
      }
    },
    dependencies: [],
    adoptionRate: 19,
    tenantCount: 6,
    status: "ACTIVE",
    version: "1.5.0",
    lastUpdated: "2026-02-08",
    icon: "GraduationCap",
    color: "green"
  },

  // B6: Project + Assets + Approvals
  {
    id: "B6",
    name: "Project + Assets + Approvals",
    description: "Production and creative project management. Brief → Production → Review → Deliver → Payout.",
    category: "SPECIALIZED",
    usedBy: [
      "Production agencies",
      "UGC agencies",
      "Creative agencies",
      "Content studios"
    ],
    keyWorkflows: [
      "Brief → Production → Review → Deliver → Payout",
      "Asset review cycles",
      "Client approvals",
      "Vendor management"
    ],
    defaultModules: [
      "Projects",
      "Asset Approvals",
      "Vendors",
      "Finance Ops (Ledger-based)",
      "Work Management"
    ],
    defaultRoles: [
      "Producer / Project Manager",
      "Operations Manager",
      "Finance Manager",
      "Brand Manager"
    ],
    defaultPermissions: [
      "project.create",
      "asset.upload",
      "asset.approve",
      "vendor.manage",
      "finance.view"
    ],
    defaultDashboards: [
      "Project dashboard",
      "Asset approvals",
      "Vendor performance",
      "Finance overview"
    ],
    kpiTargets: {
      timing: {
        "Brief→plan": "≤48h",
        "First cut→feedback": "≤72h",
        "Final→approval": "≤5d"
      },
      cash: {
        "Deposit funded": "≥80%",
        "Cash Conversion Cycle": "≤30d"
      },
      quality: {
        "Dispute rate": "≤2%"
      }
    },
    dependencies: [],
    adoptionRate: 13,
    tenantCount: 4,
    status: "ACTIVE",
    version: "1.8.0",
    lastUpdated: "2026-02-05",
    icon: "Film",
    color: "indigo"
  },

  // B7: Shift / Staffing
  {
    id: "B7",
    name: "Shift / Staffing",
    description: "Event staffing and shift management. Job → Assign → Check-in → Complete → Payout.",
    category: "SPECIALIZED",
    usedBy: [
      "Event staffing agencies",
      "Temporary staffing",
      "Hospitality staffing"
    ],
    keyWorkflows: [
      "Job → Assign staff → Check-in → Complete → Payout",
      "Attendance tracking",
      "Timesheet approval",
      "No-show detection"
    ],
    defaultModules: [
      "Shifts",
      "Attendance",
      "Payroll-like Payouts",
      "Finance Ops (Ledger-based)"
    ],
    defaultRoles: [
      "Operations Manager",
      "Finance Manager",
      "Staff Coordinator"
    ],
    defaultPermissions: [
      "shift.create",
      "shift.assign",
      "attendance.track",
      "timesheet.approve",
      "payout.initiate"
    ],
    defaultDashboards: [
      "Shift planner",
      "Attendance tracker",
      "Payout queue",
      "Staff utilization"
    ],
    kpiTargets: {
      timing: {
        "Shift created→assigned": "24h",
        "Assigned→accepted": "12h",
        "Timesheet approval": "24h"
      },
      cash: {
        "Cash Conversion Cycle": "≤14d"
      },
      quality: {
        "No-show rate": "≤3%",
        "Dispute rate": "≤3%"
      }
    },
    dependencies: [],
    adoptionRate: 19,
    tenantCount: 6,
    status: "ACTIVE",
    version: "1.6.0",
    lastUpdated: "2026-02-07",
    icon: "Calendar",
    color: "cyan"
  },

  // B8: Community + Monetization
  {
    id: "B8",
    name: "Community + Monetization",
    description: "Talent network and community management. Join → Engage → Moderate → Reward.",
    category: "ADVANCED",
    usedBy: [
      "Talent networks",
      "Community operators",
      "Membership platforms"
    ],
    keyWorkflows: [
      "Join → Engage → Moderate → Reward",
      "Content moderation",
      "Membership tiers",
      "Reward distribution"
    ],
    defaultModules: [
      "Community",
      "Moderation",
      "Rewards",
      "Membership Tiers"
    ],
    defaultRoles: [
      "Moderator",
      "Operations Manager",
      "Community Manager"
    ],
    defaultPermissions: [
      "community.post.hide",
      "community.member.ban",
      "community.report.resolve",
      "reward.issue"
    ],
    defaultDashboards: [
      "Community health",
      "Moderation queue",
      "Growth metrics",
      "Engagement analytics"
    ],
    kpiTargets: {
      timing: {
        "Report triage": "≤6h",
        "Report resolution": "≤48h"
      },
      cash: {},
      quality: {
        "Healthy engagement": "Target",
        "Moderation SLA compliance": "≥95%"
      }
    },
    dependencies: [],
    adoptionRate: 13,
    tenantCount: 4,
    status: "ACTIVE",
    version: "1.4.0",
    lastUpdated: "2026-02-03",
    icon: "Users2",
    color: "teal"
  },

  // B9: Marketplace / Aggregator
  {
    id: "B9",
    name: "Marketplace / Aggregator",
    description: "Service marketplace and aggregator. Listing → Request → Booking → Escrow → Settlement.",
    category: "ADVANCED",
    usedBy: [
      "Service marketplaces",
      "Aggregators",
      "Multi-vendor platforms"
    ],
    keyWorkflows: [
      "Listing → Request → Booking → Escrow → Settlement",
      "Vendor onboarding",
      "Dispute safety",
      "Multi-party payouts"
    ],
    defaultModules: [
      "Vendor Onboarding",
      "Listings",
      "Booking Management",
      "Escrow System",
      "Finance Ops (Ledger-based)"
    ],
    defaultRoles: [
      "Operations Manager",
      "Finance Manager",
      "Vendor Manager"
    ],
    defaultPermissions: [
      "vendor.onboard",
      "listing.create",
      "booking.manage",
      "escrow.view",
      "payout.approve"
    ],
    defaultDashboards: [
      "Marketplace overview",
      "Vendor performance",
      "Transaction analytics",
      "Dispute queue"
    ],
    kpiTargets: {
      timing: {},
      cash: {},
      quality: {}
    },
    dependencies: ["B1"],
    adoptionRate: 13,
    tenantCount: 4,
    status: "BETA",
    version: "1.0.0",
    lastUpdated: "2026-01-28",
    icon: "Store",
    color: "orange"
  },

  // B10: Holding / Group Blueprint
  {
    id: "B10",
    name: "Holding / Group Blueprint",
    description: "Enterprise holding company management. Parent tenant → Sub-tenant management → Shared services.",
    category: "ADVANCED",
    usedBy: [
      "Enterprise holding companies",
      "Multi-brand groups",
      "Franchise operators"
    ],
    keyWorkflows: [
      "Parent tenant → Sub-tenant management → Shared services",
      "Consolidated billing",
      "Shared analytics",
      "Group governance"
    ],
    defaultModules: [
      "Sub-tenant Management",
      "Shared Billing",
      "Shared Analytics",
      "Group Governance"
    ],
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Finance Manager"
    ],
    defaultPermissions: [
      "admin.tenant.settings.update",
      "admin.tenant.suspend",
      "finance.view",
      "analytics.view"
    ],
    defaultDashboards: [
      "Group overview",
      "Sub-tenant performance",
      "Consolidated finance",
      "Governance dashboard"
    ],
    kpiTargets: {
      timing: {},
      cash: {},
      quality: {}
    },
    dependencies: [],
    adoptionRate: 6,
    tenantCount: 2,
    status: "ACTIVE",
    version: "1.2.0",
    lastUpdated: "2026-01-25",
    icon: "Building2",
    color: "slate"
  }
]

// Helper functions
export function getBlueprintById(id: BlueprintId): Blueprint | undefined {
  return seedBlueprints.find(bp => bp.id === id)
}

export function getBlueprintsByCategory(category: BlueprintCategory): Blueprint[] {
  return seedBlueprints.filter(bp => bp.category === category)
}

export function getBlueprintsByStatus(status: BlueprintStatus): Blueprint[] {
  return seedBlueprints.filter(bp => bp.status === status)
}

export function getActiveBlueprints(): Blueprint[] {
  return seedBlueprints.filter(bp => bp.status === "ACTIVE")
}

export function getBlueprintStats() {
  return {
    total: seedBlueprints.length,
    active: seedBlueprints.filter(bp => bp.status === "ACTIVE").length,
    beta: seedBlueprints.filter(bp => bp.status === "BETA").length,
    deprecated: seedBlueprints.filter(bp => bp.status === "DEPRECATED").length,
    totalTenants: seedBlueprints.reduce((sum, bp) => sum + bp.tenantCount, 0),
    avgAdoptionRate: Math.round(
      seedBlueprints.reduce((sum, bp) => sum + bp.adoptionRate, 0) / seedBlueprints.length
    )
  }
}
