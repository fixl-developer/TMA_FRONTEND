// Tenant Lifecycle Seed Data
// Week 17-18: Tenant Lifecycle Management

export interface TenantApplication {
  id: string;
  companyName: string;
  businessType: 'MODELING_AGENCY' | 'PAGEANT_ORGANIZER' | 'TALENT_MANAGER' | 'ACADEMY' | 'INFLUENCER_AGENCY' | 'PRODUCTION_HOUSE' | 'CASTING_AGENCY' | 'EVENT_STAFFING' | 'COMMUNITY_OPERATOR';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  country: string;
  city: string;
  expectedTalentCount: number;
  expectedMonthlyVolume: number;
  businessDescription: string;
  requestedBlueprints: string[];
  requestedTemplate: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PROVISIONING' | 'ACTIVE';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
  riskScore: number;
  riskFlags: string[];
  documents: {
    businessLicense?: string;
    taxId?: string;
    bankStatement?: string;
    identityProof?: string;
  };
  verificationStatus: {
    businessLicense: 'PENDING' | 'VERIFIED' | 'REJECTED';
    taxId: 'PENDING' | 'VERIFIED' | 'REJECTED';
    bankStatement: 'PENDING' | 'VERIFIED' | 'REJECTED';
    identityProof: 'PENDING' | 'VERIFIED' | 'REJECTED';
  };
}

