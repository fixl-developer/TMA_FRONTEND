'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { trustSafetyService, type AppealCase } from '@/shared/services/trustSafetyService';
import { 
  Eye, 
  Search, 
  Filter, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Building,
  Calendar,
  FileText,
  Download,
  Gavel,
  MessageSquare,
  Scale,
  Flag
} from 'lucide-react';

export default function AppealsPage() {
  const [appeals, setAppeals] = useState<AppealCase[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealCase | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    appealType: '',
    priority: '',
    appellantType: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appealsData, statsData] = await Promise.all([
        trustSafetyService.getAppealCases(filters),
        trustSafetyService.getTrustSafetyStats()
      ]);
      setAppeals(appealsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load appeals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAppeal = async (id: string, decision: any) => {
    try {
      await trustSafetyService.reviewAppeal(id, decision);
      setShowReviewModal(false);
      setSelectedAppeal(null);
      loadData();
    } catch (error) {
      console.error('Failed to review appeal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'yellow',
      UNDER_REVIEW: 'blue',
      APPROVED: 'green',
      DENIED: 'red',
      ESCALATED: 'orange'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'UNDER_REVIEW':
        return <Eye className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'DENIED':
        return <XCircle className="w-4 h-4" />;
      case 'ESCALATED':
        return <Flag className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'green',
      MEDIUM: 'yellow',
      HIGH: 'red'
    };
    return colors[priority] || 'gray';
  };

  const getAppealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DISPUTE_DECISION: 'Dispute Decision',
      ENFORCEMENT_ACTION: 'Enforcement Action',
      ACCOUNT_SUSPENSION: 'Account Suspension',
      CONTENT_REMOVAL: 'Content Removal'
    };
    return labels[type] || type;
  };

  const getAppealTypeIcon = (type: string) => {
    switch (type) {
      case 'DISPUTE_DECISION':
        return <Scale className="w-4 h-4" />;
      case 'ENFORCEMENT_ACTION':
        return <Gavel className="w-4 h-4" />;
      case 'ACCOUNT_SUSPENSION':
        return <User className="w-4 h-4" />;
      case 'CONTENT_REMOVAL':
        return <FileText className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getAppellantTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TENANT: 'Tenant',
      USER: 'User',
      TALENT: 'Talent'
    };
    return labels[type] || type;
  };

  const getDaysAgo = (date: string) => {
    const now = new Date();
    const submitted = new Date(date);
    const diffTime = now.getTime() - submitted.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Appeal Cases"
        description="Review and manage appeal requests"
        icon={Eye}
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
                <p className="text-sm text-gray-600">Total Appeals</p>
                <p className="text-2xl font-bold mt-1">{stats.appeals.total}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold mt-1">{stats.appeals.pending + stats.appeals.underReview}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold mt-1">{stats.appeals.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Denied</p>
                <p className="text-2xl font-bold mt-1">{stats.appeals.denied}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  placeholder="Search appeals..."
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
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="DENIED">Denied</option>
                <option value="ESCALATED">Escalated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appeal Type
              </label>
              <select
                value={filters.appealType}
                onChange={(e) => setFilters({ ...filters, appealType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                <option value="DISPUTE_DECISION">Dispute Decision</option>
                <option value="ENFORCEMENT_ACTION">Enforcement Action</option>
                <option value="ACCOUNT_SUSPENSION">Account Suspension</option>
                <option value="CONTENT_REMOVAL">Content Removal</option>
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
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: '', appealType: '', priority: '', appellantType: '', search: '' });
                }}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Appeals List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appeals...</p>
          </div>
        ) : appeals.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appeals found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No appeals have been submitted yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appeals.map((appeal) => (
              <Card key={appeal.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getAppealTypeLabel(appeal.appealType)} Appeal
                      </h3>
                      <Badge variant={getStatusColor(appeal.status)} size="sm">
                        {getStatusIcon(appeal.status)}
                        <span className="ml-1">{appeal.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge variant={getPriorityColor(appeal.priority)} size="sm">
                        <Flag className="w-3 h-3 mr-1" />
                        {appeal.priority}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {getAppealTypeIcon(appeal.appealType)}
                        <span className="ml-1">{getAppealTypeLabel(appeal.appealType)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {appeal.appellantName} ({getAppellantTypeLabel(appeal.appellantType)})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {getDaysAgo(appeal.submittedAt)} days ago
                      </span>
                      {appeal.reviewedBy && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          Reviewed by: {appeal.reviewedBy}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAppeal(appeal);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {(appeal.status === 'PENDING' || appeal.status === 'UNDER_REVIEW') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAppeal(appeal);
                          setShowReviewModal(true);
                        }}
                      >
                        <Scale className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Appeal Reason</h4>
                  <p className="text-sm text-gray-700 mb-3">{appeal.reason}</p>
                  
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{appeal.description}</p>
                </div>

                {appeal.evidence && appeal.evidence.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Supporting Evidence ({appeal.evidence.length} files)</h4>
                    <div className="flex flex-wrap gap-2">
                      {appeal.evidence.map((evidence, idx) => (
                        <Badge key={idx} variant="outline" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          {evidence.type}: {evidence.filename}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {appeal.decision && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    appeal.decision.outcome === 'OVERTURNED' ? 'bg-green-50' : 
                    appeal.decision.outcome === 'UPHELD' ? 'bg-red-50' : 'bg-yellow-50'
                  }`}>
                    <h4 className={`text-sm font-medium mb-2 ${
                      appeal.decision.outcome === 'OVERTURNED' ? 'text-green-800' : 
                      appeal.decision.outcome === 'UPHELD' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      Decision: {appeal.decision.outcome}
                    </h4>
                    <p className={`text-sm mb-1 ${
                      appeal.decision.outcome === 'OVERTURNED' ? 'text-green-700' : 
                      appeal.decision.outcome === 'UPHELD' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      <strong>Reasoning:</strong> {appeal.decision.reasoning}
                    </p>
                    {appeal.decision.newAction && (
                      <p className={`text-sm mb-1 ${
                        appeal.decision.outcome === 'OVERTURNED' ? 'text-green-700' : 
                        appeal.decision.outcome === 'UPHELD' ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        <strong>New Action:</strong> {appeal.decision.newAction}
                      </p>
                    )}
                    {appeal.decision.compensationOffered && (
                      <p className={`text-sm ${
                        appeal.decision.outcome === 'OVERTURNED' ? 'text-green-700' : 
                        appeal.decision.outcome === 'UPHELD' ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        <strong>Compensation:</strong> ${appeal.decision.compensationOffered.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>ID: {appeal.id}</span>
                    {appeal.originalDisputeId && (
                      <span>Original Dispute: {appeal.originalDisputeId}</span>
                    )}
                    {appeal.originalActionId && (
                      <span>Original Action: {appeal.originalActionId}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Submitted: {new Date(appeal.submittedAt).toLocaleDateString()}</span>
                    {appeal.reviewedAt && (
                      <span>Reviewed: {new Date(appeal.reviewedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      {/* Appeal Details Modal */}
      {showDetails && selectedAppeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {getAppealTypeLabel(selectedAppeal.appealType)} Appeal - {selectedAppeal.appellantName}
                </h2>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Appeal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Appeal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Appeal Type</p>
                      <p className="text-sm text-gray-600">{getAppealTypeLabel(selectedAppeal.appealType)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <Badge variant={getStatusColor(selectedAppeal.status)} size="sm">
                        {selectedAppeal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Priority</p>
                      <Badge variant={getPriorityColor(selectedAppeal.priority)} size="sm">
                        {selectedAppeal.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Appellant</p>
                      <p className="text-sm text-gray-600">
                        {selectedAppeal.appellantName} ({getAppellantTypeLabel(selectedAppeal.appellantType)})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appeal Details */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Appeal Reason</h3>
                  <p className="text-sm text-gray-700 mb-4">{selectedAppeal.reason}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{selectedAppeal.description}</p>
                </div>

                {/* Evidence */}
                {selectedAppeal.evidence && selectedAppeal.evidence.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Supporting Evidence</h3>
                    <div className="space-y-3">
                      {selectedAppeal.evidence.map((evidence, idx) => (
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

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Timeline</h3>
                  <div className="space-y-3">
                    {selectedAppeal.timeline.map((event, idx) => (
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

                {/* Decision */}
                {selectedAppeal.decision && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Decision</h3>
                    <div className={`p-4 rounded-lg ${
                      selectedAppeal.decision.outcome === 'OVERTURNED' ? 'bg-green-50' : 
                      selectedAppeal.decision.outcome === 'UPHELD' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}>
                      <div className="space-y-2">
                        <div>
                          <p className={`text-sm font-medium ${
                            selectedAppeal.decision.outcome === 'OVERTURNED' ? 'text-green-800' : 
                            selectedAppeal.decision.outcome === 'UPHELD' ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            Outcome: {selectedAppeal.decision.outcome}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${
                            selectedAppeal.decision.outcome === 'OVERTURNED' ? 'text-green-700' : 
                            selectedAppeal.decision.outcome === 'UPHELD' ? 'text-red-700' : 'text-yellow-700'
                          }`}>
                            <strong>Reasoning:</strong> {selectedAppeal.decision.reasoning}
                          </p>
                        </div>
                        {selectedAppeal.decision.newAction && (
                          <div>
                            <p className={`text-sm ${
                              selectedAppeal.decision.outcome === 'OVERTURNED' ? 'text-green-700' : 
                              selectedAppeal.decision.outcome === 'UPHELD' ? 'text-red-700' : 'text-yellow-700'
                            }`}>
                              <strong>New Action:</strong> {selectedAppeal.decision.newAction}
                            </p>
                          </div>
                        )}
                        {selectedAppeal.decision.compensationOffered && (
                          <div>
                            <p className={`text-sm ${
                              selectedAppeal.decision.outcome === 'OVERTURNED' ? 'text-green-700' : 
                              selectedAppeal.decision.outcome === 'UPHELD' ? 'text-red-700' : 'text-yellow-700'
                            }`}>
                              <strong>Compensation Offered:</strong> ${selectedAppeal.decision.compensationOffered.toLocaleString()}
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

      {/* Review Appeal Modal */}
      {showReviewModal && selectedAppeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Review Appeal</h2>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleReviewAppeal(selectedAppeal.id, {
                outcome: formData.get('outcome'),
                reasoning: formData.get('reasoning'),
                newAction: formData.get('newAction') || undefined,
                compensationOffered: formData.get('compensationOffered') ? parseInt(formData.get('compensationOffered') as string) : undefined
              });
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Appeal Summary</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Type:</strong> {getAppealTypeLabel(selectedAppeal.appealType)}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Appellant:</strong> {selectedAppeal.appellantName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong> {selectedAppeal.reason}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Decision Outcome
                  </label>
                  <select
                    name="outcome"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Outcome</option>
                    <option value="UPHELD">Upheld - Original decision stands</option>
                    <option value="OVERTURNED">Overturned - Appeal granted</option>
                    <option value="MODIFIED">Modified - Partial appeal granted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reasoning
                  </label>
                  <textarea
                    name="reasoning"
                    required
                    rows={4}
                    placeholder="Explain the reasoning behind this decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Action (if applicable)
                  </label>
                  <input
                    name="newAction"
                    type="text"
                    placeholder="e.g., Reduce suspension to warning"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compensation Offered ($)
                  </label>
                  <input
                    name="compensationOffered"
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-6 border-t border-gray-200">
                <Button type="submit">Submit Decision</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReviewModal(false)}
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