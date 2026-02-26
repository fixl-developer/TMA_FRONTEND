'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { rbacService, type Role, type Permission } from '@/shared/services/rbacService';
import { 
  Grid3x3, 
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function AccessControlMatrixPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleType, setSelectedRoleType] = useState<string>('TENANT');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedRoleType]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        rbacService.getRoles({ type: selectedRoleType }),
        rbacService.getPermissions({})
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Export matrix as CSV
    console.log('Export matrix');
  };

  // Filter permissions by category and search
  const filteredPermissions = permissions.filter(perm => {
    const matchesCategory = !selectedCategory || perm.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      perm.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = Array.from(new Set(permissions.map(p => p.category))).sort();

  // Check if role has permission
  const hasPermission = (role: Role, permission: Permission): boolean => {
    // Check exact match
    if (role.capabilities.includes(permission.key)) return true;
    
    // Check wildcard matches
    return role.capabilities.some(cap => {
      if (cap.endsWith('.*')) {
        const prefix = cap.slice(0, -2);
        return permission.key.startsWith(prefix);
      }
      return false;
    });
  };

  // Get permission status for role
  const getPermissionStatus = (role: Role, permission: Permission) => {
    if (hasPermission(role, permission)) {
      return {
        granted: true,
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        color: 'bg-green-50'
      };
    }
    
    // Check if permission is too risky for role level
    if (permission.riskLevel === 'CRITICAL' && !['OWN', 'ADM'].includes(role.level)) {
      return {
        granted: false,
        icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        color: 'bg-orange-50'
      };
    }
    
    return {
      granted: false,
      icon: <XCircle className="w-5 h-5 text-gray-300" />,
      color: 'bg-gray-50'
    };
  };

  return (
    <PageLayout>
      <PageHeader
        title="Access Control Matrix"
        description="View role-permission mappings across the platform"
        icon={Grid3x3}
        actions={
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Matrix
          </Button>
        }
      />

      {/* Controls */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Type
            </label>
            <select
              value={selectedRoleType}
              onChange={(e) => setSelectedRoleType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="PLATFORM">Platform Roles</option>
              <option value="TENANT">Tenant Roles</option>
              <option value="TALENT">Talent Roles</option>
              <option value="BRAND">Brand Roles</option>
              <option value="SYSTEM">System Roles</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permission Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Permissions
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">Granted</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-gray-300" />
            <span className="text-sm text-gray-700">Not Granted</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-700">Risk Mismatch</span>
          </div>
        </div>
      </Card>

      {/* Matrix */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading matrix...</p>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Permission
                    </th>
                    {roles.map(role => (
                      <th
                        key={role.id}
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold">{role.name}</span>
                          <Badge variant="gray" size="sm">{role.level}</Badge>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPermissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-200">
                        <div>
                          <code className="text-xs font-mono text-blue-600">
                            {permission.key}
                          </code>
                          <p className="text-xs text-gray-500 mt-1">
                            {permission.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={
                                permission.riskLevel === 'CRITICAL' ? 'red' :
                                permission.riskLevel === 'HIGH' ? 'orange' :
                                permission.riskLevel === 'MEDIUM' ? 'yellow' : 'green'
                              } 
                              size="sm"
                            >
                              {permission.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      {roles.map(role => {
                        const status = getPermissionStatus(role, permission);
                        return (
                          <td
                            key={role.id}
                            className={`px-4 py-3 text-center ${status.color}`}
                          >
                            <div className="flex justify-center">
                              {status.icon}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPermissions.length === 0 && (
              <div className="text-center py-12">
                <Grid3x3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No permissions found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Summary */}
        {!loading && filteredPermissions.length > 0 && (
          <Card className="p-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
                <p className="text-sm text-gray-600">Roles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPermissions.length}
                </p>
                <p className="text-sm text-gray-600">Permissions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {roles.length * filteredPermissions.length}
                </p>
                <p className="text-sm text-gray-600">Total Mappings</p>
              </div>
            </div>
          </Card>
        )}
      </PageSection>
    </PageLayout>
  );
}
