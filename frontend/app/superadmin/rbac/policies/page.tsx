'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { FilterPanel } from '@/shared/components/ui/FilterPanel';
import { rbacService, type PolicyRule } from '@/shared/services/rbacService';
import { 
  FileCode, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  });

  useEffect(() => {
    loadData();
  }, [filters, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await rbacService.getPolicyRules({ ...filters, search: searchQuery });
      setPolicies(data);
    } catch (error) {
      console.error('Failed to load policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = () => {
    // TODO: Open policy editor
    console.log('Create policy');
  };

  const handleEditPolicy = (policy: PolicyRule) => {
    // TODO: Open policy editor
    console.log('Edit policy:', policy);
  };

  const handleDeletePolicy = async (policy: PolicyRule) => {
    if (confirm(`Are you sure you want to delete policy "${policy.name}"?`)) {
      try {
        await rbacService.deletePolicyRule(policy.id);
        loadData();
      } catch (error) {
        console.error('Failed to delete policy:', error);
      }
    }
  };

  const handleToggleStatus = async (policy: PolicyRule) => {
    try {
      const newStatus = policy.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
      await rbacService.updatePolicyRule(policy.id, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Failed to toggle policy status:', error);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      RBAC: 'blue',
      ABAC: 'purple',
      HYBRID: 'indigo'
    };
    return colors[type] || 'gray';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'green',
      DRAFT: 'yellow',
      DISABLED: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getEffectColor = (effect: string) => {
    return effect === 'ALLOW' ? 'green' : 'red';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Policy Management"
        description="Manage RBAC and ABAC policy rules"
        icon={FileCode}
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
            <Button onClick={handleCreatePolicy}>
              <Plus className="w-4 h-4 mr-2" />
              Create Policy
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold mt-1">{policies.length}</p>
            </div>
            <FileCode className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold mt-1">
                {policies.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold mt-1">
                {policies.filter(p => p.status === 'DRAFT').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disabled</p>
              <p className="text-2xl font-bold mt-1">
                {policies.filter(p => p.status === 'DISABLED').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          onApply={() => setShowFilters(false)}
          onReset={() => {
            setFilters({ type: '', status: '' });
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
                  placeholder="Search policies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="RBAC">RBAC</option>
                <option value="ABAC">ABAC</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          </div>
        </FilterPanel>
      )}

      {/* Policies List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading policies...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-12">
            <FileCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filters.type || filters.status
                ? 'Try adjusting your filters'
                : 'Get started by creating your first policy'}
            </p>
            {!searchQuery && !filters.type && !filters.status && (
              <Button onClick={handleCreatePolicy}>
                <Plus className="w-4 h-4 mr-2" />
                Create Policy
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy) => (
              <Card key={policy.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{policy.name}</h3>
                      <Badge variant={getTypeColor(policy.type)} size="sm">
                        {policy.type}
                      </Badge>
                      <Badge variant={getStatusColor(policy.status)} size="sm">
                        {policy.status}
                      </Badge>
                      <Badge variant={getEffectColor(policy.effect)} size="sm">
                        {policy.effect}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Priority: {policy.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{policy.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(policy)}
                      title={policy.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                    >
                      {policy.status === 'ACTIVE' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPolicy(policy)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePolicy(policy)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Conditions
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm text-gray-800 font-mono">
                        {policy.conditions}
                      </code>
                    </div>
                  </div>

                  {policy.obligations && policy.obligations.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">
                        Obligations
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {policy.obligations.map((obligation, idx) => (
                          <Badge key={idx} variant="purple" size="sm">
                            {obligation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <span>Created: {new Date(policy.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(policy.updatedAt).toLocaleDateString()}</span>
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
