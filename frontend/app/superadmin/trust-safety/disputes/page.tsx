'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { trustSafetyService, type Dispute } from '@/shared/services/trustSafetyService';
import { 
  FileText, 
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
  Flag,
  Download,
  Gavel,
  MessageSquare
} from 'lucide-react';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    category: '',
    disputeType: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [disputesData, statsData] = await Promise.all([
        trustSafetyService.getDisputes(filters),
        trustSafetyService.getTrustSafetyStats()
      ]);
      setDisputes(disputesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await trustSafetyService.updateDisputeStatus(id, status, 'admin@platform.com');
      loadData();
    } catch (error) {
      console.error('Failed to update dispute status:', error);
    }
  };

  const handleResolveDispute = async (id: string) => {
    try {
      const outcome = prompt('Resolution outcome:');
      if (!outcome) return;
      
      const details = prompt('Resolution details:');
      if (!details) return;
      
      await trustSafetyService.resolveDispute(id, {
        outcome,
        details,
        actionTaken: 'Manual resolution by admin'
      });
      loadData();
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
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
        return <Flag className="w-4 h-4" />;
      case 'MEDIUM':
        return <Eye className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'red',
      INVESTIGATING: 'yellow',
      ESCALATED: 'orange',
      RESOLVED: 'green',
      CLOSED: 'gray',
      APPEALED: 'purple'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertTriangle className="w-4 h-4" />;
      case 'INVESTIGATING':
        return <Clock className="w-4 h-4" />;
      case 'ESCALATED':
        return <Flag className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      case 'APPEALED':
        return <Eye className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      FINANCIAL: 'Financial',
      BEHAVIORAL: 'Behavioral',
      CONTENT: 'Content',
      SECURITY: 'Security',
      COMPLIANCE: 'Compliance'
    };
    return labels[category] || category;
  };

  const getDisputeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PAYMENT_DISPUTE: 'Payment Dispute',
      CONTRACT_VIOLATION: 'Contract Violation',
      HARASSMENT: 'Harassment',
      FRAUD: 'Fraud',
      CONTENT_VIOLATION: 'Content Violation',
      PLATFORM_ABUSE: 'Platform Abuse',
      DATA_BREACH: 'Data Breach',
      DISCRIMINATION: 'Discrimination'
    };
    return labels[type] || type;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Dispute Management"
        description="Review and resolve platform disputes"
        icon={FileText}
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
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Dispute
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
                <p className="text-sm text-gray-600">Total Disputes</p>
                <p className="text-2xl font-bold mt-1">{stats.disputes.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold mt-1">{stats.disputes.open}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investigating</p>
                <p className="text-2xl font-bold mt-1">{stats.disputes.investigating}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Escalated</p>
                <p className="text-2xl font-bold mt-1">{stats.disputes.escalated}</p>
              </div>
              <Flag className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold mt-1">{stats.disputes.resolved}</p>
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
                  placeholder="Search disputes..."
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
                <option value="OPEN">Open</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="APPEALED">Appealed</option>
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
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                <option value="FINANCIAL">Financial</option>
                <option value="BEHAVIORAL">Behavioral</option>
                <option value="CONTENT">Content</option>
                <option value="SECURITY">Security</option>
                <option value="COMPLIANCE">Compliance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: '', severity: '', category: '', disputeType: '', priority: '', search: '' });
                }}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Disputes List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading disputes...</p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No disputes have been filed yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{dispute.title}</h3>
                      <Badge variant={getSeverityColor(dispute.severity)} size="sm">
                        {getSeverityIcon(dispute.severity)}
                        <span className="ml-1">{dispute.severity}</span>
                      </Badge>
                      <Badge variant={getStatusColor(dispute.status)} size="sm">
                        {getStatusIcon(dispute.status)}
                        <span className="ml-1">{dispute.status}</span>
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {getCategoryLabel(dispute.category)}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        Risk: {dispute.riskScore}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {dispute.tenantName}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {dispute.reporterName} ({dispute.reporterType})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flag className="w-4 h-4" />
                        {dispute.priority} Priority
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {dispute.status === 'OPEN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(dispute.id, 'INVESTIGATING')}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Investigate
                      </Button>
                    )}
                    {(dispute.status === 'INVESTIGATING' || dispute.status === 'ESCALATED') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveDispute(dispute.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    {dispute.status === 'OPEN' && dispute.severity === 'CRITICAL' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(dispute.id, 'ESCALATED')}
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        Escalate
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">{dispute.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Dispute Type</h4>
                      <p className="text-sm text-gray-600">{getDisputeTypeLabel(dispute.disputeType)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Impact</h4>
                      <p className="text-sm text-gray-600">{dispute.impact.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>

                {dispute.evidence && dispute.evidence.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Evidence ({dispute.evidence.length} files)</h4>
                    <div className="flex flex-wrap gap-2">
                      {dispute.evidence.map((evidence, idx) => (
                        <Badge key={idx} variant="outline" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          {evidence.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {dispute.involvedParties && dispute.involvedParties.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Involved Parties</h4>
                    <div className="flex flex-wrap gap-2">
                      {dispute.involvedParties.map((party, idx) => (
                        <Badge key={idx} variant="outline" size="sm">
                          {party.name} ({party.role})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {dispute.tags && dispute.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {dispute.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {dispute.resolution && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Resolution</h4>
                    <p className="text-sm text-green-700 mb-1">
                      <strong>Outcome:</strong> {dispute.resolution.outcome}
                    </p>
                    <p className="text-sm text-green-700 mb-1">
                      <strong>Details:</strong> {dispute.resolution.details}
                    </p>
                    <p className="text-xs text-green-600">
                      Resolved by: {dispute.resolution.resolvedBy} on {new Date(dispute.resolution.resolvedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>ID: {dispute.id}</span>
                    {dispute.assignedTo && (
                      <span>Assigned to: {dispute.assignedTo}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Updated: {new Date(dispute.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      {/* Dispute Details Modal */}
      {showDetails && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedDispute.title}</h2>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Timeline</h3>
                  <div className="space-y-3">
                    {selectedDispute.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{event.action}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{event.details}</p>
                          <p className="text-xs text-gray-500">by {event.actor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Details */}
                {selectedDispute.evidence && selectedDispute.evidence.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Evidence</h3>
                    <div className="space-y-2">
                      {selectedDispute.evidence.map((evidence, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{evidence.filename}</p>
                              <p className="text-xs text-gray-500">{evidence.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(evidence.uploadedAt).toLocaleDateString()}
                            </p>
                            <Button variant="outline" size="sm" className="mt-1">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
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