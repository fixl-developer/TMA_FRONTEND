// Trust & Safety Service
// Week 19-20: Trust & Safety System

import { 
  disputes, 
  enforcementActions, 
  safetyAlerts, 
  appealCases, 
  trustSafetyStats,
  type Dispute, 
  type EnforcementAction, 
  type SafetyAlert, 
  type AppealCase 
} from '@/data/seed/trustSafety';

export interface DisputeFilters {
  status?: string;
  severity?: string;
  category?: string;
  disputeType?: string;
  tenantId?: string;
  priority?: string;
  assignedTo?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface EnforcementActionFilters {
  status?: string;
  actionType?: string;
  severity?: string;
  targetType?: string;
  tenantId?: string;
  search?: string;
}

export interface SafetyAlertFilters {
  status?: string;
  type?: string;
  severity?: string;
  tenantId?: string;
  assignedTo?: string;
  search?: string;
}

export interface AppealFilters {
  status?: string;
  appealType?: string;
  priority?: string;
  appellantType?: string;
  search?: string;
}

class TrustSafetyService {
  // Disputes
  async getDisputes(filters?: DisputeFilters): Promise<Dispute[]> {
    await this.delay(300);
    
    let filtered = [...disputes];
    
    if (filters?.status) {
      filtered = filtered.filter(dispute => dispute.status === filters.status);
    }
    if (filters?.severity) {
      filtered = filtered.filter(dispute => dispute.severity === filters.severity);
    }
    if (filters?.category) {
      filtered = filtered.filter(dispute => dispute.category === filters.category);
    }
    if (filters?.disputeType) {
      filtered = filtered.filter(dispute => dispute.disputeType === filters.disputeType);
    }
    if (filters?.tenantId) {
      filtered = filtered.filter(dispute => dispute.tenantId === filters.tenantId);
    }
    if (filters?.priority) {
      filtered = filtered.filter(dispute => dispute.priority === filters.priority);
    }
    if (filters?.assignedTo) {
      filtered = filtered.filter(dispute => dispute.assignedTo === filters.assignedTo);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(dispute => 
        dispute.title.toLowerCase().includes(search) ||
        dispute.description.toLowerCase().includes(search) ||
        dispute.tenantName.toLowerCase().includes(search) ||
        dispute.reporterName.toLowerCase().includes(search)
      );
    }
    if (filters?.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(dispute => {
        const created = new Date(dispute.createdAt);
        return created >= start && created <= end;
      });
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getDisputeById(id: string): Promise<Dispute | null> {
    await this.delay(200);
    return disputes.find(dispute => dispute.id === id) || null;
  }

  async updateDisputeStatus(id: string, status: string, assignedTo?: string): Promise<Dispute> {
    await this.delay(500);
    
    const dispute = disputes.find(d => d.id === id);
    if (!dispute) throw new Error('Dispute not found');
    
    const updatedDispute: Dispute = {
      ...dispute,
      status: status as any,
      assignedTo,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...dispute.timeline,
        {
          timestamp: new Date().toISOString(),
          action: `Status changed to ${status}`,
          actor: 'admin@platform.com',
          details: assignedTo ? `Assigned to ${assignedTo}` : `Status updated to ${status}`
        }
      ]
    };
    
    return updatedDispute;
  }

  async resolveDispute(id: string, resolution: any): Promise<Dispute> {
    await this.delay(500);
    
    const dispute = disputes.find(d => d.id === id);
    if (!dispute) throw new Error('Dispute not found');
    
    const updatedDispute: Dispute = {
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

  async createDispute(data: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<Dispute> {
    await this.delay(500);
    
    const newDispute: Dispute = {
      ...data,
      id: `DISP${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          timestamp: new Date().toISOString(),
          action: 'Dispute Created',
          actor: data.reporterName,
          details: 'Initial dispute filed'
        }
      ]
    };
    
    return newDispute;
  }

  // Enforcement Actions
  async getEnforcementActions(filters?: EnforcementActionFilters): Promise<EnforcementAction[]> {
    await this.delay(300);
    
    let filtered = [...enforcementActions];
    
    if (filters?.status) {
      filtered = filtered.filter(action => action.status === filters.status);
    }
    if (filters?.actionType) {
      filtered = filtered.filter(action => action.actionType === filters.actionType);
    }
    if (filters?.severity) {
      filtered = filtered.filter(action => action.severity === filters.severity);
    }
    if (filters?.targetType) {
      filtered = filtered.filter(action => action.targetType === filters.targetType);
    }
    if (filters?.tenantId) {
      filtered = filtered.filter(action => action.tenantId === filters.tenantId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(action => 
        action.reason.toLowerCase().includes(search) ||
        action.description.toLowerCase().includes(search) ||
        action.targetName.toLowerCase().includes(search) ||
        action.tenantName.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createEnforcementAction(data: Omit<EnforcementAction, 'id' | 'createdAt'>): Promise<EnforcementAction> {
    await this.delay(500);
    
    const newAction: EnforcementAction = {
      ...data,
      id: `ENF${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    return newAction;
  }

  async updateEnforcementAction(id: string, updates: Partial<EnforcementAction>): Promise<EnforcementAction> {
    await this.delay(500);
    
    const action = enforcementActions.find(a => a.id === id);
    if (!action) throw new Error('Enforcement action not found');
    
    const updatedAction: EnforcementAction = {
      ...action,
      ...updates
    };
    
    return updatedAction;
  }

  // Safety Alerts
  async getSafetyAlerts(filters?: SafetyAlertFilters): Promise<SafetyAlert[]> {
    await this.delay(300);
    
    let filtered = [...safetyAlerts];
    
    if (filters?.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }
    if (filters?.type) {
      filtered = filtered.filter(alert => alert.type === filters.type);
    }
    if (filters?.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }
    if (filters?.tenantId) {
      filtered = filtered.filter(alert => alert.tenantId === filters.tenantId);
    }
    if (filters?.assignedTo) {
      filtered = filtered.filter(alert => alert.assignedTo === filters.assignedTo);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(search) ||
        alert.description.toLowerCase().includes(search) ||
        (alert.tenantName && alert.tenantName.toLowerCase().includes(search))
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }

  async updateSafetyAlert(id: string, updates: Partial<SafetyAlert>): Promise<SafetyAlert> {
    await this.delay(500);
    
    const alert = safetyAlerts.find(a => a.id === id);
    if (!alert) throw new Error('Safety alert not found');
    
    const updatedAlert: SafetyAlert = {
      ...alert,
      ...updates
    };
    
    return updatedAlert;
  }

  async investigateSafetyAlert(id: string, investigationData: any): Promise<SafetyAlert> {
    await this.delay(500);
    
    const alert = safetyAlerts.find(a => a.id === id);
    if (!alert) throw new Error('Safety alert not found');
    
    const updatedAlert: SafetyAlert = {
      ...alert,
      status: 'INVESTIGATING',
      assignedTo: investigationData.investigator,
      investigation: {
        startedAt: new Date().toISOString(),
        investigator: investigationData.investigator,
        findings: investigationData.findings || '',
        conclusion: investigationData.conclusion || ''
      }
    };
    
    return updatedAlert;
  }

  // Appeal Cases
  async getAppealCases(filters?: AppealFilters): Promise<AppealCase[]> {
    await this.delay(300);
    
    let filtered = [...appealCases];
    
    if (filters?.status) {
      filtered = filtered.filter(appeal => appeal.status === filters.status);
    }
    if (filters?.appealType) {
      filtered = filtered.filter(appeal => appeal.appealType === filters.appealType);
    }
    if (filters?.priority) {
      filtered = filtered.filter(appeal => appeal.priority === filters.priority);
    }
    if (filters?.appellantType) {
      filtered = filtered.filter(appeal => appeal.appellantType === filters.appellantType);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(appeal => 
        appeal.reason.toLowerCase().includes(search) ||
        appeal.description.toLowerCase().includes(search) ||
        appeal.appellantName.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async reviewAppeal(id: string, decision: any): Promise<AppealCase> {
    await this.delay(500);
    
    const appeal = appealCases.find(a => a.id === id);
    if (!appeal) throw new Error('Appeal case not found');
    
    const updatedAppeal: AppealCase = {
      ...appeal,
      status: decision.outcome === 'APPROVED' ? 'APPROVED' : 'DENIED',
      reviewedBy: 'appeals-team@platform.com',
      reviewedAt: new Date().toISOString(),
      decision,
      timeline: [
        ...appeal.timeline,
        {
          timestamp: new Date().toISOString(),
          action: `Appeal ${decision.outcome}`,
          actor: 'appeals-team@platform.com',
          details: decision.reasoning
        }
      ]
    };
    
    return updatedAppeal;
  }

  async createAppeal(data: Omit<AppealCase, 'id' | 'submittedAt' | 'timeline'>): Promise<AppealCase> {
    await this.delay(500);
    
    const newAppeal: AppealCase = {
      ...data,
      id: `APP${Date.now()}`,
      submittedAt: new Date().toISOString(),
      timeline: [
        {
          timestamp: new Date().toISOString(),
          action: 'Appeal Submitted',
          actor: data.appellantName,
          details: 'Initial appeal filed'
        }
      ]
    };
    
    return newAppeal;
  }

  // Statistics
  async getTrustSafetyStats() {
    await this.delay(100);
    return trustSafetyStats;
  }

  // Risk Assessment
  async calculateRiskScore(data: any): Promise<number> {
    await this.delay(200);
    
    let riskScore = 0;
    
    // Severity impact
    if (data.severity === 'CRITICAL') riskScore += 40;
    else if (data.severity === 'HIGH') riskScore += 30;
    else if (data.severity === 'MEDIUM') riskScore += 20;
    else riskScore += 10;
    
    // Impact scope
    if (data.impact === 'PLATFORM_WIDE') riskScore += 30;
    else if (data.impact === 'TENANT_WIDE') riskScore += 20;
    else if (data.impact === 'MULTIPLE_USERS') riskScore += 15;
    else riskScore += 5;
    
    // Category impact
    if (data.category === 'SECURITY') riskScore += 20;
    else if (data.category === 'FINANCIAL') riskScore += 15;
    else if (data.category === 'BEHAVIORAL') riskScore += 10;
    else riskScore += 5;
    
    // Evidence quality
    if (data.evidence && data.evidence.length > 0) {
      riskScore += Math.min(data.evidence.length * 5, 15);
    }
    
    return Math.min(riskScore, 100);
  }

  // Bulk operations
  async bulkUpdateDisputes(disputeIds: string[], updates: any): Promise<void> {
    await this.delay(1000);
    // Mock bulk update
  }

  async exportTrustSafetyData(type: 'disputes' | 'actions' | 'alerts' | 'appeals', filters?: any): Promise<Blob> {
    await this.delay(1000);
    
    let data: any[] = [];
    switch (type) {
      case 'disputes':
        data = await this.getDisputes(filters);
        break;
      case 'actions':
        data = await this.getEnforcementActions(filters);
        break;
      case 'alerts':
        data = await this.getSafetyAlerts(filters);
        break;
      case 'appeals':
        data = await this.getAppealCases(filters);
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

export const trustSafetyService = new TrustSafetyService();
export type { Dispute, EnforcementAction, SafetyAlert, AppealCase };