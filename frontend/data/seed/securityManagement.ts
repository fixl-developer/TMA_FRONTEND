// Security Management Seed Data
// Week 23-24: Security Management System

export interface SecurityIncident {
  id: string;
  title: string;
  type: 'DATA_BREACH' | 'UNAUTHORIZED_ACCESS' | 'MALWARE' | 'PHISHING' | 'DDoS' | 'INSIDER_THREAT' | 'API_ABUSE' | 'SYSTEM_COMPROMISE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  description: string;
  affectedSystems: string[];
  affectedTenants: string[];
  affectedUsers: number;
  detectedAt: string;
  reportedBy: string;
  assignedTo?: string;
  containedAt?: string;
  resolvedAt?: string;
  impact: {
    dataExposed: boolean;
    serviceDisruption: boolean;
    financialLoss: number;
    reputationRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    complianceImpact: boolean;
  };
  timeline: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
  evidence: {
    type: 'LOG_FILE' | 'SCREENSHOT' | 'NETWORK_CAPTURE' | 'FORENSIC_IMAGE' | 'DOCUMENT';
    filename: string;
    url: string;
    uploadedAt: string;
    uploadedBy: string;
  }[];
  mitigation: {
    actions: string[];
    preventiveMeasures: string[];
    lessonsLearned: string[];
  };
  notifications: {
    internal: boolean;
    external: boolean;
    regulatory: boolean;
    customers: boolean;
    sentAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ThreatAlert {
  id: string;
  source: 'IDS' | 'FIREWALL' | 'ANTIVIRUS' | 'SIEM' | 'MANUAL' | 'EXTERNAL_FEED' | 'ML_DETECTION';
  type: 'MALWARE' | 'SUSPICIOUS_LOGIN' | 'BRUTE_FORCE' | 'SQL_INJECTION' | 'XSS' | 'ANOMALOUS_TRAFFIC' | 'PRIVILEGE_ESCALATION' | 'DATA_EXFILTRATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'INVESTIGATING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'RESOLVED';
  title: string;
  description: string;
  indicators: {
    ips: string[];
    domains: string[];
    hashes: string[];
    userAgents: string[];
    patterns: string[];
  };
  affectedAssets: string[];
  riskScore: number; // 0-100
  confidence: number; // 0-100
  detectedAt: string;
  lastSeenAt: string;
  occurrenceCount: number;
  investigatedBy?: string;
  resolution?: {
    outcome: 'BLOCKED' | 'MONITORED' | 'IGNORED' | 'ESCALATED';
    details: string;
    resolvedBy: string;
    resolvedAt: string;
  };
  automatedActions: {
    blocked: boolean;
    quarantined: boolean;
    alertSent: boolean;
    ticketCreated: boolean;
  };
  relatedIncidents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AccessReview {
  id: string;
  type: 'PERIODIC' | 'ROLE_CHANGE' | 'TERMINATION' | 'COMPLIANCE' | 'INCIDENT_DRIVEN';
  scope: 'USER' | 'ROLE' | 'SYSTEM' | 'TENANT' | 'GLOBAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  reviewer: string;
  reviewee?: string; // For user-specific reviews
  targetRole?: string; // For role-specific reviews
  targetSystem?: string; // For system-specific reviews
  dueDate: string;
  completedAt?: string;
  findings: {
    excessivePermissions: {
      count: number;
      details: string[];
    };
    unusedAccess: {
      count: number;
      details: string[];
    };
    policyViolations: {
      count: number;
      details: string[];
    };
    recommendations: string[];
  };
  actions: {
    permissionsRevoked: string[];
    accessGranted: string[];
    rolesModified: string[];
    accountsDisabled: string[];
  };
  evidence: {
    accessLogs: string[];
    screenshots: string[];
    approvals: string[];
  };
  schedule: {
    frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    nextReview: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SecurityConfiguration {
  id: string;
  category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'ENCRYPTION' | 'NETWORK' | 'MONITORING' | 'BACKUP' | 'COMPLIANCE';
  name: string;
  description: string;
  currentValue: any;
  recommendedValue: any;
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'UNKNOWN';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lastChecked: string;
  lastModified: string;
  modifiedBy: string;
  applicableSystems: string[];
  complianceFrameworks: string[];
  remediation: {
    required: boolean;
    priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
    steps: string[];
    estimatedEffort: string;
    assignedTo?: string;
    dueDate?: string;
  };
  history: {
    timestamp: string;
    oldValue: any;
    newValue: any;
    changedBy: string;
    reason: string;
  }[];
}

// Mock security incidents
export const securityIncidents: SecurityIncident[] = [
  {
    id: 'INC001',
    title: 'Suspicious Login Activity from Multiple Locations',
    type: 'UNAUTHORIZED_ACCESS',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    priority: 'P1',
    description: 'Multiple failed login attempts followed by successful login from different geographic locations within minutes',
    affectedSystems: ['Authentication Service', 'User Management API'],
    affectedTenants: ['T001', 'T003'],
    affectedUsers: 2,
    detectedAt: '2024-02-24T14:30:00Z',
    reportedBy: 'security-monitor@platform.com',
    assignedTo: 'security-team@platform.com',
    impact: {
      dataExposed: false,
      serviceDisruption: false,
      financialLoss: 0,
      reputationRisk: 'MEDIUM',
      complianceImpact: true
    },
    timeline: [
      {
        timestamp: '2024-02-24T14:30:00Z',
        action: 'Incident Detected',
        actor: 'Automated System',
        details: 'Anomalous login pattern detected by ML system'
      },
      {
        timestamp: '2024-02-24T14:35:00Z',
        action: 'Investigation Started',
        actor: 'security-team@platform.com',
        details: 'Security team notified and investigation initiated'
      },
      {
        timestamp: '2024-02-24T15:00:00Z',
        action: 'Accounts Secured',
        actor: 'security-team@platform.com',
        details: 'Affected user accounts temporarily locked pending investigation'
      }
    ],
    evidence: [
      {
        type: 'LOG_FILE',
        filename: 'auth_logs_2024-02-24.log',
        url: '/evidence/auth_logs_2024-02-24.log',
        uploadedAt: '2024-02-24T14:45:00Z',
        uploadedBy: 'security-team@platform.com'
      },
      {
        type: 'NETWORK_CAPTURE',
        filename: 'network_traffic_analysis.pcap',
        url: '/evidence/network_traffic_analysis.pcap',
        uploadedAt: '2024-02-24T15:15:00Z',
        uploadedBy: 'security-team@platform.com'
      }
    ],
    mitigation: {
      actions: [
        'Temporarily locked affected accounts',
        'Implemented additional monitoring on authentication service',
        'Contacted affected users for verification'
      ],
      preventiveMeasures: [
        'Implement geo-location based login alerts',
        'Enhance multi-factor authentication requirements',
        'Improve anomaly detection thresholds'
      ],
      lessonsLearned: [
        'Need faster automated response to suspicious login patterns',
        'User notification system needs improvement'
      ]
    },
    notifications: {
      internal: true,
      external: false,
      regulatory: false,
      customers: true,
      sentAt: '2024-02-24T16:00:00Z'
    },
    createdAt: '2024-02-24T14:30:00Z',
    updatedAt: '2024-02-24T16:00:00Z'
  },
  {
    id: 'INC002',
    title: 'API Rate Limit Bypass Attempt',
    type: 'API_ABUSE',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    priority: 'P2',
    description: 'Automated attempts to bypass API rate limits using distributed requests',
    affectedSystems: ['Public API Gateway', 'Rate Limiting Service'],
    affectedTenants: [],
    affectedUsers: 0,
    detectedAt: '2024-02-23T09:15:00Z',
    reportedBy: 'api-monitor@platform.com',
    assignedTo: 'security-team@platform.com',
    containedAt: '2024-02-23T10:30:00Z',
    resolvedAt: '2024-02-23T16:45:00Z',
    impact: {
      dataExposed: false,
      serviceDisruption: true,
      financialLoss: 500,
      reputationRisk: 'LOW',
      complianceImpact: false
    },
    timeline: [
      {
        timestamp: '2024-02-23T09:15:00Z',
        action: 'Incident Detected',
        actor: 'Automated System',
        details: 'Unusual API traffic pattern detected'
      },
      {
        timestamp: '2024-02-23T09:30:00Z',
        action: 'Investigation Started',
        actor: 'security-team@platform.com',
        details: 'Security team began analysis of traffic patterns'
      },
      {
        timestamp: '2024-02-23T10:30:00Z',
        action: 'Threat Contained',
        actor: 'security-team@platform.com',
        details: 'Malicious IP ranges blocked at firewall level'
      },
      {
        timestamp: '2024-02-23T16:45:00Z',
        action: 'Incident Resolved',
        actor: 'security-team@platform.com',
        details: 'Enhanced rate limiting rules deployed'
      }
    ],
    evidence: [
      {
        type: 'LOG_FILE',
        filename: 'api_access_logs.log',
        url: '/evidence/api_access_logs.log',
        uploadedAt: '2024-02-23T11:00:00Z',
        uploadedBy: 'security-team@platform.com'
      }
    ],
    mitigation: {
      actions: [
        'Blocked malicious IP ranges',
        'Enhanced rate limiting rules',
        'Implemented distributed rate limiting'
      ],
      preventiveMeasures: [
        'Deploy advanced bot detection',
        'Implement CAPTCHA for suspicious traffic',
        'Enhance API monitoring and alerting'
      ],
      lessonsLearned: [
        'Need better real-time traffic analysis',
        'Rate limiting rules need regular review'
      ]
    },
    notifications: {
      internal: true,
      external: false,
      regulatory: false,
      customers: false
    },
    createdAt: '2024-02-23T09:15:00Z',
    updatedAt: '2024-02-23T16:45:00Z'
  }
];

// Mock threat alerts
export const threatAlerts: ThreatAlert[] = [
  {
    id: 'ALERT001',
    source: 'ML_DETECTION',
    type: 'SUSPICIOUS_LOGIN',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    title: 'Anomalous Login Pattern Detected',
    description: 'User login from unusual location with different device fingerprint',
    indicators: {
      ips: ['192.168.1.100', '10.0.0.50'],
      domains: [],
      hashes: [],
      userAgents: ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
      patterns: ['rapid_geo_change', 'device_fingerprint_mismatch']
    },
    affectedAssets: ['user-auth-service', 'session-manager'],
    riskScore: 85,
    confidence: 78,
    detectedAt: '2024-02-25T08:30:00Z',
    lastSeenAt: '2024-02-25T08:45:00Z',
    occurrenceCount: 3,
    investigatedBy: 'security-analyst@platform.com',
    automatedActions: {
      blocked: false,
      quarantined: true,
      alertSent: true,
      ticketCreated: true
    },
    relatedIncidents: ['INC001'],
    createdAt: '2024-02-25T08:30:00Z',
    updatedAt: '2024-02-25T09:00:00Z'
  },
  {
    id: 'ALERT002',
    source: 'FIREWALL',
    type: 'BRUTE_FORCE',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    title: 'Brute Force Attack on SSH Service',
    description: 'Multiple failed SSH login attempts from single IP address',
    indicators: {
      ips: ['203.0.113.45'],
      domains: [],
      hashes: [],
      userAgents: [],
      patterns: ['ssh_brute_force', 'dictionary_attack']
    },
    affectedAssets: ['ssh-gateway', 'admin-server'],
    riskScore: 65,
    confidence: 95,
    detectedAt: '2024-02-24T22:15:00Z',
    lastSeenAt: '2024-02-24T22:30:00Z',
    occurrenceCount: 1,
    investigatedBy: 'security-analyst@platform.com',
    resolution: {
      outcome: 'BLOCKED',
      details: 'IP address blocked at firewall level after 50 failed attempts',
      resolvedBy: 'security-analyst@platform.com',
      resolvedAt: '2024-02-24T22:35:00Z'
    },
    automatedActions: {
      blocked: true,
      quarantined: false,
      alertSent: true,
      ticketCreated: false
    },
    relatedIncidents: [],
    createdAt: '2024-02-24T22:15:00Z',
    updatedAt: '2024-02-24T22:35:00Z'
  },
  {
    id: 'ALERT003',
    source: 'SIEM',
    type: 'DATA_EXFILTRATION',
    severity: 'CRITICAL',
    status: 'NEW',
    title: 'Unusual Data Transfer Volume',
    description: 'Large volume of data transferred to external IP during off-hours',
    indicators: {
      ips: ['198.51.100.25'],
      domains: ['suspicious-domain.com'],
      hashes: [],
      userAgents: [],
      patterns: ['large_data_transfer', 'off_hours_activity']
    },
    affectedAssets: ['database-server', 'file-storage'],
    riskScore: 92,
    confidence: 85,
    detectedAt: '2024-02-25T02:15:00Z',
    lastSeenAt: '2024-02-25T02:45:00Z',
    occurrenceCount: 1,
    automatedActions: {
      blocked: false,
      quarantined: false,
      alertSent: true,
      ticketCreated: true
    },
    relatedIncidents: [],
    createdAt: '2024-02-25T02:15:00Z',
    updatedAt: '2024-02-25T02:15:00Z'
  }
];

// Mock access reviews
export const accessReviews: AccessReview[] = [
  {
    id: 'REV001',
    type: 'PERIODIC',
    scope: 'USER',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    title: 'Quarterly Admin Access Review',
    description: 'Review of all administrative access permissions across platform',
    reviewer: 'security-manager@platform.com',
    dueDate: '2024-03-01T00:00:00Z',
    findings: {
      excessivePermissions: {
        count: 5,
        details: [
          'User john.doe@platform.com has unnecessary database admin access',
          'Service account api-service has overly broad permissions'
        ]
      },
      unusedAccess: {
        count: 3,
        details: [
          'User jane.smith@platform.com has not used admin panel in 90 days',
          'Role "legacy-admin" has no active assignments'
        ]
      },
      policyViolations: {
        count: 2,
        details: [
          'User temp-contractor@platform.com has admin access without MFA',
          'Shared service account lacks proper documentation'
        ]
      },
      recommendations: [
        'Implement principle of least privilege for database access',
        'Remove unused admin permissions',
        'Enforce MFA for all administrative accounts',
        'Document all service account purposes'
      ]
    },
    actions: {
      permissionsRevoked: ['database-admin for john.doe@platform.com'],
      accessGranted: [],
      rolesModified: ['legacy-admin role deprecated'],
      accountsDisabled: []
    },
    evidence: {
      accessLogs: ['admin_access_logs_q1_2024.log'],
      screenshots: ['permission_matrix_screenshot.png'],
      approvals: ['admin_access_approval_2024.pdf']
    },
    schedule: {
      frequency: 'QUARTERLY',
      nextReview: '2024-06-01T00:00:00Z'
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-25T10:00:00Z',
    createdBy: 'security-manager@platform.com'
  },
  {
    id: 'REV002',
    type: 'TERMINATION',
    scope: 'USER',
    status: 'COMPLETED',
    priority: 'HIGH',
    title: 'Employee Termination Access Review',
    description: 'Access review for terminated employee - ensure all access revoked',
    reviewer: 'hr-security@platform.com',
    reviewee: 'former.employee@platform.com',
    dueDate: '2024-02-20T00:00:00Z',
    completedAt: '2024-02-20T16:30:00Z',
    findings: {
      excessivePermissions: {
        count: 0,
        details: []
      },
      unusedAccess: {
        count: 0,
        details: []
      },
      policyViolations: {
        count: 1,
        details: [
          'API key for former employee still active in system'
        ]
      },
      recommendations: [
        'Implement automated access revocation on termination',
        'Regular audit of API keys and service accounts'
      ]
    },
    actions: {
      permissionsRevoked: ['All platform access'],
      accessGranted: [],
      rolesModified: [],
      accountsDisabled: ['former.employee@platform.com', 'API key #12345']
    },
    evidence: {
      accessLogs: ['termination_access_review.log'],
      screenshots: [],
      approvals: ['termination_approval_hr.pdf']
    },
    schedule: {
      frequency: 'ANNUALLY',
      nextReview: '2025-02-20T00:00:00Z'
    },
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-20T16:30:00Z',
    createdBy: 'hr-security@platform.com'
  }
];

// Mock security configurations
export const securityConfigurations: SecurityConfiguration[] = [
  {
    id: 'CONF001',
    category: 'AUTHENTICATION',
    name: 'Password Policy',
    description: 'Minimum password requirements for user accounts',
    currentValue: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      maxAge: 90,
      historyCount: 5
    },
    recommendedValue: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 60,
      historyCount: 10
    },
    complianceStatus: 'PARTIALLY_COMPLIANT',
    riskLevel: 'MEDIUM',
    lastChecked: '2024-02-25T00:00:00Z',
    lastModified: '2024-01-15T00:00:00Z',
    modifiedBy: 'security-admin@platform.com',
    applicableSystems: ['User Authentication', 'Admin Portal', 'API Gateway'],
    complianceFrameworks: ['SOC 2', 'ISO 27001', 'NIST'],
    remediation: {
      required: true,
      priority: 'MEDIUM',
      steps: [
        'Update password policy to require 12 character minimum',
        'Enable special character requirement',
        'Reduce password age to 60 days',
        'Increase password history to 10'
      ],
      estimatedEffort: '2 hours',
      assignedTo: 'security-admin@platform.com',
      dueDate: '2024-03-15T00:00:00Z'
    },
    history: [
      {
        timestamp: '2024-01-15T00:00:00Z',
        oldValue: { minLength: 6 },
        newValue: { minLength: 8 },
        changedBy: 'security-admin@platform.com',
        reason: 'Compliance requirement update'
      }
    ]
  },
  {
    id: 'CONF002',
    category: 'ENCRYPTION',
    name: 'Data Encryption Standards',
    description: 'Encryption requirements for data at rest and in transit',
    currentValue: {
      dataAtRest: 'AES-256',
      dataInTransit: 'TLS 1.2',
      keyRotation: 365,
      keyManagement: 'AWS KMS'
    },
    recommendedValue: {
      dataAtRest: 'AES-256',
      dataInTransit: 'TLS 1.3',
      keyRotation: 90,
      keyManagement: 'AWS KMS'
    },
    complianceStatus: 'PARTIALLY_COMPLIANT',
    riskLevel: 'HIGH',
    lastChecked: '2024-02-25T00:00:00Z',
    lastModified: '2024-02-01T00:00:00Z',
    modifiedBy: 'security-admin@platform.com',
    applicableSystems: ['Database', 'File Storage', 'API Gateway', 'Message Queue'],
    complianceFrameworks: ['SOC 2', 'ISO 27001', 'PCI DSS'],
    remediation: {
      required: true,
      priority: 'HIGH',
      steps: [
        'Upgrade all services to support TLS 1.3',
        'Implement quarterly key rotation',
        'Update load balancers and proxies',
        'Test compatibility with client applications'
      ],
      estimatedEffort: '40 hours',
      assignedTo: 'infrastructure-team@platform.com',
      dueDate: '2024-03-30T00:00:00Z'
    },
    history: [
      {
        timestamp: '2024-02-01T00:00:00Z',
        oldValue: { dataInTransit: 'TLS 1.1' },
        newValue: { dataInTransit: 'TLS 1.2' },
        changedBy: 'security-admin@platform.com',
        reason: 'Security vulnerability mitigation'
      }
    ]
  },
  {
    id: 'CONF003',
    category: 'MONITORING',
    name: 'Security Event Logging',
    description: 'Configuration for security event logging and retention',
    currentValue: {
      logLevel: 'INFO',
      retentionDays: 90,
      realTimeAlerting: true,
      logSources: ['Authentication', 'Authorization', 'Data Access'],
      siemIntegration: true
    },
    recommendedValue: {
      logLevel: 'DEBUG',
      retentionDays: 365,
      realTimeAlerting: true,
      logSources: ['Authentication', 'Authorization', 'Data Access', 'System Changes', 'Network Traffic'],
      siemIntegration: true
    },
    complianceStatus: 'COMPLIANT',
    riskLevel: 'LOW',
    lastChecked: '2024-02-25T00:00:00Z',
    lastModified: '2024-02-10T00:00:00Z',
    modifiedBy: 'security-admin@platform.com',
    applicableSystems: ['All Systems'],
    complianceFrameworks: ['SOC 2', 'ISO 27001', 'GDPR'],
    remediation: {
      required: false,
      priority: 'LOW',
      steps: [
        'Consider extending log retention to 1 year',
        'Add system changes and network traffic logging'
      ],
      estimatedEffort: '8 hours'
    },
    history: [
      {
        timestamp: '2024-02-10T00:00:00Z',
        oldValue: { retentionDays: 30 },
        newValue: { retentionDays: 90 },
        changedBy: 'security-admin@platform.com',
        reason: 'Compliance requirement for audit trail'
      }
    ]
  }
];

// Statistics
export const securityStats = {
  incidents: {
    total: securityIncidents.length,
    open: securityIncidents.filter(i => i.status === 'OPEN').length,
    investigating: securityIncidents.filter(i => i.status === 'INVESTIGATING').length,
    resolved: securityIncidents.filter(i => i.status === 'RESOLVED').length,
    critical: securityIncidents.filter(i => i.severity === 'CRITICAL').length,
    high: securityIncidents.filter(i => i.severity === 'HIGH').length
  },
  threats: {
    total: threatAlerts.length,
    new: threatAlerts.filter(t => t.status === 'NEW').length,
    investigating: threatAlerts.filter(t => t.status === 'INVESTIGATING').length,
    resolved: threatAlerts.filter(t => t.status === 'RESOLVED').length,
    critical: threatAlerts.filter(t => t.severity === 'CRITICAL').length,
    high: threatAlerts.filter(t => t.severity === 'HIGH').length,
    avgRiskScore: Math.round(threatAlerts.reduce((sum, t) => sum + t.riskScore, 0) / threatAlerts.length)
  },
  reviews: {
    total: accessReviews.length,
    pending: accessReviews.filter(r => r.status === 'PENDING').length,
    inProgress: accessReviews.filter(r => r.status === 'IN_PROGRESS').length,
    completed: accessReviews.filter(r => r.status === 'COMPLETED').length,
    overdue: accessReviews.filter(r => r.status === 'OVERDUE').length
  },
  configurations: {
    total: securityConfigurations.length,
    compliant: securityConfigurations.filter(c => c.complianceStatus === 'COMPLIANT').length,
    nonCompliant: securityConfigurations.filter(c => c.complianceStatus === 'NON_COMPLIANT').length,
    partiallyCompliant: securityConfigurations.filter(c => c.complianceStatus === 'PARTIALLY_COMPLIANT').length,
    criticalRisk: securityConfigurations.filter(c => c.riskLevel === 'CRITICAL').length,
    highRisk: securityConfigurations.filter(c => c.riskLevel === 'HIGH').length
  }
};