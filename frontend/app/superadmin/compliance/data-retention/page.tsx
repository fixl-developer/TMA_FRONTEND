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
import { complianceManagementService, type DataRetentionPolicy } from '@/shared/services/complianceManagementService';
import { 
  Database, 
  Search, 
  Download, 
  Plus,
  Eye,
  Play,
  Calendar,
  HardDrive,
  Clock,
  Shield
} from 'lucide-react';

export default function DataRetentionPage() {
  const [policies, setPolicies] = useState<DataRetentionPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<DataRetentionPolicy | null>(null);
  const [filters, setFilters] = useState({
    dataType: '',
    category: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadPolicies();
  }, [filters]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await complianceManagementService.getDataRetentionPolicies(filters);
      setPolicies(data);
    } catch (error) {
      console.error('Failed to load retention policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'green',
      DRAFT: 'yellow',
      ARCHIVED: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      PERSONAL: 'blue',
      FINANCIAL: 'green',
      OPERATIONAL: 'purple',
      SECURITY: 'red',
      MARKETING: 'orange'
    };
    return colors[category] || 'gray';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Data Retention Policies"
        description="Manage data retention and deletion schedules"
        icon={Database}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Policy
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
              placeholder="Search policies..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.dataType} onValueChange={(value) => setFilters({ ...filters, dataType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Data Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Data Types</SelectItem>
              <SelectItem value="USER_DATA">User Data</SelectItem>
              <SelectItem value="TRANSACTION_DATA">Transaction Data</SelectItem>
              <SelectItem value="LOG_DATA">Log Data</SelectItem>
              <SelectItem value="BACKUP_DATA">Backup Data</SelectItem>
              <SelectItem value="ANALYTICS_DATA">Analytics Data</SelectItem>
              <SelectItem value="COMMUNICATION_DATA">Communication Data</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="PERSONAL">Personal</SelectItem>
              <SelectItem value="FINANCIAL">Financial</SelectItem>
              <SelectItem value="OPERATIONAL">Operational</SelectItem>
              <SelectItem value="SECURITY">Security</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ dataType: '', category: '', status: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Policies List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Retention Policies ({policies.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No retention policies found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{policy.name}</h4>
                        <Badge variant={getStatusColor(policy.status)} size="sm">{policy.status}</Badge>
                        <Badge variant={getCategoryColor(policy.category)} size="sm">{policy.category}</Badge>
                        <Badge variant="outline" size="sm">{policy.dataType.replace('_', ' ')}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Retention Period
                          </p>
                          <p className="text-gray-600">{policy.retentionPeriod} {policy.retentionUnit.toLowerCase()}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <HardDrive className="w-4 h-4" />
                            Data Volume
                          </p>
                          <p className="text-gray-600">{policy.dataVolume.current} {policy.dataVolume.unit}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Next Run
                          </p>
                          <p className="text-gray-600">{new Date(policy.deletionSchedule.nextRun).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            Systems
                          </p>
                          <p className="text-gray-600">{policy.affectedSystems.length} systems</p>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Auto-delete: {policy.autoDelete ? 'Yes' : 'No'}</span>
                        <span>Archive: {policy.archiveBeforeDelete ? 'Yes' : 'No'}</span>
                        <span>Frequency: {policy.deletionSchedule.frequency}</span>
                        <span>Last deleted: {policy.deletionSchedule.recordsDeleted.toLocaleString()} records</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedPolicy(policy)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[800px] sm:w-[800px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Policy Details</SheetTitle>
                          </SheetHeader>
                          {selectedPolicy && <PolicyDetails policy={selectedPolicy} />}
                        </SheetContent>
                      </Sheet>
                      {policy.status === 'ACTIVE' && (
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Run Now
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

function PolicyDetails({ policy }: { policy: DataRetentionPolicy }) {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h4 className="font-semibold mb-3">Policy Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Policy ID</p>
            <p className="font-medium">{policy.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{policy.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Data Type</p>
            <Badge variant="blue" size="sm">{policy.dataType.replace('_', ' ')}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <Badge variant={getCategoryColor(policy.category)} size="sm">{policy.category}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(policy.status)} size="sm">{policy.status}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Created By</p>
            <p className="font-medium">{policy.createdBy}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Retention Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Retention Period</p>
            <p className="font-medium">{policy.retentionPeriod} {policy.retentionUnit.toLowerCase()}</p>
          </div>
          <div>
            <p className="text-gray-600">Auto Delete</p>
            <p className="font-medium">{policy.autoDelete ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div>
            <p className="text-gray-600">Archive Before Delete</p>
            <p className="font-medium">{policy.archiveBeforeDelete ? 'Yes' : 'No'}</p>
          </div>
          {policy.archiveLocation && (
            <div>
              <p className="text-gray-600">Archive Location</p>
              <p className="font-medium text-xs">{policy.archiveLocation}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Legal Basis</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{policy.legalBasis}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Applicable Regulations</h4>
        <div className="flex flex-wrap gap-2">
          {policy.applicableRegulations.map((reg, index) => (
            <Badge key={index} variant="purple" size="sm">{reg}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Affected Systems</h4>
        <div className="flex flex-wrap gap-2">
          {policy.affectedSystems.map((system, index) => (
            <Badge key={index} variant="outline" size="sm">{system}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Data Volume</h4>
        <Card className="p-4">
          <p className="text-2xl font-bold">{policy.dataVolume.current} {policy.dataVolume.unit}</p>
          <p className="text-sm text-gray-600">Current data volume</p>
        </Card>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Deletion Schedule</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Frequency</p>
            <p className="font-medium">{policy.deletionSchedule.frequency}</p>
          </div>
          <div>
            <p className="text-gray-600">Last Run</p>
            <p className="font-medium">
              {policy.deletionSchedule.lastRun ? new Date(policy.deletionSchedule.lastRun).toLocaleDateString() : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Next Run</p>
            <p className="font-medium">{new Date(policy.deletionSchedule.nextRun).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Records Deleted (Last Run)</p>
            <p className="font-medium">{policy.deletionSchedule.recordsDeleted.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {policy.exceptions.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Exceptions</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {policy.exceptions.map((exception, index) => (
              <li key={index}>{exception}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-3">Review Schedule</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Last Reviewed</p>
            <p className="font-medium">{new Date(policy.lastReviewed).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Next Review</p>
            <p className="font-medium">{new Date(policy.nextReview).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    ACTIVE: 'green',
    DRAFT: 'yellow',
    ARCHIVED: 'gray'
  };
  return colors[status] || 'gray';
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    PERSONAL: 'blue',
    FINANCIAL: 'green',
    OPERATIONAL: 'purple',
    SECURITY: 'red',
    MARKETING: 'orange'
  };
  return colors[category] || 'gray';
}
