// Compliance Management Seed Data
// Week 25-26: Compliance & Data Legal System

export interface ComplianceReport {
  id: string;
  framework: 'SOC2' | 'ISO27001' | 'GDPR' | 'CCPA' | 'PCI_DSS' | 'HIPAA';
  reportType: 'AUDIT' | 'ASSESSMENT' | 'CERTIFICATION' | 'SELF_ASSESSMENT';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED' | 'APPROVED' | 'FAILED';
  period: {
    start: string;
    end: string;
  };
  auditor?: string;
  findings: {
    compliant: number;
    nonCompliant: number;
    partiallyCompliant: number;
    notApplicable: number;
  };
  controls: {
    id: string;
    name: string;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NOT_APPLICABLE';
    evidence: string[];
    notes: string;
  }[];
  recommendations: string[];
  nextAuditDate?: string;
  certificationExpiry?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PrivacyRequest {
  id: string;
  type: 'ACCESS' | 'DELETION' | 'RECTIFICATION' | 'PORTABILITY' | 'OBJECTION' | 'RESTRICTION';
  regulation: 'GDPR' | 'CCPA' | 'LGPD' | 'PIPEDA';
  status: 'PENDING' | 'VERIFIED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  requester: {
    name: string;
    email: string;
    userId?: string;
    tenantId?: string;
  };
  requestDetails: string;
  verificationMethod: 'EMAIL' | 'ID_DOCUMENT' | 'PHONE' | 'IN_PERSON';
  verifiedAt?: string;
  dataScope: {
    personalData: boolean;
    accountData: boolean;
    transactionData: boolean;
    communicationData: boolean;
    analyticsData: boolean;
  };
  timeline: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
  fulfillment?: {
    method: 'EMAIL' | 'DOWNLOAD' | 'API' | 'PHYSICAL';
    completedAt: string;
    completedBy: string;
    evidence: string[];
  };
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface DataRetentionPolicy {
  id: string;
  name: string;
  dataType: 'USER_DATA' | 'TRANSACTION_DATA' | 'LOG_DATA' | 'BACKUP_DATA' | 'ANALYTICS_DATA' | 'COMMUNICATION_DATA';
  category: 'PERSONAL' | 'FINANCIAL' | 'OPERATIONAL' | 'SECURITY' | 'MARKETING';
  retentionPeriod: number; // in days
  retentionUnit: 'DAYS' | 'MONTHS' | 'YEARS';
  legalBasis: string;
  applicableRegulations: string[];
  autoDelete: boolean;
  archiveBeforeDelete: boolean;
  archiveLocation?: string;
  exceptions: string[];
  lastReviewed: string;
  nextReview: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  affectedSystems: string[];
  dataVolume: {
    current: number;
    unit: 'GB' | 'TB' | 'RECORDS';
  };
  deletionSchedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    lastRun?: string;
    nextRun: string;
    recordsDeleted: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LegalHold {
  id: string;
  name: string;
  type: 'LITIGATION' | 'INVESTIGATION' | 'REGULATORY' | 'AUDIT';
  status: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  legalCase?: string;
  custodians: string[];
  dataScope: {
    users: string[];
    tenants: string[];
    dateRange: {
      start: string;
      end: string;
    };
    dataTypes: string[];
    keywords: string[];
  };
  preservationActions: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    recordsPreserved: number;
  }[];
  notifications: {
    sent: boolean;
    recipients: string[];
    sentAt?: string;
  };
  expiryDate?: string;
  releasedAt?: string;
  releasedBy?: string;
  releaseReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock compliance reports
export const complianceReports: ComplianceReport[] = [
  {
    id: 'COMP001',
    framework: 'SOC2',
    reportType: 'AUDIT',
    status: 'IN_PROGRESS',
    period: {
      start: '2024-01-01T00:00:00Z',
      end: '2024-12-31T23:59:59Z'
    },
    auditor: 'Deloitte Audit Services',
    findings: {
      compliant: 85,
      nonCompliant: 5,
      partiallyCompliant: 8,
      notApplicable: 2
    },
    controls: [
      {
        id: 'CC1.1',
        name: 'Control Environment - Integrity and Ethical Values',
        status: 'COMPLIANT',
        evidence: ['code_of_conduct.pdf', 'ethics_training_records.xlsx'],
        notes: 'All employees completed ethics training. Code of conduct reviewed and signed.'
      },
      {
        id: 'CC2.1',
        name: 'Communication and Information - Internal Communication',
        status: 'PARTIALLY_COMPLIANT',
        evidence: ['communication_policy.pdf'],
        notes: 'Policy exists but needs update for remote work scenarios.'
      },
      {
        id: 'CC6.1',
        name: 'Logical and Physical Access Controls',
        status: 'NON_COMPLIANT',
        evidence: [],
        notes: 'MFA not enforced for all administrative accounts. Remediation in progress.'
      }
    ],
    recommendations: [
      'Implement MFA for all administrative accounts',
      'Update communication policy for remote work',
      'Conduct quarterly access reviews',
      'Enhance logging and monitoring capabilities'
    ],
    nextAuditDate: '2025-01-15T00:00:00Z',
    certificationExpiry: '2025-12-31T23:59:59Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-25T10:00:00Z',
    createdBy: 'compliance@platform.com'
  },
  {
    id: 'COMP002',
    framework: 'GDPR',
    reportType: 'SELF_ASSESSMENT',
    status: 'COMPLETED',
    period: {
      start: '2024-01-01T00:00:00Z',
      end: '2024-03-31T23:59:59Z'
    },
    findings: {
      compliant: 42,
      nonCompliant: 3,
      partiallyCompliant: 5,
      notApplicable: 0
    },
    controls: [
      {
        id: 'ART5',
        name: 'Principles relating to processing of personal data',
        status: 'COMPLIANT',
        evidence: ['data_processing_policy.pdf', 'privacy_notice.pdf'],
        notes: 'All principles documented and implemented.'
      },
      {
        id: 'ART32',
        name: 'Security of processing',
        status: 'COMPLIANT',
        evidence: ['encryption_policy.pdf', 'security_measures.pdf'],
        notes: 'Encryption at rest and in transit implemented.'
      },
      {
        id: 'ART33',
        name: 'Notification of a personal data breach',
        status: 'PARTIALLY_COMPLIANT',
        evidence: ['breach_response_plan.pdf'],
        notes: 'Plan exists but needs testing and update.'
      }
    ],
    recommendations: [
      'Test breach notification procedures',
      'Update data processing agreements with vendors',
      'Conduct privacy impact assessments for new features'
    ],
    nextAuditDate: '2024-07-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-31T16:00:00Z',
    createdBy: 'dpo@platform.com'
  }
];

// Mock privacy requests
export const privacyRequests: PrivacyRequest[] = [
  {
    id: 'PRIV001',
    type: 'ACCESS',
    regulation: 'GDPR',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    requester: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      userId: 'U12345',
      tenantId: 'T001'
    },
    requestDetails: 'Request for all personal data held by the platform including account information, transaction history, and communication records.',
    verificationMethod: 'EMAIL',
    verifiedAt: '2024-02-20T10:30:00Z',
    dataScope: {
      personalData: true,
      accountData: true,
      transactionData: true,
      communicationData: true,
      analyticsData: false
    },
    timeline: [
      {
        timestamp: '2024-02-20T10:00:00Z',
        action: 'Request Received',
        actor: 'system@platform.com',
        details: 'Privacy request submitted via web form'
      },
      {
        timestamp: '2024-02-20T10:30:00Z',
        action: 'Identity Verified',
        actor: 'privacy@platform.com',
        details: 'Email verification completed successfully'
      },
      {
        timestamp: '2024-02-20T14:00:00Z',
        action: 'Data Collection Started',
        actor: 'privacy@platform.com',
        details: 'Gathering data from all systems'
      }
    ],
    dueDate: '2024-03-20T23:59:59Z',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
    assignedTo: 'privacy@platform.com'
  },
  {
    id: 'PRIV002',
    type: 'DELETION',
    regulation: 'CCPA',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    requester: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      userId: 'U67890'
    },
    requestDetails: 'Request to delete all personal information from the platform.',
    verificationMethod: 'ID_DOCUMENT',
    verifiedAt: '2024-02-15T11:00:00Z',
    dataScope: {
      personalData: true,
      accountData: true,
      transactionData: true,
      communicationData: true,
      analyticsData: true
    },
    timeline: [
      {
        timestamp: '2024-02-15T10:00:00Z',
        action: 'Request Received',
        actor: 'system@platform.com',
        details: 'Deletion request submitted'
      },
      {
        timestamp: '2024-02-15T11:00:00Z',
        action: 'Identity Verified',
        actor: 'privacy@platform.com',
        details: 'ID document verified'
      },
      {
        timestamp: '2024-02-18T09:00:00Z',
        action: 'Data Deleted',
        actor: 'privacy@platform.com',
        details: 'All personal data deleted from active systems'
      },
      {
        timestamp: '2024-02-18T10:00:00Z',
        action: 'Request Completed',
        actor: 'privacy@platform.com',
        details: 'Confirmation email sent to requester'
      }
    ],
    fulfillment: {
      method: 'EMAIL',
      completedAt: '2024-02-18T10:00:00Z',
      completedBy: 'privacy@platform.com',
      evidence: ['deletion_confirmation.pdf', 'deletion_log.txt']
    },
    dueDate: '2024-03-15T23:59:59Z',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-18T10:00:00Z',
    assignedTo: 'privacy@platform.com'
  }
];

