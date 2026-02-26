'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { complianceManagementService, type PrivacyRequest } from '@/shared/services/complianceManagementService';
import { 
  Shield, 
  Search, 
  Download, 
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Mail
} from 'lucide-react';

export default function PrivacyRequestsPage() {
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PrivacyRequest | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    regulation: '',
    status: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await complianceManagementService.getPrivacyRequests(filters);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load privacy requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'yellow',
      VERIFIED: 'blue',
      IN_PROGRESS: 'orange',
      COMPLETED: 'green',
      REJECTED: 'red'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: 'red',
      MEDIUM: 'yellow',
      LOW: 'blue'
    };
    return colors[priority] || 'gray';
  };

  const isOverdue = (request: PrivacyRequest) => {
    return new Date(request.dueDate) < new Date() && request.status !== 'COMPLETED';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Privacy Requests"
        description="Manage GDPR, CCPA, and other privacy requests"
        icon={Shield}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Request
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
              placeholder="Search requests..."
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
              <SelectItem value="ACCESS">Access</SelectItem>
              <SelectItem value="DELETION">Deletion</SelectItem>
              <SelectItem value="RECTIFICATION">Rectification</SelectItem>
              <SelectItem value="PORTABILITY">Portability</SelectItem>
              <SelectItem value="OBJECTION">Objection</SelectItem>
              <SelectItem value="RESTRICTION">Restriction</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.regulation} onValueChange={(value) => setFilters({ ...filters, regulation: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Regulations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Regulations</SelectItem>
              <SelectItem value="GDPR">GDPR</SelectItem>
              <SelectItem value="CCPA">CCPA</SelectItem>
              <SelectItem value="LGPD">LGPD</SelectItem>
              <SelectItem value="PIPEDA">PIPEDA</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
          <Button variant="outline" onClick={() => setFilters({ type: '', regulation: '', status: '', priority: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Requests List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Requests ({requests.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No privacy requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{request.type} Request</h4>
                        <Badge variant={getStatusColor(request.status)} size="sm">{request.status.replace('_', ' ')}</Badge>
                        <Badge variant={getPriorityColor(request.priority)} size="sm">{request.priority}</Badge>
                        <Badge variant="blue" size="sm">{request.regulation}</Badge>
                        {isOverdue(request) && (
                          <Badge variant="red" size="sm">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{request.requestDetails}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Requester
                          </p>
                          <p className="text-gray-600">{request.requester.name}</p>
                          <p className="text-xs text-gray-500">{request.requester.email}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due Date
                          </p>
                          <p className="text-gray-600">{new Date(request.dueDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">
                            {Math.ceil((new Date(request.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Verification</p>
                          <p className="text-gray-600">{request.verificationMethod.replace('_', ' ')}</p>
                          {request.verifiedAt && (
                            <p className="text-xs text-green-600">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Verified
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Assigned To</p>
                          <p className="text-gray-600">{request.assignedTo || 'Unassigned'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[800px] sm:w-[800px] overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Request Details</SheetTitle>
                        </SheetHeader>
                        {selectedRequest && <RequestDetails request={selectedRequest} />}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  );
}

function RequestDetails({ request }: { request: PrivacyRequest }) {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h4 className="font-semibold mb-3">Request Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Request ID</p>
            <p className="font-medium">{request.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <Badge variant="blue" size="sm">{request.type}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Regulation</p>
            <Badge variant="purple" size="sm">{request.regulation}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(request.status)} size="sm">{request.status.replace('_', ' ')}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Priority</p>
            <Badge variant={getPriorityColor(request.priority)} size="sm">{request.priority}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Due Date</p>
            <p className="font-medium">{new Date(request.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Requester Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{request.requester.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{request.requester.email}</p>
          </div>
          {request.requester.userId && (
            <div>
              <p className="text-gray-600">User ID</p>
              <p className="font-medium">{request.requester.userId}</p>
            </div>
          )}
          {request.requester.tenantId && (
            <div>
              <p className="text-gray-600">Tenant ID</p>
              <p className="font-medium">{request.requester.tenantId}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Request Details</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{request.requestDetails}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Data Scope</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(request.dataScope).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {value ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
              )}
              <span className={value ? 'font-medium' : 'text-gray-500'}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Timeline</h4>
        <div className="space-y-3">
          {request.timeline.map((event, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{event.action}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{event.details}</p>
                <p className="text-xs text-gray-500">by {event.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {request.fulfillment && (
        <div>
          <h4 className="font-semibold mb-3">Fulfillment</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Method</p>
              <p className="font-medium">{request.fulfillment.method}</p>
            </div>
            <div>
              <p className="text-gray-600">Completed At</p>
              <p className="font-medium">{new Date(request.fulfillment.completedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Completed By</p>
              <p className="font-medium">{request.fulfillment.completedBy}</p>
            </div>
            <div>
              <p className="text-gray-600">Evidence</p>
              <p className="font-medium">{request.fulfillment.evidence.length} files</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: 'yellow',
    VERIFIED: 'blue',
    IN_PROGRESS: 'orange',
    COMPLETED: 'green',
    REJECTED: 'red'
  };
  return colors[status] || 'gray';
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    HIGH: 'red',
    MEDIUM: 'yellow',
    LOW: 'blue'
  };
  return colors[priority] || 'gray';
}
