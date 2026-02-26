'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { tenantLifecycleService, type TenantLifecycle } from '@/shared/services/tenantLifecycleService';
import { 
  Activity, 
  Search, 
  Filter, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Zap,
  DollarSign,
  Shield,
  Building,
  Download
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function TenantHealthPage() {
  const [tenants, setTenants] = useState<TenantLifecycle[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    healthStatus: '',
    plan: '',
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
      console.error('Failed to load tenant health data:', error);
    } finally {
      setLoading(false);
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

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="w-4 h-4" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4" />;
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  // Mock health trend data
  const healthTrendData = [
    { date: '2024-02-18', healthy: 85, warning: 12, critical: 3 },
    { date: '2024-02-19', healthy: 87, warning: 10, critical: 3 },
    { date: '2024-02-20', healthy: 82, warning: 15, critical: 3 },
    { date: '2024-02-21', healthy: 88, warning: 9, critical: 3 },
    { date: '2024-02-22', healthy: 90, warning: 8, critical: 2 },
    { date: '2024-02-23', healthy: 89, warning: 9, critical: 2 },
    { date: '2024-02-24', healthy: 91, warning: 7, critical: 2 },
    { date: '2024-02-25', healthy: 88, warning: 10, critical: 2 }
  ];

  // Mock resource usage data
  const resourceUsageData = [
    { resource: 'Users', average: 65, peak: 85 },
    { resource: 'Talent', average: 58, peak: 78 },
    { resource: 'Storage', average: 42, peak: 67 },
    { resource: 'API Calls', average: 71, peak: 92 }
  ];

  // Health distribution data
  const healthDistribution = [
    { name: 'Healthy', value: stats?.tenants.healthy || 0, color: '#10B981' },
    { name: 'Warning', value: stats?.tenants.warning || 0, color: '#F59E0B' },
    { name: 'Critical', value: stats?.tenants.critical || 0, color: '#EF4444' }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Tenant Health Dashboard"
        description="Monitor tenant health metrics and resource usage"
        icon={Activity}
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

      {/* Health Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Healthy Tenants</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{stats.tenants.healthy}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +5% from last week
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warning Status</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.tenants.warning}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  -2% from last week
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Status</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{stats.tenants.critical}</p>
                <p className="text-xs text-red-600 mt-1">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  -1 from last week
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Health Score</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round(tenants.reduce((sum, t) => sum + t.healthScore, 0) / tenants.length) || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +3 points this week
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Health Trend Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Health Status Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={healthTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Area type="monotone" dataKey="healthy" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="warning" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Health Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Health Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {healthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {healthDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Resource Usage Chart */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Average Resource Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resourceUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="resource" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Bar dataKey="average" fill="#3B82F6" name="Average Usage" />
            <Bar dataKey="peak" fill="#EF4444" name="Peak Usage" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tenant Health List */}
      <PageSection>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tenant Health Details</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search tenants..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <select
              value={filters.healthStatus}
              onChange={(e) => setFilters({ ...filters, healthStatus: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Health Status</option>
              <option value="HEALTHY">Healthy</option>
              <option value="WARNING">Warning</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tenant health data...</p>
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No tenant health data available'}
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
                      <Badge variant={getHealthStatusColor(tenant.healthStatus)} size="sm">
                        {getHealthStatusIcon(tenant.healthStatus)}
                        <span className="ml-1">{tenant.healthStatus}</span>
                      </Badge>
                      <Badge variant="outline" size="sm">
                        Score: {tenant.healthScore}/100
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>ID: {tenant.tenantId}</span>
                      <span>•</span>
                      <span>{tenant.businessType.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Plan: {tenant.plan}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last Activity</p>
                    <p className="text-sm font-medium">{new Date(tenant.lastActivityAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Health Metrics */}
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
                    <p className="text-xs text-gray-500 mt-1">
                      {getUsagePercentage(tenant.usage.users, tenant.limits.maxUsers)}% used
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      {getUsagePercentage(tenant.usage.talent, tenant.limits.maxTalent)}% used
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      {getUsagePercentage(tenant.usage.storage, tenant.limits.maxStorage)}% used
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      {getUsagePercentage(tenant.usage.apiCalls, tenant.limits.maxApiCalls)}% used
                    </p>
                  </div>
                </div>

                {/* Risk Indicators */}
                {tenant.riskFlags.length > 0 && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Risk Indicators</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tenant.riskFlags.map((flag, idx) => (
                        <Badge key={idx} variant="warning" size="sm">
                          {flag.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>Revenue: ${tenant.billing.monthlyRevenue.toLocaleString()}/month</span>
                    <span>Payment: {tenant.billing.paymentStatus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Risk Score: {tenant.riskScore}</span>
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