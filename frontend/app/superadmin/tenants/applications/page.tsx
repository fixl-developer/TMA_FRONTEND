'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { FilterPanel } from '@/shared/components/ui/FilterPanel';
import { tenantLifecycleService, type TenantApplication } from '@/shared/services/tenantLifecycleService';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Building,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Download
} from 'lucide-react';

export default function TenantApplicationsPage() {
  const [applications, setApplications] = useState<TenantApplication[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    businessType: '',
    country: '',
    riskLevel: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, statsData] = await Promise.all([
        tenantLifecycleService.getTenantApplications(filters),
        tenantLifecycleService.getTenantLifecycleStats()
      ]);
      setApplications(appsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewApplication = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const reason = action === 'REJECT' ? prompt('Rejection reason:') : undefined;
      if (action === 'REJECT' && !reason) return;
      
      await tenantLifecycleService.reviewTenantApplication(id, action, {
        reviewedBy: 'current-admin@platform.com',
        rejectionReason: reason,
        notes: `${action} by superadmin`
      });
      
      loadData();
    } catch (error) {
      console.error('Failed to review application:', error);
    }
  };

  const handleProvisionTenant = async (applicationId: string) => {
    try {
      const result = await tenantLifecycleService.provisionTenant(applicationId);
      alert(`Tenant provisioned successfully!\nTenant ID: ${result.tenantId}\nSubdomain: ${result.subdomain}`);
      loadData();
    } catch (error) {
      console.error('Failed to provision tenant:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'yellow',
      UNDER_REVIEW: 'blue',
      APPROVED: 'green',
      REJECTED: 'red',
      PROVISIONING: 'purple',
      ACTIVE: 'green'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'UNDER_REVIEW':
        return <Eye className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'PROVISIONING':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 70) return 'red';
    if (score >= 40) return 'orange';
    if (score >= 20) return 'yellow';
    return 'green';
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MODELING_AGENCY: 'Modeling Agency',
      PAGEANT_ORGANIZER: 'Pageant Organizer',
      TALENT_MANAGER: 'Talent Manager',
      ACADEMY: 'Academy',
      INFLUENCER_AGENCY: 'Influencer Agency',
      PRODUCTION_HOUSE: 'Production House',
      CASTING_AGENCY: 'Casting Agency',
      EVENT_STAFFING: 'Event Staffing',
      COMMUNITY_OPERATOR: 'Community Operator'
    };
    return labels[type] || type;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Tenant Applications"
        description="Review and manage tenant onboarding applications"
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
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold mt-1">{stats.applications.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold mt-1">{stats.applications.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold mt-1">{stats.applications.underReview}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold mt-1">{stats.applications.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold mt-1">{stats.applications.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Provisioning</p>
                <p className="text-2xl font-bold mt-1">{stats.applications.provisioning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-500" />
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
            setFilters({ status: '', businessType: '', country: '', riskLevel: '', search: '' });
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
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search applications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
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
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PROVISIONING">Provisioning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <select
                value={filters.businessType}
                onChange={(e) => setFilters({ ...filters, businessType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="MODELING_AGENCY">Modeling Agency</option>
                <option value="PAGEANT_ORGANIZER">Pageant Organizer</option>
                <option value="TALENT_MANAGER">Talent Manager</option>
                <option value="ACADEMY">Academy</option>
                <option value="INFLUENCER_AGENCY">Influencer Agency</option>
                <option value="PRODUCTION_HOUSE">Production House</option>
                <option value="CASTING_AGENCY">Casting Agency</option>
                <option value="EVENT_STAFFING">Event Staffing</option>
                <option value="COMMUNITY_OPERATOR">Community Operator</option>
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
                <option value="LOW">Low Risk (0-29)</option>
                <option value="MEDIUM">Medium Risk (30-59)</option>
                <option value="HIGH">High Risk (60+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Countries</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </FilterPanel>
      )}

      {/* Applications List */}
      <PageSection>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters'
                : 'No tenant applications have been submitted yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{app.companyName}</h3>
                      <Badge variant={getStatusColor(app.status)} size="sm">
                        {getStatusIcon(app.status)}
                        <span className="ml-1">{app.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge variant={getRiskLevelColor(app.riskScore)} size="sm">
                        Risk: {app.riskScore}
                      </Badge>
                      {app.riskFlags.length > 0 && (
                        <Badge variant="red" size="sm">
                          {app.riskFlags.length} flags
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{getBusinessTypeLabel(app.businessType)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.status === 'PENDING' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewApplication(app.id, 'APPROVE')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewApplication(app.id, 'REJECT')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {app.status === 'APPROVED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProvisionTenant(app.id)}
                      >
                        <Building className="w-4 h-4 mr-1" />
                        Provision
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{app.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{app.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{app.contactPhone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{app.city}, {app.country}</span>
                    </div>
                    {app.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {app.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{app.expectedTalentCount} expected talent</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>${app.expectedMonthlyVolume.toLocaleString()}/month</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700">{app.businessDescription}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                    {app.reviewedAt && (
                      <span>Reviewed: {new Date(app.reviewedAt).toLocaleDateString()}</span>
                    )}
                    {app.reviewedBy && (
                      <span>By: {app.reviewedBy}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Template: {app.requestedTemplate}</span>
                    <span>Blueprints: {app.requestedBlueprints.join(', ')}</span>
                  </div>
                </div>

                {app.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </p>
                  </div>
                )}

                {app.riskFlags.length > 0 && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Risk Flags:</strong> {app.riskFlags.join(', ')}
                    </p>
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