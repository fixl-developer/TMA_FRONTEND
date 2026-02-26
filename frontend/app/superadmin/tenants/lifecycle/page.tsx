'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { FilterPanel } from '@/shared/components/ui/FilterPanel';
import { tenantLifecycleService, type TenantLifecycle } from '@/shared/services/tenantLifecycleService';
import { 
  Building, 
  Search, 
  Filter, 
  Settings, 
  Pause, 
  Play,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  Database,
  Zap,
  DollarSign,
  Calendar,
  Shield,
  Download
} from 'lucide-react';

export default function TenantLifecyclePage() {
  const [tenants, setTenants] = useState<TenantLifecycle[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
    healthStatus: '',
    riskLevel: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tenantsData, statsData] = await Promise.all([
        tenantLifecycleService.getTenantLifecycles(filters),
        tenantLifecycleService.getTenantLifecycleStats()
      ]);
      setTenants(tenantsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (tenantId: string, status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED') => {
    try {
      const reason = status !== 'ACTIVE' ? prompt(`Reason for ${status.toLowerCase()}:`) : undefined;
      if (status !== 'ACTIVE' && !reason) return;
      
      await tenantLifecycleService.updateTenantStatus(tenantId, status, reason);
      loadData();
    } catch (error) {
      console.error('Failed to update tenant status:', error);
    }
  };

  const handleUpdatePlan = async (tenantId: string, plan: 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE') => {
    try {
      await tenantLifecycleService.updateTenantPlan(tenantId, plan);
      loadData();
    } catch (error) {
      console.error('Failed to update tenant plan:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'green',
      SUSPENDED: 'orange',
      TERMINATED: 'red',
      PENDING_TERMINATION: 'red'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'SUSPENDED':
        return <Pause className="w-4 h-4" />;
      case 'TERMINATED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      HEALTHY: 'green',
      WARNING: 'yellow',
      CRITICAL: 'red'
    };
    return colors[status] || 'gray';
  };

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      STARTER: 'gray',
      GROWTH: 'blue',
      PRO: 'purple',
      ENTERPRISE: 'indigo'
    };
    return colors[plan] || 'gray';
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 70) return 'red';
    if (score >= 40) return 'orange';
    if (score >= 20) return 'yellow';
    return 'green';
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Tenant Lifecycle"
        description="Manage tenant status, plans, and configurations"
        icon={Building}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold mt-1">{stats.tenants.total}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold mt-1">{stats.tenants.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold mt-1">{stats.tenants.suspended}</p>
              </div>
              <Pause className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Health</p>
                <p className="text-2xl font-bold mt-1">{stats.tenants.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          onApply={() => setShowFilters(false)}
          onReset={() => {
            setFilters({ status: '', plan: '', healthStatus: '', riskLevel: '', search: '' });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search tenants..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan
              </label>
              <select
                value={filters.plan}
                onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Plans</option>
                <option value="STARTER">Starter</option>
                <option value="GROWTH">Growth</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Health Status
              </label>
              <select
                value={filters.healthStatus}
                onChange={(e) => setFilters({ ...filters, healthStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Health</option>
                <option value="HEALTHY">Healthy</option>
                <option value="WARNING">Warning</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Risk Levels</option>
                <option value="LOW">Low Risk (0-29)</option>
                <option value="MEDIUM">Medium Risk (30-59)</option>
                <option value="HIGH">High Risk (60+)</option>
              </select>
            </div>
          </div>
        </FilterPanel>
      )}

      {/* Tenants List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tenants...</p>
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No tenants have been provisioned yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{tenant.companyName}</h3>
                      <Badge variant={getStatusColor(tenant.status)} size="sm">
                        {getStatusIcon(tenant.status)}
                        <span className="ml-1">{tenant.status}</span>
                      </Badge>
                      <Badge variant={getPlanColor(tenant.plan)} size="sm">
                        {tenant.plan}
                      </Badge>
                      <Badge variant={getHealthStatusColor(tenant.healthStatus)} size="sm">
                        <Activity className="w-3 h-3 mr-1" />
                        {tenant.healthStatus}
                      </Badge>
                      <Badge variant={getRiskLevelColor(tenant.riskScore)} size="sm">
                        <Shield className="w-3 h-3 mr-1" />
                        Risk: {tenant.riskScore}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>ID: {tenant.tenantId}</span>
                      <span>•</span>
                      <span>{tenant.businessType.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Health: {tenant.healthScore}/100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                    {tenant.status === 'ACTIVE' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(tenant.tenantId, 'SUSPENDED')}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Suspend
                      </Button>
                    ) : tenant.status === 'SUSPENDED' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(tenant.tenantId, 'ACTIVE')}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    ) : null}
                    {tenant.status !== 'TERMINATED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(tenant.tenantId, 'TERMINATED')}
                      >
                        <Trash2 className="w-4 h-4 mr-1 text-red-600" />
                        Terminate
                      </Button>
                    )}
                  </div>
                </div>

                {/* Usage Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Users</span>
                      <Users className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{tenant.usage.users}</span>
                      <span className="text-sm text-gray-500">/ {tenant.limits.maxUsers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          getUsagePercentage(tenant.usage.users, tenant.limits.maxUsers) >= 90 
                            ? 'bg-red-500' 
                            : getUsagePercentage(tenant.usage.users, tenant.limits.maxUsers) >= 75 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${getUsagePercentage(tenant.usage.users, tenant.limits.maxUsers)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Talent</span>
                      <Users className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{tenant.usage.talent}</span>
                      <span className="text-sm text-gray-500">/ {tenant.limits.maxTalent}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          getUsagePercentage(tenant.usage.talent, tenant.limits.maxTalent) >= 90 
                            ? 'bg-red-500' 
                            : getUsagePercentage(tenant.usage.talent, tenant.limits.maxTalent) >= 75 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${getUsagePercentage(tenant.usage.talent, tenant.limits.maxTalent)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Storage</span>
                      <Database className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{tenant.usage.storage}GB</span>
                      <span className="text-sm text-gray-500">/ {tenant.limits.maxStorage}GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          getUsagePercentage(tenant.usage.storage, tenant.limits.maxStorage) >= 90 
                            ? 'bg-red-500' 
                            : getUsagePercentage(tenant.usage.storage, tenant.limits.maxStorage) >= 75 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${getUsagePercentage(tenant.usage.storage, tenant.limits.maxStorage)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">API Calls</span>
                      <Zap className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{(tenant.usage.apiCalls / 1000).toFixed(0)}K</span>
                      <span className="text-sm text-gray-500">/ {(tenant.limits.maxApiCalls / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          getUsagePercentage(tenant.usage.apiCalls, tenant.limits.maxApiCalls) >= 90 
                            ? 'bg-red-500' 
                            : getUsagePercentage(tenant.usage.apiCalls, tenant.limits.maxApiCalls) >= 75 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${getUsagePercentage(tenant.usage.apiCalls, tenant.limits.maxApiCalls)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Billing & Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Monthly Revenue:</span>
                        <span className="font-medium">${tenant.billing.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-medium">${tenant.billing.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment Status:</span>
                        <Badge 
                          variant={tenant.billing.paymentStatus === 'CURRENT' ? 'green' : 'red'} 
                          size="sm"
                        >
                          {tenant.billing.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Contact</h4>
                    <div className="space-y-1 text-sm">
                      <div>{tenant.contacts.primary.name} ({tenant.contacts.primary.role})</div>
                      <div>{tenant.contacts.primary.email}</div>
                      <div>{tenant.contacts.primary.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Risk Flags */}
                {tenant.riskFlags.length > 0 && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-800 mb-2">Risk Flags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tenant.riskFlags.map((flag, idx) => (
                        <Badge key={idx} variant="orange" size="sm">
                          {flag.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>Created: {new Date(tenant.createdAt).toLocaleDateString()}</span>
                    <span>Last Activity: {new Date(tenant.lastActivityAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={tenant.plan}
                      onChange={(e) => handleUpdatePlan(tenant.tenantId, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="STARTER">Starter</option>
                      <option value="GROWTH">Growth</option>
                      <option value="PRO">Pro</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  );
}