export interface TenantLifecycle {
  id: string;
  tenantId: string;
  companyName: string;
  businessType: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'PENDING_TERMINATION';
  plan: 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE';
  createdAt: string;
  activatedAt?: string;
  suspendedAt?: string;
  terminatedAt?: string;
  lastActivityAt: string;
  riskScore: number;
  riskFlags: string[];
  healthScore: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  limits: {
    maxUsers: number;
    maxTalent: number;
    maxStorage: number; // GB
    maxApiCalls: number; // per month
  };
  usage: {
    users: number;
    talent: number;
    storage: number; // GB
    apiCalls: number; // this month
  };
  billing: {
    monthlyRevenue: number;
    totalRevenue: number;
    lastPayment: string;
    paymentStatus: 'CURRENT' | 'OVERDUE' | 'FAILED';
  };
  compliance: {
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    kybStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    dataProcessingAgreement: boolean;
    privacyPolicyAccepted: boolean;
    termsAccepted: boolean;
  };
  contacts: {
    primary: {
      name: string;
      email: string;
      phone: string;
      role: string;
    };
    billing?: {
      name: string;
      email: string;
      phone: string;
    };
    technical?: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export interface RiskFlag {
  id: string;
  tenantId: string;
  type: 'FRAUD_SUSPICION' | 'PAYMENT_FAILURE' | 'POLICY_VIOLATION' | 'UNUSUAL_ACTIVITY' | 'COMPLIANCE_ISSUE' | 'SECURITY_BREACH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  evidence?: string[];
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  impact: string;
  recommendedAction: string;
}

// Mock tenant applications
export const tenantApplications: TenantApplication[] = [
  {
    id: 'APP001',
    companyName: 'Elite Models Mumbai',
    businessType: 'MODELING_AGENCY',
    contactName: 'Priya Sharma',
    contactEmail: 'priya@elitemodels.in',
    contactPhone: '+91-98765-43210',
    website: 'https://elitemodels.in',
    country: 'India',
    city: 'Mumbai',
    expectedTalentCount: 150,
    expectedMonthlyVolume: 50000,
    businessDescription: 'Leading modeling agency in Mumbai with 10+ years experience. We represent fashion models, commercial models, and brand ambassadors.',
    requestedBlueprints: ['B1'],
    requestedTemplate: 'T1',
    status: 'PENDING',
    submittedAt: '2024-02-20T10:30:00Z',
    riskScore: 25,
    riskFlags: [],
    documents: {
      businessLicense: 'license_001.pdf',
      taxId: 'gst_001.pdf',
      bankStatement: 'bank_001.pdf',
      identityProof: 'id_001.pdf'
    },
    verificationStatus: {
      businessLicense: 'PENDING',
      taxId: 'PENDING',
      bankStatement: 'PENDING',
      identityProof: 'VERIFIED'
    }
  },
  {
    id: 'APP002',
    companyName: 'Miss India Organization',
    businessType: 'PAGEANT_ORGANIZER',
    contactName: 'Rajesh Kumar',
    contactEmail: 'rajesh@missindia.org',
    contactPhone: '+91-98765-43211',
    website: 'https://missindia.org',
    country: 'India',
    city: 'Delhi',
    expectedTalentCount: 500,
    expectedMonthlyVolume: 200000,
    businessDescription: 'National pageant organization conducting beauty contests across India. We organize state and national level competitions.',
    requestedBlueprints: ['B3', 'B8'],
    requestedTemplate: 'T3',
    status: 'UNDER_REVIEW',
    submittedAt: '2024-02-18T14:15:00Z',
    reviewedAt: '2024-02-19T09:00:00Z',
    reviewedBy: 'admin@platform.com',
    riskScore: 15,
    riskFlags: [],
    documents: {
      businessLicense: 'license_002.pdf',
      taxId: 'gst_002.pdf',
      bankStatement: 'bank_002.pdf',
      identityProof: 'id_002.pdf'
    },
    verificationStatus: {
      businessLicense: 'VERIFIED',
      taxId: 'VERIFIED',
      bankStatement: 'VERIFIED',
      identityProof: 'VERIFIED'
    }
  },
  {
    id: 'APP003',
    companyName: 'Bollywood Talent Hub',
    businessType: 'TALENT_MANAGER',
    contactName: 'Arjun Mehta',
    contactEmail: 'arjun@bollywoodtalent.com',
    contactPhone: '+91-98765-43212',
    website: 'https://bollywoodtalent.com',
    country: 'India',
    city: 'Mumbai',
    expectedTalentCount: 200,
    expectedMonthlyVolume: 75000,
    businessDescription: 'Talent management agency for Bollywood actors, dancers, and performers. We handle casting, contracts, and career management.',
    requestedBlueprints: ['B1', 'B2'],
    requestedTemplate: 'T2',
    status: 'APPROVED',
    submittedAt: '2024-02-15T11:20:00Z',
    reviewedAt: '2024-02-17T16:30:00Z',
    reviewedBy: 'admin@platform.com',
    riskScore: 20,
    riskFlags: [],
    documents: {
      businessLicense: 'license_003.pdf',
      taxId: 'gst_003.pdf',
      bankStatement: 'bank_003.pdf',
      identityProof: 'id_003.pdf'
    },
    verificationStatus: {
      businessLicense: 'VERIFIED',
      taxId: 'VERIFIED',
      bankStatement: 'VERIFIED',
      identityProof: 'VERIFIED'
    }
  },
  {
    id: 'APP004',
    companyName: 'Shady Casting Co',
    businessType: 'CASTING_AGENCY',
    contactName: 'John Doe',
    contactEmail: 'john@shadycasting.com',
    contactPhone: '+1-555-0123',
    country: 'USA',
    city: 'Los Angeles',
    expectedTalentCount: 1000,
    expectedMonthlyVolume: 500000,
    businessDescription: 'Casting agency for adult entertainment industry.',
    requestedBlueprints: ['B2'],
    requestedTemplate: 'T2',
    status: 'REJECTED',
    submittedAt: '2024-02-10T08:45:00Z',
    reviewedAt: '2024-02-12T10:15:00Z',
    reviewedBy: 'admin@platform.com',
    rejectionReason: 'Business type not aligned with platform values and target market',
    riskScore: 85,
    riskFlags: ['HIGH_RISK_INDUSTRY', 'POLICY_VIOLATION'],
    documents: {
      businessLicense: 'license_004.pdf',
      identityProof: 'id_004.pdf'
    },
    verificationStatus: {
      businessLicense: 'REJECTED',
      taxId: 'PENDING',
      bankStatement: 'PENDING',
      identityProof: 'VERIFIED'
    }
  },
  {
    id: 'APP005',
    companyName: 'Fashion Academy Delhi',
    businessType: 'ACADEMY',
    contactName: 'Sunita Gupta',
    contactEmail: 'sunita@fashionacademy.in',
    contactPhone: '+91-98765-43213',
    website: 'https://fashionacademy.in',
    country: 'India',
    city: 'Delhi',
    expectedTalentCount: 300,
    expectedMonthlyVolume: 100000,
    businessDescription: 'Fashion and modeling academy providing training in runway, photography, and grooming. We also offer certification courses.',
    requestedBlueprints: ['B5'],
    requestedTemplate: 'T5',
    status: 'PROVISIONING',
    submittedAt: '2024-02-12T13:00:00Z',
    reviewedAt: '2024-02-14T11:45:00Z',
    reviewedBy: 'admin@platform.com',
    riskScore: 10,
    riskFlags: [],
    documents: {
      businessLicense: 'license_005.pdf',
      taxId: 'gst_005.pdf',
      bankStatement: 'bank_005.pdf',
      identityProof: 'id_005.pdf'
    },
    verificationStatus: {
      businessLicense: 'VERIFIED',
      taxId: 'VERIFIED',
      bankStatement: 'VERIFIED',
      identityProof: 'VERIFIED'
    }
  }
];

// Mock tenant lifecycle data
export const tenantLifecycles: TenantLifecycle[] = [
  {
    id: 'TL001',
    tenantId: 'T001',
    companyName: 'Elite Models Agency',
    businessType: 'MODELING_AGENCY',
    status: 'ACTIVE',
    plan: 'PRO',
    createdAt: '2024-01-15T10:00:00Z',
    activatedAt: '2024-01-15T10:00:00Z',
    lastActivityAt: '2024-02-25T08:30:00Z',
    riskScore: 15,
    riskFlags: [],
    healthScore: 92,
    healthStatus: 'HEALTHY',
    limits: {
      maxUsers: 50,
      maxTalent: 500,
      maxStorage: 100,
      maxApiCalls: 100000
    },
    usage: {
      users: 25,
      talent: 180,
      storage: 45,
      apiCalls: 35000
    },
    billing: {
      monthlyRevenue: 2500,
      totalRevenue: 12500,
      lastPayment: '2024-02-01T00:00:00Z',
      paymentStatus: 'CURRENT'
    },
    compliance: {
      kycStatus: 'VERIFIED',
      kybStatus: 'VERIFIED',
      dataProcessingAgreement: true,
      privacyPolicyAccepted: true,
      termsAccepted: true
    },
    contacts: {
      primary: {
        name: 'Sarah Johnson',
        email: 'sarah@elitemodels.com',
        phone: '+1-555-0101',
        role: 'CEO'
      },
      billing: {
        name: 'Mike Finance',
        email: 'billing@elitemodels.com',
        phone: '+1-555-0102'
      },
      technical: {
        name: 'Tech Support',
        email: 'tech@elitemodels.com',
        phone: '+1-555-0103'
      }
    }
  },
  {
    id: 'TL002',
    tenantId: 'T002',
    companyName: 'Global Pageants Inc',
    businessType: 'PAGEANT_ORGANIZER',
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2024-01-20T14:30:00Z',
    activatedAt: '2024-01-20T14:30:00Z',
    lastActivityAt: '2024-02-25T09:15:00Z',
    riskScore: 8,
    riskFlags: [],
    healthScore: 98,
    healthStatus: 'HEALTHY',
    limits: {
      maxUsers: 200,
      maxTalent: 2000,
      maxStorage: 500,
      maxApiCalls: 500000
    },
    usage: {
      users: 85,
      talent: 750,
      storage: 180,
      apiCalls: 125000
    },
    billing: {
      monthlyRevenue: 8500,
      totalRevenue: 34000,
      lastPayment: '2024-02-01T00:00:00Z',
      paymentStatus: 'CURRENT'
    },
    compliance: {
      kycStatus: 'VERIFIED',
      kybStatus: 'VERIFIED',
      dataProcessingAgreement: true,
      privacyPolicyAccepted: true,
      termsAccepted: true
    },
    contacts: {
      primary: {
        name: 'Maria Rodriguez',
        email: 'maria@globalpageants.com',
        phone: '+1-555-0201',
        role: 'Founder'
      },
      billing: {
        name: 'Finance Team',
        email: 'billing@globalpageants.com',
        phone: '+1-555-0202'
      }
    }
  },
  {
    id: 'TL003',
    tenantId: 'T003',
    companyName: 'Risky Talent Co',
    businessType: 'TALENT_MANAGER',
    status: 'SUSPENDED',
    plan: 'GROWTH',
    createdAt: '2024-02-01T09:00:00Z',
    activatedAt: '2024-02-01T09:00:00Z',
    suspendedAt: '2024-02-20T16:45:00Z',
    lastActivityAt: '2024-02-20T16:30:00Z',
    riskScore: 75,
    riskFlags: ['PAYMENT_FAILURE', 'UNUSUAL_ACTIVITY'],
    healthScore: 35,
    healthStatus: 'CRITICAL',
    limits: {
      maxUsers: 25,
      maxTalent: 250,
      maxStorage: 50,
      maxApiCalls: 50000
    },
    usage: {
      users: 15,
      talent: 95,
      storage: 28,
      apiCalls: 45000
    },
    billing: {
      monthlyRevenue: 0,
      totalRevenue: 1200,
      lastPayment: '2024-01-15T00:00:00Z',
      paymentStatus: 'OVERDUE'
    },
    compliance: {
      kycStatus: 'PENDING',
      kybStatus: 'REJECTED',
      dataProcessingAgreement: false,
      privacyPolicyAccepted: true,
      termsAccepted: true
    },
    contacts: {
      primary: {
        name: 'Bob Suspicious',
        email: 'bob@riskytalent.com',
        phone: '+1-555-0301',
        role: 'Owner'
      }
    }
  },
  {
    id: 'TL004',
    tenantId: 'T004',
    companyName: 'Fashion Academy Pro',
    businessType: 'ACADEMY',
    status: 'ACTIVE',
    plan: 'GROWTH',
    createdAt: '2024-02-10T11:15:00Z',
    activatedAt: '2024-02-10T11:15:00Z',
    lastActivityAt: '2024-02-24T14:20:00Z',
    riskScore: 25,
    riskFlags: ['COMPLIANCE_ISSUE'],
    healthScore: 78,
    healthStatus: 'WARNING',
    limits: {
      maxUsers: 25,
      maxTalent: 250,
      maxStorage: 50,
      maxApiCalls: 50000
    },
    usage: {
      users: 22,
      talent: 180,
      storage: 35,
      apiCalls: 28000
    },
    billing: {
      monthlyRevenue: 1500,
      totalRevenue: 3000,
      lastPayment: '2024-02-10T00:00:00Z',
      paymentStatus: 'CURRENT'
    },
    compliance: {
      kycStatus: 'VERIFIED',
      kybStatus: 'VERIFIED',
      dataProcessingAgreement: true,
      privacyPolicyAccepted: false,
      termsAccepted: true
    },
    contacts: {
      primary: {
        name: 'Lisa Academy',
        email: 'lisa@fashionacademy.com',
        phone: '+1-555-0401',
        role: 'Director'
      },
      billing: {
        name: 'Academy Billing',
        email: 'billing@fashionacademy.com',
        phone: '+1-555-0402'
      }
    }
  }
];

// Mock risk flags
export const riskFlags: RiskFlag[] = [
  {
    id: 'RF001',
    tenantId: 'T003',
    type: 'PAYMENT_FAILURE',
    severity: 'HIGH',
    title: 'Multiple Payment Failures',
    description: 'Tenant has failed to make payments for 2 consecutive months',
    evidence: ['invoice_001.pdf', 'payment_failure_log.txt'],
    status: 'OPEN',
    createdAt: '2024-02-15T10:30:00Z',
    impact: 'Service suspension risk, revenue loss',
    recommendedAction: 'Contact tenant for payment resolution, consider suspension if no response within 7 days'
  },
  {
    id: 'RF002',
    tenantId: 'T003',
    type: 'UNUSUAL_ACTIVITY',
    severity: 'MEDIUM',
    title: 'Unusual API Usage Pattern',
    description: 'Sudden spike in API calls during off-hours, potential bot activity',
    evidence: ['api_logs_feb.csv', 'traffic_analysis.pdf'],
    status: 'INVESTIGATING',
    createdAt: '2024-02-18T14:15:00Z',
    impact: 'Potential system abuse, increased infrastructure costs',
    recommendedAction: 'Monitor API usage patterns, implement rate limiting if necessary'
  },
  {
    id: 'RF003',
    tenantId: 'T004',
    type: 'COMPLIANCE_ISSUE',
    severity: 'LOW',
    title: 'Privacy Policy Not Accepted',
    description: 'Tenant has not accepted the updated privacy policy',
    status: 'OPEN',
    createdAt: '2024-02-22T09:00:00Z',
    impact: 'Potential compliance violation, legal risk',
    recommendedAction: 'Send reminder to accept privacy policy, restrict access if not resolved within 30 days'
  },
  {
    id: 'RF004',
    tenantId: 'T005',
    type: 'FRAUD_SUSPICION',
    severity: 'CRITICAL',
    title: 'Suspicious Identity Documents',
    description: 'Uploaded identity documents appear to be forged or manipulated',
    evidence: ['id_analysis.pdf', 'forensic_report.pdf'],
    status: 'INVESTIGATING',
    createdAt: '2024-02-23T16:20:00Z',
    impact: 'Potential fraud, platform reputation risk',
    recommendedAction: 'Immediate account freeze, request additional verification documents'
  },
  {
    id: 'RF005',
    tenantId: 'T001',
    type: 'SECURITY_BREACH',
    severity: 'HIGH',
    title: 'Unauthorized Access Attempt',
    description: 'Multiple failed login attempts from suspicious IP addresses',
    evidence: ['security_logs.txt', 'ip_analysis.csv'],
    status: 'RESOLVED',
    createdAt: '2024-02-20T11:45:00Z',
    resolvedAt: '2024-02-21T14:30:00Z',
    resolvedBy: 'security@platform.com',
    resolution: 'Implemented additional security measures, forced password reset for affected accounts',
    impact: 'Potential account compromise, data breach risk',
    recommendedAction: 'Monitor for additional suspicious activity, consider MFA enforcement'
  }
];

// Statistics
export const tenantLifecycleStats = {
  applications: {
    total: tenantApplications.length,
    pending: tenantApplications.filter(a => a.status === 'PENDING').length,
    underReview: tenantApplications.filter(a => a.status === 'UNDER_REVIEW').length,
    approved: tenantApplications.filter(a => a.status === 'APPROVED').length,
    rejected: tenantApplications.filter(a => a.status === 'REJECTED').length,
    provisioning: tenantApplications.filter(a => a.status === 'PROVISIONING').length
  },
  tenants: {
    total: tenantLifecycles.length,
    active: tenantLifecycles.filter(t => t.status === 'ACTIVE').length,
    suspended: tenantLifecycles.filter(t => t.status === 'SUSPENDED').length,
    terminated: tenantLifecycles.filter(t => t.status === 'TERMINATED').length,
    healthy: tenantLifecycles.filter(t => t.healthStatus === 'HEALTHY').length,
    warning: tenantLifecycles.filter(t => t.healthStatus === 'WARNING').length,
    critical: tenantLifecycles.filter(t => t.healthStatus === 'CRITICAL').length
  },
  riskFlags: {
    total: riskFlags.length,
    open: riskFlags.filter(r => r.status === 'OPEN').length,
    investigating: riskFlags.filter(r => r.status === 'INVESTIGATING').length,
    resolved: riskFlags.filter(r => r.status === 'RESOLVED').length,
    critical: riskFlags.filter(r => r.severity === 'CRITICAL').length,
    high: riskFlags.filter(r => r.severity === 'HIGH').length,
    medium: riskFlags.filter(r => r.severity === 'MEDIUM').length,
    low: riskFlags.filter(r => r.severity === 'LOW').length
  }
};