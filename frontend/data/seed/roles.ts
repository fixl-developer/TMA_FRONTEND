// Roles Seed Data - Platform and Tenant Roles
// Week 16: RBAC/ABAC Management

export interface Role {
  id: string;
  name: string;
  key: string;
  type: 'PLATFORM' | 'TENANT' | 'TALENT' | 'BRAND' | 'SYSTEM';
  description: string;
  level: 'OWN' | 'ADM' | 'OPS' | 'CONTRIB' | 'FIN' | 'LEGAL' | 'MOD' | 'VIEW';
  capabilities: string[];
  isSystem: boolean;
  isAssignable: boolean;
  maxUsers?: number;
  requiresMFA: boolean;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export const platformRoles: Role[] = [
  {
    id: 'PR001',
    name: 'Root Admin',
    key: 'root_admin',
    type: 'PLATFORM',
    description: 'Full platform control - super admins, providers, billing, emergency overrides',
    level: 'OWN',
    capabilities: [
      'platform.*',
      'admin.tenant.*',
      'admin.policy.emergency_override',
      'admin.billing.*',
      'admin.security.*'
    ],
    isSystem: true,
    isAssignable: false,
    maxUsers: 5,
    requiresMFA: true,
    requiresApproval: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PR002',
    name: 'Super Admin',
    key: 'super_admin',
    type: 'PLATFORM',
    description: 'Tenant governance, global policy, escalations, platform health',
    level: 'ADM',
    capabilities: [
      'admin.tenant.view',
      'admin.tenant.settings.update',
      'admin.tenant.suspend',
      'admin.policy.manage',
      'admin.escalation.handle',
      'analytics.platform.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PR003',
    name: 'Platform Ops Admin',
    key: 'platform_ops_admin',
    type: 'PLATFORM',
    description: 'Support operations, onboarding support, incident management',
    level: 'OPS',
    capabilities: [
      'admin.tenant.view',
      'admin.support.manage',
      'admin.incident.manage',
      'admin.onboarding.assist'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PR004',
    name: 'Platform Finance Admin',
    key: 'platform_finance_admin',
    type: 'PLATFORM',
    description: 'Global payment providers, escrow oversight, refunds, escalated disputes',
    level: 'FIN',
    capabilities: [
      'finance.platform.view',
      'finance.escrow.oversight',
      'finance.payment.refund',
      'finance.dispute.escalated',
      'finance.provider.manage'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PR005',
    name: 'Trust & Safety Admin',
    key: 'trust_safety_admin',
    type: 'PLATFORM',
    description: 'Fraud monitoring, moderation escalations, enforcement, risk controls',
    level: 'ADM',
    capabilities: [
      'safety.fraud.monitor',
      'safety.moderation.escalate',
      'safety.enforcement.action',
      'safety.risk.control'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PR006',
    name: 'Security Admin',
    key: 'security_admin',
    type: 'PLATFORM',
    description: 'Security configuration, access reviews, audit exports, breach response',
    level: 'ADM',
    capabilities: [
      'security.config.manage',
      'security.access.review',
      'security.audit.export',
      'security.breach.respond'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PR007',
    name: 'Compliance Admin',
    key: 'compliance_admin',
    type: 'PLATFORM',
    description: 'Retention policies, privacy requests, compliance reporting',
    level: 'ADM',
    capabilities: [
      'compliance.retention.manage',
      'compliance.privacy.handle',
      'compliance.report.generate',
      'compliance.evidence.package'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const tenantRoles: Role[] = [
  {
    id: 'TR001',
    name: 'Tenant Owner',
    key: 'tenant_owner',
    type: 'TENANT',
    description: 'Owns tenant - billing, entitlements, critical approvals, admin management',
    level: 'OWN',
    capabilities: [
      'tenant.*',
      'admin.tenant.settings.*',
      'admin.billing.*',
      'admin.user.manage',
      'admin.role.manage',
      'finance.escrow.release',
      'finance.payout.approve'
    ],
    isSystem: false,
    isAssignable: true,
    maxUsers: 3,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR002',
    name: 'Tenant Admin',
    key: 'tenant_admin',
    type: 'TENANT',
    description: 'User/role management, module configs, workflow configs, integrations',
    level: 'ADM',
    capabilities: [
      'admin.user.manage',
      'admin.role.assign',
      'admin.module.configure',
      'admin.workflow.configure',
      'admin.integration.manage'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR003',
    name: 'Operations Manager',
    key: 'operations_manager',
    type: 'TENANT',
    description: 'Runs daily ops across pipelines - assign work, manage SLAs',
    level: 'OPS',
    capabilities: [
      'crm.lead.manage',
      'crm.deal.assign',
      'booking.manage',
      'casting.manage',
      'project.manage',
      'workflow.execute'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR004',
    name: 'Agent / Booker',
    key: 'agent_booker',
    type: 'TENANT',
    description: 'Talent sourcing, roster management, submissions, bookings, deals',
    level: 'OPS',
    capabilities: [
      'talent.roster.manage',
      'booking.create',
      'booking.manage',
      'casting.submission.create',
      'crm.lead.create',
      'contracts.contract.send'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR005',
    name: 'Casting Director',
    key: 'casting_director',
    type: 'TENANT',
    description: 'Creates castings, reviews submissions, schedules auditions, shortlists',
    level: 'OPS',
    capabilities: [
      'casting.call.create',
      'casting.call.publish',
      'casting.submission.review',
      'casting.audition.schedule',
      'casting.submission.shortlist'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR006',
    name: 'Pageant Director',
    key: 'pageant_director',
    type: 'TENANT',
    description: 'Creates season/stages, manages judges, controls results workflow',
    level: 'OPS',
    capabilities: [
      'pageant.season.create',
      'pageant.stage.configure',
      'pageant.judge.manage',
      'pageant.results.freeze',
      'pageant.results.publish'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR007',
    name: 'Campaign Manager',
    key: 'campaign_manager',
    type: 'TENANT',
    description: 'Runs brand deals, deliverables, approvals, reporting',
    level: 'OPS',
    capabilities: [
      'campaign.deal.create',
      'campaign.deliverable.manage',
      'campaign.deliverable.approve',
      'campaign.report.view',
      'contracts.contract.send'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR008',
    name: 'Finance Manager',
    key: 'finance_manager',
    type: 'TENANT',
    description: 'Invoice, escrow milestones, settlement, payout initiation (maker-checker)',
    level: 'FIN',
    capabilities: [
      'finance.invoice.create',
      'finance.invoice.send',
      'finance.escrow.create',
      'finance.payment.record',
      'finance.payout.initiate',
      'finance.settlement.create'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR009',
    name: 'Legal Manager',
    key: 'legal_manager',
    type: 'TENANT',
    description: 'Contract templates, clause library, negotiation approvals, dispute decisions',
    level: 'LEGAL',
    capabilities: [
      'contracts.template.manage',
      'contracts.clause.manage',
      'contracts.contract.approve',
      'contracts.addendum.approve',
      'dispute.decision.make'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR010',
    name: 'Producer / Project Manager',
    key: 'producer_pm',
    type: 'TENANT',
    description: 'Production workflows - tasks, assets, approvals, vendors',
    level: 'OPS',
    capabilities: [
      'project.create',
      'project.task.manage',
      'project.asset.manage',
      'project.approval.request',
      'vendor.manage'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR011',
    name: 'Moderator',
    key: 'moderator',
    type: 'TENANT',
    description: 'Community and content moderation actions',
    level: 'MOD',
    capabilities: [
      'community.post.hide',
      'community.post.remove',
      'community.member.warn',
      'community.member.ban',
      'community.report.resolve'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR012',
    name: 'Support Agent',
    key: 'support_agent',
    type: 'TENANT',
    description: 'Helps users with tickets - mostly read-only with limited actions',
    level: 'VIEW',
    capabilities: [
      'support.ticket.view',
      'support.ticket.respond',
      'crm.account.view',
      'talent.profile.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TR013',
    name: 'Viewer / Auditor',
    key: 'viewer_auditor',
    type: 'TENANT',
    description: 'Read-only reporting for sponsors/auditors/clients',
    level: 'VIEW',
    capabilities: [
      'analytics.view',
      'report.view',
      'audit.log.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const talentRoles: Role[] = [
  {
    id: 'TLR001',
    name: 'Talent / Creator',
    key: 'talent_creator',
    type: 'TALENT',
    description: 'Manage profile, apply, submit deliverables, view earnings, raise disputes',
    level: 'CONTRIB',
    capabilities: [
      'talent.profile.manage',
      'casting.submission.create',
      'campaign.deliverable.submit',
      'finance.earnings.view',
      'dispute.raise'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TLR002',
    name: 'Talent Manager',
    key: 'talent_manager',
    type: 'TALENT',
    description: 'Manages multiple talents - visibility, submissions, coordination',
    level: 'OPS',
    capabilities: [
      'talent.profile.view',
      'talent.profile.update',
      'casting.submission.create',
      'booking.coordinate',
      'finance.earnings.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TLR003',
    name: 'Guardian',
    key: 'guardian',
    type: 'TALENT',
    description: 'Consent approvals, privacy controls, approval gates for minors',
    level: 'OPS',
    capabilities: [
      'talent.minor.consent',
      'talent.minor.privacy',
      'booking.minor.approve',
      'contract.minor.approve'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const brandRoles: Role[] = [
  {
    id: 'BR001',
    name: 'Brand Admin',
    key: 'brand_admin',
    type: 'BRAND',
    description: 'Manage brand tenant users, campaigns, approvals, reporting',
    level: 'ADM',
    capabilities: [
      'brand.user.manage',
      'campaign.manage',
      'campaign.deliverable.approve',
      'campaign.report.view',
      'finance.invoice.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: true,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'BR002',
    name: 'Brand Manager',
    key: 'brand_manager',
    type: 'BRAND',
    description: 'Day-to-day campaign execution and approvals',
    level: 'OPS',
    capabilities: [
      'campaign.create',
      'campaign.deliverable.approve',
      'campaign.report.view',
      'casting.shortlist.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'BR003',
    name: 'Sponsor Manager',
    key: 'sponsor_manager',
    type: 'BRAND',
    description: 'Sponsorship deliverables and event reporting',
    level: 'OPS',
    capabilities: [
      'pageant.sponsor.manage',
      'pageant.deliverable.track',
      'pageant.report.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'BR004',
    name: 'Brand Viewer',
    key: 'brand_viewer',
    type: 'BRAND',
    description: 'View-only access to reports and shortlists',
    level: 'VIEW',
    capabilities: [
      'campaign.report.view',
      'casting.shortlist.view',
      'analytics.view'
    ],
    isSystem: false,
    isAssignable: true,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const systemRoles: Role[] = [
  {
    id: 'SR001',
    name: 'Automation Ops',
    key: 'automation_ops',
    type: 'SYSTEM',
    description: 'Runs operational automations with least privilege',
    level: 'OPS',
    capabilities: [
      'automation.workflow.execute',
      'automation.task.create',
      'automation.notification.send'
    ],
    isSystem: true,
    isAssignable: false,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SR002',
    name: 'Automation Finance',
    key: 'automation_finance',
    type: 'SYSTEM',
    description: 'Runs finance automations with strict limits',
    level: 'FIN',
    capabilities: [
      'finance.invoice.auto_create',
      'finance.reminder.send',
      'finance.commission.calculate'
    ],
    isSystem: true,
    isAssignable: false,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SR003',
    name: 'Automation Moderation',
    key: 'automation_moderation',
    type: 'SYSTEM',
    description: 'Runs moderation workflows',
    level: 'MOD',
    capabilities: [
      'community.content.scan',
      'community.spam.detect',
      'community.report.auto_triage'
    ],
    isSystem: true,
    isAssignable: false,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SR004',
    name: 'Notifications Service',
    key: 'notifications_service',
    type: 'SYSTEM',
    description: 'Dispatches notifications',
    level: 'OPS',
    capabilities: [
      'notification.email.send',
      'notification.sms.send',
      'notification.push.send'
    ],
    isSystem: true,
    isAssignable: false,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SR005',
    name: 'Payments Webhook',
    key: 'payments_webhook',
    type: 'SYSTEM',
    description: 'Processes provider webhooks with reconciliation-only permissions',
    level: 'FIN',
    capabilities: [
      'finance.payment.reconcile',
      'finance.webhook.process'
    ],
    isSystem: true,
    isAssignable: false,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SR006',
    name: 'Policy Engine',
    key: 'policy_engine',
    type: 'SYSTEM',
    description: 'Policy decision service',
    level: 'ADM',
    capabilities: [
      'policy.evaluate',
      'policy.decision.make'
    ],
    isSystem: true,
    isAssignable: false,
    requiresMFA: false,
    requiresApproval: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const allRoles = [
  ...platformRoles,
  ...tenantRoles,
  ...talentRoles,
  ...brandRoles,
  ...systemRoles
];

// Role statistics
export const roleStats = {
  total: allRoles.length,
  byType: {
    PLATFORM: platformRoles.length,
    TENANT: tenantRoles.length,
    TALENT: talentRoles.length,
    BRAND: brandRoles.length,
    SYSTEM: systemRoles.length
  },
  byLevel: {
    OWN: allRoles.filter(r => r.level === 'OWN').length,
    ADM: allRoles.filter(r => r.level === 'ADM').length,
    OPS: allRoles.filter(r => r.level === 'OPS').length,
    CONTRIB: allRoles.filter(r => r.level === 'CONTRIB').length,
    FIN: allRoles.filter(r => r.level === 'FIN').length,
    LEGAL: allRoles.filter(r => r.level === 'LEGAL').length,
    MOD: allRoles.filter(r => r.level === 'MOD').length,
    VIEW: allRoles.filter(r => r.level === 'VIEW').length
  },
  assignable: allRoles.filter(r => r.isAssignable).length,
  requiresMFA: allRoles.filter(r => r.requiresMFA).length,
  requiresApproval: allRoles.filter(r => r.requiresApproval).length
};
