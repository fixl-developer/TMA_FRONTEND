// Revenue Management Service
// Week 21-22: Revenue Management System

import { 
  subscriptions, 
  platformFees, 
  revenueReports, 
  billingDisputes, 
  revenueStats,
  type Subscription, 
  type PlatformFee, 
  type RevenueReport, 
  type BillingDispute 
} from '@/data/seed/revenueManagement';

export interface SubscriptionFilters {
  status?: string;
  plan?: string;
  billingCycle?: string;
  tenantId?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PlatformFeeFilters {
  type?: string;
  category?: string;
  structure?: string;
  isActive?: boolean;
  search?: string;
}

export interface BillingDisputeFilters {
  status?: string;
  disputeType?: string;
  priority?: string;
  tenantId?: string;
  search?: string;
}

export interface RevenueReportFilters {
  reportType?: string;
  period?: {
    start: string;
    end: string;
  };
}

class RevenueManagementService {
  // Subscriptions
  async getSubscriptions(filters?: SubscriptionFilters): Promise<Subscription[]> {
    await this.delay(300);
    
    let filtered = [...subscriptions];
    
    if (filters?.status) {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }
    if (filters?.plan) {
      filtered = filtered.filter(sub => sub.plan === filters.plan);
    }
    if (filters?.billingCycle) {
      filtered = filtered.filter(sub => sub.billingCycle === filters.billingCycle);
    }
    if (filters?.tenantId) {
      filtered = filtered.filter(sub => sub.tenantId === filters.tenantId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.tenantName.toLowerCase().includes(search) ||
        sub.tenantId.toLowerCase().includes(search) ||
        sub.plan.toLowerCase().includes(search)
      );
    }
    if (filters?.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(sub => {
        const created = new Date(sub.createdAt);
        return created >= start && created <= end;
      });
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    await this.delay(200);
    return subscriptions.find(sub => sub.id === id) || null;
  }

  async updateSubscriptionStatus(id: string, status: string, reason?: string): Promise<Subscription> {
    await this.delay(500);
    
    const subscription = subscriptions.find(s => s.id === id);
    if (!subscription) throw new Error('Subscription not found');
    
    const updatedSubscription: Subscription = {
      ...subscription,
      status: status as any,
      updatedAt: new Date().toISOString(),
      notes: reason ? `${subscription.notes || ''}\n${new Date().toISOString()}: ${reason}` : subscription.notes
    };
    
    return updatedSubscription;
  }

  async updateSubscriptionPlan(id: string, plan: string, pricing: any): Promise<Subscription> {
    await this.delay(500);
    
    const subscription = subscriptions.find(s => s.id === id);
    if (!subscription) throw new Error('Subscription not found');
    
    const updatedSubscription: Subscription = {
      ...subscription,
      plan: plan as any,
      basePrice: pricing.basePrice,
      discountPercent: pricing.discountPercent || 0,
      finalPrice: pricing.finalPrice,
      updatedAt: new Date().toISOString()
    };
    
    return updatedSubscription;
  }

  async createSubscription(data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    await this.delay(500);
    
    const newSubscription: Subscription = {
      ...data,
      id: `SUB${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newSubscription;
  }

  // Platform Fees
  async getPlatformFees(filters?: PlatformFeeFilters): Promise<PlatformFee[]> {
    await this.delay(300);
    
    let filtered = [...platformFees];
    
    if (filters?.type) {
      filtered = filtered.filter(fee => fee.type === filters.type);
    }
    if (filters?.category) {
      filtered = filtered.filter(fee => fee.category === filters.category);
    }
    if (filters?.structure) {
      filtered = filtered.filter(fee => fee.structure === filters.structure);
    }
    if (filters?.isActive !== undefined) {
      filtered = filtered.filter(fee => fee.isActive === filters.isActive);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(fee => 
        fee.name.toLowerCase().includes(search) ||
        fee.description.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createPlatformFee(data: Omit<PlatformFee, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlatformFee> {
    await this.delay(500);
    
    const newFee: PlatformFee = {
      ...data,
      id: `FEE${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newFee;
  }

  async updatePlatformFee(id: string, updates: Partial<PlatformFee>): Promise<PlatformFee> {
    await this.delay(500);
    
    const fee = platformFees.find(f => f.id === id);
    if (!fee) throw new Error('Platform fee not found');
    
    const updatedFee: PlatformFee = {
      ...fee,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedFee;
  }

  async togglePlatformFee(id: string): Promise<PlatformFee> {
    await this.delay(500);
    
    const fee = platformFees.find(f => f.id === id);
    if (!fee) throw new Error('Platform fee not found');
    
    const updatedFee: PlatformFee = {
      ...fee,
      isActive: !fee.isActive,
      updatedAt: new Date().toISOString()
    };
    
    return updatedFee;
  }

  // Revenue Reports
  async getRevenueReports(filters?: RevenueReportFilters): Promise<RevenueReport[]> {
    await this.delay(300);
    
    let filtered = [...revenueReports];
    
    if (filters?.reportType) {
      filtered = filtered.filter(report => report.reportType === filters.reportType);
    }
    if (filters?.period) {
      const start = new Date(filters.period.start);
      const end = new Date(filters.period.end);
      filtered = filtered.filter(report => {
        const reportStart = new Date(report.period.start);
        const reportEnd = new Date(report.period.end);
        return reportStart >= start && reportEnd <= end;
      });
    }
    
    return filtered.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  async generateRevenueReport(type: string, period: { start: string; end: string }): Promise<RevenueReport> {
    await this.delay(2000); // Simulate report generation time
    
    // Mock report generation
    const newReport: RevenueReport = {
      id: `REP${Date.now()}`,
      reportType: type as any,
      period,
      metrics: {
        totalRevenue: Math.floor(Math.random() * 200000) + 100000,
        subscriptionRevenue: Math.floor(Math.random() * 150000) + 80000,
        transactionFees: Math.floor(Math.random() * 30000) + 15000,
        platformFees: Math.floor(Math.random() * 20000) + 8000,
        refunds: Math.floor(Math.random() * 5000) + 1000,
        netRevenue: Math.floor(Math.random() * 180000) + 95000,
        growth: {
          amount: Math.floor(Math.random() * 20000) + 5000,
          percentage: Math.round((Math.random() * 20 + 5) * 100) / 100
        },
        activeSubscriptions: Math.floor(Math.random() * 100) + 120,
        newSubscriptions: Math.floor(Math.random() * 30) + 15,
        cancelledSubscriptions: Math.floor(Math.random() * 15) + 5,
        churnRate: Math.round((Math.random() * 8 + 2) * 100) / 100,
        averageRevenuePerUser: Math.round((Math.random() * 500 + 600) * 100) / 100,
        lifetimeValue: Math.round((Math.random() * 2000 + 3000) * 100) / 100
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
          { tenantId: 'T005', tenantName: 'Fashion Week Organizers', revenue: 6800, percentage: 5.4 }
        ]
      },
      generatedAt: new Date().toISOString(),
      generatedBy: 'admin@platform.com'
    };
    
    return newReport;
  }

  // Billing Disputes
  async getBillingDisputes(filters?: BillingDisputeFilters): Promise<BillingDispute[]> {
    await this.delay(300);
    
    let filtered = [...billingDisputes];
    
    if (filters?.status) {
      filtered = filtered.filter(dispute => dispute.status === filters.status);
    }
    if (filters?.disputeType) {
      filtered = filtered.filter(dispute => dispute.disputeType === filters.disputeType);
    }
    if (filters?.priority) {
      filtered = filtered.filter(dispute => dispute.priority === filters.priority);
    }
    if (filters?.tenantId) {
      filtered = filtered.filter(dispute => dispute.tenantId === filters.tenantId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(dispute => 
        dispute.tenantName.toLowerCase().includes(search) ||
        dispute.description.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateBillingDisputeStatus(id: string, status: string): Promise<BillingDispute> {
    await this.delay(500);
    
    const dispute = billingDisputes.find(d => d.id === id);
    if (!dispute) throw new Error('Billing dispute not found');
    
    const updatedDispute: BillingDispute = {
      ...dispute,
      status: status as any,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...dispute.timeline,
        {
          timestamp: new Date().toISOString(),
          action: `Status changed to ${status}`,
          actor: 'admin@platform.com',
          details: `Dispute status updated to ${status}`
        }
      ]
    };
    
    return updatedDispute;
  }

  async resolveBillingDispute(id: string, resolution: any): Promise<BillingDispute> {
    await this.delay(500);
    
    const dispute = billingDisputes.find(d => d.id === id);
    if (!dispute) throw new Error('Billing dispute not found');
    
    const updatedDispute: BillingDispute = {
      ...dispute,
      status: 'RESOLVED',
      resolution: {
        ...resolution,
        resolvedBy: 'admin@platform.com',
        resolvedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString(),
      timeline: [
        ...dispute.timeline,
        {
          timestamp: new Date().toISOString(),
          action: 'Dispute Resolved',
          actor: 'admin@platform.com',
          details: `Resolution: ${resolution.outcome}`
        }
      ]
    };
    
    return updatedDispute;
  }

  // Analytics
  async getRevenueAnalytics(period: { start: string; end: string }) {
    await this.delay(500);
    
    // Mock analytics data
    return {
      totalRevenue: 125750,
      growth: 14.6,
      subscriptions: {
        active: 156,
        new: 23,
        cancelled: 8,
        churn: 5.1
      },
      plans: {
        starter: { count: 45, revenue: 18950 },
        growth: { count: 38, revenue: 32450 },
        pro: { count: 28, revenue: 45600 },
        enterprise: { count: 8, revenue: 28750 }
      },
      trends: [
        { date: '2024-02-01', revenue: 98500, subscriptions: 148 },
        { date: '2024-02-08', revenue: 105200, subscriptions: 152 },
        { date: '2024-02-15', revenue: 112800, subscriptions: 155 },
        { date: '2024-02-22', revenue: 118900, subscriptions: 158 },
        { date: '2024-02-29', revenue: 125750, subscriptions: 156 }
      ]
    };
  }

  // Statistics
  async getRevenueStats() {
    await this.delay(100);
    return revenueStats;
  }

  // Pricing Calculator
  async calculatePricing(plan: string, billingCycle: string, addons: string[] = []): Promise<any> {
    await this.delay(200);
    
    const basePrices: Record<string, Record<string, number>> = {
      STARTER: { MONTHLY: 79, QUARTERLY: 213, ANNUALLY: 790 },
      GROWTH: { MONTHLY: 149, QUARTERLY: 402, ANNUALLY: 1490 },
      PRO: { MONTHLY: 299, QUARTERLY: 807, ANNUALLY: 2990 },
      ENTERPRISE: { MONTHLY: 599, QUARTERLY: 1617, ANNUALLY: 5990 }
    };
    
    const addonPrices: Record<string, number> = {
      'premium-api': 99,
      'white-label': 500,
      'custom-integrations': 299,
      'dedicated-support': 199
    };
    
    const basePrice = basePrices[plan]?.[billingCycle] || 0;
    const addonPrice = addons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0);
    const subtotal = basePrice + addonPrice;
    
    // Apply billing cycle discounts
    let discount = 0;
    if (billingCycle === 'QUARTERLY') discount = 10;
    if (billingCycle === 'ANNUALLY') discount = 20;
    
    const discountAmount = (subtotal * discount) / 100;
    const finalPrice = subtotal - discountAmount;
    
    return {
      plan,
      billingCycle,
      basePrice,
      addons: addons.map(addon => ({
        name: addon,
        price: addonPrices[addon] || 0
      })),
      addonPrice,
      subtotal,
      discount,
      discountAmount,
      finalPrice
    };
  }

  // Bulk operations
  async bulkUpdateSubscriptions(subscriptionIds: string[], updates: any): Promise<void> {
    await this.delay(1000);
    // Mock bulk update
  }

  async exportRevenueData(type: 'subscriptions' | 'fees' | 'disputes' | 'reports', filters?: any): Promise<Blob> {
    await this.delay(1000);
    
    let data: any[] = [];
    switch (type) {
      case 'subscriptions':
        data = await this.getSubscriptions(filters);
        break;
      case 'fees':
        data = await this.getPlatformFees(filters);
        break;
      case 'disputes':
        data = await this.getBillingDisputes(filters);
        break;
      case 'reports':
        data = await this.getRevenueReports(filters);
        break;
    }
    
    const csv = this.convertToCSV(data);
    return new Blob([csv], { type: 'text/csv' });
  }

  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => 
      headers.map(header => {
        const value = item[header];
        if (typeof value === 'object') return JSON.stringify(value);
        return value;
      }).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }
}

export const revenueManagementService = new RevenueManagementService();
export type { Subscription, PlatformFee, RevenueReport, BillingDispute };