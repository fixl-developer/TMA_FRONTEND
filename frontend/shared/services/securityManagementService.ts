// Security Management Service
// Week 23-24: Security Management System

import { 
  securityIncidents, 
  threatAlerts, 
  accessReviews, 
  securityConfigurations, 
  securityStats,
  type SecurityIncident, 
  type ThreatAlert, 
  type AccessReview, 
  type SecurityConfiguration 
} from '@/data/seed/securityManagement';

export interface SecurityIncidentFilters {
  type?: string;
  severity?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ThreatAlertFilters {
  source?: string;
  type?: string;
  severity?: string;
  status?: string;
  riskScoreMin?: number;
  riskScoreMax?: number;
  search?: string;
}

export interface AccessReviewFilters {
  type?: string;
  scope?: string;
  status?: string;
  priority?: string;
  reviewer?: string;
  search?: string;
}

export interface SecurityConfigurationFilters {
  category?: string;
  complianceStatus?: string;
  riskLevel?: string;
  search?: string;
}

class SecurityManagementService {
  // Security Incidents
  async getSecurityIncidents(filters?: SecurityIncidentFilters): Promise<SecurityIncident[]> {
    await this.delay(300);
    
    let filtered = [...securityIncidents];
    
    if (filters?.type) {
      filtered = filtered.filter(incident => incident.type === filters.type);
    }
    if (filters?.severity) {
      filtered = filtered.filter(incident => incident.severity === filters.severity);
    }
    if (filters?.status) {
      filtered = filtered.filter(incident => incident.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter(incident => incident.priority === filters.priority);
    }
    if (filters?.assignedTo) {
      filtered = filtered.filter(incident => incident.assignedTo === filters.assignedTo);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(incident => 
        incident.title.toLowerCase().includes(search) ||
        incident.description.toLowerCase().includes(search) ||
        incident.affectedSystems.some(system => system.toLowerCase().includes(search))
      );
    }
    if (filters?.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(incident => {
        const detected = new Date(incident.detectedAt);
        return detected >= start && detected <= end;
      });
    }
    
    return filtered.sort((a, b) => 
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }

  async getSecurityIncidentById(id: string): Promise<SecurityIncident | null> {
    await this.delay(200);
    return securityIncidents.find(incident => incident.id === id) || null;
  }

  async updateIncidentStatus(id: string, status: string, notes?: string): Promise<SecurityIncident> {
    await this.delay(500);
    
    const incident = securityIncidents.find(i => i.id === id);
    if (!incident) throw new Error('Security incident not found');
    
    const updatedIncident: SecurityIncident = {
      ...incident,
      status: status as any,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...incident.timeline,
        {
          timestamp: new Date().toISOString(),
          action: `Status changed to ${status}`,
          actor: 'admin@platform.com',
          details: notes || `Incident status updated to ${status}`
        }
      ]
    };
    
    if (status === 'CONTAINED') {
      updatedIncident.containedAt = new Date().toISOString();
    }
    if (status === 'RESOLVED') {
      updatedIncident.resolvedAt = new Date().toISOString();
    }
    
    return updatedIncident;
  }

  async assignIncident(id: string, assignee: string): Promise<SecurityIncident> {
    await this.delay(500);
    
    const incident = securityIncidents.find(i => i.id === id);
    if (!incident) throw new Error('Security incident not found');
    
    const updatedIncident: SecurityIncident = {
      ...incident,
      assignedTo: assignee,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...incident.timeline,
        {
          timestamp: new Date().toISOString(),
          action: 'Incident Assigned',
          actor: 'admin@platform.com',
          details: `Incident assigned to ${assignee}`
        }
      ]
    };
    
    return updatedIncident;
  }

