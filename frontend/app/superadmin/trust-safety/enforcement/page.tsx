'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { trustSafetyService, type EnforcementAction } from '@/shared/services/trustSafetyService';
import { 
  Gavel, 
  Search, 
  Filter, 
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Building,
  Calendar,
  Shield,
  Download,
  Pause,
  Play,
  Ban,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';

export default function EnforcementActionsPage() {
  const [actions, setActions] = useState<EnforcementAction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    actionType: '',
    severity: '',
    targetType: '',
    tenantId: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [actionsData, statsData] = await Promise.all([
        trustSafetyService.getEnforcementActions(filters),
        trustSafetyService.getTrustSafetyStats()
      ]);
      setActions(actionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load enforcement actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAction = async (data: any) => {
    try {
      await trustSafetyService.createEnforcementAction({
        ...data,
        createdBy: 'admin@platform.com',
        status: 'PENDING',
        impact: {
          usersAffected: parseInt(data.usersAffected) || 0,
          revenueImpact: parseInt(data.revenueImpact) || 0,
          reputationRisk: data.reputationRisk || 'LOW'
        }
      });
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to create enforcement action:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await trustSafetyService.updateEnforcementAction(id, { 
        status: status as any,
        reviewedBy: 'admin@platform.com',
        reviewedAt: new Date().toISOString()
      });
      loadData();
    } catch (error) {
      console.error('Failed to update enforcement action:', error);
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
        return <Eye className="w-4 h-4" />;
      default:
        return <Gavel className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'yellow',
      ACTIVE: 'orange',
      COMPLETED: 'green',
      APPEALED: 'purple',
      OVERTURNED: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'ACTIVE':
        return <Play className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'APPEALED':
        return <Eye className="w-4 h-4" />;
      case 'OVERTURNED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Gavel className="w-4 h-4" />;
    }
  };

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      WARNING: 'Warning',
      TEMPORARY_SUSPENSION: 'Temporary Suspension',
      PERMANENT_SUSPENSION: 'Permanent Suspension',
      ACCOUNT_TERMINATION: 'Account Termination',
      FEATURE_RESTRICTION: 'Feature Restriction',
      PAYMENT_HOLD: 'Payment Hold',
      CONTENT_REMOVAL: 'Content Removal'
    };
    return labels[type] || type;
  };

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4" />;
      case 'TEMPORARY_SUSPENSION':
        return <Pause className="w-4 h-4" />;
      case 'PERMANENT_SUSPENSION':
        return <Ban className="w-4 h-4" />;
      case 'ACCOUNT_TERMINATION':
        return <XCircle className="w-4 h-4" />;
      case 'FEATURE_RESTRICTION':
        return <Shield className="w-4 h-4" />;
      case 'PAYMENT_HOLD':
        return <DollarSign className="w-4 h-4" />;
      case 'CONTENT_REMOVAL':
        return <Eye className="w-4 h-4" />;
      default:
        return <Gavel className="w-4 h-4" />;
    }
  };

  const getTargetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TENANT: 'Tenant',
      USER: 'User',
      TALENT: 'Talent',
      ADMIN: 'Admin'
    };
    return labels[type] || type;
  };

  const isActionExpired = (action: EnforcementAction) => {
    if (!action.effectiveUntil) return false;
    return new Date(action.effectiveUntil) < new Date();
  };

  const getDaysRemaining = (action: EnforcementAction) => {
    if (!action.effectiveUntil) return null;
    const now = new Date();
    const end = new Date(action.effectiveUntil);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Enforcement Actions"
        description="Manage policy enforcement and disciplinary actions"
        icon={Gavel}
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
              Create Action
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
                <p className="text-sm text-gray-600">Total Actions</p>
                <p className="text-2xl font-bold mt-1">{stats.enforcementActions.total}</p>
              </div>
              <Gavel className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold mt-1">{stats.enforcementActions.active}</p>
              </div>
              <Play className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold mt-1">{stats.enforcementActions.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appealed</p>
                <p className="text-2xl font-bold mt-1">{stats.enforcementActions.appealed}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                  placeholder="Search actions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="APPEALED">Appealed</option>
                <option value="OVERTURNED">Overturned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                value={filters.actionType}
                onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                <option value="WARNING">Warning</option>
                <option value="TEMPORARY_SUSPENSION">Temporary Suspension</option>
                <option value="PERMANENT_SUSPENSION">Permanent Suspension</option>
                <option value="ACCOUNT_TERMINATION">Account Termination</option>
                <option value="FEATURE_RESTRICTION">Feature Restriction</option>
                <option value="PAYMENT_HOLD">Payment Hold</option>
                <option value="CONTENT_REMOVAL">Content Removal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                Target Type
              </label>
              <select
                value={filters.targetType}
                onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                <option value="TENANT">Tenant</option>
                <option value="USER">User</option>
                <option value="TALENT">Talent</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: '', actionType: '', severity: '', targetType: '', tenantId: '', search: '' });
                }}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Actions List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading enforcement actions...</p>
          </div>
        ) : actions.length === 0 ? (
          <div className="text-center py-12">
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enforcement actions found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No enforcement actions have been created yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((action) => (
              <Card key={action.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getActionTypeLabel(action.actionType)} - {action.targetName}
                      </h3>
                      <Badge variant={getSeverityColor(action.severity)} size="sm">
                        {getSeverityIcon(action.severity)}
                        <span className="ml-1">{action.severity}</span>
                      </Badge>
                      <Badge variant={getStatusColor(action.status)} size="sm">
                        {getStatusIcon(action.status)}
                        <span className="ml-1">{action.status}</span>
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {getActionTypeIcon(action.actionType)}
                        <span className="ml-1">{getActionTypeLabel(action.actionType)}</span>
                      </Badge>
                      {isActionExpired(action) && (
                        <Badge variant="red" size="sm">
                          Expired
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {action.tenantName}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {getTargetTypeLabel(action.targetType)}: {action.targetName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(action.effectiveFrom).toLocaleDateString()}
                      </span>
                      {action.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {action.duration} days
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {action.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(action.id, 'ACTIVE')}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    )}
                    {action.status === 'ACTIVE' && !isActionExpired(action) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(action.id, 'COMPLETED')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">{action.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Reason</h4>
                      <p className="text-sm text-gray-600">{action.reason}</p>
                    </div>
                    {action.effectiveUntil && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Duration</h4>
                        <p className="text-sm text-gray-600">
                          Until {new Date(action.effectiveUntil).toLocaleDateString()}
                          {getDaysRemaining(action) !== null && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({getDaysRemaining(action)} days remaining)
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {action.restrictions && action.restrictions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Restrictions</h4>
                    <div className="flex flex-wrap gap-2">
                      {action.restrictions.map((restriction, idx) => (
                        <Badge key={idx} variant="outline" size="sm">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact Assessment */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Impact Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        <strong>{action.impact.usersAffected}</strong> users affected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        <strong>${action.impact.revenueImpact.toLocaleString()}</strong> revenue impact
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        <strong>{action.impact.reputationRisk}</strong> reputation risk
                      </span>
                    </div>
                  </div>
                </div>

                {action.appeal && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">Appeal Filed</h4>
                    <p className="text-sm text-purple-700 mb-1">
                      <strong>Reason:</strong> {action.appeal.reason}
                    </p>
                    <p className="text-sm text-purple-700 mb-1">
                      <strong>Status:</strong> {action.appeal.status}
                    </p>
                    <p className="text-xs text-purple-600">
                      Filed on: {new Date(action.appeal.submittedAt).toLocaleDateString()}
                    </p>
                    {action.appeal.decision && (
                      <p className="text-sm text-purple-700 mt-2">
                        <strong>Decision:</strong> {action.appeal.decision}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>ID: {action.id}</span>
                    <span>Created by: {action.createdBy}</span>
                    {action.disputeId && (
                      <span>Related to dispute: {action.disputeId}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Created: {new Date(action.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      {/* Create Action Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Create Enforcement Action</h2>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateAction({
                tenantId: formData.get('tenantId'),
                tenantName: formData.get('tenantName'),
                targetId: formData.get('targetId'),
                targetName: formData.get('targetName'),
                targetType: formData.get('targetType'),
                actionType: formData.get('actionType'),
                reason: formData.get('reason'),
                description: formData.get('description'),
                severity: formData.get('severity'),
                duration: formData.get('duration') ? parseInt(formData.get('duration') as string) : undefined,
                restrictions: formData.get('restrictions') ? (formData.get('restrictions') as string).split(',').map(r => r.trim()) : [],
                effectiveFrom: new Date().toISOString(),
                effectiveUntil: formData.get('duration') ? new Date(Date.now() + parseInt(formData.get('duration') as string) * 24 * 60 * 60 * 1000).toISOString() : undefined,
                usersAffected: formData.get('usersAffected'),
                revenueImpact: formData.get('revenueImpact'),
                reputationRisk: formData.get('reputationRisk')
              });
            }}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Tenant Name
                    </label>
                    <input
                      name="tenantName"
                      type="text"
                      required
                      placeholder="e.g., Elite Models Agency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target ID
                    </label>
                    <input
                      name="targetId"
                      type="text"
                      required
                      placeholder="e.g., U123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Name
                    </label>
                    <input
                      name="targetName"
                      type="text"
                      required
                      placeholder="e.g., John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Type
                    </label>
                    <select
                      name="targetType"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Type</option>
                      <option value="TENANT">Tenant</option>
                      <option value="USER">User</option>
                      <option value="TALENT">Talent</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action Type
                    </label>
                    <select
                      name="actionType"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Action</option>
                      <option value="WARNING">Warning</option>
                      <option value="TEMPORARY_SUSPENSION">Temporary Suspension</option>
                      <option value="PERMANENT_SUSPENSION">Permanent Suspension</option>
                      <option value="ACCOUNT_TERMINATION">Account Termination</option>
                      <option value="FEATURE_RESTRICTION">Feature Restriction</option>
                      <option value="PAYMENT_HOLD">Payment Hold</option>
                      <option value="CONTENT_REMOVAL">Content Removal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Duration (days)
                    </label>
                    <input
                      name="duration"
                      type="number"
                      placeholder="Leave empty for permanent"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <input
                    name="reason"
                    type="text"
                    required
                    placeholder="Brief reason for the action"
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
                    placeholder="Detailed description of the enforcement action"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restrictions (comma-separated)
                  </label>
                  <input
                    name="restrictions"
                    type="text"
                    placeholder="e.g., Platform access revoked, Payment processing suspended"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Users Affected
                    </label>
                    <input
                      name="usersAffected"
                      type="number"
                      defaultValue="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Revenue Impact ($)
                    </label>
                    <input
                      name="revenueImpact"
                      type="number"
                      defaultValue="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reputation Risk
                    </label>
                    <select
                      name="reputationRisk"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-6 border-t border-gray-200">
                <Button type="submit">Create Action</Button>
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