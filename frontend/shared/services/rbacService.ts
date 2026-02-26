// RBAC Service - Role and Permission Management
// Week 16: RBAC/ABAC Management

import { allRoles, roleStats, type Role } from '@/data/seed/roles';
import { permissions, permissionStats, type Permission } from '@/data/seed/permissions';

// Mock user-role assignments
export interface UserRoleAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleId: string;
  roleName: string;
  roleKey: string;
  tenantId?: string;
  tenantName?: string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

// Mock audit log entry
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  tenantId?: string;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

// Mock policy rule
export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  type: 'RBAC' | 'ABAC' | 'HYBRID';
  status: 'ACTIVE' | 'DRAFT' | 'DISABLED';
  priority: number;
  conditions: string;
  effect: 'ALLOW' | 'DENY';
  obligations?: string[];
  createdAt: string;
  updatedAt: string;
}

class RBACService {
  // Roles
  async getRoles(filters?: {
    type?: string;
    level?: string;
    isAssignable?: boolean;
    search?: string;
  }): Promise<Role[]> {
    await this.delay(300);
    
    let filtered = [...allRoles];
    
    if (filters?.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters?.level) {
      filtered = filtered.filter(r => r.level === filters.level);
    }
    if (filters?.isAssignable !== undefined) {
      filtered = filtered.filter(r => r.isAssignable === filters.isAssignable);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(search) ||
        r.key.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }

  async getRoleById(id: string): Promise<Role | null> {
    await this.delay(200);
    return allRoles.find(r => r.id === id) || null;
  }

  async getRoleStats() {
    await this.delay(100);
    return roleStats;
  }

  async createRole(data: Partial<Role>): Promise<Role> {
    await this.delay(500);
    const newRole: Role = {
      id: `R${Date.now()}`,
      name: data.name || '',
      key: data.key || '',
      type: data.type || 'TENANT',
      description: data.description || '',
      level: data.level || 'OPS',
      capabilities: data.capabilities || [],
      isSystem: false,
      isAssignable: true,
      requiresMFA: data.requiresMFA || false,
      requiresApproval: data.requiresApproval || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newRole;
  }

  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    await this.delay(500);
    const role = await this.getRoleById(id);
    if (!role) throw new Error('Role not found');
    return { ...role, ...data, updatedAt: new Date().toISOString() };
  }

  async deleteRole(id: string): Promise<void> {
    await this.delay(500);
    // Mock deletion
  }

  // Permissions
  async getPermissions(filters?: {
    domain?: string;
    category?: string;
    riskLevel?: string;
    search?: string;
  }): Promise<Permission[]> {
    await this.delay(300);
    
    let filtered = [...permissions];
    
    if (filters?.domain) {
      filtered = filtered.filter(p => p.domain === filters.domain);
    }
    if (filters?.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters?.riskLevel) {
      filtered = filtered.filter(p => p.riskLevel === filters.riskLevel);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.key.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.domain.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }

  async getPermissionById(id: string): Promise<Permission | null> {
    await this.delay(200);
    return permissions.find(p => p.id === id) || null;
  }

  async getPermissionStats() {
    await this.delay(100);
    return permissionStats;
  }

  async createPermission(data: Partial<Permission>): Promise<Permission> {
    await this.delay(500);
    const newPermission: Permission = {
      id: `P${Date.now()}`,
      key: data.key || '',
      domain: data.domain || '',
      resource: data.resource || '',
      action: data.action || '',
      description: data.description || '',
      riskLevel: data.riskLevel || 'LOW',
      auditLevel: data.auditLevel || 'STANDARD',
      requiresApproval: data.requiresApproval || false,
      requiresMFA: data.requiresMFA || false,
      requiresEvidence: data.requiresEvidence || false,
      category: data.category || '',
      tags: data.tags || []
    };
    return newPermission;
  }

  // User-Role Assignments
  async getUserRoleAssignments(filters?: {
    userId?: string;
    roleId?: string;
    tenantId?: string;
    status?: string;
  }): Promise<UserRoleAssignment[]> {
    await this.delay(300);
    
    // Mock data
    const assignments: UserRoleAssignment[] = [
      {
        id: 'URA001',
        userId: 'U001',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        roleId: 'TR001',
        roleName: 'Tenant Owner',
        roleKey: 'tenant_owner',
        tenantId: 'T001',
        tenantName: 'Elite Models Agency',
        assignedBy: 'System',
        assignedAt: '2024-01-15T10:00:00Z',
        status: 'ACTIVE'
      },
      {
        id: 'URA002',
        userId: 'U002',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        roleId: 'TR003',
        roleName: 'Operations Manager',
        roleKey: 'operations_manager',
        tenantId: 'T001',
        tenantName: 'Elite Models Agency',
        assignedBy: 'John Doe',
        assignedAt: '2024-01-20T14:30:00Z',
        status: 'ACTIVE'
      },
      {
        id: 'URA003',
        userId: 'U003',
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        roleId: 'TR008',
        roleName: 'Finance Manager',
        roleKey: 'finance_manager',
        tenantId: 'T001',
        tenantName: 'Elite Models Agency',
        assignedBy: 'John Doe',
        assignedAt: '2024-02-01T09:00:00Z',
        status: 'ACTIVE'
      }
    ];
    
    let filtered = assignments;
    
    if (filters?.userId) {
      filtered = filtered.filter(a => a.userId === filters.userId);
    }
    if (filters?.roleId) {
      filtered = filtered.filter(a => a.roleId === filters.roleId);
    }
    if (filters?.tenantId) {
      filtered = filtered.filter(a => a.tenantId === filters.tenantId);
    }
    if (filters?.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    
    return filtered;
  }

  async assignRole(data: {
    userId: string;
    roleId: string;
    tenantId?: string;
    expiresAt?: string;
  }): Promise<UserRoleAssignment> {
    await this.delay(500);
    
    const role = await this.getRoleById(data.roleId);
    if (!role) throw new Error('Role not found');
    
    const assignment: UserRoleAssignment = {
      id: `URA${Date.now()}`,
      userId: data.userId,
      userName: 'User Name',
      userEmail: 'user@example.com',
      roleId: data.roleId,
      roleName: role.name,
      roleKey: role.key,
      tenantId: data.tenantId,
      tenantName: data.tenantId ? 'Tenant Name' : undefined,
      assignedBy: 'Current User',
      assignedAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      status: 'ACTIVE'
    };
    
    return assignment;
  }

  async revokeRole(assignmentId: string): Promise<void> {
    await this.delay(500);
    // Mock revocation
  }

  // Audit Logs
  async getAuditLogs(filters?: {
    actor?: string;
    action?: string;
    resource?: string;
    tenantId?: string;
    riskLevel?: string;
    result?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AuditLogEntry[]> {
    await this.delay(400);
    
    // Mock data
    const logs: AuditLogEntry[] = [
      {
        id: 'AL001',
        timestamp: '2024-02-25T10:30:00Z',
        actor: 'john@example.com',
        actorRole: 'Tenant Owner',
        action: 'finance.escrow.release',
        resource: 'escrow',
        resourceId: 'ESC001',
        tenantId: 'T001',
        result: 'SUCCESS',
        riskLevel: 'CRITICAL',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        metadata: { amount: 50000, currency: 'USD' }
      },
      {
        id: 'AL002',
        timestamp: '2024-02-25T09:15:00Z',
        actor: 'jane@example.com',
        actorRole: 'Operations Manager',
        action: 'casting.submission.shortlist',
        resource: 'submission',
        resourceId: 'SUB123',
        tenantId: 'T001',
        result: 'SUCCESS',
        riskLevel: 'LOW',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: 'AL003',
        timestamp: '2024-02-25T08:45:00Z',
        actor: 'mike@example.com',
        actorRole: 'Finance Manager',
        action: 'finance.payout.approve',
        resource: 'payout',
        resourceId: 'PAY456',
        tenantId: 'T001',
        result: 'SUCCESS',
        riskLevel: 'CRITICAL',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0...',
        metadata: { amount: 25000, currency: 'USD' }
      },
      {
        id: 'AL004',
        timestamp: '2024-02-25T08:00:00Z',
        actor: 'admin@platform.com',
        actorRole: 'Super Admin',
        action: 'admin.tenant.settings.update',
        resource: 'tenant',
        resourceId: 'T001',
        result: 'SUCCESS',
        riskLevel: 'HIGH',
        ipAddress: '10.0.0.1',
        userAgent: 'Mozilla/5.0...',
        metadata: { setting: 'feature_flags', value: 'automation_enabled' }
      },
      {
        id: 'AL005',
        timestamp: '2024-02-24T16:30:00Z',
        actor: 'unauthorized@example.com',
        actorRole: 'Viewer',
        action: 'finance.escrow.release',
        resource: 'escrow',
        resourceId: 'ESC002',
        tenantId: 'T001',
        result: 'DENIED',
        riskLevel: 'CRITICAL',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0...',
        metadata: { reason: 'Insufficient permissions' }
      }
    ];
    
    let filtered = logs;
    
    if (filters?.actor) {
      filtered = filtered.filter(l => l.actor.includes(filters.actor!));
    }
    if (filters?.action) {
      filtered = filtered.filter(l => l.action.includes(filters.action!));
    }
    if (filters?.resource) {
      filtered = filtered.filter(l => l.resource === filters.resource);
    }
    if (filters?.tenantId) {
      filtered = filtered.filter(l => l.tenantId === filters.tenantId);
    }
    if (filters?.riskLevel) {
      filtered = filtered.filter(l => l.riskLevel === filters.riskLevel);
    }
    if (filters?.result) {
      filtered = filtered.filter(l => l.result === filters.result);
    }
    
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async exportAuditLogs(filters?: any): Promise<Blob> {
    await this.delay(1000);
    const logs = await this.getAuditLogs(filters);
    const csv = this.convertToCSV(logs);
    return new Blob([csv], { type: 'text/csv' });
  }

  // Policy Rules
  async getPolicyRules(filters?: {
    type?: string;
    status?: string;
    search?: string;
  }): Promise<PolicyRule[]> {
    await this.delay(300);
    
    // Mock data
    const rules: PolicyRule[] = [
      {
        id: 'POL001',
        name: 'Escrow Release Dual Approval',
        description: 'Requires dual approval for escrow releases above $10,000',
        type: 'ABAC',
        status: 'ACTIVE',
        priority: 1,
        conditions: 'amount > 10000 AND resource.type == "escrow"',
        effect: 'ALLOW',
        obligations: ['require_approval', 'require_evidence'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'POL002',
        name: 'Pageant Results Publishing',
        description: 'Requires dual approval and freeze before publishing results',
        type: 'HYBRID',
        status: 'ACTIVE',
        priority: 1,
        conditions: 'action == "pageant.results.publish" AND results.frozen == true',
        effect: 'ALLOW',
        obligations: ['require_approval', 'require_mfa'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'POL003',
        name: 'Finance Manager Payout Limit',
        description: 'Finance managers can only initiate payouts, not approve',
        type: 'RBAC',
        status: 'ACTIVE',
        priority: 2,
        conditions: 'role == "finance_manager" AND action == "finance.payout.approve"',
        effect: 'DENY',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
    
    let filtered = rules;
    
    if (filters?.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }

  async createPolicyRule(data: Partial<PolicyRule>): Promise<PolicyRule> {
    await this.delay(500);
    const newRule: PolicyRule = {
      id: `POL${Date.now()}`,
      name: data.name || '',
      description: data.description || '',
      type: data.type || 'RBAC',
      status: data.status || 'DRAFT',
      priority: data.priority || 10,
      conditions: data.conditions || '',
      effect: data.effect || 'ALLOW',
      obligations: data.obligations,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newRule;
  }

  async updatePolicyRule(id: string, data: Partial<PolicyRule>): Promise<PolicyRule> {
    await this.delay(500);
    const rules = await this.getPolicyRules();
    const rule = rules.find(r => r.id === id);
    if (!rule) throw new Error('Policy rule not found');
    return { ...rule, ...data, updatedAt: new Date().toISOString() };
  }

  async deletePolicyRule(id: string): Promise<void> {
    await this.delay(500);
    // Mock deletion
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

export const rbacService = new RBACService();
