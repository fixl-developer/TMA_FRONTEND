// Revenue Management Seed Data
// Week 21-22: Revenue Management System

export interface Subscription {
  id: string;
  tenantId: string;
  tenantName: string;
  plan: 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  currency: 'USD' | 'EUR' | 'GBP';
  startDate: string;
  endDate?: string;
  nextBillingDate: string;
  lastBillingDate?: string;
  trialEndDate?: string;
  features: string[];
  limits: {
    users: number;
    talent: number;
    storage: number; // GB
    apiCalls: number; // per month
    customDomains: number;
    integrations: number;
  };
  usage: {
    users: number;
    talent: number;
    storage: number;
    apiCalls: number;
    customDomains: number;
    integrations: number;
  };
  paymentMethod: {
    type: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  billingAddress: {
    company?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  invoices: string[]; // Invoice IDs
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
}

export interface PlatformFee {
  id: string;
  name: string;
  type: 'TRANSACTION' | 'BOOKING' | 'PAYMENT_PROCESSING' | 'SUBSCRIPTION' | 'CUSTOM';
  category: 'CORE' | 'PREMIUM' | 'ENTERPRISE' | 'ADDON';
  structure: 'PERCENTAGE' | 'FIXED' | 'TIERED' | 'HYBRID';
  value: number; // Percentage or fixed amount
  minAmount?: number;
  maxAmount?: number;
  currency: 'USD' | 'EUR' | 'GBP';
  applicablePlans: string[];
  applicableRegions: string[];
  tiers?: {
    from: number;
    to: number;
    rate: number;
  }[];
  description: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveUntil?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface RevenueReport {
  id: string;
  reportType: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalRevenue: number;
    subscriptionRevenue: number;
    transactionFees: number;
    platformFees: number;
    refunds: number;
    netRevenue: number;
    growth: {
      amount: number;
      percentage: number;
    };
    activeSubscriptions: number;
    newSubscriptions: number;
    cancelledSubscriptions: number;
    churnRate: number;
    averageRevenuePerUser: number;
    lifetimeValue: number;
  };
  breakdown: {
    byPlan: {
      plan: string;
      revenue: number;
      subscriptions: number;
      percentage: number;
    }[];
    byRegion: {
      region: string;
      revenue: number;
      subscriptions: number;
      percentage: number;
    }[];
    byTenant: {
      tenantId: string;
      tenantName: string;
      revenue: number;
      percentage: number;
    }[];
  };
  generatedAt: string;
  generatedBy: string;
}

export interface BillingDispute {
  id: string;
  subscriptionId: string;
  tenantId: string;
  tenantName: string;
  disputeType: 'BILLING_ERROR' | 'UNAUTHORIZED_CHARGE' | 'SERVICE_ISSUE' | 'REFUND_REQUEST' | 'PRICING_DISPUTE';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  amount: number;
  currency: string;
  description: string;
  evidence: {
    type: 'INVOICE' | 'PAYMENT_RECORD' | 'EMAIL' | 'SCREENSHOT' | 'DOCUMENT';
    filename: string;
    url: string;
    uploadedAt: string;
  }[];
  timeline: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
  resolution?: {
    outcome: 'REFUND_ISSUED' | 'CREDIT_APPLIED' | 'DISPUTE_DISMISSED' | 'PLAN_ADJUSTED';
    amount?: number;
    details: string;
    resolvedBy: string;
    resolvedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

// Mock subscriptions data
export const subscriptions: Subscription[] = [
  {
    id: 'SUB001',
    tenantId: 'T001',
    tenantName: 'Elite Models Agency',
    plan: 'PRO',
    status: 'ACTIVE',
    billingCycle: 'MONTHLY',
    basePrice: 299,
    discountPercent: 10,
    finalPrice: 269.10,
    currency: 'USD',
    startDate: '2024-01-15T00:00:00Z',
    nextBillingDate: '2024-03-15T00:00:00Z',
    lastBillingDate: '2024-02-15T00:00:00Z',
    features: ['Advanced Analytics', 'Custom Branding', 'API Access', 'Priority Support'],
    limits: {
      users: 50,
      talent: 500,
      storage: 100,
      apiCalls: 100000,
      customDomains: 3,
      integrations: 10
    },
    usage: {
      users: 25,
      talent: 180,
      storage: 45,
      apiCalls: 35000,
      customDomains: 2,
      integrations: 5
    },
    paymentMethod: {
      type: 'CREDIT_CARD',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026
    },
    billingAddress: {
      company: 'Elite Models Agency LLC',
      street: '123 Fashion Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    invoices: ['INV001', 'INV002', 'INV003'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    createdBy: 'system@platform.com'
  },
  {
    id: 'SUB002',
    tenantId: 'T002',
    tenantName: 'Global Pageants Inc',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    billingCycle: 'ANNUALLY',
    basePrice: 8500,
    discountPercent: 15,
    finalPrice: 7225,
    currency: 'USD',
    startDate: '2024-01-20T00:00:00Z',
    nextBillingDate: '2025-01-20T00:00:00Z',
    lastBillingDate: '2024-01-20T00:00:00Z',
    features: ['All Pro Features', 'Dedicated Support', 'Custom Integrations', 'SLA Guarantee', 'White Label'],
    limits: {
      users: 200,
      talent: 2000,
      storage: 500,
      apiCalls: 500000,
      customDomains: 10,
      integrations: 50
    },
    usage: {
      users: 85,
      talent: 750,
      storage: 180,
      apiCalls: 125000,
      customDomains: 5,
      integrations: 15
    },
    paymentMethod: {
      type: 'BANK_TRANSFER',
      last4: '7890'
    },
    billingAddress: {
      company: 'Global Pageants Inc',
      street: '456 Beauty Blvd',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90210',
      country: 'USA'
    },
    invoices: ['INV004'],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'sales@platform.com'
  },
  {
    id: 'SUB003',
    tenantId: 'T003',
    tenantName: 'Risky Talent Co',
    plan: 'GROWTH',
    status: 'PAST_DUE',
    billingCycle: 'MONTHLY',
    basePrice: 149,
    discountPercent: 0,
    finalPrice: 149,
    currency: 'USD',
    startDate: '2024-02-01T00:00:00Z',
    nextBillingDate: '2024-03-01T00:00:00Z',
    lastBillingDate: '2024-02-01T00:00:00Z',
    features: ['Basic Analytics', 'Email Support', 'Standard Integrations'],
    limits: {
      users: 25,
      talent: 250,
      storage: 50,
      apiCalls: 50000,
      customDomains: 1,
      integrations: 5
    },
    usage: {
      users: 15,
      talent: 95,
      storage: 28,
      apiCalls: 45000,
      customDomains: 1,
      integrations: 3
    },
    paymentMethod: {
      type: 'CREDIT_CARD',
      last4: '1234',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2025
    },
    billingAddress: {
      company: 'Risky Talent Co',
      street: '789 Talent St',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA'
    },
    invoices: ['INV005', 'INV006'],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-20T16:45:00Z',
    createdBy: 'system@platform.com',
    notes: 'Payment failed multiple times, account suspended'
  },
  {
    id: 'SUB004',
    tenantId: 'T004',
    tenantName: 'Fashion Academy Pro',
    plan: 'STARTER',
    status: 'TRIALING',
    billingCycle: 'MONTHLY',
    basePrice: 79,
    discountPercent: 0,
    finalPrice: 79,
    currency: 'USD',
    startDate: '2024-02-10T00:00:00Z',
    trialEndDate: '2024-03-10T00:00:00Z',
    nextBillingDate: '2024-03-10T00:00:00Z',
    features: ['Basic Features', 'Community Support'],
    limits: {
      users: 10,
      talent: 100,
      storage: 25,
      apiCalls: 25000,
      customDomains: 0,
      integrations: 2
    },
    usage: {
      users: 8,
      talent: 45,
      storage: 12,
      apiCalls: 8000,
      customDomains: 0,
      integrations: 1
    },
    paymentMethod: {
      type: 'CREDIT_CARD',
      last4: '5678',
      brand: 'Visa',
      expiryMonth: 6,
      expiryYear: 2027
    },
    billingAddress: {
      company: 'Fashion Academy Pro',
      street: '321 Academy Rd',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    invoices: [],
    createdAt: '2024-02-10T11:15:00Z',
    updatedAt: '2024-02-10T11:15:00Z',
    createdBy: 'system@platform.com'
  }
];

// Mock platform fees
export const platformFees: PlatformFee[] = [
  {
    id: 'FEE001',
    name: 'Transaction Processing Fee',
    type: 'TRANSACTION',
    category: 'CORE',
    structure: 'PERCENTAGE',
    value: 2.9,
    minAmount: 0.30,
    maxAmount: 50,
    currency: 'USD',
    applicablePlans: ['STARTER', 'GROWTH', 'PRO', 'ENTERPRISE'],
    applicableRegions: ['US', 'CA', 'EU'],
    description: 'Standard transaction processing fee for all payments',
    isActive: true,
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin@platform.com'
  },
  {
    id: 'FEE002',
    name: 'Booking Commission',
    type: 'BOOKING',
    category: 'CORE',
    structure: 'TIERED',
    value: 5,
    currency: 'USD',
    applicablePlans: ['STARTER', 'GROWTH', 'PRO', 'ENTERPRISE'],
    applicableRegions: ['US', 'CA', 'EU', 'UK'],
    tiers: [
      { from: 0, to: 1000, rate: 5 },
      { from: 1001, to: 5000, rate: 4 },
      { from: 5001, to: 10000, rate: 3 },
      { from: 10001, to: 999999, rate: 2.5 }
    ],
    description: 'Tiered commission on booking values',
    isActive: true,
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'admin@platform.com'
  },
  {
    id: 'FEE003',
    name: 'Premium API Access',
    type: 'SUBSCRIPTION',
    category: 'PREMIUM',
    structure: 'FIXED',
    value: 99,
    currency: 'USD',
    applicablePlans: ['PRO', 'ENTERPRISE'],
    applicableRegions: ['US', 'CA', 'EU', 'UK', 'AU'],
    description: 'Monthly fee for premium API access and higher rate limits',
    isActive: true,
    effectiveFrom: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'product@platform.com'
  },
  {
    id: 'FEE004',
    name: 'White Label Addon',
    type: 'CUSTOM',
    category: 'ENTERPRISE',
    structure: 'FIXED',
    value: 500,
    currency: 'USD',
    applicablePlans: ['ENTERPRISE'],
    applicableRegions: ['US', 'CA', 'EU', 'UK', 'AU'],
    description: 'Monthly addon for complete white label branding',
    isActive: true,
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'enterprise@platform.com'
  }
];

// Mock revenue reports
export const revenueReports: RevenueReport[] = [
  {
    id: 'REP001',
    reportType: 'MONTHLY',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    metrics: {
      totalRevenue: 125750,
      subscriptionRevenue: 98500,
      transactionFees: 18250,
      platformFees: 9000,
      refunds: 2500,
      netRevenue: 123250,
      growth: {
        amount: 15750,
        percentage: 14.6
      },
      activeSubscriptions: 156,
      newSubscriptions: 23,
      cancelledSubscriptions: 8,
      churnRate: 5.1,
      averageRevenuePerUser: 806.41,
      lifetimeValue: 4832.46
    },
    breakdown: {
      byPlan: [
        { plan: 'STARTER', revenue: 18950, subscriptions: 45, percentage: 15.1 },
        { plan: 'GROWTH', revenue: 32450, subscriptions: 38, percentage: 25.8 },
        { plan: 'PRO', revenue: 45600, subscriptions: 28, percentage: 36.3 },
        { plan: 'ENTERPRISE', revenue: 28750, subscriptions: 8, percentage: 22.9 }
      ],
      byRegion: [
        { region: 'North America', revenue: 78500, subscriptions: 89, percentage: 62.4 },
        { region: 'Europe', revenue: 32750, subscriptions: 45, percentage: 26.0 },
        { region: 'Asia Pacific', revenue: 14500, subscriptions: 22, percentage: 11.5 }
      ],
      byTenant: [
        { tenantId: 'T002', tenantName: 'Global Pageants Inc', revenue: 8500, percentage: 6.8 },
        { tenantId: 'T001', tenantName: 'Elite Models Agency', revenue: 7200, percentage: 5.7 },
        { tenantId: 'T005', tenantName: 'Fashion Week Organizers', revenue: 6800, percentage: 5.4 },
        { tenantId: 'T003', tenantName: 'Risky Talent Co', revenue: 4500, percentage: 3.6 },
        { tenantId: 'T004', tenantName: 'Fashion Academy Pro', revenue: 3200, percentage: 2.5 }
      ]
    },
    generatedAt: '2024-03-01T09:00:00Z',
    generatedBy: 'finance@platform.com'
  }
];

// Mock billing disputes
export const billingDisputes: BillingDispute[] = [
  {
    id: 'DISP001',
    subscriptionId: 'SUB003',
    tenantId: 'T003',
    tenantName: 'Risky Talent Co',
    disputeType: 'BILLING_ERROR',
    status: 'INVESTIGATING',
    priority: 'HIGH',
    amount: 149,
    currency: 'USD',
    description: 'Customer claims they were charged twice for February subscription',
    evidence: [
      {
        type: 'INVOICE',
        filename: 'duplicate_invoice.pdf',
        url: '/evidence/duplicate_invoice.pdf',
        uploadedAt: '2024-02-22T10:30:00Z'
      },
      {
        type: 'PAYMENT_RECORD',
        filename: 'bank_statement.pdf',
        url: '/evidence/bank_statement.pdf',
        uploadedAt: '2024-02-22T10:35:00Z'
      }
    ],
    timeline: [
      {
        timestamp: '2024-02-22T10:00:00Z',
        action: 'Dispute Filed',
        actor: 'Risky Talent Co',
        details: 'Customer reported duplicate billing'
      },
      {
        timestamp: '2024-02-22T14:30:00Z',
        action: 'Investigation Started',
        actor: 'billing@platform.com',
        details: 'Assigned to billing team for review'
      }
    ],
    createdAt: '2024-02-22T10:00:00Z',
    updatedAt: '2024-02-22T14:30:00Z',
    assignedTo: 'billing@platform.com'
  },
  {
    id: 'DISP002',
    subscriptionId: 'SUB001',
    tenantId: 'T001',
    tenantName: 'Elite Models Agency',
    disputeType: 'REFUND_REQUEST',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    amount: 269.10,
    currency: 'USD',
    description: 'Customer requested refund due to service downtime during critical period',
    evidence: [
      {
        type: 'EMAIL',
        filename: 'service_complaint.pdf',
        url: '/evidence/service_complaint.pdf',
        uploadedAt: '2024-02-18T16:20:00Z'
      },
      {
        type: 'SCREENSHOT',
        filename: 'downtime_evidence.png',
        url: '/evidence/downtime_evidence.png',
        uploadedAt: '2024-02-18T16:25:00Z'
      }
    ],
    timeline: [
      {
        timestamp: '2024-02-18T16:00:00Z',
        action: 'Refund Request',
        actor: 'Elite Models Agency',
        details: 'Requested refund due to service downtime'
      },
      {
        timestamp: '2024-02-19T09:00:00Z',
        action: 'Review Started',
        actor: 'support@platform.com',
        details: 'Assigned to customer success team'
      },
      {
        timestamp: '2024-02-20T15:30:00Z',
        action: 'Resolved',
        actor: 'support@platform.com',
        details: 'Partial credit applied to account'
      }
    ],
    resolution: {
      outcome: 'CREDIT_APPLIED',
      amount: 134.55,
      details: 'Applied 50% credit to account for service disruption during critical period',
      resolvedBy: 'support@platform.com',
      resolvedAt: '2024-02-20T15:30:00Z'
    },
    createdAt: '2024-02-18T16:00:00Z',
    updatedAt: '2024-02-20T15:30:00Z',
    assignedTo: 'support@platform.com'
  }
];

// Statistics
export const revenueStats = {
  subscriptions: {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'ACTIVE').length,
    trialing: subscriptions.filter(s => s.status === 'TRIALING').length,
    pastDue: subscriptions.filter(s => s.status === 'PAST_DUE').length,
    cancelled: subscriptions.filter(s => s.status === 'CANCELLED').length,
    suspended: subscriptions.filter(s => s.status === 'SUSPENDED').length
  },
  fees: {
    total: platformFees.length,
    active: platformFees.filter(f => f.isActive).length,
    core: platformFees.filter(f => f.category === 'CORE').length,
    premium: platformFees.filter(f => f.category === 'PREMIUM').length,
    enterprise: platformFees.filter(f => f.category === 'ENTERPRISE').length
  },
  disputes: {
    total: billingDisputes.length,
    open: billingDisputes.filter(d => d.status === 'OPEN').length,
    investigating: billingDisputes.filter(d => d.status === 'INVESTIGATING').length,
    resolved: billingDisputes.filter(d => d.status === 'RESOLVED').length,
    escalated: billingDisputes.filter(d => d.status === 'ESCALATED').length
  },
  revenue: {
    monthly: 125750,
    growth: 14.6,
    churn: 5.1,
    arpu: 806.41
  }
};