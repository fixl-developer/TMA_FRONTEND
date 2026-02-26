// Trust & Safety Seed Data
// Week 19-20: Trust & Safety System

export interface Dispute {
  id: string;
  tenantId: string;
  tenantName: string;
  reporterId: string;
  reporterName: string;
  reporterType: 'TENANT_ADMIN' | 'TALENT' | 'CLIENT' | 'SYSTEM';
  disputeType: 'PAYMENT_DISPUTE' | 'CONTRACT_VIOLATION' | 'HARASSMENT' | 'FRAUD' | 'CONTENT_VIOLATION' | 'PLATFORM_ABUSE' | 'DATA_BREACH' | 'DISCRIMINATION';
  category: 'FINANCIAL' | 'BEHAVIORAL' | 'CONTENT' | 'SECURITY' | 'COMPLIANCE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED' | 'CLOSED' | 'APPEALED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  title: string;
  description: string;
  evidence: {
    type: 'SCREENSHOT' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'LOG' | 'EMAIL';
    filename: string;
    url: string;
    uploadedAt: string;
  }[];
  involvedParties: {
    id: string;
    name: string;
    type: 'TENANT' | 'TALENT' | 'CLIENT' | 'ADMIN';
    role: string;
  }[];
  timeline: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
  resolution?: {
    outcome: 'DISMISSED' | 'WARNING_ISSUED' | 'SUSPENSION' | 'TERMINATION' | 'REFUND_ISSUED' | 'POLICY_CHANGE';
    details: string;
    compensationAmount?: number;
    actionTaken: string;
    resolvedBy: string;
    resolvedAt: string;
  };
  appeal?: {
    submittedAt: string;
    submittedBy: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'DENIED';
    reviewedBy?: string;
    reviewedAt?: string;
    decision?: string;
  };
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  tags: string[];
  impact: 'SINGLE_USER' | 'MULTIPLE_USERS' | 'TENANT_WIDE' | 'PLATFORM_WIDE';
  riskScore: number;
}

