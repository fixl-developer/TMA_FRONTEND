/**
 * Template Seed Data (T1-T8)
 * 
 * Tenant Template = Blueprint bundle + default roles + workflows + dashboards + policies + automations.
 * Templates let a new tenant start operating immediately and later add more blueprints without breaking data or permissions.
 * 
 * Source: updated.md - Section 4. Tenant Template System
 */

export type TemplateId = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8"

export type TemplateComplexity = "SIMPLE" | "MODERATE" | "COMPLEX"

export interface Template {
  id: TemplateId
  name: string
  description: string
  usedBy: string[] // Agency types that use this template
  blueprints: string[] // Blueprint IDs included (e.g., ["B1", "B2"])
  coreWorkflow: string // Main workflow description
  defaultRoles: string[]
  defaultDashboards: string[]
  kpiTargets: {
    timing: Record<string, string>
    cash: Record<string, string>
    quality: Record<string, string>
  }
  setupTime: string // e.g., "3-5 days"
  complexity: TemplateComplexity
  tenantCount: number // Number of tenants using this template
  successRate: number // Percentage (0-100)
  monthlyRevenue: string // Average monthly revenue
  features: string[] // Key features
  icon: string
  color: string
}

export const seedTemplates: Template[] = [
  // T1: Roster + Booking Agency
  {
    id: "T1",
    name: "Roster + Booking Agency",
    description: "Complete solution for modeling agencies, talent agencies, and speaker bureaus. Manage talent roster, handle bookings, contracts, and commission splits.",
    usedBy: [
      "Modeling agencies",
      "Talent agencies",
      "Speaker bureaus",
      "Artist management companies"
    ],
    blueprints: ["B1"],
    coreWorkflow: "Inquiry → Hold → Contract → Escrow → Delivery → Payout",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Agent / Booker",
      "Operations Manager",
      "Finance Manager",
      "Talent Manager"
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
    setupTime: "3-5 days",
    complexity: "SIMPLE",
    tenantCount: 28,
    successRate: 94,
    monthlyRevenue: "₹180K",
    features: [
      "Talent roster management",
      "Booking calendar",
      "Option holds",
      "Contract generation",
      "Escrow payments",
      "Commission splits",
      "Availability tracking",
      "Client portal"
    ],
    icon: "Users",
    color: "blue"
  },

  // T2: Casting Pipeline Office
  {
    id: "T2",
    name: "Casting Pipeline Office",
    description: "Streamlined casting workflow for casting agencies and production houses. Manage casting calls, submissions, auditions, and offers.",
    usedBy: [
      "Casting agencies",
      "Production houses",
      "Creative recruitment agencies"
    ],
    blueprints: ["B2"],
    coreWorkflow: "Casting call → Submissions → Shortlist → Audition → Offer → Booking",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Casting Director",
      "Casting Associate",
      "Producer / Project Manager",
      "Operations Manager"
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
    setupTime: "4-6 days",
    complexity: "MODERATE",
    tenantCount: 12,
    successRate: 89,
    monthlyRevenue: "₹145K",
    features: [
      "Casting call creation",
      "Submission management",
      "Audition scheduling",
      "Shortlisting tools",
      "Client approvals",
      "NDA gating",
      "Call sheets",
      "Talent database"
    ],
    icon: "Video",
    color: "purple"
  },

  // T3: Pageant Season Operator
  {
    id: "T3",
    name: "Pageant Season Operator",
    description: "Complete pageant management system with integrity controls. Manage registrations, rounds, judging, scoring, and results with full transparency.",
    usedBy: [
      "Pageant organizers",
      "Competition organizers",
      "Beauty pageants",
      "Talent hunts"
    ],
    blueprints: ["B3", "B8"],
    coreWorkflow: "Registration → Verification → Rounds → Judging → Results → Payout",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Pageant Director",
      "Judge",
      "Moderator",
      "Sponsor Manager",
      "Operations Manager"
    ],
    defaultDashboards: [
      "Season control center",
      "Judging console",
      "Sponsor dashboard",
      "Integrity monitoring",
      "Community health"
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
    setupTime: "5-7 days",
    complexity: "COMPLEX",
    tenantCount: 12,
    successRate: 92,
    monthlyRevenue: "₹220K",
    features: [
      "Season builder",
      "Registration management",
      "Multi-round scoring",
      "Judge assignment",
      "Integrity controls",
      "Result freeze/publish",
      "Sponsor integration",
      "Ticketing",
      "Community features"
    ],
    icon: "Trophy",
    color: "amber"
  },

  // T4: Influencer / Brand Deals Agency
  {
    id: "T4",
    name: "Influencer / Brand Deals Agency",
    description: "Manage influencer campaigns and brand partnerships. Track deliverables, approvals, and performance metrics.",
    usedBy: [
      "Influencer agencies",
      "Brand agencies",
      "Creator networks",
      "Social media agencies"
    ],
    blueprints: ["B4"],
    coreWorkflow: "Brief → Negotiation → Contract → Deliverables → Approval → Payout",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Campaign / Deals Manager",
      "Brand Manager",
      "Operations Manager",
      "Finance Manager"
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
    setupTime: "4-6 days",
    complexity: "MODERATE",
    tenantCount: 8,
    successRate: 91,
    monthlyRevenue: "₹195K",
    features: [
      "Campaign management",
      "Deliverable tracking",
      "Content approvals",
      "Performance reporting",
      "ROI analytics",
      "Brand portal",
      "Escrow payments",
      "Multi-platform support"
    ],
    icon: "Megaphone",
    color: "pink"
  },

  // T5: Academy / Training Provider
  {
    id: "T5",
    name: "Academy / Training Provider",
    description: "Complete learning management system for academies and training providers. Manage courses, cohorts, assessments, and certifications.",
    usedBy: [
      "Academies",
      "Training providers",
      "Grooming institutes",
      "Skill development centers"
    ],
    blueprints: ["B5"],
    coreWorkflow: "Enrollment → Training → Assessment → Certification",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Academy Manager",
      "Trainer",
      "Operations Manager",
      "Finance Manager"
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
    setupTime: "4-6 days",
    complexity: "MODERATE",
    tenantCount: 6,
    successRate: 88,
    monthlyRevenue: "₹125K",
    features: [
      "Course management",
      "Cohort scheduling",
      "Assessment tools",
      "Certificate generation",
      "Progress tracking",
      "Trainer assignment",
      "Revenue sharing",
      "Student portal"
    ],
    icon: "GraduationCap",
    color: "green"
  },

  // T6: Production / Creative Services Agency
  {
    id: "T6",
    name: "Production / Creative Services Agency",
    description: "Project management for production and creative agencies. Manage projects, assets, approvals, and vendor coordination.",
    usedBy: [
      "Production agencies",
      "UGC agencies",
      "Creative agencies",
      "Content studios"
    ],
    blueprints: ["B6"],
    coreWorkflow: "Brief → Production → Review → Deliver → Payout",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Producer / Project Manager",
      "Operations Manager",
      "Finance Manager",
      "Brand Manager"
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
    setupTime: "5-7 days",
    complexity: "COMPLEX",
    tenantCount: 4,
    successRate: 87,
    monthlyRevenue: "₹210K",
    features: [
      "Project management",
      "Asset management",
      "Approval workflows",
      "Vendor coordination",
      "Run-of-show templates",
      "Client portal",
      "Milestone tracking",
      "Budget management"
    ],
    icon: "Film",
    color: "indigo"
  },

  // T7: Event Staffing Agency
  {
    id: "T7",
    name: "Event Staffing Agency",
    description: "Shift and staffing management for event agencies. Manage shifts, attendance, timesheets, and payouts.",
    usedBy: [
      "Event staffing agencies",
      "Temporary staffing",
      "Hospitality staffing"
    ],
    blueprints: ["B7"],
    coreWorkflow: "Job → Assign staff → Check-in → Complete → Payout",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Operations Manager",
      "Finance Manager",
      "Staff Coordinator"
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
    setupTime: "3-5 days",
    complexity: "SIMPLE",
    tenantCount: 6,
    successRate: 90,
    monthlyRevenue: "₹135K",
    features: [
      "Shift scheduling",
      "Staff assignment",
      "Check-in/check-out",
      "Timesheet management",
      "No-show detection",
      "Automated payouts",
      "Staff database",
      "Attendance tracking"
    ],
    icon: "Calendar",
    color: "cyan"
  },

  // T8: Community Network Operator
  {
    id: "T8",
    name: "Community Network Operator",
    description: "Community and network management for talent communities. Manage members, content, moderation, and rewards.",
    usedBy: [
      "Talent networks",
      "Community operators",
      "Membership platforms"
    ],
    blueprints: ["B8"],
    coreWorkflow: "Join → Participate → Moderate → Reward",
    defaultRoles: [
      "Tenant Owner",
      "Tenant Admin",
      "Moderator",
      "Operations Manager",
      "Community Manager"
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
    setupTime: "4-6 days",
    complexity: "MODERATE",
    tenantCount: 4,
    successRate: 85,
    monthlyRevenue: "₹95K",
    features: [
      "Community management",
      "Content moderation",
      "Member tiers",
      "Reward system",
      "Engagement tracking",
      "Safety controls",
      "Growth analytics",
      "Event management"
    ],
    icon: "Users2",
    color: "teal"
  }
]

// Helper functions
export function getTemplateById(id: TemplateId): Template | undefined {
  return seedTemplates.find(t => t.id === id)
}

export function getTemplatesByComplexity(complexity: TemplateComplexity): Template[] {
  return seedTemplates.filter(t => t.complexity === complexity)
}

export function getTemplatesByBlueprint(blueprintId: string): Template[] {
  return seedTemplates.filter(t => t.blueprints.includes(blueprintId))
}

export function getTemplateStats() {
  return {
    total: seedTemplates.length,
    simple: seedTemplates.filter(t => t.complexity === "SIMPLE").length,
    moderate: seedTemplates.filter(t => t.complexity === "MODERATE").length,
    complex: seedTemplates.filter(t => t.complexity === "COMPLEX").length,
    totalTenants: seedTemplates.reduce((sum, t) => sum + t.tenantCount, 0),
    avgSuccessRate: Math.round(
      seedTemplates.reduce((sum, t) => sum + t.successRate, 0) / seedTemplates.length
    )
  }
}
