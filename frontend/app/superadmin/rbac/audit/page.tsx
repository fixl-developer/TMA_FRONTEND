'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { FilterPanel } from '@/shared/components/ui/FilterPanel';
import { rbacService, type AuditLogEntry } from '@/shared/services/rbacService';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Shield,
  Activity
} from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    actor: '',
    action: '',
    resource: '',
    riskLevel: '',
    result: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await rbacService.getAuditLogs(filters);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await rbacService.exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const getRiskLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      LOW: 'green',
      MEDIUM: 'yellow',
      HIGH: 'orange',
      CRITICAL: 'red'
    };
    return colors[level] || 'gray';
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'FAILURE':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'DENIED':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getResultColor = (result: string) => {
    const colors: Record<string, string> = {
      SUCCESS: 'green',
      FAILURE: 'red',
      DENIED: 'orange'
    };
    return colors[result] || 'gray';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Audit Logs"
        description="Track all access control and security events"
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
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold mt-1">{logs.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success</p>
              <p className="text-2xl font-bold mt-1">
                {logs.filter(l => l.result === 'SUCCESS').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Denied</p>
              <p className="text-2xl font-bold mt-1">
                {logs.filter(l => l.result === 'DENIED').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Risk</p>
              <p className="text-2xl font-bold mt-1">
                {logs.filter(l => l.riskLevel === 'CRITICAL').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          onApply={() => setShowFilters(false)}
          onReset={() => {
            setFilters({
              actor: '',
              action: '',
              resource: '',
              riskLevel: '',
              result: '',
              startDate: '',
              endDate: ''
            });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actor (User)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.actor}
                  onChange={(e) => setFilters({ ...filters, actor: e.target.value })}
                  placeholder="Search by user..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                placeholder="e.g., finance.escrow.release"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select
                value={filters.resource}
                onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Resources</option>
                <option value="tenant">Tenant</option>
                <option value="escrow">Escrow</option>
                <option value="payout">Payout</option>
                <option value="submission">Submission</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Levels</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result
              </label>
              <select
                value={filters.result}
                onChange={(e) => setFilters({ ...filters, result: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Results</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILURE">Failure</option>
                <option value="DENIED">Denied</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </FilterPanel>
      )}

      {/* Logs List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getResultIcon(log.result)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-blue-600">
                            {log.action}
                          </code>
                          <Badge variant={getResultColor(log.result)} size="sm">
                            {log.result}
                          </Badge>
                          <Badge variant={getRiskLevelColor(log.riskLevel)} size="sm">
                            {log.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {log.actor}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            {log.actorRole}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Resource:</span>
                        <span className="ml-1 font-medium">{log.resource}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Resource ID:</span>
                        <span className="ml-1 font-medium">{log.resourceId}</span>
                      </div>
                      {log.tenantId && (
                        <div>
                          <span className="text-gray-500">Tenant:</span>
                          <span className="ml-1 font-medium">{log.tenantId}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">IP:</span>
                        <span className="ml-1 font-mono text-xs">{log.ipAddress}</span>
                      </div>
                    </div>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Metadata
                        </p>
                        <div className="space-y-1">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2 text-sm">
                              <span className="text-gray-600 font-medium">{key}:</span>
                              <span className="text-gray-900">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value) 
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  );
}
