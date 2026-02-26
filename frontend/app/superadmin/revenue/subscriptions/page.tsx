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
import { revenueManagementService, type Subscription } from '@/shared/services/revenueManagementService';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  Pause,
  Play,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Building,
  Mail,
  Phone
} from 'lucide-react';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
    billingCycle: '',
    search: ''
  });

  useEffect(() => {
    loadSubscriptions();
  }, [filters]);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await revenueManagementService.getSubscriptions(filters);
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: string, reason?: string) => {
    try {
      await revenueManagementService.updateSubscriptionStatus(subscriptionId, newStatus, reason);
      loadSubscriptions();
    } catch (error) {
      console.error('Failed to update subscription status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'green',
      TRIALING: 'blue',
      PAST_DUE: 'orange',
      CANCELLED: 'red',
      SUSPENDED: 'gray'
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

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Subscription Management"
        description="Manage platform subscriptions and billing"
        icon={CreditCard}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Subscription
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
              placeholder="Search subscriptions..."
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
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="TRIALING">Trialing</SelectItem>
              <SelectItem value="PAST_DUE">Past Due</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.plan} onValueChange={(value) => setFilters({ ...filters, plan: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Plans</SelectItem>
              <SelectItem value="STARTER">Starter</SelectItem>
              <SelectItem value="GROWTH">Growth</SelectItem>
              <SelectItem value="PRO">Pro</SelectItem>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.billingCycle} onValueChange={(value) => setFilters({ ...filters, billingCycle: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Cycles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cycles</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="QUARTERLY">Quarterly</SelectItem>
              <SelectItem value="ANNUALLY">Annually</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ status: '', plan: '', billingCycle: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Subscriptions ({subscriptions.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No subscriptions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{subscription.tenantName}</h4>
                        <Badge variant={getStatusColor(subscription.status)} size="sm">
                          {subscription.status}
                        </Badge>
                        <Badge variant={getPlanColor(subscription.plan)} size="sm">
                          {subscription.plan}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium">Billing</p>
                          <p>${subscription.finalPrice}/{subscription.billingCycle.toLowerCase()}</p>
                          {subscription.discountPercent > 0 && (
                            <p className="text-green-600">-{subscription.discountPercent}% discount</p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Next Billing</p>
                          <p>{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                          {subscription.trialEndDate && (
                            <p className="text-blue-600">Trial ends: {new Date(subscription.trialEndDate).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Usage</p>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Users:</span>
                              <span className={getUsageColor(getUsagePercentage(subscription.usage.users, subscription.limits.users))}>
                                {subscription.usage.users}/{subscription.limits.users}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Talent:</span>
                              <span className={getUsageColor(getUsagePercentage(subscription.usage.talent, subscription.limits.talent))}>
                                {subscription.usage.talent}/{subscription.limits.talent}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Payment</p>
                          <p>{subscription.paymentMethod.type}</p>
                          {subscription.paymentMethod.last4 && (
                            <p>****{subscription.paymentMethod.last4}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedSubscription(subscription)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[600px]">
                          <SheetHeader>
                            <SheetTitle>Subscription Details</SheetTitle>
                          </SheetHeader>
                          {selectedSubscription && (
                            <SubscriptionDetails subscription={selectedSubscription} onStatusChange={handleStatusChange} />
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      {subscription.status === 'ACTIVE' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(subscription.id, 'SUSPENDED', 'Manual suspension')}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {subscription.status === 'SUSPENDED' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(subscription.id, 'ACTIVE', 'Manual reactivation')}
                        >
                          <Play className="w-4 h-4" />
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
    </PageLayout>
  );
}

function SubscriptionDetails({ subscription, onStatusChange }: { 
  subscription: Subscription; 
  onStatusChange: (id: string, status: string, reason?: string) => void;
}) {
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const handleStatusChangeSubmit = () => {
    if (newStatus && statusChangeReason) {
      onStatusChange(subscription.id, newStatus, statusChangeReason);
      setShowStatusChange(false);
      setStatusChangeReason('');
      setNewStatus('');
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Basic Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Tenant ID</p>
            <p className="font-medium">{subscription.tenantId}</p>
          </div>
          <div>
            <p className="text-gray-600">Subscription ID</p>
            <p className="font-medium">{subscription.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Plan</p>
            <Badge variant={getPlanColor(subscription.plan)} size="sm">
              {subscription.plan}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(subscription.status)} size="sm">
              {subscription.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div>
        <h4 className="font-semibold mb-3">Billing Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Base Price</p>
            <p className="font-medium">${subscription.basePrice}</p>
          </div>
          <div>
            <p className="text-gray-600">Final Price</p>
            <p className="font-medium">${subscription.finalPrice}</p>
          </div>
          <div>
            <p className="text-gray-600">Billing Cycle</p>
            <p className="font-medium">{subscription.billingCycle}</p>
          </div>
          <div>
            <p className="text-gray-600">Currency</p>
            <p className="font-medium">{subscription.currency}</p>
          </div>
          <div>
            <p className="text-gray-600">Next Billing</p>
            <p className="font-medium">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
          </div>
          {subscription.trialEndDate && (
            <div>
              <p className="text-gray-600">Trial End</p>
              <p className="font-medium">{new Date(subscription.trialEndDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Usage & Limits */}
      <div>
        <h4 className="font-semibold mb-3">Usage & Limits</h4>
        <div className="space-y-3">
          {Object.entries(subscription.limits).map(([key, limit]) => {
            const usage = subscription.usage[key as keyof typeof subscription.usage];
            const percentage = Math.round((usage / limit) * 100);
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        percentage >= 90 ? 'bg-red-500' : 
                        percentage >= 75 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">
                    {usage}/{limit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h4 className="font-semibold mb-3">Payment Method</h4>
        <div className="text-sm">
          <p><span className="text-gray-600">Type:</span> {subscription.paymentMethod.type}</p>
          {subscription.paymentMethod.last4 && (
            <p><span className="text-gray-600">Card:</span> ****{subscription.paymentMethod.last4}</p>
          )}
          {subscription.paymentMethod.brand && (
            <p><span className="text-gray-600">Brand:</span> {subscription.paymentMethod.brand}</p>
          )}
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <h4 className="font-semibold mb-3">Billing Address</h4>
        <div className="text-sm">
          {subscription.billingAddress.company && (
            <p>{subscription.billingAddress.company}</p>
          )}
          <p>{subscription.billingAddress.street}</p>
          <p>{subscription.billingAddress.city}, {subscription.billingAddress.state} {subscription.billingAddress.postalCode}</p>
          <p>{subscription.billingAddress.country}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Actions</h4>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStatusChange(true)}
          >
            Change Status
          </Button>
          <Button variant="outline" size="sm">
            Update Plan
          </Button>
          <Button variant="outline" size="sm">
            View Invoices
          </Button>
        </div>
      </div>

      {/* Status Change Dialog */}
      {showStatusChange && (
        <Dialog open={showStatusChange} onOpenChange={setShowStatusChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Subscription Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">New Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  value={statusChangeReason}
                  onChange={(e) => setStatusChangeReason(e.target.value)}
                  placeholder="Enter reason for status change..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowStatusChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChangeSubmit}>
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function getPlanColor(plan: string) {
  const colors: Record<string, string> = {
    STARTER: 'gray',
    GROWTH: 'blue',
    PRO: 'purple',
    ENTERPRISE: 'indigo'
  };
  return colors[plan] || 'gray';
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    ACTIVE: 'green',
    TRIALING: 'blue',
    PAST_DUE: 'orange',
    CANCELLED: 'red',
    SUSPENDED: 'gray'
  };
  return colors[status] || 'gray';
}