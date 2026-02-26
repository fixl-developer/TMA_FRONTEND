'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { trustSafetyService, type SafetyAlert } from '@/shared/services/trustSafetyService';
import { 
  Bell, 
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
  Zap,
  Activity,
  Target,
  Brain,
  Settings
} from 'lucide-react';

export default function SafetyAlertsPage() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    severity: '',
    tenantId: '',
    assignedTo: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertsData, statsData] = await Promise.all([
        trustSafetyService.getSafetyAlerts(filters),
        trustSafetyService.getTrustSafetyStats()
      ]);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load safety alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await trustSafetyService.updateSafetyAlert(id, { 
        status: status as any,
        assignedTo: status === 'INVESTIGATING' ? 'admin@platform.com' : undefined
      });
      loadData();
    } catch (error) {
      console.error('Failed to update alert status:', error);
    }
  };

  const handleInvestigate = async (id: string) => {
    try {
      const findings = prompt('Investigation findings:');
      if (!findings) return;
      
      await trustSafetyService.investigateSafetyAlert(id, {
        investigator: 'admin@platform.com',
        findings,
        conclusion: 'Investigation completed'
      });
      loadData();
    } catch (error) {
      console.error('Failed to investigate alert:', error);
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
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'blue',
      INVESTIGATING: 'yellow',
      RESOLVED: 'green',
      FALSE_POSITIVE: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Bell className="w-4 h-4" />;
      case 'INVESTIGATING':
        return <Clock className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'FALSE_POSITIVE':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FRAUD_DETECTION: 'Fraud Detection',
      UNUSUAL_ACTIVITY: 'Unusual Activity',
      POLICY_VIOLATION: 'Policy Violation',
      SECURITY_THREAT: 'Security Threat',
      COMPLIANCE_ISSUE: 'Compliance Issue'
    };
    return labels[type] || type;
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'FRAUD_DETECTION':
        return <Shield className="w-4 h-4" />;
      case 'UNUSUAL_ACTIVITY':
        return <Activity className="w-4 h-4" />;
      case 'POLICY_VIOLATION':
        return <AlertTriangle className="w-4 h-4" />;
      case 'SECURITY_THREAT':
        return <Zap className="w-4 h-4" />;
      case 'COMPLIANCE_ISSUE':
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Safety Alerts"
        description="Monitor automated safety alerts and security threats"
        icon={Bell}
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
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure Alerts
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
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold mt-1">{stats.safetyAlerts.total}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold mt-1">{stats.safetyAlerts.new}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investigating</p>
                <p className="text-2xl font-bold mt-1">{stats.safetyAlerts.investigating}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold mt-1">{stats.safetyAlerts.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold mt-1">{stats.safetyAlerts.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
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
                  placeholder="Search alerts..."
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
                <option value="NEW">New</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="RESOLVED">Resolved</option>
                <option value="FALSE_POSITIVE">False Positive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                <option value="FRAUD_DETECTION">Fraud Detection</option>
                <option value="UNUSUAL_ACTIVITY">Unusual Activity</option>
                <option value="POLICY_VIOLATION">Policy Violation</option>
                <option value="SECURITY_THREAT">Security Threat</option>
                <option value="COMPLIANCE_ISSUE">Compliance Issue</option>
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
                Tenant ID
              </label>
              <input
                type="text"
                value={filters.tenantId}
                onChange={(e) => setFilters({ ...filters, tenantId: e.target.value })}
                placeholder="e.g., T001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: '', type: '', severity: '', tenantId: '', assignedTo: '', search: '' });
                }}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading safety alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No safety alerts found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No safety alerts have been detected yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <Badge variant={getSeverityColor(alert.severity)} size="sm">
                        {getSeverityIcon(alert.severity)}
                        <span className="ml-1">{alert.severity}</span>
                      </Badge>
                      <Badge variant={getStatusColor(alert.status)} size="sm">
                        {getStatusIcon(alert.status)}
                        <span className="ml-1">{alert.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {getAlertTypeIcon(alert.type)}
                        <span className="ml-1">{getAlertTypeLabel(alert.type)}</span>
                      </Badge>
                      <Badge variant="outline" size="sm">
                        <Target className="w-3 h-3 mr-1" />
                        <span className={getRiskScoreColor(alert.riskScore)}>
                          Risk: {alert.riskScore}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {alert.tenantName && (
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {alert.tenantName}
                        </span>
                      )}
                      {alert.userName && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {alert.userName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(alert.detectedAt).toLocaleDateString()}
                      </span>
                      {alert.assignedTo && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Assigned to: {alert.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {alert.status === 'NEW' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(alert.id, 'INVESTIGATING')}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Investigate
                      </Button>
                    )}
                    {alert.status === 'INVESTIGATING' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInvestigate(alert.id)}
                        >
                          <Brain className="w-4 h-4 mr-1" />
                          Complete Investigation
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(alert.id, 'FALSE_POSITIVE')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          False Positive
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                </div>

                {/* Risk Indicators */}
                {alert.indicators && alert.indicators.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Indicators</h4>
                    <div className="space-y-1">
                      {alert.indicators.map((indicator, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Actions */}
                {alert.recommendedActions && alert.recommendedActions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</h4>
                    <div className="space-y-1">
                      {alert.recommendedActions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto Actions */}
                {alert.autoActions && alert.autoActions.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Automated Actions Taken</h4>
                    <div className="space-y-2">
                      {alert.autoActions.map((autoAction, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-700">{autoAction.action}</span>
                            <span className="text-xs text-blue-600">
                              {new Date(autoAction.executedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-blue-600 text-xs mt-1">{autoAction.result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investigation Results */}
                {alert.investigation && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Investigation Results</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Investigator:</strong> {alert.investigation.investigator}</p>
                      <p><strong>Findings:</strong> {alert.investigation.findings}</p>
                      <p><strong>Conclusion:</strong> {alert.investigation.conclusion}</p>
                      {alert.investigation.completedAt && (
                        <p className="text-xs text-green-600">
                          Completed: {new Date(alert.investigation.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>ID: {alert.id}</span>
                    <span>Detected: {new Date(alert.detectedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={getRiskScoreColor(alert.riskScore)}>
                      Risk Score: {alert.riskScore}/100
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      {/* Alert Details Modal */}
      {showDetails && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedAlert.title}</h2>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Alert Details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Alert Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Type</p>
                      <p className="text-sm text-gray-600">{getAlertTypeLabel(selectedAlert.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Severity</p>
                      <Badge variant={getSeverityColor(selectedAlert.severity)} size="sm">
                        {selectedAlert.severity}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Risk Score</p>
                      <p className={`text-sm font-bold ${getRiskScoreColor(selectedAlert.riskScore)}`}>
                        {selectedAlert.riskScore}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <Badge variant={getStatusColor(selectedAlert.status)} size="sm">
                        {selectedAlert.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{selectedAlert.description}</p>
                </div>

                {/* Risk Indicators */}
                {selectedAlert.indicators && selectedAlert.indicators.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Risk Indicators</h3>
                    <div className="space-y-2">
                      {selectedAlert.indicators.map((indicator, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                          <span className="text-sm text-orange-800">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Actions */}
                {selectedAlert.recommendedActions && selectedAlert.recommendedActions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recommended Actions</h3>
                    <div className="space-y-2">
                      {selectedAlert.recommendedActions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                          <span className="text-sm text-blue-800">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto Actions */}
                {selectedAlert.autoActions && selectedAlert.autoActions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Automated Actions</h3>
                    <div className="space-y-3">
                      {selectedAlert.autoActions.map((autoAction, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{autoAction.action}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(autoAction.executedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{autoAction.result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investigation */}
                {selectedAlert.investigation && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Investigation</h3>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-green-800">Investigator</p>
                          <p className="text-sm text-green-700">{selectedAlert.investigation.investigator}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Findings</p>
                          <p className="text-sm text-green-700">{selectedAlert.investigation.findings}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Conclusion</p>
                          <p className="text-sm text-green-700">{selectedAlert.investigation.conclusion}</p>
                        </div>
                        {selectedAlert.investigation.completedAt && (
                          <div>
                            <p className="text-sm font-medium text-green-800">Completed</p>
                            <p className="text-sm text-green-700">
                              {new Date(selectedAlert.investigation.completedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}