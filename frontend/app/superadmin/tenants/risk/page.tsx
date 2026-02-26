'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { FilterPanel } from '@/shared/components/ui/FilterPanel';
import { tenantLifecycleService, type RiskFlag } from '@/shared/services/tenantLifecycleService';
import { 
  Shield, 
  Search, 
  Filter, 
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  User,
  Calendar,
  Flag,
  Download
} from 'lucide-react';

export default function TenantRiskPage() {
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    tenantId: '',
    type: '',
    severity: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [flagsData, statsData] = await Promise.all([
        tenantLifecycleService.getRiskFlags(filters),
        tenantLifecycleService.getTenantLifecycleStats()
      ]);
      setRiskFlags(flagsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load risk flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRiskFlag = async (id: string, status: 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE') => {
    try {
      const resolution = status === 'RESOLVED' ? prompt('Resolution details:') : undefined;
      
      await tenantLifecycleService.updateRiskFlag(id, {
        status,
        resolvedBy: 'current-admin@platform.com',
        resolution
      });
      
      loadData();
    } catch (error) {
      console.error('Failed to update risk flag:', error);
    }
  };

  const handleCreateRiskFlag = async (data: any) => {
    try {
      await tenantLifecycleService.createRiskFlag({
        ...data,
        status: 'OPEN'
      });
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to create risk flag:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      LOW: 'green',
      MEDIUM: 'yellow',
      HIGH: 'orange',
      CRITICAL: 'red'
    };
    return colors[severity] || 'gray';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4" />;
      case 'HIGH':
        return <Shield className="w-4 h-4" />;
      case 'MEDIUM':
        return <Flag className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'red',
      INVESTIGATING: 'yellow',
      RESOLVED: 'green',
      FALSE_POSITIVE: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertTriangle className="w-4 h-4" />;
      case 'INVESTIGATING':
        return <Clock className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'FALSE_POSITIVE':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FRAUD_SUSPICION: 'Fraud Suspicion',
      PAYMENT_FAILURE: 'Payment Failure',
      POLICY_VIOLATION: 'Policy Violation',
      UNUSUAL_ACTIVITY: 'Unusual Activity',
      COMPLIANCE_ISSUE: 'Compliance Issue',
      SECURITY_BREACH: 'Security Breach'
    };
    return labels[type] || type;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Risk Management"
        description="Monitor and manage tenant risk flags and security issues"
        icon={Shield}
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
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Risk Flag
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Flags</p>
                <p className="text-2xl font-bold mt-1">{stats.riskFlags.total}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold mt-1">{stats.riskFlags.open}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investigating</p>
                <p className="text-2xl font-bold mt-1">{stats.riskFlags.investigating}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold mt-1">{stats.riskFlags.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold mt-1">{stats.riskFlags.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
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
            setFilters({ tenantId: '', type: '', severity: '', status: '', search: '' });
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
                  placeholder="Search risk flags..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant ID
              </label>
              <input
                type="text"
                value={filters.tenantId}
                onChange={(e) => setFilters({ ...filters, tenantId: e.target.value })}
                placeholder="e.g., T001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="FRAUD_SUSPICION">Fraud Suspicion</option>
                <option value="PAYMENT_FAILURE">Payment Failure</option>
                <option value="POLICY_VIOLATION">Policy Violation</option>
                <option value="UNUSUAL_ACTIVITY">Unusual Activity</option>
                <option value="COMPLIANCE_ISSUE">Compliance Issue</option>
                <option value="SECURITY_BREACH">Security Breach</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Severities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
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
                <option value="OPEN">Open</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="RESOLVED">Resolved</option>
                <option value="FALSE_POSITIVE">False Positive</option>
              </select>
            </div>
          </div>
        </FilterPanel>
      )}

      {/* Risk Flags List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading risk flags...</p>
          </div>
        ) : riskFlags.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No risk flags found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No risk flags have been created yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {riskFlags.map((flag) => (
              <Card key={flag.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{flag.title}</h3>
                      <Badge variant={getSeverityColor(flag.severity)} size="sm">
                        {getSeverityIcon(flag.severity)}
                        <span className="ml-1">{flag.severity}</span>
                      </Badge>
                      <Badge variant={getStatusColor(flag.status)} size="sm">
                        {getStatusIcon(flag.status)}
                        <span className="ml-1">{flag.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge variant="blue" size="sm">
                        {getTypeLabel(flag.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Tenant: {flag.tenantId}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(flag.createdAt).toLocaleDateString()}
                      </span>
                      {flag.resolvedAt && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Resolved: {new Date(flag.resolvedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {flag.status === 'OPEN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateRiskFlag(flag.id, 'INVESTIGATING')}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Investigate
                      </Button>
                    )}
                    {(flag.status === 'OPEN' || flag.status === 'INVESTIGATING') && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateRiskFlag(flag.id, 'RESOLVED')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateRiskFlag(flag.id, 'FALSE_POSITIVE')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          False Positive
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">{flag.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Impact</h4>
                      <p className="text-sm text-gray-600">{flag.impact}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Action</h4>
                      <p className="text-sm text-gray-600">{flag.recommendedAction}</p>
                    </div>
                  </div>
                </div>

                {flag.evidence && flag.evidence.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Evidence</h4>
                    <div className="flex flex-wrap gap-2">
                      {flag.evidence.map((evidence, idx) => (
                        <Badge key={idx} variant="gray" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          {evidence}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {flag.resolution && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Resolution</h4>
                    <p className="text-sm text-green-700">{flag.resolution}</p>
                    {flag.resolvedBy && (
                      <p className="text-xs text-green-600 mt-1">
                        Resolved by: {flag.resolvedBy}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <span>ID: {flag.id}</span>
                  <span>Created: {new Date(flag.createdAt).toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      {/* Create Risk Flag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Risk Flag</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateRiskFlag({
                tenantId: formData.get('tenantId'),
                type: formData.get('type'),
                severity: formData.get('severity'),
                title: formData.get('title'),
                description: formData.get('description'),
                impact: formData.get('impact'),
                recommendedAction: formData.get('recommendedAction')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tenant ID
                  </label>
                  <input
                    name="tenantId"
                    type="text"
                    required
                    placeholder="e.g., T001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Type</option>
                    <option value="FRAUD_SUSPICION">Fraud Suspicion</option>
                    <option value="PAYMENT_FAILURE">Payment Failure</option>
                    <option value="POLICY_VIOLATION">Policy Violation</option>
                    <option value="UNUSUAL_ACTIVITY">Unusual Activity</option>
                    <option value="COMPLIANCE_ISSUE">Compliance Issue</option>
                    <option value="SECURITY_BREACH">Security Breach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    name="severity"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Severity</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="Brief description of the issue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    placeholder="Detailed description of the risk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <input
                    name="impact"
                    type="text"
                    required
                    placeholder="Potential impact of this risk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recommended Action
                  </label>
                  <input
                    name="recommendedAction"
                    type="text"
                    required
                    placeholder="Recommended action to address this risk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button type="submit">Create Risk Flag</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}