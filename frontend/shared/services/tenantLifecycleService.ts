// Tenant Lifecycle Service
// Week 17-18: Tenant Lifecycle Management

import { 
  tenantApplications, 
  tenantLifecycles, 
  riskFlags, 
  tenantLifecycleStats,
  type TenantApplication, 
  type TenantLifecycle, 
  type RiskFlag 
} from '@/data/seed/tenantLifecycle';

export interface TenantApplicationFilters {
  status?: string;
  businessType?: string;
  country?: string;
  riskLevel?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TenantLifecycleFilters {
  status?: string;
  plan?: string;
  healthStatus?: string;
  riskLevel?: string;
  search?: string;
}

export interface RiskFlagFilters {
  tenantId?: string;
  type?: string;
  severity?: string;
  status?: string;
  search?: string;
}

class TenantLifecycleService {
  // Tenant Applications
  async getTenantApplications(filters?: TenantApplicationFilters): Promise<TenantApplication[]> {
    await this.delay(300);
    
    let filtered = [...tenantApplications];
    
    if (filters?.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    if (filters?.businessType) {
      filtered = filtered.filter(app => app.businessType === filters.businessType);
    }
    if (filters?.country) {
      filtered = filtered.filter(app => app.country === filters.country);
    }
    if (filters?.riskLevel) {
      const riskThreshold = filters.riskLevel === 'HIGH' ? 60 : filters.riskLevel === 'MEDIUM' ? 30 : 0;
      filtered = filtered.filter(app => app.riskScore >= riskThreshold);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.companyName.toLowerCase().includes(search) ||
        app.contactName.toLowerCase().includes(search) ||
        app.contactEmail.toLowerCase().includes(search)
      );
    }
    if (filters?.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(app => {
        const submitted = new Date(app.submittedAt);
        return submitted >= start && submitted <= end;
      });
    }
    
    return filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async getTenantApplicationById(id: string): Promise<TenantApplication | null> {
    await this.delay(200);
    return tenantApplications.find(app => app.id === id) || null;
  }

  async reviewTenantApplication(id: string, action: 'APPROVE' | 'REJECT', data: {
    reviewedBy: string;
    notes?: string;
    rejectionReason?: string;
  }): Promise<TenantApplication> {
    await this.delay(500);
    
    const app = tenantApplications.find(a => a.id === id);
    if (!app) throw new Error('Application not found');
    
    const updatedApp: TenantApplication = {
      ...app,
      status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
      reviewedAt: new Date().toISOString(),
      reviewedBy: data.reviewedBy,
      notes: data.notes,
      rejectionReason: action === 'REJECT' ? data.rejectionReason : undefined
    };
    
    return updatedApp;
  }

  async provisionTenant(applicationId: string): Promise<{ tenantId: string; subdomain: string }> {
    await this.delay(2000); // Simulate provisioning time
    
    const app = tenantApplications.find(a => a.id === applicationId);
    if (!app) throw new Error('Application not found');
    
    const tenantId = `T${Date.now()}`;
    const subdomain = app.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return { tenantId, subdomain };
  }

  // Tenant Lifecycle
  async getTenantLifecycles(filters?: TenantLifecycleFilters): Promise<TenantLifecycle[]> {
    await this.delay(300);
    
    let filtered = [...tenantLifecycles];
    
    if (filters?.status) {
      filtered = filtered.filter(tenant => tenant.status === filters.status);
    }
    if (filters?.plan) {
      filtered = filtered.filter(tenant => tenant.plan === filters.plan);
    }
    if (filters?.healthStatus) {
      filtered = filtered.filter(tenant => tenant.healthStatus === filters.healthStatus);
    }
    if (filters?.riskLevel) {
      const riskThreshold = filters.riskLevel === 'HIGH' ? 60 : filters.riskLevel === 'MEDIUM' ? 30 : 0;
      filtered = filtered.filter(tenant => tenant.riskScore >= riskThreshold);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(tenant => 
        tenant.companyName.toLowerCase().includes(search) ||
        tenant.tenantId.toLowerCase().includes(search) ||
        tenant.contacts.primary.email.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    );
  }

  async getTenantLifecycleById(id: string): Promise<TenantLifecycle | null> {
    await this.delay(200);
    return tenantLifecycles.find(tenant => tenant.id === id || tenant.tenantId === id) || null;
  }

  async updateTenantStatus(tenantId: string, status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED', reason?: string): Promise<TenantLifecycle> {
    await this.delay(500);
    
    const tenant = tenantLifecycles.find(t => t.tenantId === tenantId);
    if (!tenant) throw new Error('Tenant not found');
    
    const now = new Date().toISOString();
    const updatedTenant: TenantLifecycle = {
      ...tenant,
      status,
      suspendedAt: status === 'SUSPENDED' ? now : tenant.suspendedAt,
      terminatedAt: status === 'TERMINATED' ? now : tenant.terminatedAt
    };
    
    return updatedTenant;
  }

  async updateTenantLimits(tenantId: string, limits: Partial<TenantLifecycle['limits']>): Promise<TenantLifecycle> {
    await this.delay(500);
    
    const tenant = tenantLifecycles.find(t => t.tenantId === tenantId);
    if (!tenant) throw new Error('Tenant not found');
    
    const updatedTenant: TenantLifecycle = {
      ...tenant,
      limits: { ...tenant.limits, ...limits }
    };
    
    return updatedTenant;
  }

  async updateTenantPlan(tenantId: string, plan: 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE'): Promise<TenantLifecycle> {
    await this.delay(500);
    
    const tenant = tenantLifecycles.find(t => t.tenantId === tenantId);
    if (!tenant) throw new Error('Tenant not found');
    
    // Update limits based on plan
    const planLimits = {
      STARTER: { maxUsers: 10, maxTalent: 100, maxStorage: 25, maxApiCalls: 25000 },
      GROWTH: { maxUsers: 25, maxTalent: 250, maxStorage: 50, maxApiCalls: 50000 },
      PRO: { maxUsers: 50, maxTalent: 500, maxStorage: 100, maxApiCalls: 100000 },
      ENTERPRISE: { maxUsers: 200, maxTalent: 2000, maxStorage: 500, maxApiCalls: 500000 }
    };
    
    const updatedTenant: TenantLifecycle = {
      ...tenant,
      plan,
      limits: planLimits[plan]
    };
    
    return updatedTenant;
  }

  // Risk Flags
  async getRiskFlags(filters?: RiskFlagFilters): Promise<RiskFlag[]> {
    await this.delay(300);
    
    let filtered = [...riskFlags];
    
    if (filters?.tenantId) {
      filtered = filtered.filter(flag => flag.tenantId === filters.tenantId);
    }
    if (filters?.type) {
      filtered = filtered.filter(flag => flag.type === filters.type);
    }
    if (filters?.severity) {
      filtered = filtered.filter(flag => flag.severity === filters.severity);
    }
    if (filters?.status) {
      filtered = filtered.filter(flag => flag.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(flag => 
        flag.title.toLowerCase().includes(search) ||
        flag.description.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createRiskFlag(data: Omit<RiskFlag, 'id' | 'createdAt'>): Promise<RiskFlag> {
    await this.delay(500);
    
    const newFlag: RiskFlag = {
      ...data,
      id: `RF${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    return newFlag;
  }

  async updateRiskFlag(id: string, data: Partial<RiskFlag>): Promise<RiskFlag> {
    await this.delay(500);
    
    const flag = riskFlags.find(f => f.id === id);
    if (!flag) throw new Error('Risk flag not found');
    
    const updatedFlag: RiskFlag = {
      ...flag,
      ...data,
      resolvedAt: data.status === 'RESOLVED' ? new Date().toISOString() : flag.resolvedAt
    };
    
    return updatedFlag;
  }

  // Statistics
  async getTenantLifecycleStats() {
    await this.delay(100);
    return tenantLifecycleStats;
  }

  async getTenantHealthMetrics(tenantId: string) {
    await this.delay(200);
    
    const tenant = tenantLifecycles.find(t => t.tenantId === tenantId);
    if (!tenant) throw new Error('Tenant not found');
    
    // Calculate health metrics
    const usagePercentages = {
      users: (tenant.usage.users / tenant.limits.maxUsers) * 100,
      talent: (tenant.usage.talent / tenant.limits.maxTalent) * 100,
      storage: (tenant.usage.storage / tenant.limits.maxStorage) * 100,
      apiCalls: (tenant.usage.apiCalls / tenant.limits.maxApiCalls) * 100
    };
    
    const tenantRiskFlags = riskFlags.filter(f => f.tenantId === tenantId && f.status === 'OPEN');
    
    return {
      healthScore: tenant.healthScore,
      healthStatus: tenant.healthStatus,
      riskScore: tenant.riskScore,
      usagePercentages,
      activeRiskFlags: tenantRiskFlags.length,
      lastActivity: tenant.lastActivityAt,
      compliance: tenant.compliance
    };
  }

  // Bulk operations
  async bulkUpdateTenantStatus(tenantIds: string[], status: 'ACTIVE' | 'SUSPENDED', reason?: string): Promise<void> {
    await this.delay(1000);
    // Mock bulk update
  }

  async exportTenantData(filters?: any): Promise<Blob> {
    await this.delay(1000);
    const data = await this.getTenantLifecycles(filters);
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

export const tenantLifecycleService = new TenantLifecycleService();
export type { TenantApplication, TenantLifecycle, RiskFlag };