  async createSecurityIncident(data: Omit<SecurityIncident, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<SecurityIncident> {
    await this.delay(500);
    
    const newIncident: SecurityIncident = {
      ...data,
      id: `INC${Date.now()}`,
      timeline: [
        {
          timestamp: new Date().toISOString(),
          action: 'Incident Created',
          actor: data.reportedBy,
          details: 'Security incident created and investigation initiated'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newIncident;
  }

  // Threat Alerts
  async getThreatAlerts(filters?: ThreatAlertFilters): Promise<ThreatAlert[]> {
    await this.delay(300);
    
    let filtered = [...threatAlerts];
    
    if (filters?.source) {
      filtered = filtered.filter(alert => alert.source === filters.source);
    }
    if (filters?.type) {
      filtered = filtered.filter(alert => alert.type === filters.type);
    }
    if (filters?.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }
    if (filters?.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }
    if (filters?.riskScoreMin !== undefined) {
      filtered = filtered.filter(alert => alert.riskScore >= filters.riskScoreMin!);
    }
    if (filters?.riskScoreMax !== undefined) {
      filtered = filtered.filter(alert => alert.riskScore <= filters.riskScoreMax!);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(search) ||
        alert.description.toLowerCase().includes(search) ||
        alert.indicators.ips.some(ip => ip.includes(search)) ||
        alert.indicators.domains.some(domain => domain.toLowerCase().includes(search))
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }

  async updateThreatAlertStatus(id: string, status: string): Promise<ThreatAlert> {
    await this.delay(500);
    
    const alert = threatAlerts.find(a => a.id === id);
    if (!alert) throw new Error('Threat alert not found');
    
    const updatedAlert: ThreatAlert = {
      ...alert,
      status: status as any,
      updatedAt: new Date().toISOString()
    };
    
    return updatedAlert;
  }

  async resolveThreatAlert(id: string, resolution: any): Promise<ThreatAlert> {
    await this.delay(500);
    
    const alert = threatAlerts.find(a => a.id === id);
    if (!alert) throw new Error('Threat alert not found');
    
    const updatedAlert: ThreatAlert = {
      ...alert,
      status: 'RESOLVED',
      resolution: {
        ...resolution,
        resolvedBy: 'admin@platform.com',
        resolvedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };
    
    return updatedAlert;
  }

  async assignThreatAlert(id: string, investigator: string): Promise<ThreatAlert> {
    await this.delay(500);
    
    const alert = threatAlerts.find(a => a.id === id);
    if (!alert) throw new Error('Threat alert not found');
    
    const updatedAlert: ThreatAlert = {
      ...alert,
      investigatedBy: investigator,
      status: 'INVESTIGATING',
      updatedAt: new Date().toISOString()
    };
    
    return updatedAlert;
  }

  // Access Reviews
  async getAccessReviews(filters?: AccessReviewFilters): Promise<AccessReview[]> {
    await this.delay(300);
    
    let filtered = [...accessReviews];
    
    if (filters?.type) {
      filtered = filtered.filter(review => review.type === filters.type);
    }
    if (filters?.scope) {
      filtered = filtered.filter(review => review.scope === filters.scope);
    }
    if (filters?.status) {
      filtered = filtered.filter(review => review.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter(review => review.priority === filters.priority);
    }
    if (filters?.reviewer) {
      filtered = filtered.filter(review => review.reviewer === filters.reviewer);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(search) ||
        review.description.toLowerCase().includes(search) ||
        (review.reviewee && review.reviewee.toLowerCase().includes(search))
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateAccessReviewStatus(id: string, status: string): Promise<AccessReview> {
    await this.delay(500);
    
    const review = accessReviews.find(r => r.id === id);
    if (!review) throw new Error('Access review not found');
    
    const updatedReview: AccessReview = {
      ...review,
      status: status as any,
      updatedAt: new Date().toISOString()
    };
    
    if (status === 'COMPLETED') {
      updatedReview.completedAt = new Date().toISOString();
    }
    
    return updatedReview;
  }

  async completeAccessReview(id: string, findings: any, actions: any): Promise<AccessReview> {
    await this.delay(500);
    
    const review = accessReviews.find(r => r.id === id);
    if (!review) throw new Error('Access review not found');
    
    const updatedReview: AccessReview = {
      ...review,
      status: 'COMPLETED',
      findings,
      actions,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return updatedReview;
  }

  async createAccessReview(data: Omit<AccessReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccessReview> {
    await this.delay(500);
    
    const newReview: AccessReview = {
      ...data,
      id: `REV${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newReview;
  }

  // Security Configurations
  async getSecurityConfigurations(filters?: SecurityConfigurationFilters): Promise<SecurityConfiguration[]> {
    await this.delay(300);
    
    let filtered = [...securityConfigurations];
    
    if (filters?.category) {
      filtered = filtered.filter(config => config.category === filters.category);
    }
    if (filters?.complianceStatus) {
      filtered = filtered.filter(config => config.complianceStatus === filters.complianceStatus);
    }
    if (filters?.riskLevel) {
      filtered = filtered.filter(config => config.riskLevel === filters.riskLevel);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(config => 
        config.name.toLowerCase().includes(search) ||
        config.description.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.lastChecked).getTime() - new Date(a.lastChecked).getTime()
    );
  }

  async updateSecurityConfiguration(id: string, newValue: any, reason: string): Promise<SecurityConfiguration> {
    await this.delay(500);
    
    const config = securityConfigurations.find(c => c.id === id);
    if (!config) throw new Error('Security configuration not found');
    
    const updatedConfig: SecurityConfiguration = {
      ...config,
      currentValue: newValue,
      lastModified: new Date().toISOString(),
      modifiedBy: 'admin@platform.com',
      history: [
        ...config.history,
        {
          timestamp: new Date().toISOString(),
          oldValue: config.currentValue,
          newValue,
          changedBy: 'admin@platform.com',
          reason
        }
      ]
    };
    
    // Update compliance status based on comparison with recommended value
    const isCompliant = JSON.stringify(newValue) === JSON.stringify(config.recommendedValue);
    updatedConfig.complianceStatus = isCompliant ? 'COMPLIANT' : 'PARTIALLY_COMPLIANT';
    
    return updatedConfig;
  }

  async runComplianceCheck(id: string): Promise<SecurityConfiguration> {
    await this.delay(1000);
    
    const config = securityConfigurations.find(c => c.id === id);
    if (!config) throw new Error('Security configuration not found');
    
    const updatedConfig: SecurityConfiguration = {
      ...config,
      lastChecked: new Date().toISOString()
    };
    
    return updatedConfig;
  }

  // Analytics and Reporting
  async getSecurityMetrics(period: { start: string; end: string }) {
    await this.delay(500);
    
    // Mock security metrics
    return {
      incidentTrends: [
        { date: '2024-02-01', incidents: 3, resolved: 2 },
        { date: '2024-02-08', incidents: 5, resolved: 4 },
        { date: '2024-02-15', incidents: 2, resolved: 3 },
        { date: '2024-02-22', incidents: 4, resolved: 3 }
      ],
      threatDistribution: [
        { type: 'Suspicious Login', count: 15, percentage: 35 },
        { type: 'Brute Force', count: 12, percentage: 28 },
        { type: 'API Abuse', count: 8, percentage: 19 },
        { type: 'Data Exfiltration', count: 5, percentage: 12 },
        { type: 'Malware', count: 3, percentage: 7 }
      ],
      complianceStatus: {
        compliant: 65,
        partiallyCompliant: 25,
        nonCompliant: 10
      },
      riskScoreHistory: [
        { date: '2024-02-01', score: 75 },
        { date: '2024-02-08', score: 72 },
        { date: '2024-02-15', score: 68 },
        { date: '2024-02-22', score: 65 }
      ]
    };
  }

  async getSecurityStats() {
    await this.delay(100);
    return securityStats;
  }

  // Risk Assessment
  async calculateRiskScore(factors: any): Promise<number> {
    await this.delay(300);
    
    // Mock risk calculation
    let score = 50; // Base score
    
    if (factors.openIncidents) score += factors.openIncidents * 10;
    if (factors.criticalAlerts) score += factors.criticalAlerts * 15;
    if (factors.nonCompliantConfigs) score += factors.nonCompliantConfigs * 5;
    if (factors.overdueReviews) score += factors.overdueReviews * 8;
    
    return Math.min(Math.max(score, 0), 100);
  }

  // Bulk Operations
  async bulkUpdateIncidents(incidentIds: string[], updates: any): Promise<void> {
    await this.delay(1000);
    // Mock bulk update
  }

  async bulkResolveAlerts(alertIds: string[], resolution: any): Promise<void> {
    await this.delay(1000);
    // Mock bulk resolve
  }

  async exportSecurityData(type: 'incidents' | 'alerts' | 'reviews' | 'configurations', filters?: any): Promise<Blob> {
    await this.delay(1000);
    
    let data: any[] = [];
    switch (type) {
      case 'incidents':
        data = await this.getSecurityIncidents(filters);
        break;
      case 'alerts':
        data = await this.getThreatAlerts(filters);
        break;
      case 'reviews':
        data = await this.getAccessReviews(filters);
        break;
      case 'configurations':
        data = await this.getSecurityConfigurations(filters);
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

export const securityManagementService = new SecurityManagementService();
export type { SecurityIncident, ThreatAlert, AccessReview, SecurityConfiguration };