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
import { securityManagementService, type SecurityConfiguration } from '@/shared/services/securityManagementService';
import { 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Shield,
  Lock,
  Globe,
  Server,
  Activity,
  FileText
} from 'lucide-react';

export default function SecurityConfigurationsPage() {
  const [configurations, setConfigurations] = useState<SecurityConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<SecurityConfiguration | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    complianceStatus: '',
    riskLevel: '',
    search: ''
  });

  useEffect(() => {
    loadConfigurations();
  }, [filters]);

  const loadConfigurations = async () => {
    setLoading(true);
    try {
      const data = await securityManagementService.getSecurityConfigurations(filters);
      setConfigurations(data);
    } catch (error) {
      console.error('Failed to load security configurations:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleRunComplianceCheck = async (configId: string) => {
    try {
      await securityManagementService.runComplianceCheck(configId);
      loadConfigurations();
    } catch (error) {
      console.error('Failed to run compliance check:', error);
    }
  };

  const getComplianceStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      COMPLIANT: 'green',
      PARTIALLY_COMPLIANT: 'yellow',
      NON_COMPLIANT: 'red',
      UNKNOWN: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle className="w-4 h-4" />;
      case 'PARTIALLY_COMPLIANT':
        return <AlertTriangle className="w-4 h-4" />;
      case 'NON_COMPLIANT':
        return <XCircle className="w-4 h-4" />;
      case 'UNKNOWN':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'red',
      HIGH: 'orange',
      MEDIUM: 'yellow',
      LOW: 'green'
    };
    return colors[riskLevel] || 'gray';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      AUTHENTICATION: 'blue',
      AUTHORIZATION: 'green',
      ENCRYPTION: 'purple',
      NETWORK: 'orange',
      MONITORING: 'indigo',
      BACKUP: 'gray',
      COMPLIANCE: 'red'
    };
    return colors[category] || 'gray';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AUTHENTICATION':
        return <Shield className="w-4 h-4" />;
      case 'AUTHORIZATION':
        return <Lock className="w-4 h-4" />;
      case 'ENCRYPTION':
        return <Lock className="w-4 h-4" />;
      case 'NETWORK':
        return <Globe className="w-4 h-4" />;
      case 'MONITORING':
        return <Activity className="w-4 h-4" />;
      case 'BACKUP':
        return <Server className="w-4 h-4" />;
      case 'COMPLIANCE':
        return <FileText className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };
  return (
    <PageLayout>
      <PageHeader
        title="Security Configurations"
        description="Manage security policies and compliance settings"
        icon={Settings}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadConfigurations}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Configuration
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
              placeholder="Search configurations..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
              <SelectItem value="AUTHORIZATION">Authorization</SelectItem>
              <SelectItem value="ENCRYPTION">Encryption</SelectItem>
              <SelectItem value="NETWORK">Network</SelectItem>
              <SelectItem value="MONITORING">Monitoring</SelectItem>
              <SelectItem value="BACKUP">Backup</SelectItem>
              <SelectItem value="COMPLIANCE">Compliance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.complianceStatus} onValueChange={(value) => setFilters({ ...filters, complianceStatus: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Compliance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Compliance</SelectItem>
              <SelectItem value="COMPLIANT">Compliant</SelectItem>
              <SelectItem value="PARTIALLY_COMPLIANT">Partially Compliant</SelectItem>
              <SelectItem value="NON_COMPLIANT">Non-Compliant</SelectItem>
              <SelectItem value="UNKNOWN">Unknown</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.riskLevel} onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Risk Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Risk Levels</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ category: '', complianceStatus: '', riskLevel: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Configurations List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security Configurations ({configurations.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : configurations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No security configurations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configurations.map((config) => (
                <div key={config.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          {getCategoryIcon(config.category)}
                          {config.name}
                        </h4>
                        <Badge variant={getComplianceStatusColor(config.complianceStatus)} size="sm">
                          {getComplianceStatusIcon(config.complianceStatus)}
                          <span className="ml-1">{config.complianceStatus.replace('_', ' ')}</span>
                        </Badge>
                        <Badge variant={getRiskLevelColor(config.riskLevel)} size="sm">
                          {config.riskLevel}
                        </Badge>
                        <Badge variant={getCategoryColor(config.category)} size="sm">
                          {config.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Last Checked</p>
                          <p className="text-gray-600">{new Date(config.lastChecked).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">
                            {Math.floor((Date.now() - new Date(config.lastChecked).getTime()) / (1000 * 60 * 60 * 24))} days ago
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Last Modified</p>
                          <p className="text-gray-600">{new Date(config.lastModified).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">by {config.modifiedBy}</p>
                        </div>
                        <div>
                          <p className="font-medium">Applicable Systems</p>
                          <p className="text-gray-600">{config.applicableSystems.length} systems</p>
                        </div>
                        <div>
                          <p className="font-medium">Compliance Frameworks</p>
                          <p className="text-gray-600">{config.complianceFrameworks.length} frameworks</p>
                        </div>
                      </div>

                      {/* Remediation Required */}
                      {config.remediation.required && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                          <p className="font-medium text-sm text-orange-800 mb-2">
                            Remediation Required ({config.remediation.priority} Priority)
                          </p>
                          <p className="text-sm text-orange-700 mb-2">
                            Estimated Effort: {config.remediation.estimatedEffort}
                          </p>
                          {config.remediation.dueDate && (
                            <p className="text-xs text-orange-600">
                              Due: {new Date(config.remediation.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedConfig(config)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[700px] sm:w-[700px]">
                          <SheetHeader>
                            <SheetTitle>Configuration Details</SheetTitle>
                          </SheetHeader>
                          {selectedConfig && (
                            <ConfigurationDetails 
                              config={selectedConfig} 
                              onUpdate={() => setShowUpdateDialog(true)}
                              onComplianceCheck={handleRunComplianceCheck}
                            />
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRunComplianceCheck(config.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedConfig(config);
                          setShowUpdateDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Update Configuration Dialog */}
      {showUpdateDialog && selectedConfig && (
        <UpdateConfigurationDialog
          config={selectedConfig}
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          onSuccess={loadConfigurations}
        />
      )}
    </PageLayout>
  );
}
function ConfigurationDetails({ 
  config, 
  onUpdate, 
  onComplianceCheck 
}: { 
  config: SecurityConfiguration; 
  onUpdate: () => void;
  onComplianceCheck: (id: string) => void;
}) {
  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Configuration Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Configuration ID</p>
            <p className="font-medium">{config.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <Badge variant={getCategoryColor(config.category)} size="sm">
              {getCategoryIcon(config.category)}
              <span className="ml-1">{config.category}</span>
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Compliance Status</p>
            <Badge variant={getComplianceStatusColor(config.complianceStatus)} size="sm">
              {getComplianceStatusIcon(config.complianceStatus)}
              <span className="ml-1">{config.complianceStatus.replace('_', ' ')}</span>
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Risk Level</p>
            <Badge variant={getRiskLevelColor(config.riskLevel)} size="sm">
              {config.riskLevel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{config.description}</p>
      </div>

      {/* Current vs Recommended Values */}
      <div>
        <h4 className="font-semibold mb-3">Configuration Values</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-sm mb-2">Current Value</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(config.currentValue, null, 2)}
              </pre>
            </div>
          </div>
          <div>
            <p className="font-medium text-sm mb-2">Recommended Value</p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <pre className="text-xs text-blue-700 whitespace-pre-wrap">
                {JSON.stringify(config.recommendedValue, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Applicable Systems */}
      <div>
        <h4 className="font-semibold mb-3">Applicable Systems</h4>
        <div className="flex flex-wrap gap-2">
          {config.applicableSystems.map((system, index) => (
            <Badge key={index} variant="outline" size="sm">
              {system}
            </Badge>
          ))}
        </div>
      </div>

      {/* Compliance Frameworks */}
      <div>
        <h4 className="font-semibold mb-3">Compliance Frameworks</h4>
        <div className="flex flex-wrap gap-2">
          {config.complianceFrameworks.map((framework, index) => (
            <Badge key={index} variant="outline" size="sm">
              {framework}
            </Badge>
          ))}
        </div>
      </div>

      {/* Remediation */}
      {config.remediation.required && (
        <div>
          <h4 className="font-semibold mb-3">Remediation Required</h4>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-gray-600">Priority</p>
                <Badge variant={getRiskLevelColor(config.remediation.priority)} size="sm">
                  {config.remediation.priority}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600">Estimated Effort</p>
                <p className="font-medium">{config.remediation.estimatedEffort}</p>
              </div>
              {config.remediation.assignedTo && (
                <div>
                  <p className="text-gray-600">Assigned To</p>
                  <p className="font-medium">{config.remediation.assignedTo}</p>
                </div>
              )}
              {config.remediation.dueDate && (
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-medium">{new Date(config.remediation.dueDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm mb-2">Remediation Steps:</p>
              <ul className="list-disc list-inside text-sm text-orange-700">
                {config.remediation.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Change History */}
      <div>
        <h4 className="font-semibold mb-3">Change History</h4>
        {config.history.length === 0 ? (
          <p className="text-sm text-gray-500">No changes recorded</p>
        ) : (
          <div className="space-y-3">
            {config.history.map((change, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">Configuration Updated</p>
                  <p className="text-xs text-gray-500">
                    {new Date(change.timestamp).toLocaleDateString()} {new Date(change.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-1">{change.reason}</p>
                <p className="text-xs text-gray-500">Changed by {change.changedBy}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Actions</h4>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onComplianceCheck(config.id)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Compliance Check
          </Button>
          <Button 
            size="sm"
            onClick={onUpdate}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
function UpdateConfigurationDialog({ 
  config, 
  open, 
  onOpenChange, 
  onSuccess 
}: {
  config: SecurityConfiguration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [newValue, setNewValue] = useState(JSON.stringify(config.currentValue, null, 2));
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedValue = JSON.parse(newValue);
      await securityManagementService.updateSecurityConfiguration(config.id, parsedValue, reason);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update configuration:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Update Security Configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Configuration Name</label>
            <Input value={config.name} disabled />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Current Value</label>
              <div className="bg-gray-50 p-3 rounded-lg h-48 overflow-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(config.currentValue, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Recommended Value</label>
              <div className="bg-blue-50 p-3 rounded-lg h-48 overflow-auto">
                <pre className="text-xs text-blue-700 whitespace-pre-wrap">
                  {JSON.stringify(config.recommendedValue, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">New Value (JSON)</label>
            <Textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="font-mono text-sm h-32"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Reason for Change</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this configuration is being updated..."
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Update Configuration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions for consistent styling
function getComplianceStatusColor(status: string) {
  const colors: Record<string, string> = {
    COMPLIANT: 'green',
    PARTIALLY_COMPLIANT: 'yellow',
    NON_COMPLIANT: 'red',
    UNKNOWN: 'gray'
  };
  return colors[status] || 'gray';
}

function getRiskLevelColor(riskLevel: string) {
  const colors: Record<string, string> = {
    CRITICAL: 'red',
    HIGH: 'orange',
    MEDIUM: 'yellow',
    LOW: 'green'
  };
  return colors[riskLevel] || 'gray';
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    AUTHENTICATION: 'blue',
    AUTHORIZATION: 'green',
    ENCRYPTION: 'purple',
    NETWORK: 'orange',
    MONITORING: 'indigo',
    BACKUP: 'gray',
    COMPLIANCE: 'red'
  };
  return colors[category] || 'gray';
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'AUTHENTICATION':
      return <Shield className="w-4 h-4" />;
    case 'AUTHORIZATION':
      return <Lock className="w-4 h-4" />;
    case 'ENCRYPTION':
      return <Lock className="w-4 h-4" />;
    case 'NETWORK':
      return <Globe className="w-4 h-4" />;
    case 'MONITORING':
      return <Activity className="w-4 h-4" />;
    case 'BACKUP':
      return <Server className="w-4 h-4" />;
    case 'COMPLIANCE':
      return <FileText className="w-4 h-4" />;
    default:
      return <Settings className="w-4 h-4" />;
  }
}