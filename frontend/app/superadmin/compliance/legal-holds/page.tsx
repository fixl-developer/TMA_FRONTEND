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
import { complianceManagementService, type LegalHold } from '@/shared/services/complianceManagementService';
import { 
  Scale, 
  Search, 
  Download, 
  Plus,
  Eye,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function LegalHoldsPage() {
  const [holds, setHolds] = useState<LegalHold[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHold, setSelectedHold] = useState<LegalHold | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    loadHolds();
  }, [filters]);

  const loadHolds = async () => {
    setLoading(true);
    try {
      const data = await complianceManagementService.getLegalHolds(filters);
      setHolds(data);
    } catch (error) {
      console.error('Failed to load legal holds:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'red',
      RELEASED: 'green',
      EXPIRED: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'red',
      HIGH: 'orange',
      MEDIUM: 'yellow',
      LOW: 'blue'
    };
    return colors[priority] || 'gray';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      LITIGATION: 'red',
      INVESTIGATION: 'orange',
      REGULATORY: 'purple',
      AUDIT: 'blue'
    };
    return colors[type] || 'gray';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Legal Holds"
        description="Manage litigation and regulatory holds"
        icon={Scale}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Hold
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
              placeholder="Search holds..."
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
              <SelectItem value="LITIGATION">Litigation</SelectItem>
              <SelectItem value="INVESTIGATION">Investigation</SelectItem>
              <SelectItem value="REGULATORY">Regulatory</SelectItem>
              <SelectItem value="AUDIT">Audit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="RELEASED">Released</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ type: '', status: '', priority: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Holds List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Legal Holds ({holds.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : holds.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Scale className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No legal holds found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {holds.map((hold) => (
                <div key={hold.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{hold.name}</h4>
                        <Badge variant={getStatusColor(hold.status)} size="sm">
                          {hold.status === 'ACTIVE' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {hold.status === 'RELEASED' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {hold.status === 'EXPIRED' && <XCircle className="w-3 h-3 mr-1" />}
                          {hold.status}
                        </Badge>
                        <Badge variant={getPriorityColor(hold.priority)} size="sm">{hold.priority}</Badge>
                        <Badge variant={getTypeColor(hold.type)} size="sm">{hold.type}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{hold.description}</p>
                      
                      {hold.legalCase && (
                        <p className="text-sm font-medium text-blue-600 mb-3">
                          <FileText className="w-4 h-4 inline mr-1" />
                          {hold.legalCase}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created
                          </p>
                          <p className="text-gray-600">{new Date(hold.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Custodians
                          </p>
                          <p className="text-gray-600">{hold.custodians.length} people</p>
                        </div>
                        <div>
                          <p className="font-medium">Records Preserved</p>
                          <p className="text-gray-600">
                            {hold.preservationActions.reduce((sum, action) => sum + action.recordsPreserved, 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Data Scope</p>
                          <p className="text-gray-600">
                            {hold.dataScope.users.length} users, {hold.dataScope.tenants.length} tenants
                          </p>
                        </div>
                      </div>

                      {hold.expiryDate && hold.status === 'ACTIVE' && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Expires on {new Date(hold.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedHold(hold)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[800px] sm:w-[800px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Hold Details</SheetTitle>
                          </SheetHeader>
                          {selectedHold && <HoldDetails hold={selectedHold} />}
                        </SheetContent>
                      </Sheet>
                      {hold.status === 'ACTIVE' && (
                        <Button variant="outline" size="sm">
                          Release Hold
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

function HoldDetails({ hold }: { hold: LegalHold }) {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h4 className="font-semibold mb-3">Hold Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Hold ID</p>
            <p className="font-medium">{hold.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{hold.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <Badge variant={getTypeColor(hold.type)} size="sm">{hold.type}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(hold.status)} size="sm">{hold.status}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Priority</p>
            <Badge variant={getPriorityColor(hold.priority)} size="sm">{hold.priority}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Created By</p>
            <p className="font-medium">{hold.createdBy}</p>
          </div>
        </div>
      </div>

      {hold.legalCase && (
        <div>
          <h4 className="font-semibold mb-3">Legal Case</h4>
          <p className="text-sm font-medium text-blue-600">{hold.legalCase}</p>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{hold.description}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Custodians ({hold.custodians.length})</h4>
        <div className="flex flex-wrap gap-2">
          {hold.custodians.map((custodian, index) => (
            <Badge key={index} variant="blue" size="sm">
              <Users className="w-3 h-3 mr-1" />
              {custodian}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Data Scope</h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Date Range</p>
            <p className="text-gray-600">
              {new Date(hold.dataScope.dateRange.start).toLocaleDateString()} - {new Date(hold.dataScope.dateRange.end).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-medium">Users ({hold.dataScope.users.length})</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {hold.dataScope.users.map((user, index) => (
                <Badge key={index} variant="outline" size="sm">{user}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium">Tenants ({hold.dataScope.tenants.length})</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {hold.dataScope.tenants.map((tenant, index) => (
                <Badge key={index} variant="outline" size="sm">{tenant}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium">Data Types</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {hold.dataScope.dataTypes.map((type, index) => (
                <Badge key={index} variant="purple" size="sm">{type}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium">Keywords</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {hold.dataScope.keywords.map((keyword, index) => (
                <Badge key={index} variant="yellow" size="sm">{keyword}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Preservation Actions</h4>
        <div className="space-y-3">
          {hold.preservationActions.map((action, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{action.action}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(action.timestamp).toLocaleDateString()} {new Date(action.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{action.details}</p>
                <p className="text-xs text-gray-500">
                  by {action.actor} • {action.recordsPreserved.toLocaleString()} records preserved
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Notifications</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-medium">{hold.notifications.sent ? 'Sent' : 'Not Sent'}</p>
          </div>
          {hold.notifications.sentAt && (
            <div>
              <p className="text-gray-600">Sent At</p>
              <p className="font-medium">{new Date(hold.notifications.sentAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
        {hold.notifications.recipients.length > 0 && (
          <div className="mt-2">
            <p className="text-gray-600 text-sm">Recipients:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {hold.notifications.recipients.map((recipient, index) => (
                <Badge key={index} variant="outline" size="sm">{recipient}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {hold.expiryDate && (
        <div>
          <h4 className="font-semibold mb-3">Expiry</h4>
          <p className="text-sm text-gray-600">
            This hold will expire on {new Date(hold.expiryDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {hold.status === 'RELEASED' && (
        <div>
          <h4 className="font-semibold mb-3">Release Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Released At</p>
              <p className="font-medium">{hold.releasedAt ? new Date(hold.releasedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Released By</p>
              <p className="font-medium">{hold.releasedBy || 'N/A'}</p>
            </div>
          </div>
          {hold.releaseReason && (
            <div className="mt-2">
              <p className="text-gray-600 text-sm">Reason:</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{hold.releaseReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    ACTIVE: 'red',
    RELEASED: 'green',
    EXPIRED: 'gray'
  };
  return colors[status] || 'gray';
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    CRITICAL: 'red',
    HIGH: 'orange',
    MEDIUM: 'yellow',
    LOW: 'blue'
  };
  return colors[priority] || 'gray';
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    LITIGATION: 'red',
    INVESTIGATION: 'orange',
    REGULATORY: 'purple',
    AUDIT: 'blue'
  };
  return colors[type] || 'gray';
}
