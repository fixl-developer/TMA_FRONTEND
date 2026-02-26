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
import { Switch } from '@/shared/components/ui/switch';
import { revenueManagementService, type PlatformFee } from '@/shared/services/revenueManagementService';
import { 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Percent,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Globe
} from 'lucide-react';

export default function PlatformFeesPage() {
  const [fees, setFees] = useState<PlatformFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFee, setSelectedFee] = useState<PlatformFee | null>(null);
  const [showCreateFee, setShowCreateFee] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    structure: '',
    isActive: '',
    search: ''
  });

  useEffect(() => {
    loadFees();
  }, [filters]);

  const loadFees = async () => {
    setLoading(true);
    try {
      const data = await revenueManagementService.getPlatformFees({
        ...filters,
        isActive: filters.isActive === '' ? undefined : filters.isActive === 'true'
      });
      setFees(data);
    } catch (error) {
      console.error('Failed to load platform fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFee = async (feeId: string) => {
    try {
      await revenueManagementService.togglePlatformFee(feeId);
      loadFees();
    } catch (error) {
      console.error('Failed to toggle fee:', error);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      TRANSACTION: 'blue',
      BOOKING: 'green',
      PAYMENT_PROCESSING: 'purple',
      SUBSCRIPTION: 'orange',
      CUSTOM: 'gray'
    };
    return colors[type] || 'gray';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CORE: 'blue',
      PREMIUM: 'purple',
      ENTERPRISE: 'indigo',
      ADDON: 'gray'
    };
    return colors[category] || 'gray';
  };

  const getStructureIcon = (structure: string) => {
    switch (structure) {
      case 'PERCENTAGE':
        return <Percent className="w-4 h-4" />;
      case 'FIXED':
        return <DollarSign className="w-4 h-4" />;
      case 'TIERED':
        return <TrendingUp className="w-4 h-4" />;
      case 'HYBRID':
        return <Settings className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatFeeValue = (fee: PlatformFee) => {
    switch (fee.structure) {
      case 'PERCENTAGE':
        return `${fee.value}%`;
      case 'FIXED':
        return `$${fee.value}`;
      case 'TIERED':
        return `${fee.value}% base`;
      case 'HYBRID':
        return `${fee.value}% + fixed`;
      default:
        return `$${fee.value}`;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Platform Fees"
        description="Configure platform fee structure and pricing"
        icon={Settings}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateFee(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Fee
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
              placeholder="Search fees..."
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
              <SelectItem value="TRANSACTION">Transaction</SelectItem>
              <SelectItem value="BOOKING">Booking</SelectItem>
              <SelectItem value="PAYMENT_PROCESSING">Payment Processing</SelectItem>
              <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
              <SelectItem value="CUSTOM">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="CORE">Core</SelectItem>
              <SelectItem value="PREMIUM">Premium</SelectItem>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              <SelectItem value="ADDON">Addon</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.structure} onValueChange={(value) => setFilters({ ...filters, structure: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Structures" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Structures</SelectItem>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              <SelectItem value="FIXED">Fixed</SelectItem>
              <SelectItem value="TIERED">Tiered</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.isActive} onValueChange={(value) => setFilters({ ...filters, isActive: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ type: '', category: '', structure: '', isActive: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Fees List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Fees ({fees.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : fees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No platform fees found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fees.map((fee) => (
                <div key={fee.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{fee.name}</h4>
                        <Badge variant={fee.isActive ? 'green' : 'gray'} size="sm">
                          {fee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant={getTypeColor(fee.type)} size="sm">
                          {fee.type}
                        </Badge>
                        <Badge variant={getCategoryColor(fee.category)} size="sm">
                          {fee.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{fee.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            {getStructureIcon(fee.structure)}
                            Structure
                          </p>
                          <p className="text-gray-600">{fee.structure}</p>
                          <p className="font-medium text-lg">{formatFeeValue(fee)}</p>
                        </div>
                        <div>
                          <p className="font-medium">Limits</p>
                          {fee.minAmount && <p className="text-gray-600">Min: ${fee.minAmount}</p>}
                          {fee.maxAmount && <p className="text-gray-600">Max: ${fee.maxAmount}</p>}
                          {!fee.minAmount && !fee.maxAmount && <p className="text-gray-600">No limits</p>}
                        </div>
                        <div>
                          <p className="font-medium">Applicable Plans</p>
                          <p className="text-gray-600">
                            {fee.applicablePlans.length === 4 ? 'All Plans' : `${fee.applicablePlans.length} plans`}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Effective Period</p>
                          <p className="text-gray-600">
                            From: {new Date(fee.effectiveFrom).toLocaleDateString()}
                          </p>
                          {fee.effectiveUntil && (
                            <p className="text-gray-600">
                              Until: {new Date(fee.effectiveUntil).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tiered Structure Details */}
                      {fee.structure === 'TIERED' && fee.tiers && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-sm mb-2">Tier Structure:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {fee.tiers.map((tier, index) => (
                              <div key={index} className="flex justify-between">
                                <span>${tier.from} - ${tier.to === 999999 ? '∞' : tier.to}:</span>
                                <span className="font-medium">{tier.rate}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedFee(fee)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[600px]">
                          <SheetHeader>
                            <SheetTitle>Fee Details</SheetTitle>
                          </SheetHeader>
                          {selectedFee && (
                            <FeeDetails fee={selectedFee} />
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleFee(fee.id)}
                      >
                        {fee.isActive ? (
                          <ToggleRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Create Fee Dialog */}
      {showCreateFee && (
        <CreateFeeDialog 
          open={showCreateFee} 
          onOpenChange={setShowCreateFee}
          onSuccess={loadFees}
        />
      )}
    </PageLayout>
  );
}

function FeeDetails({ fee }: { fee: PlatformFee }) {
  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Basic Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Fee ID</p>
            <p className="font-medium">{fee.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{fee.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <Badge variant={getTypeColor(fee.type)} size="sm">
              {fee.type}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <Badge variant={getCategoryColor(fee.category)} size="sm">
              {fee.category}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={fee.isActive ? 'green' : 'gray'} size="sm">
              {fee.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Currency</p>
            <p className="font-medium">{fee.currency}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-sm text-gray-600">{fee.description}</p>
      </div>

      {/* Fee Structure */}
      <div>
        <h4 className="font-semibold mb-3">Fee Structure</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Structure Type</p>
            <p className="font-medium">{fee.structure}</p>
          </div>
          <div>
            <p className="text-gray-600">Value</p>
            <p className="font-medium text-lg">{formatFeeValue(fee)}</p>
          </div>
          {fee.minAmount && (
            <div>
              <p className="text-gray-600">Minimum Amount</p>
              <p className="font-medium">${fee.minAmount}</p>
            </div>
          )}
          {fee.maxAmount && (
            <div>
              <p className="text-gray-600">Maximum Amount</p>
              <p className="font-medium">${fee.maxAmount}</p>
            </div>
          )}
        </div>

        {/* Tiered Structure */}
        {fee.structure === 'TIERED' && fee.tiers && (
          <div className="mt-4">
            <p className="font-medium mb-2">Tier Breakdown:</p>
            <div className="space-y-2">
              {fee.tiers.map((tier, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    ${tier.from.toLocaleString()} - {tier.to === 999999 ? '∞' : `$${tier.to.toLocaleString()}`}
                  </span>
                  <span className="font-medium">{tier.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Applicability */}
      <div>
        <h4 className="font-semibold mb-3">Applicability</h4>
        <div className="space-y-3">
          <div>
            <p className="text-gray-600 text-sm">Applicable Plans</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {fee.applicablePlans.map((plan) => (
                <Badge key={plan} variant="outline" size="sm">
                  {plan}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Applicable Regions</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {fee.applicableRegions.map((region) => (
                <Badge key={region} variant="outline" size="sm">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Effective Period */}
      <div>
        <h4 className="font-semibold mb-3">Effective Period</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Effective From</p>
            <p className="font-medium">{new Date(fee.effectiveFrom).toLocaleDateString()}</p>
          </div>
          {fee.effectiveUntil && (
            <div>
              <p className="text-gray-600">Effective Until</p>
              <p className="font-medium">{new Date(fee.effectiveUntil).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Metadata</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Created At</p>
            <p className="font-medium">{new Date(fee.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Updated At</p>
            <p className="font-medium">{new Date(fee.updatedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Created By</p>
            <p className="font-medium">{fee.createdBy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateFeeDialog({ open, onOpenChange, onSuccess }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    structure: '',
    value: '',
    minAmount: '',
    maxAmount: '',
    currency: 'USD',
    description: '',
    applicablePlans: [] as string[],
    applicableRegions: [] as string[],
    effectiveFrom: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await revenueManagementService.createPlatformFee({
        ...formData,
        value: parseFloat(formData.value),
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : undefined,
        maxAmount: formData.maxAmount ? parseFloat(formData.maxAmount) : undefined,
        isActive: true,
        effectiveFrom: new Date(formData.effectiveFrom).toISOString(),
        createdBy: 'admin@platform.com'
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create fee:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Platform Fee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSACTION">Transaction</SelectItem>
                  <SelectItem value="BOOKING">Booking</SelectItem>
                  <SelectItem value="PAYMENT_PROCESSING">Payment Processing</SelectItem>
                  <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CORE">Core</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="ADDON">Addon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Structure</label>
              <Select value={formData.structure} onValueChange={(value) => setFormData({ ...formData, structure: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                  <SelectItem value="TIERED">Tiered</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Value</label>
              <Input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Amount (optional)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Amount (optional)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.maxAmount}
                onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Effective From</label>
            <Input
              type="date"
              value={formData.effectiveFrom}
              onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    TRANSACTION: 'blue',
    BOOKING: 'green',
    PAYMENT_PROCESSING: 'purple',
    SUBSCRIPTION: 'orange',
    CUSTOM: 'gray'
  };
  return colors[type] || 'gray';
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    CORE: 'blue',
    PREMIUM: 'purple',
    ENTERPRISE: 'indigo',
    ADDON: 'gray'
  };
  return colors[category] || 'gray';
}

function formatFeeValue(fee: PlatformFee) {
  switch (fee.structure) {
    case 'PERCENTAGE':
      return `${fee.value}%`;
    case 'FIXED':
      return `$${fee.value}`;
    case 'TIERED':
      return `${fee.value}% base`;
    case 'HYBRID':
      return `${fee.value}% + fixed`;
    default:
      return `$${fee.value}`;
  }
}