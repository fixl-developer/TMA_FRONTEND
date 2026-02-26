'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { securityManagementService, type AccessReview } from '@/shared/services/securityManagementService';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Shield,
  FileText,
  TrendingUp
} from 'lucide-react';

export default function AccessReviewsPage() {
  const [reviews, setReviews] = useState<AccessReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<AccessReview | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    scope: '',
    status: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    loadReviews();
  }, [filters]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await securityManagementService.getAccessReviews(filters);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load access reviews:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      await securityManagementService.updateAccessReviewStatus(reviewId, newStatus);
      loadReviews();
    } catch (error) {
      console.error('Failed to update review status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'yellow',
      IN_PROGRESS: 'blue',
      COMPLETED: 'green',
      OVERDUE: 'red'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <TrendingUp className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'OVERDUE':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PERIODIC: 'blue',
      ROLE_CHANGE: 'green',
      TERMINATION: 'red',
      COMPLIANCE: 'purple',
      INCIDENT_DRIVEN: 'orange'
    };
    return colors[type] || 'gray';
  };

  const getScopeColor = (scope: string) => {
    const colors: Record<string, string> = {
      USER: 'blue',
      ROLE: 'green',
      SYSTEM: 'purple',
      TENANT: 'orange',
      GLOBAL: 'red'
    };
    return colors[scope] || 'gray';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: 'red',
      MEDIUM: 'yellow',
      LOW: 'blue'
    };
    return colors[priority] || 'gray';
  };
  return (
    <PageLayout>
      <PageHeader
        title="Access Reviews"
        description="Review and audit user access permissions"
        icon={Users}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Review
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reviews..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="PERIODIC">Periodic</SelectItem>
              <SelectItem value="ROLE_CHANGE">Role Change</SelectItem>
              <SelectItem value="TERMINATION">Termination</SelectItem>
              <SelectItem value="COMPLIANCE">Compliance</SelectItem>
              <SelectItem value="INCIDENT_DRIVEN">Incident Driven</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.scope} onValueChange={(value) => setFilters({ ...filters, scope: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Scopes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Scopes</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ROLE">Role</SelectItem>
              <SelectItem value="SYSTEM">System</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
              <SelectItem value="GLOBAL">Global</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ type: '', scope: '', status: '', priority: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>
      {/* Reviews List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Access Reviews ({reviews.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No access reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{review.title}</h4>
                        <Badge variant={getStatusColor(review.status)} size="sm">
                          {getStatusIcon(review.status)}
                          <span className="ml-1">{review.status}</span>
                        </Badge>
                        <Badge variant={getTypeColor(review.type)} size="sm">
                          {review.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getScopeColor(review.scope)} size="sm">
                          {review.scope}
                        </Badge>
                        <Badge variant={getPriorityColor(review.priority)} size="sm">
                          {review.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{review.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Reviewer
                          </p>
                          <p className="text-gray-600">{review.reviewer}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due Date
                          </p>
                          <p className="text-gray-600">{new Date(review.dueDate).toLocaleDateString()}</p>
                          {review.status === 'OVERDUE' && (
                            <p className="text-xs text-red-600">
                              {Math.floor((Date.now() - new Date(review.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Target</p>
                          <p className="text-gray-600">
                            {review.reviewee || review.targetRole || review.targetSystem || 'All users'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Schedule</p>
                          <p className="text-gray-600">{review.schedule.frequency}</p>
                          <p className="text-xs text-gray-500">
                            Next: {new Date(review.schedule.nextReview).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Findings Summary */}
                      {review.status === 'COMPLETED' && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-sm mb-2">Review Findings:</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-red-600 font-medium">{review.findings.excessivePermissions.count}</span>
                              <span className="text-gray-600 ml-1">Excessive Permissions</span>
                            </div>
                            <div>
                              <span className="text-orange-600 font-medium">{review.findings.unusedAccess.count}</span>
                              <span className="text-gray-600 ml-1">Unused Access</span>
                            </div>
                            <div>
                              <span className="text-purple-600 font-medium">{review.findings.policyViolations.count}</span>
                              <span className="text-gray-600 ml-1">Policy Violations</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReview(review)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[700px] sm:w-[700px]">
                          <SheetHeader>
                            <SheetTitle>Access Review Details</SheetTitle>
                          </SheetHeader>
                          {selectedReview && (
                            <ReviewDetails 
                              review={selectedReview} 
                              onStatusChange={handleStatusChange}
                            />
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      {review.status === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(review.id, 'IN_PROGRESS')}
                        >
                          Start Review
                        </Button>
                      )}
                      
                      {review.status === 'IN_PROGRESS' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(review.id, 'COMPLETED')}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Create Review Dialog */}
      {showCreateDialog && (
        <CreateReviewDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={loadReviews}
        />
      )}
    </PageLayout>
  );
}
function ReviewDetails({ 
  review, 
  onStatusChange 
}: { 
  review: AccessReview; 
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Review Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Review ID</p>
            <p className="font-medium">{review.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <Badge variant={getTypeColor(review.type)} size="sm">
              {review.type.replace('_', ' ')}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Scope</p>
            <Badge variant={getScopeColor(review.scope)} size="sm">
              {review.scope}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(review.status)} size="sm">
              {review.status}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Priority</p>
            <Badge variant={getPriorityColor(review.priority)} size="sm">
              {review.priority}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Reviewer</p>
            <p className="font-medium">{review.reviewer}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{review.description}</p>
      </div>

      {/* Review Target */}
      <div>
        <h4 className="font-semibold mb-3">Review Target</h4>
        <div className="text-sm">
          {review.reviewee && <p><span className="text-gray-600">User:</span> {review.reviewee}</p>}
          {review.targetRole && <p><span className="text-gray-600">Role:</span> {review.targetRole}</p>}
          {review.targetSystem && <p><span className="text-gray-600">System:</span> {review.targetSystem}</p>}
        </div>
      </div>

      {/* Schedule */}
      <div>
        <h4 className="font-semibold mb-3">Schedule</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Frequency</p>
            <p className="font-medium">{review.schedule.frequency}</p>
          </div>
          <div>
            <p className="text-gray-600">Next Review</p>
            <p className="font-medium">{new Date(review.schedule.nextReview).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Due Date</p>
            <p className="font-medium">{new Date(review.dueDate).toLocaleDateString()}</p>
          </div>
          {review.completedAt && (
            <div>
              <p className="text-gray-600">Completed At</p>
              <p className="font-medium">{new Date(review.completedAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
      {/* Findings */}
      {review.status === 'COMPLETED' && (
        <div>
          <h4 className="font-semibold mb-3">Review Findings</h4>
          <div className="space-y-4">
            {/* Excessive Permissions */}
            <div className="p-4 bg-red-50 rounded-lg">
              <h5 className="font-medium text-red-800 mb-2">
                Excessive Permissions ({review.findings.excessivePermissions.count})
              </h5>
              {review.findings.excessivePermissions.details.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-red-700">
                  {review.findings.excessivePermissions.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-700">No excessive permissions found</p>
              )}
            </div>

            {/* Unused Access */}
            <div className="p-4 bg-orange-50 rounded-lg">
              <h5 className="font-medium text-orange-800 mb-2">
                Unused Access ({review.findings.unusedAccess.count})
              </h5>
              {review.findings.unusedAccess.details.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-orange-700">
                  {review.findings.unusedAccess.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-orange-700">No unused access found</p>
              )}
            </div>

            {/* Policy Violations */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h5 className="font-medium text-purple-800 mb-2">
                Policy Violations ({review.findings.policyViolations.count})
              </h5>
              {review.findings.policyViolations.details.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-purple-700">
                  {review.findings.policyViolations.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-purple-700">No policy violations found</p>
              )}
            </div>

            {/* Recommendations */}
            {review.findings.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Recommendations</h5>
                <ul className="list-disc list-inside text-sm text-blue-700">
                  {review.findings.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions Taken */}
      {review.status === 'COMPLETED' && (
        <div>
          <h4 className="font-semibold mb-3">Actions Taken</h4>
          <div className="space-y-3">
            {review.actions.permissionsRevoked.length > 0 && (
              <div>
                <p className="font-medium text-sm text-red-800">Permissions Revoked:</p>
                <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                  {review.actions.permissionsRevoked.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.actions.accessGranted.length > 0 && (
              <div>
                <p className="font-medium text-sm text-green-800">Access Granted:</p>
                <ul className="list-disc list-inside text-sm text-green-700 mt-1">
                  {review.actions.accessGranted.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.actions.rolesModified.length > 0 && (
              <div>
                <p className="font-medium text-sm text-blue-800">Roles Modified:</p>
                <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                  {review.actions.rolesModified.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.actions.accountsDisabled.length > 0 && (
              <div>
                <p className="font-medium text-sm text-gray-800">Accounts Disabled:</p>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                  {review.actions.accountsDisabled.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evidence */}
      <div>
        <h4 className="font-semibold mb-3">Evidence</h4>
        <div className="space-y-2">
          {review.evidence.accessLogs.map((log, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Access Log: {log}</span>
            </div>
          ))}
          {review.evidence.screenshots.map((screenshot, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Screenshot: {screenshot}</span>
            </div>
          ))}
          {review.evidence.approvals.map((approval, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Approval: {approval}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {review.status !== 'COMPLETED' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Actions</h4>
          <div className="flex gap-2">
            {review.status === 'PENDING' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange(review.id, 'IN_PROGRESS')}
              >
                Start Review
              </Button>
            )}
            {review.status === 'IN_PROGRESS' && (
              <Button 
                size="sm"
                onClick={() => onStatusChange(review.id, 'COMPLETED')}
              >
                Complete Review
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
function CreateReviewDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    scope: '',
    priority: '',
    description: '',
    reviewer: 'admin@platform.com',
    reviewee: '',
    targetRole: '',
    targetSystem: '',
    dueDate: '',
    frequency: 'QUARTERLY'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nextReview = new Date(formData.dueDate);
      if (formData.frequency === 'MONTHLY') {
        nextReview.setMonth(nextReview.getMonth() + 1);
      } else if (formData.frequency === 'QUARTERLY') {
        nextReview.setMonth(nextReview.getMonth() + 3);
      } else if (formData.frequency === 'ANNUALLY') {
        nextReview.setFullYear(nextReview.getFullYear() + 1);
      }

      await securityManagementService.createAccessReview({
        ...formData,
        status: 'PENDING',
        findings: {
          excessivePermissions: { count: 0, details: [] },
          unusedAccess: { count: 0, details: [] },
          policyViolations: { count: 0, details: [] },
          recommendations: []
        },
        actions: {
          permissionsRevoked: [],
          accessGranted: [],
          rolesModified: [],
          accountsDisabled: []
        },
        evidence: {
          accessLogs: [],
          screenshots: [],
          approvals: []
        },
        schedule: {
          frequency: formData.frequency as any,
          nextReview: nextReview.toISOString()
        },
        createdBy: 'admin@platform.com'
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create access review:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Access Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERIODIC">Periodic</SelectItem>
                  <SelectItem value="ROLE_CHANGE">Role Change</SelectItem>
                  <SelectItem value="TERMINATION">Termination</SelectItem>
                  <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                  <SelectItem value="INCIDENT_DRIVEN">Incident Driven</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Scope</label>
              <Select value={formData.scope} onValueChange={(value) => setFormData({ ...formData, scope: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ROLE">Role</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                  <SelectItem value="TENANT">Tenant</SelectItem>
                  <SelectItem value="GLOBAL">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Frequency</label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="ANNUALLY">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target specific fields based on scope */}
          {formData.scope === 'USER' && (
            <div>
              <label className="text-sm font-medium">Target User</label>
              <Input
                value={formData.reviewee}
                onChange={(e) => setFormData({ ...formData, reviewee: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
          )}

          {formData.scope === 'ROLE' && (
            <div>
              <label className="text-sm font-medium">Target Role</label>
              <Input
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                placeholder="Role name"
              />
            </div>
          )}

          {formData.scope === 'SYSTEM' && (
            <div>
              <label className="text-sm font-medium">Target System</label>
              <Input
                value={formData.targetSystem}
                onChange={(e) => setFormData({ ...formData, targetSystem: e.target.value })}
                placeholder="System name"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions for consistent styling
function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: 'yellow',
    IN_PROGRESS: 'blue',
    COMPLETED: 'green',
    OVERDUE: 'red'
  };
  return colors[status] || 'gray';
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    PERIODIC: 'blue',
    ROLE_CHANGE: 'green',
    TERMINATION: 'red',
    COMPLIANCE: 'purple',
    INCIDENT_DRIVEN: 'orange'
  };
  return colors[type] || 'gray';
}

function getScopeColor(scope: string) {
  const colors: Record<string, string> = {
    USER: 'blue',
    ROLE: 'green',
    SYSTEM: 'purple',
    TENANT: 'orange',
    GLOBAL: 'red'
  };
  return colors[scope] || 'gray';
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    HIGH: 'red',
    MEDIUM: 'yellow',
    LOW: 'blue'
  };
  return colors[priority] || 'gray';
}