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
import { revenueManagementService, type BillingDispute } from '@/shared/services/revenueManagementService';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  Upload,
  ExternalLink
} from 'lucide-react';

export default function BillingDisputesPage() {
  const [disputes, setDisputes] = useState<BillingDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<BillingDispute | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    disputeType: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    loadDisputes();
  }, [filters]);

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const data = await revenueManagementService.getBillingDisputes(filters);
      setDisputes(data);
    } catch (error) {
      console.error('Failed to load billing disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (disputeId: string, newStatus: string) => {
    try {
      await revenueManagementService.updateBillingDisputeStatus(disputeId, newStatus);
      loadDisputes();
    } catch (error) {
      console.error('Failed to update dispute status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'red',
      INVESTIGATING: 'yellow',
      RESOLVED: 'green',
      ESCALATED: 'purple',
      CLOSED: 'gray'
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
      case 'ESCALATED':
        return <AlertTriangle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'gray',
      MEDIUM: 'blue',
      HIGH: 'orange',
      URGENT: 'red'
    };
    return colors[priority] || 'gray';
  };

  const getDisputeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      BILLING_ERROR: 'red',
      UNAUTHORIZED_CHARGE: 'purple',
      SERVICE_ISSUE: 'orange',
      REFUND_REQUEST: 'blue',
      PRICING_DISPUTE: 'yellow'
    };
    return colors[type] || 'gray';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Billing Disputes"
        description="Manage billing disputes and resolution"
        icon={AlertTriangle}
        actions={
          <div className="flex items-center gap-3">
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

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search disputes..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="INVESTIGATING">Investigating</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="ESCALATED">Escalated</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.disputeType} onValueChange={(value) => setFilters({ ...filters, disputeType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="BILLING_ERROR">Billing Error</SelectItem>
              <SelectItem value="UNAUTHORIZED_CHARGE">Unauthorized Charge</SelectItem>
              <SelectItem value="SERVICE_ISSUE">Service Issue</SelectItem>
              <SelectItem value="REFUND_REQUEST">Refund Request</SelectItem>
              <SelectItem value="PRICING_DISPUTE">Pricing Dispute</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ status: '', disputeType: '', priority: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Disputes List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Billing Disputes ({disputes.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <p>No billing disputes found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{dispute.tenantName}</h4>
                        <Badge variant={getStatusColor(dispute.status)} size="sm">
                          {getStatusIcon(dispute.status)}
                          <span className="ml-1">{dispute.status}</span>
                        </Badge>
                        <Badge variant={getDisputeTypeColor(dispute.disputeType)} size="sm">
                          {dispute.disputeType.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityColor(dispute.priority)} size="sm">
                          {dispute.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{dispute.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Amount
                          </p>
                          <p className="text-lg font-semibold">${dispute.amount}</p>
                          <p className="text-gray-600">{dispute.currency}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created
                          </p>
                          <p className="text-gray-600">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">
                            {Math.floor((Date.now() - new Date(dispute.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                          </p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Assigned To
                          </p>
                          <p className="text-gray-600">{dispute.assignedTo || 'Unassigned'}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Evidence
                          </p>
                          <p className="text-gray-600">{dispute.evidence.length} files</p>
                        </div>
                      </div>

                      {/* Resolution Info */}
                      {dispute.resolution && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="font-medium text-sm text-green-800">Resolution:</p>
                          <p className="text-sm text-green-700">{dispute.resolution.outcome}</p>
                          {dispute.resolution.amount && (
                            <p className="text-sm text-green-700">Amount: ${dispute.resolution.amount}</p>
                          )}
                          <p className="text-xs text-green-600 mt-1">
                            Resolved by {dispute.resolution.resolvedBy} on {new Date(dispute.resolution.resolvedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedDispute(dispute)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[700px] sm:w-[700px]">
                          <SheetHeader>
                            <SheetTitle>Dispute Details</SheetTitle>
                          </SheetHeader>
                          {selectedDispute && (
                            <DisputeDetails 
                              dispute={selectedDispute} 
                              onStatusChange={handleStatusChange}
                              onResolve={() => setShowResolveDialog(true)}
                            />
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      {dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setShowResolveDialog(true);
                          }}
                        >
                          Resolve
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

      {/* Resolve Dispute Dialog */}
      {showResolveDialog && selectedDispute && (
        <ResolveDisputeDialog
          dispute={selectedDispute}
          open={showResolveDialog}
          onOpenChange={setShowResolveDialog}
          onSuccess={loadDisputes}
        />
      )}
    </PageLayout>
  );
}

function DisputeDetails({ 
  dispute, 
  onStatusChange, 
  onResolve 
}: { 
  dispute: BillingDispute; 
  onStatusChange: (id: string, status: string) => void;
  onResolve: () => void;
}) {
  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Dispute Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Dispute ID</p>
            <p className="font-medium">{dispute.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Subscription ID</p>
            <p className="font-medium">{dispute.subscriptionId}</p>
          </div>
          <div>
            <p className="text-gray-600">Tenant</p>
            <p className="font-medium">{dispute.tenantName}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <Badge variant={getDisputeTypeColor(dispute.disputeType)} size="sm">
              {dispute.disputeType.replace('_', ' ')}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(dispute.status)} size="sm">
              {dispute.status}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Priority</p>
            <Badge variant={getPriorityColor(dispute.priority)} size="sm">
              {dispute.priority}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Amount</p>
            <p className="font-medium text-lg">${dispute.amount} {dispute.currency}</p>
          </div>
          <div>
            <p className="text-gray-600">Assigned To</p>
            <p className="font-medium">{dispute.assignedTo || 'Unassigned'}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{dispute.description}</p>
      </div>

      {/* Evidence */}
      <div>
        <h4 className="font-semibold mb-3">Evidence ({dispute.evidence.length})</h4>
        {dispute.evidence.length === 0 ? (
          <p className="text-sm text-gray-500">No evidence uploaded</p>
        ) : (
          <div className="space-y-2">
            {dispute.evidence.map((evidence, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{evidence.filename}</p>
                    <p className="text-xs text-gray-500">
                      {evidence.type} • Uploaded {new Date(evidence.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div>
        <h4 className="font-semibold mb-3">Timeline</h4>
        <div className="space-y-3">
          {dispute.timeline.map((event, index) => (
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

      {/* Resolution */}
      {dispute.resolution && (
        <div>
          <h4 className="font-semibold mb-3">Resolution</h4>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Outcome</p>
                <p className="font-medium">{dispute.resolution.outcome}</p>
              </div>
              {dispute.resolution.amount && (
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-medium">${dispute.resolution.amount}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Resolved By</p>
                <p className="font-medium">{dispute.resolution.resolvedBy}</p>
              </div>
              <div>
                <p className="text-gray-600">Resolved At</p>
                <p className="font-medium">{new Date(dispute.resolution.resolvedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-600 text-sm">Details</p>
              <p className="text-sm">{dispute.resolution.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Actions</h4>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusChange(dispute.id, 'INVESTIGATING')}
            >
              Start Investigation
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusChange(dispute.id, 'ESCALATED')}
            >
              Escalate
            </Button>
            <Button 
              size="sm"
              onClick={onResolve}
            >
              Resolve Dispute
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResolveDisputeDialog({ 
  dispute, 
  open, 
  onOpenChange, 
  onSuccess 
}: {
  dispute: BillingDispute;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [resolution, setResolution] = useState({
    outcome: '',
    amount: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await revenueManagementService.resolveBillingDispute(dispute.id, {
        ...resolution,
        amount: resolution.amount ? parseFloat(resolution.amount) : undefined
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Dispute</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Resolution Outcome</label>
            <Select value={resolution.outcome} onValueChange={(value) => setResolution({ ...resolution, outcome: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REFUND_ISSUED">Refund Issued</SelectItem>
                <SelectItem value="CREDIT_APPLIED">Credit Applied</SelectItem>
                <SelectItem value="DISPUTE_DISMISSED">Dispute Dismissed</SelectItem>
                <SelectItem value="PLAN_ADJUSTED">Plan Adjusted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(resolution.outcome === 'REFUND_ISSUED' || resolution.outcome === 'CREDIT_APPLIED') && (
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={resolution.amount}
                onChange={(e) => setResolution({ ...resolution, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Resolution Details</label>
            <Textarea
              value={resolution.details}
              onChange={(e) => setResolution({ ...resolution, details: e.target.value })}
              placeholder="Explain the resolution..."
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Resolve Dispute
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    OPEN: 'red',
    INVESTIGATING: 'yellow',
    RESOLVED: 'green',
    ESCALATED: 'purple',
    CLOSED: 'gray'
  };
  return colors[status] || 'gray';
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    LOW: 'gray',
    MEDIUM: 'blue',
    HIGH: 'orange',
    URGENT: 'red'
  };
  return colors[priority] || 'gray';
}

function getDisputeTypeColor(type: string) {
  const colors: Record<string, string> = {
    BILLING_ERROR: 'red',
    UNAUTHORIZED_CHARGE: 'purple',
    SERVICE_ISSUE: 'orange',
    REFUND_REQUEST: 'blue',
    PRICING_DISPUTE: 'yellow'
  };
  return colors[type] || 'gray';
}