'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { tenantLifecycleService, type TenantLifecycle } from '@/shared/services/tenantLifecycleService';
import { 
  Settings, 
  Search, 
  Save,
  Users,
  Database,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building,
  CreditCard,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function TenantConfigurationPage() {
  const [tenants, setTenants] = useState<TenantLifecycle[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<TenantLifecycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'limits' | 'features' | 'compliance' | 'billing'>('limits');

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const tenantsData = await tenantLifecycleService.getTenantLifecycles();
      setTenants(tenantsData.filter(t => t.status === 'ACTIVE'));
      if (tenantsData.length > 0) {
        setSelectedTenant(tenantsData[0]);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimits = async (limits: Partial<TenantLifecycle['limits']>) => {
    if (!selectedTenant) return;
    
    setSaving(true);
    try {
      const updatedTenant = await tenantLifecycleService.updateTenantLimits(selectedTenant.tenantId, limits);
      setSelectedTenant(updatedTenant);
      setTenants(tenants.map(t => t.tenantId === updatedTenant.tenantId ? updatedTenant : t));
    } catch (error) {
      console.error('Failed to update limits:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePlan = async (plan: 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE') => {
    if (!selectedTenant) return;
    
    setSaving(true);
    try {
      const updatedTenant = await tenantLifecycleService.updateTenantPlan(selectedTenant.tenantId, plan);
      setSelectedTenant(updatedTenant);
      setTenants(tenants.map(t => t.tenantId === updatedTenant.tenantId ? updatedTenant : t));
    } catch (error) {
      console.error('Failed to update plan:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.tenantId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Tenant Configuration"
        description="Configure tenant limits, features, and settings"
        icon={Settings}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tenant List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tenants..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredTenants.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No tenants found
                </div>
              ) : (
                filteredTenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTenant?.id === tenant.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{tenant.companyName}</h4>
                      <Badge variant={getPlanColor(tenant.plan)} size="sm">
                        {tenant.plan}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{tenant.tenantId}</p>
                    <p className="text-xs text-gray-500">{tenant.businessType.replace('_', ' ')}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-3">
          {selectedTenant ? (
            <div className="space-y-6">
              {/* Tenant Header */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedTenant.companyName}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>ID: {selectedTenant.tenantId}</span>
                      <span>•</span>
                      <span>{selectedTenant.businessType.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Health: {selectedTenant.healthScore}/100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getPlanColor(selectedTenant.plan)} size="sm">
                      {selectedTenant.plan} Plan
                    </Badge>
                    <Badge variant="green" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {selectedTenant.status}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Configuration Tabs */}
              <Card className="p-6">
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'limits', label: 'Limits & Usage', icon: Database },
                      { id: 'features', label: 'Features', icon: Zap },
                      { id: 'compliance', label: 'Compliance', icon: Shield },
                      { id: 'billing', label: 'Billing', icon: CreditCard }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Limits & Usage Tab */}
                {activeTab === 'limits' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Limits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Users
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              defaultValue={selectedTenant.limits.maxUsers}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              onBlur={(e) => handleUpdateLimits({ maxUsers: parseInt(e.target.value) })}
                            />
                            <span className="text-sm text-gray-500">
                              {selectedTenant.usage.users} used
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(selectedTenant.usage.users, selectedTenant.limits.maxUsers))}`}
                              style={{ width: `${getUsagePercentage(selectedTenant.usage.users, selectedTenant.limits.maxUsers)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Talent
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              defaultValue={selectedTenant.limits.maxTalent}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              onBlur={(e) => handleUpdateLimits({ maxTalent: parseInt(e.target.value) })}
                            />
                            <span className="text-sm text-gray-500">
                              {selectedTenant.usage.talent} used
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(selectedTenant.usage.talent, selectedTenant.limits.maxTalent))}`}
                              style={{ width: `${getUsagePercentage(selectedTenant.usage.talent, selectedTenant.limits.maxTalent)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Storage (GB)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              defaultValue={selectedTenant.limits.maxStorage}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              onBlur={(e) => handleUpdateLimits({ maxStorage: parseInt(e.target.value) })}
                            />
                            <span className="text-sm text-gray-500">
                              {selectedTenant.usage.storage}GB used
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(selectedTenant.usage.storage, selectedTenant.limits.maxStorage))}`}
                              style={{ width: `${getUsagePercentage(selectedTenant.usage.storage, selectedTenant.limits.maxStorage)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max API Calls (Monthly)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              defaultValue={selectedTenant.limits.maxApiCalls}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              onBlur={(e) => handleUpdateLimits({ maxApiCalls: parseInt(e.target.value) })}
                            />
                            <span className="text-sm text-gray-500">
                              {selectedTenant.usage.apiCalls.toLocaleString()} used
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(selectedTenant.usage.apiCalls, selectedTenant.limits.maxApiCalls))}`}
                              style={{ width: `${getUsagePercentage(selectedTenant.usage.apiCalls, selectedTenant.limits.maxApiCalls)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Management</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {['STARTER', 'GROWTH', 'PRO', 'ENTERPRISE'].map((plan) => (
                          <button
                            key={plan}
                            onClick={() => handleUpdatePlan(plan as any)}
                            disabled={saving}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              selectedTenant.plan === plan
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <h4 className="font-medium">{plan}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {plan === 'STARTER' && '10 users, 100 talent'}
                              {plan === 'GROWTH' && '25 users, 250 talent'}
                              {plan === 'PRO' && '50 users, 500 talent'}
                              {plan === 'ENTERPRISE' && '200 users, 2000 talent'}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Feature Flags</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'automation_enabled', label: 'Automation Engine', description: 'Enable workflow automation' },
                        { key: 'advanced_analytics', label: 'Advanced Analytics', description: 'Access to detailed analytics' },
                        { key: 'api_access', label: 'API Access', description: 'REST API access' },
                        { key: 'white_label', label: 'White Label', description: 'Custom branding options' },
                        { key: 'sso_enabled', label: 'Single Sign-On', description: 'SSO integration' },
                        { key: 'custom_domains', label: 'Custom Domains', description: 'Use custom domain names' }
                      ].map((feature) => (
                        <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{feature.label}</h4>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Tab */}
                {activeTab === 'compliance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Compliance Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">KYC Status</h4>
                            <p className="text-sm text-gray-600">Know Your Customer verification</p>
                          </div>
                          <Badge variant={selectedTenant.compliance.kycStatus === 'VERIFIED' ? 'green' : 'yellow'}>
                            {selectedTenant.compliance.kycStatus === 'VERIFIED' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            )}
                            {selectedTenant.compliance.kycStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">KYB Status</h4>
                            <p className="text-sm text-gray-600">Know Your Business verification</p>
                          </div>
                          <Badge variant={selectedTenant.compliance.kybStatus === 'VERIFIED' ? 'green' : 'yellow'}>
                            {selectedTenant.compliance.kybStatus === 'VERIFIED' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            )}
                            {selectedTenant.compliance.kybStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Data Processing Agreement</h4>
                            <p className="text-sm text-gray-600">GDPR compliance agreement</p>
                          </div>
                          <Badge variant={selectedTenant.compliance.dataProcessingAgreement ? 'green' : 'red'}>
                            {selectedTenant.compliance.dataProcessingAgreement ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {selectedTenant.compliance.dataProcessingAgreement ? 'Signed' : 'Not Signed'}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Privacy Policy</h4>
                            <p className="text-sm text-gray-600">Privacy policy acceptance</p>
                          </div>
                          <Badge variant={selectedTenant.compliance.privacyPolicyAccepted ? 'green' : 'red'}>
                            {selectedTenant.compliance.privacyPolicyAccepted ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {selectedTenant.compliance.privacyPolicyAccepted ? 'Accepted' : 'Not Accepted'}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Terms of Service</h4>
                            <p className="text-sm text-gray-600">Terms acceptance status</p>
                          </div>
                          <Badge variant={selectedTenant.compliance.termsAccepted ? 'green' : 'red'}>
                            {selectedTenant.compliance.termsAccepted ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {selectedTenant.compliance.termsAccepted ? 'Accepted' : 'Not Accepted'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Monthly Revenue</h4>
                        <p className="text-2xl font-bold">${selectedTenant.billing.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Total Revenue</h4>
                        <p className="text-2xl font-bold">${selectedTenant.billing.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Payment Status</h4>
                        <Badge variant={selectedTenant.billing.paymentStatus === 'CURRENT' ? 'green' : 'red'}>
                          {selectedTenant.billing.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-4">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">Primary Contact</h5>
                          <div className="space-y-1 text-sm">
                            <p>{selectedTenant.contacts.primary.name} ({selectedTenant.contacts.primary.role})</p>
                            <p>{selectedTenant.contacts.primary.email}</p>
                            <p>{selectedTenant.contacts.primary.phone}</p>
                          </div>
                        </div>
                        {selectedTenant.contacts.billing && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Billing Contact</h5>
                            <div className="space-y-1 text-sm">
                              <p>{selectedTenant.contacts.billing.name}</p>
                              <p>{selectedTenant.contacts.billing.email}</p>
                              <p>{selectedTenant.contacts.billing.phone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tenant</h3>
              <p className="text-gray-600">Choose a tenant from the list to configure their settings</p>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}