// Mock data retention policies
export const dataRetentionPolicies: DataRetentionPolicy[] = [
  {
    id: 'RET001',
    name: 'User Account Data Retention',
    dataType: 'USER_DATA',
    category: 'PERSONAL',
    retentionPeriod: 2555,
    retentionUnit: 'DAYS',
    legalBasis: 'GDPR Article 5(1)(e) - Storage limitation principle',
    applicableRegulations: ['GDPR', 'CCPA'],
    autoDelete: true,
    archiveBeforeDelete: true,
    archiveLocation: 's3://compliance-archive/user-data',
    exceptions: ['Active legal holds', 'Ongoing investigations', 'Regulatory requirements'],
    lastReviewed: '2024-01-15T00:00:00Z',
    nextReview: '2024-07-15T00:00:00Z',
    status: 'ACTIVE',
    affectedSystems: ['User Database', 'Authentication Service', 'Profile Service'],
    dataVolume: {
      current: 250,
      unit: 'GB'
    },
    deletionSchedule: {
      frequency: 'MONTHLY',
      lastRun: '2024-02-01T02:00:00Z',
      nextRun: '2024-03-01T02:00:00Z',
      recordsDeleted: 1250
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'dpo@platform.com'
  },
  {
    id: 'RET002',
    name: 'Transaction Log Retention',
    dataType: 'TRANSACTION_DATA',
    category: 'FINANCIAL',
    retentionPeriod: 2555,
    retentionUnit: 'DAYS',
    legalBasis: 'Financial regulations require 7 years retention',
    applicableRegulations: ['SOX', 'PCI DSS'],
    autoDelete: false,
    archiveBeforeDelete: true,
    archiveLocation: 's3://compliance-archive/transactions',
    exceptions: ['Disputed transactions', 'Fraud investigations'],
    lastReviewed: '2024-02-01T00:00:00Z',
    nextReview: '2024-08-01T00:00:00Z',
    status: 'ACTIVE',
    affectedSystems: ['Payment Gateway', 'Transaction Database', 'Accounting System'],
    dataVolume: {
      current: 1.5,
      unit: 'TB'
    },
    deletionSchedule: {
      frequency: 'MONTHLY',
      lastRun: '2024-02-01T03:00:00Z',
      nextRun: '2024-03-01T03:00:00Z',
      recordsDeleted: 45000
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    createdBy: 'compliance@platform.com'
  },
  {
    id: 'RET003',
    name: 'Security Log Retention',
    dataType: 'LOG_DATA',
    category: 'SECURITY',
    retentionPeriod: 365,
    retentionUnit: 'DAYS',
    legalBasis: 'Security best practices and compliance requirements',
    applicableRegulations: ['SOC2', 'ISO27001'],
    autoDelete: true,
    archiveBeforeDelete: true,
    archiveLocation: 's3://compliance-archive/security-logs',
    exceptions: ['Security incidents under investigation'],
    lastReviewed: '2024-02-10T00:00:00Z',
    nextReview: '2024-08-10T00:00:00Z',
    status: 'ACTIVE',
    affectedSystems: ['SIEM', 'Firewall', 'IDS/IPS', 'Application Logs'],
    dataVolume: {
      current: 500,
      unit: 'GB'
    },
    deletionSchedule: {
      frequency: 'DAILY',
      lastRun: '2024-02-25T01:00:00Z',
      nextRun: '2024-02-26T01:00:00Z',
      recordsDeleted: 2500000
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    createdBy: 'security@platform.com'
  }
];

// Mock legal holds
export const legalHolds: LegalHold[] = [
  {
    id: 'HOLD001',
    name: 'Smith v. Platform Inc. Litigation',
    type: 'LITIGATION',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    description: 'Legal hold for all data related to user Jane Smith and associated transactions for ongoing litigation.',
    legalCase: 'Case No. 2024-CV-12345',
    custodians: ['legal@platform.com', 'compliance@platform.com', 'support@platform.com'],
    dataScope: {
      users: ['U67890'],
      tenants: ['T001', 'T002'],
      dateRange: {
        start: '2023-01-01T00:00:00Z',
        end: '2024-02-15T23:59:59Z'
      },
      dataTypes: ['User Account Data', 'Transaction Records', 'Communication Logs', 'Support Tickets'],
      keywords: ['Jane Smith', 'dispute', 'refund', 'complaint']
    },
    preservationActions: [
      {
        timestamp: '2024-02-16T09:00:00Z',
        action: 'Legal Hold Initiated',
        actor: 'legal@platform.com',
        details: 'Legal hold created and custodians notified',
        recordsPreserved: 0
      },
      {
        timestamp: '2024-02-16T10:00:00Z',
        action: 'Data Preservation Started',
        actor: 'system@platform.com',
        details: 'Automated data preservation process initiated',
        recordsPreserved: 1250
      },
      {
        timestamp: '2024-02-16T14:00:00Z',
        action: 'Data Preservation Completed',
        actor: 'system@platform.com',
        details: 'All relevant data preserved and indexed',
        recordsPreserved: 1250
      }
    ],
    notifications: {
      sent: true,
      recipients: ['legal@platform.com', 'compliance@platform.com', 'support@platform.com'],
      sentAt: '2024-02-16T09:15:00Z'
    },
    createdAt: '2024-02-16T09:00:00Z',
    updatedAt: '2024-02-16T14:00:00Z',
    createdBy: 'legal@platform.com'
  },
  {
    id: 'HOLD002',
    name: 'Regulatory Investigation - Data Breach',
    type: 'REGULATORY',
    status: 'ACTIVE',
    priority: 'HIGH',
    description: 'Preservation of all data related to security incident INC001 for regulatory investigation.',
    legalCase: 'Regulatory Case #REG-2024-089',
    custodians: ['security@platform.com', 'compliance@platform.com', 'cto@platform.com'],
    dataScope: {
      users: [],
      tenants: ['T003'],
      dateRange: {
        start: '2024-02-20T00:00:00Z',
        end: '2024-02-25T23:59:59Z'
      },
      dataTypes: ['Security Logs', 'Access Logs', 'System Logs', 'Incident Reports'],
      keywords: ['unauthorized access', 'security incident', 'INC001']
    },
    preservationActions: [
      {
        timestamp: '2024-02-24T16:00:00Z',
        action: 'Legal Hold Initiated',
        actor: 'compliance@platform.com',
        details: 'Regulatory investigation legal hold created',
        recordsPreserved: 0
      },
      {
        timestamp: '2024-02-24T17:00:00Z',
        action: 'Data Preservation Completed',
        actor: 'system@platform.com',
        details: 'All security and access logs preserved',
        recordsPreserved: 5800
      }
    ],
    notifications: {
      sent: true,
      recipients: ['security@platform.com', 'compliance@platform.com', 'cto@platform.com'],
      sentAt: '2024-02-24T16:15:00Z'
    },
    expiryDate: '2025-02-24T23:59:59Z',
    createdAt: '2024-02-24T16:00:00Z',
    updatedAt: '2024-02-24T17:00:00Z',
    createdBy: 'compliance@platform.com'
  }
];

// Statistics
export const complianceStats = {
  reports: {
    total: complianceReports.length,
    inProgress: complianceReports.filter(r => r.status === 'IN_PROGRESS').length,
    completed: complianceReports.filter(r => r.status === 'COMPLETED').length,
    submitted: complianceReports.filter(r => r.status === 'SUBMITTED').length,
    approved: complianceReports.filter(r => r.status === 'APPROVED').length
  },
  privacyRequests: {
    total: privacyRequests.length,
    pending: privacyRequests.filter(r => r.status === 'PENDING').length,
    inProgress: privacyRequests.filter(r => r.status === 'IN_PROGRESS').length,
    completed: privacyRequests.filter(r => r.status === 'COMPLETED').length,
    overdue: privacyRequests.filter(r => new Date(r.dueDate) < new Date() && r.status !== 'COMPLETED').length
  },
  retentionPolicies: {
    total: dataRetentionPolicies.length,
    active: dataRetentionPolicies.filter(p => p.status === 'ACTIVE').length,
    draft: dataRetentionPolicies.filter(p => p.status === 'DRAFT').length,
    archived: dataRetentionPolicies.filter(p => p.status === 'ARCHIVED').length
  },
  legalHolds: {
    total: legalHolds.length,
    active: legalHolds.filter(h => h.status === 'ACTIVE').length,
    released: legalHolds.filter(h => h.status === 'RELEASED').length,
    expired: legalHolds.filter(h => h.status === 'EXPIRED').length
  }
};