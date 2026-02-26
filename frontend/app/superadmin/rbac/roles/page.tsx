'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { FilterPanel } from '@/shared/components/ui/FilterPanel';
import { rbacService, type Role } from '@/shared/services/rbacService';
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  Lock,
  Eye,
  AlertTriangle
} from 'lucide-react';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    level: '',
    isAssignable: undefined as boolean | undefined
  });

  useEffect(() => {
    loadData();
  }, [filters, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, statsData] = await Promise.all([
        rbacService.getRoles({ ...filters, search: searchQuery }),
        rbacService.getRoleStats()
      ]);
      setRoles(rolesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    // TODO: Open create role dialog
    console.log('Create role');
  };

  const handleEditRole = (role: Role) => {
    // TODO: Open edit role dialog
    console.log('Edit role:', role);
  };

  const handleDeleteRole = async (role: Role) => {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        await rbacService.deleteRole(role.id);
        loadData();
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const getRoleLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      OWN: 'red',
      ADM: 'orange',
      OPS: 'blue',
      CONTRIB: 'green',
      FIN: 'purple',
      LEGAL: 'indigo',
      MOD: 'yellow',
      VIEW: 'gray'
    };
    return colors[level] || 'gray';
  };

  const getRoleTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PLATFORM: 'red',
      TENANT: 'blue',
      TALENT: 'green',
      BRAND: 'purple',
      SYSTEM: 'gray'
    };
    return colors[type] || 'gray';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Role Management"
        description="Manage roles and permissions across the platform"
        icon={Shield}
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
            <Button onClick={handleCreateRole}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assignable</p>
                <p className="text-2xl font-bold mt-1">{stats.assignable}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requires MFA</p>
                <p className="text-2xl font-bold mt-1">{stats.requiresMFA}</p>
              </div>
              <Lock className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requires Approval</p>
                <p className="text-2xl font-bold mt-1">{stats.requiresApproval}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
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
            setFilters({ type: '', level: '', isAssignable: undefined });
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
                  placeholder="Search roles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="PLATFORM">Platform</option>
                <option value="TENANT">Tenant</option>
                <option value="TALENT">Talent</option>
                <option value="BRAND">Brand</option>
                <option value="SYSTEM">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permission Level
              </label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Levels</option>
                <option value="OWN">Owner</option>
                <option value="ADM">Admin</option>
                <option value="OPS">Operations</option>
                <option value="CONTRIB">Contributor</option>
                <option value="FIN">Finance</option>
                <option value="LEGAL">Legal</option>
                <option value="MOD">Moderator</option>
                <option value="VIEW">View Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignable
              </label>
              <select
                value={filters.isAssignable === undefined ? '' : filters.isAssignable.toString()}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  isAssignable: e.target.value === '' ? undefined : e.target.value === 'true'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                <option value="true">Assignable</option>
                <option value="false">System Only</option>
              </select>
            </div>
          </div>
        </FilterPanel>
      )}

      {/* Roles Grid */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading roles...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filters.type || filters.level
                ? 'Try adjusting your filters'
                : 'Get started by creating your first role'}
            </p>
            {!searchQuery && !filters.type && !filters.level && (
              <Button onClick={handleCreateRole}>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      {role.isSystem && (
                        <Badge variant="gray" size="sm">System</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{role.key}</p>
                  </div>
                  {!role.isSystem && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {role.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={getRoleTypeColor(role.type)} size="sm">
                    {role.type}
                  </Badge>
                  <Badge variant={getRoleLevelColor(role.level)} size="sm">
                    {role.level}
                  </Badge>
                  {role.requiresMFA && (
                    <Badge variant="orange" size="sm">
                      <Lock className="w-3 h-3 mr-1" />
                      MFA
                    </Badge>
                  )}
                  {role.requiresApproval && (
                    <Badge variant="red" size="sm">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Approval
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {role.capabilities.length} capabilities
                  </span>
                  {role.maxUsers && (
                    <span className="text-gray-600">
                      Max: {role.maxUsers} users
                    </span>
                  )}
                </div>

                {role.isAssignable && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      View Assignments
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  );
}
