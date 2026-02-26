'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { FilterPanel } from '@/shared/components/ui/FilterPanel';
import { rbacService, type Permission } from '@/shared/services/rbacService';
import { 
  Key, 
  Plus, 
  Search, 
  Filter, 
  Shield, 
  AlertTriangle,
  Lock,
  FileText,
  Eye
} from 'lucide-react';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    domain: '',
    category: '',
    riskLevel: ''
  });

  useEffect(() => {
    loadData();
  }, [filters, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [permsData, statsData] = await Promise.all([
        rbacService.getPermissions({ ...filters, search: searchQuery }),
        rbacService.getPermissionStats()
      ]);
      setPermissions(permsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePermission = () => {
    // TODO: Open create permission dialog
    console.log('Create permission');
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

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4" />;
      case 'HIGH':
        return <Shield className="w-4 h-4" />;
      case 'MEDIUM':
        return <Lock className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <PageLayout>
      <PageHeader
        title="Permission Management"
        description="Manage capabilities and access controls"
        icon={Key}
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
            <Button onClick={handleCreatePermission}>
              <Plus className="w-4 h-4 mr-2" />
              Create Permission
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Key className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Risk</p>
                <p className="text-2xl font-bold mt-1">{stats.byRiskLevel.LOW}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medium Risk</p>
                <p className="text-2xl font-bold mt-1">{stats.byRiskLevel.MEDIUM}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold mt-1">{stats.byRiskLevel.HIGH}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold mt-1">{stats.byRiskLevel.CRITICAL}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          onApply={() => setShowFilters(false)}
          onReset={() => {
            setFilters({ domain: '', category: '', riskLevel: '' });
            setSearchQuery('');
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search permissions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <select
                value={filters.domain}
                onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Domains</option>
                <option value="platform">Platform</option>
                <option value="admin">Admin</option>
                <option value="crm">CRM</option>
                <option value="contracts">Contracts</option>
                <option value="finance">Finance</option>
                <option value="casting">Casting</option>
                <option value="pageant">Pageant</option>
                <option value="campaign">Campaign</option>
                <option value="community">Community</option>
                <option value="talent">Talent</option>
                <option value="booking">Booking</option>
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
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {stats && Object.keys(stats.byCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </FilterPanel>
      )}

      {/* Permissions List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading permissions...</p>
          </div>
        ) : permissions.length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No permissions found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filters.domain || filters.riskLevel
                ? 'Try adjusting your filters'
                : 'Get started by creating your first permission'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, perms]) => (
              <Card key={category} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                  <Badge variant="gray">{perms.length} permissions</Badge>
                </div>

                <div className="space-y-2">
                  {perms.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-blue-600">{perm.key}</code>
                          <Badge 
                            variant={getRiskLevelColor(perm.riskLevel)} 
                            size="sm"
                          >
                            {getRiskLevelIcon(perm.riskLevel)}
                            <span className="ml-1">{perm.riskLevel}</span>
                          </Badge>
                          {perm.requiresMFA && (
                            <Badge variant="orange" size="sm">
                              <Lock className="w-3 h-3 mr-1" />
                              MFA
                            </Badge>
                          )}
                          {perm.requiresApproval && (
                            <Badge variant="red" size="sm">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Approval
                            </Badge>
                          )}
                          {perm.requiresEvidence && (
                            <Badge variant="purple" size="sm">
                              <FileText className="w-3 h-3 mr-1" />
                              Evidence
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{perm.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            Domain: <span className="font-medium">{perm.domain}</span>
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            Resource: <span className="font-medium">{perm.resource}</span>
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            Action: <span className="font-medium">{perm.action}</span>
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            Audit: <span className="font-medium">{perm.auditLevel}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  );
}