export interface EnforcementAction {
  id: string;
  disputeId?: string;
  tenantId: string;
  tenantName: string;
  targetId: string;
  targetName: string;
  targetType: 'TENANT' | 'USER' | 'TALENT' | 'ADMIN';
  actionType: 'WARNING' | 'TEMPORARY_SUSPENSION' | 'PERMANENT_SUSPENSION' | 'ACCOUNT_TERMINATION' | 'FEATURE_RESTRICTION' | 'PAYMENT_HOLD' | 'CONTENT_REMOVAL';
  reason: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  duration?: number; // in days for temporary actions
  restrictions?: string[];
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'APPEALED' | 'OVERTURNED';
  effectiveFrom: string;
  effectiveUntil?: string;
  createdBy: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  appeal?: {
    submittedAt: string;
    submittedBy: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'DENIED';
    reviewedBy?: string;
    reviewedAt?: string;
    decision?: string;
  };
  impact: {
    usersAffected: number;
    revenueImpact: number;
    reputationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export interface SafetyAlert {
  id: string;
  type: 'FRAUD_DETECTION' | 'UNUSUAL_ACTIVITY' | 'POLICY_VIOLATION' | 'SECURITY_THREAT' | 'COMPLIANCE_ISSUE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  tenantId?: string;
  tenantName?: string;
  userId?: string;
  userName?: string;
  detectedAt: string;
  status: 'NEW' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  assignedTo?: string;
  riskScore: number;
  indicators: string[];
  recommendedActions: string[];
  autoActions?: {
    action: string;
    executedAt: string;
    result: string;
  }[];
  investigation?: {
    startedAt: string;
    investigator: string;
    findings: string;
    conclusion: string;
    completedAt?: string;
  };
}

export interface AppealCase {
  id: string;
  originalDisputeId?: string;
  originalActionId?: string;
  appealType: 'DISPUTE_DECISION' | 'ENFORCEMENT_ACTION' | 'ACCOUNT_SUSPENSION' | 'CONTENT_REMOVAL';
  appellantId: string;
  appellantName: string;
  appellantType: 'TENANT' | 'USER' | 'TALENT';
  reason: string;
  description: string;
  evidence: {
    type: string;
    filename: string;
    url: string;
    uploadedAt: string;
  }[];
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'ESCALATED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  decision?: {
    outcome: 'UPHELD' | 'OVERTURNED' | 'MODIFIED';
    reasoning: string;
    newAction?: string;
    compensationOffered?: number;
  };
  timeline: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
}

// Mock disputes data
export const disputes: Dispute[] = [
  {
    id: 'DISP001',
    tenantId: 'T001',
    tenantName: 'Elite Models Agency',
    reporterId: 'U123',
    reporterName: 'Sarah Johnson',
    reporterType: 'TALENT',
    disputeType: 'PAYMENT_DISPUTE',
    category: 'FINANCIAL',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    priority: 'HIGH',
    title: 'Unpaid modeling fees for fashion shoot',
    description: 'Client has not paid agreed modeling fees of $2,500 for a 3-day fashion shoot completed 45 days ago. Multiple follow-ups have been ignored.',
    evidence: [
      {
        type: 'DOCUMENT',
        filename: 'contract_signed.pdf',
        url: '/evidence/contract_signed.pdf',
        uploadedAt: '2024-02-20T10:30:00Z'
      },
      {
        type: 'EMAIL',
        filename: 'payment_followup_emails.pdf',
        url: '/evidence/payment_followup_emails.pdf',
        uploadedAt: '2024-02-20T10:35:00Z'
      }
    ],
    involvedParties: [
      { id: 'T001', name: 'Elite Models Agency', type: 'TENANT', role: 'Agency' },
      { id: 'U123', name: 'Sarah Johnson', type: 'TALENT', role: 'Model' },
      { id: 'C456', name: 'Fashion Brand Inc', type: 'CLIENT', role: 'Client' }
    ],
    timeline: [
      {
        timestamp: '2024-02-20T10:00:00Z',
        action: 'Dispute Created',
        actor: 'Sarah Johnson',
        details: 'Initial dispute filed for unpaid modeling fees'
      },
      {
        timestamp: '2024-02-20T14:30:00Z',
        action: 'Evidence Uploaded',
        actor: 'Sarah Johnson',
        details: 'Contract and email correspondence uploaded'
      },
      {
        timestamp: '2024-02-21T09:00:00Z',
        action: 'Investigation Started',
        actor: 'Trust & Safety Team',
        details: 'Case assigned to investigator for review'
      }
    ],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-21T09:00:00Z',
    assignedTo: 'admin@platform.com',
    tags: ['payment', 'modeling', 'contract'],
    impact: 'SINGLE_USER',
    riskScore: 75
  },
  {
    id: 'DISP002',
    tenantId: 'T002',
    tenantName: 'Global Pageants Inc',
    reporterId: 'U456',
    reporterName: 'Maria Rodriguez',
    reporterType: 'TENANT_ADMIN',
    disputeType: 'HARASSMENT',
    category: 'BEHAVIORAL',
    severity: 'CRITICAL',
    status: 'ESCALATED',
    priority: 'URGENT',
    title: 'Inappropriate behavior by judge during pageant',
    description: 'Judge made inappropriate comments and advances towards contestants during the Miss State 2024 pageant. Multiple contestants have come forward.',
    evidence: [
      {
        type: 'VIDEO',
        filename: 'incident_recording.mp4',
        url: '/evidence/incident_recording.mp4',
        uploadedAt: '2024-02-22T16:45:00Z'
      },
      {
        type: 'DOCUMENT',
        filename: 'witness_statements.pdf',
        url: '/evidence/witness_statements.pdf',
        uploadedAt: '2024-02-22T17:00:00Z'
      }
    ],
    involvedParties: [
      { id: 'T002', name: 'Global Pageants Inc', type: 'TENANT', role: 'Organizer' },
      { id: 'J789', name: 'John Judge', type: 'CLIENT', role: 'Judge' },
      { id: 'U456', name: 'Maria Rodriguez', type: 'ADMIN', role: 'Pageant Director' }
    ],
    timeline: [
      {
        timestamp: '2024-02-22T16:30:00Z',
        action: 'Incident Reported',
        actor: 'Maria Rodriguez',
        details: 'Multiple contestants reported inappropriate behavior'
      },
      {
        timestamp: '2024-02-22T17:00:00Z',
        action: 'Evidence Collected',
        actor: 'Maria Rodriguez',
        details: 'Video evidence and witness statements gathered'
      },
      {
        timestamp: '2024-02-22T18:00:00Z',
        action: 'Case Escalated',
        actor: 'Trust & Safety Team',
        details: 'Escalated to senior management due to severity'
      }
    ],
    createdAt: '2024-02-22T16:30:00Z',
    updatedAt: '2024-02-22T18:00:00Z',
    assignedTo: 'senior-admin@platform.com',
    tags: ['harassment', 'pageant', 'judge', 'urgent'],
    impact: 'MULTIPLE_USERS',
    riskScore: 95
  },
  {
    id: 'DISP003',
    tenantId: 'T003',
    tenantName: 'Risky Talent Co',
    reporterId: 'SYSTEM',
    reporterName: 'Automated Detection',
    reporterType: 'SYSTEM',
    disputeType: 'FRAUD',
    category: 'SECURITY',
    severity: 'HIGH',
    status: 'OPEN',
    priority: 'HIGH',
    title: 'Suspicious financial transactions detected',
    description: 'Automated system detected unusual payment patterns and potential money laundering activity through talent payments.',
    evidence: [
      {
        type: 'LOG',
        filename: 'transaction_logs.csv',
        url: '/evidence/transaction_logs.csv',
        uploadedAt: '2024-02-23T08:15:00Z'
      },
      {
        type: 'DOCUMENT',
        filename: 'fraud_analysis_report.pdf',
        url: '/evidence/fraud_analysis_report.pdf',
        uploadedAt: '2024-02-23T08:20:00Z'
      }
    ],
    involvedParties: [
      { id: 'T003', name: 'Risky Talent Co', type: 'TENANT', role: 'Agency' },
      { id: 'U789', name: 'Bob Suspicious', type: 'ADMIN', role: 'Owner' }
    ],
    timeline: [
      {
        timestamp: '2024-02-23T08:00:00Z',
        action: 'Fraud Alert Triggered',
        actor: 'Automated System',
        details: 'Unusual transaction patterns detected by ML model'
      },
      {
        timestamp: '2024-02-23T08:15:00Z',
        action: 'Evidence Generated',
        actor: 'Automated System',
        details: 'Transaction logs and analysis report generated'
      }
    ],
    createdAt: '2024-02-23T08:00:00Z',
    updatedAt: '2024-02-23T08:20:00Z',
    tags: ['fraud', 'automated', 'financial', 'ml-detection'],
    impact: 'TENANT_WIDE',
    riskScore: 88
  }
];

// Mock enforcement actions
export const enforcementActions: EnforcementAction[] = [
  {
    id: 'ENF001',
    disputeId: 'DISP002',
    tenantId: 'T002',
    tenantName: 'Global Pageants Inc',
    targetId: 'J789',
    targetName: 'John Judge',
    targetType: 'USER',
    actionType: 'PERMANENT_SUSPENSION',
    reason: 'Sexual harassment of contestants',
    description: 'Permanent suspension from platform due to inappropriate behavior and harassment of pageant contestants.',
    severity: 'CRITICAL',
    restrictions: ['Platform access revoked', 'Judge privileges removed', 'Contact restrictions'],
    status: 'ACTIVE',
    effectiveFrom: '2024-02-22T20:00:00Z',
    createdBy: 'senior-admin@platform.com',
    createdAt: '2024-02-22T20:00:00Z',
    impact: {
      usersAffected: 1,
      revenueImpact: 0,
      reputationRisk: 'HIGH'
    }
  },
  {
    id: 'ENF002',
    tenantId: 'T003',
    tenantName: 'Risky Talent Co',
    targetId: 'T003',
    targetName: 'Risky Talent Co',
    targetType: 'TENANT',
    actionType: 'TEMPORARY_SUSPENSION',
    reason: 'Suspicious financial activity under investigation',
    description: 'Temporary suspension of payment processing while fraud investigation is ongoing.',
    severity: 'HIGH',
    duration: 14,
    restrictions: ['Payment processing suspended', 'New bookings disabled', 'Withdrawal restrictions'],
    status: 'ACTIVE',
    effectiveFrom: '2024-02-23T10:00:00Z',
    effectiveUntil: '2024-03-08T10:00:00Z',
    createdBy: 'admin@platform.com',
    createdAt: '2024-02-23T10:00:00Z',
    impact: {
      usersAffected: 15,
      revenueImpact: 12000,
      reputationRisk: 'MEDIUM'
    }
  },
  {
    id: 'ENF003',
    tenantId: 'T001',
    tenantName: 'Elite Models Agency',
    targetId: 'C456',
    targetName: 'Fashion Brand Inc',
    targetType: 'USER',
    actionType: 'WARNING',
    reason: 'Late payment to talent',
    description: 'Official warning issued for delayed payment to talent. Future violations may result in suspension.',
    severity: 'MEDIUM',
    restrictions: ['Payment monitoring enabled', 'Escrow required for future bookings'],
    status: 'ACTIVE',
    effectiveFrom: '2024-02-21T15:00:00Z',
    createdBy: 'admin@platform.com',
    createdAt: '2024-02-21T15:00:00Z',
    impact: {
      usersAffected: 1,
      revenueImpact: 0,
      reputationRisk: 'LOW'
    }
  }
];

// Mock safety alerts
export const safetyAlerts: SafetyAlert[] = [
  {
    id: 'ALERT001',
    type: 'FRAUD_DETECTION',
    severity: 'HIGH',
    title: 'Unusual Payment Pattern Detected',
    description: 'ML model detected potential money laundering through rapid high-value transactions',
    tenantId: 'T003',
    tenantName: 'Risky Talent Co',
    detectedAt: '2024-02-23T08:00:00Z',
    status: 'INVESTIGATING',
    assignedTo: 'fraud-team@platform.com',
    riskScore: 88,
    indicators: [
      'Multiple high-value transactions in short timeframe',
      'Unusual geographic patterns',
      'New payment methods added recently',
      'Transactions outside normal business hours'
    ],
    recommendedActions: [
      'Suspend payment processing',
      'Request additional documentation',
      'Manual review of all transactions',
      'Contact tenant for explanation'
    ],
    autoActions: [
      {
        action: 'Payment processing temporarily suspended',
        executedAt: '2024-02-23T08:05:00Z',
        result: 'Success - All outgoing payments blocked'
      }
    ]
  },
  {
    id: 'ALERT002',
    type: 'UNUSUAL_ACTIVITY',
    severity: 'MEDIUM',
    title: 'Spike in Failed Login Attempts',
    description: 'Significant increase in failed login attempts across multiple tenant accounts',
    detectedAt: '2024-02-24T14:30:00Z',
    status: 'NEW',
    riskScore: 65,
    indicators: [
      'Failed login attempts increased by 300%',
      'Attempts from multiple IP addresses',
      'Targeting admin accounts',
      'Dictionary attack patterns detected'
    ],
    recommendedActions: [
      'Enable additional security measures',
      'Force password resets for affected accounts',
      'Implement IP blocking',
      'Notify affected tenants'
    ]
  },
  {
    id: 'ALERT003',
    type: 'POLICY_VIOLATION',
    severity: 'LOW',
    title: 'Content Policy Violation',
    description: 'Automated content scanning detected potentially inappropriate images',
    tenantId: 'T004',
    tenantName: 'Fashion Academy Pro',
    userId: 'U567',
    userName: 'Student User',
    detectedAt: '2024-02-24T16:45:00Z',
    status: 'RESOLVED',
    assignedTo: 'content-team@platform.com',
    riskScore: 25,
    indicators: [
      'Image flagged by AI content filter',
      'Potential nudity detected',
      'Uploaded to public portfolio'
    ],
    recommendedActions: [
      'Remove content from public view',
      'Notify user of policy violation',
      'Provide content guidelines'
    ],
    autoActions: [
      {
        action: 'Content automatically hidden from public view',
        executedAt: '2024-02-24T16:46:00Z',
        result: 'Success - Content removed from public portfolio'
      }
    ],
    investigation: {
      startedAt: '2024-02-24T17:00:00Z',
      investigator: 'content-moderator@platform.com',
      findings: 'Image was artistic photography within acceptable guidelines',
      conclusion: 'False positive - content restored with appropriate age restrictions',
      completedAt: '2024-02-24T17:30:00Z'
    }
  }
];

// Mock appeal cases
export const appealCases: AppealCase[] = [
  {
    id: 'APP001',
    originalActionId: 'ENF002',
    appealType: 'ENFORCEMENT_ACTION',
    appellantId: 'T003',
    appellantName: 'Risky Talent Co',
    appellantType: 'TENANT',
    reason: 'Wrongful suspension based on false fraud detection',
    description: 'The transactions flagged as suspicious were legitimate payments for a large-scale fashion event. We have documentation proving the legitimacy of all transactions.',
    evidence: [
      {
        type: 'DOCUMENT',
        filename: 'event_contract.pdf',
        url: '/evidence/event_contract.pdf',
        uploadedAt: '2024-02-24T10:00:00Z'
      },
      {
        type: 'DOCUMENT',
        filename: 'payment_receipts.pdf',
        url: '/evidence/payment_receipts.pdf',
        uploadedAt: '2024-02-24T10:05:00Z'
      }
    ],
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    submittedAt: '2024-02-24T10:00:00Z',
    reviewedBy: 'appeals-team@platform.com',
    reviewedAt: '2024-02-24T14:00:00Z',
    timeline: [
      {
        timestamp: '2024-02-24T10:00:00Z',
        action: 'Appeal Submitted',
        actor: 'Risky Talent Co',
        details: 'Appeal filed against temporary suspension'
      },
      {
        timestamp: '2024-02-24T14:00:00Z',
        action: 'Review Started',
        actor: 'Appeals Team',
        details: 'Case assigned for detailed review'
      }
    ]
  }
];

// Statistics
export const trustSafetyStats = {
  disputes: {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'OPEN').length,
    investigating: disputes.filter(d => d.status === 'INVESTIGATING').length,
    escalated: disputes.filter(d => d.status === 'ESCALATED').length,
    resolved: disputes.filter(d => d.status === 'RESOLVED').length,
    critical: disputes.filter(d => d.severity === 'CRITICAL').length,
    high: disputes.filter(d => d.severity === 'HIGH').length,
    medium: disputes.filter(d => d.severity === 'MEDIUM').length,
    low: disputes.filter(d => d.severity === 'LOW').length
  },
  enforcementActions: {
    total: enforcementActions.length,
    active: enforcementActions.filter(a => a.status === 'ACTIVE').length,
    pending: enforcementActions.filter(a => a.status === 'PENDING').length,
    completed: enforcementActions.filter(a => a.status === 'COMPLETED').length,
    appealed: enforcementActions.filter(a => a.status === 'APPEALED').length
  },
  safetyAlerts: {
    total: safetyAlerts.length,
    new: safetyAlerts.filter(a => a.status === 'NEW').length,
    investigating: safetyAlerts.filter(a => a.status === 'INVESTIGATING').length,
    resolved: safetyAlerts.filter(a => a.status === 'RESOLVED').length,
    critical: safetyAlerts.filter(a => a.severity === 'CRITICAL').length,
    high: safetyAlerts.filter(a => a.severity === 'HIGH').length,
    medium: safetyAlerts.filter(a => a.severity === 'MEDIUM').length,
    low: safetyAlerts.filter(a => a.severity === 'LOW').length
  },
  appeals: {
    total: appealCases.length,
    pending: appealCases.filter(a => a.status === 'PENDING').length,
    underReview: appealCases.filter(a => a.status === 'UNDER_REVIEW').length,
    approved: appealCases.filter(a => a.status === 'APPROVED').length,
    denied: appealCases.filter(a => a.status === 'DENIED').length
  }
};