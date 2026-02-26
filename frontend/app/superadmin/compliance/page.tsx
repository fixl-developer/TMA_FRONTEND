'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { complianceManagementService } from '@/shared/services/complianceManagementService';
import { 
  FileText, 
  Shield, 
  Database, 
  Scale,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Activity
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

export default function CompliancePage() {
  const [stats, setStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, metricsData] = await Promise.all([
        complianceManagementService.getComplianceStats(),
        complianceManagementService.getComplianceMetrics({
          start: '2024-02-01T00:00:00Z',
          end: '2024-02-29T23:59:59Z'
        })
      ]);
      
      setStats(statsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const frameworkColors: Record<string, string> = {
    'SOC2': '#3B82F6',
    'GDPR': '#10B981',
    'ISO27001': '#8B5CF6',
    'PCI DSS': '#F59E0B'
  };

  return (
    <PageLayout>
      <PageHeader
        title="Compliance & Data Legal"
        description="Manage compliance reporting and data privacy"
        icon={FileText}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Reports</p>
                <p className="text-2xl font-bold mt-1">{stats.reports.inProgress + stats.reports.completed}</p>
                <p className="text-xs text-blue-600 mt-1">
                  <Activity className="w-3 h-3 inline mr-1" />
                  {stats.reports.inProgress} in progress
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Privacy Requests</p>
                <p className="text-2xl font-bold mt-1">{stats.privacyRequests.pending + stats.privacyRequests.inProgress}</p>
                <p className="text-xs text-orange-600 mt-1">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {stats.privacyRequests.overdue} overdue
                </p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retention Policies</p>
                <p className="text-2xl font-bold mt-1">{stats.retentionPolicies.active}</p>
                <p className="text-xs text-green-600 mt-1">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  {stats.retentionPolicies.total} total
                </p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Legal Holds</p>
                <p className="text-2xl font-bold mt-1">{stats.legalHolds.active}</p>
                <p className="text-xs text-purple-600 mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Active holds
                </p>
              </div>
              <Scale className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Compliance Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.complianceTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any, name: any) => [value, name === 'compliant' ? 'Compliant' : 'Non-Compliant']}
              />
              <Line type="monotone" dataKey="compliant" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="nonCompliant" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Privacy Request Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Request Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics?.privacyRequestTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any, name: any) => [value, name === 'received' ? 'Received' : 'Completed']}
              />
              <Bar dataKey="received" fill="#3B82F6" />
              <Bar dataKey="completed" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Framework Status */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Framework Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics?.frameworkStatus?.map((framework: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{framework.framework}</h4>
                <Badge variant={framework.status === 'Compliant' ? 'green' : 'yellow'} size="sm">
                  {framework.status}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Compliance</span>
                  <span className="font-medium">{framework.compliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${framework.compliance >= 90 ? 'bg-green-500' : framework.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${framework.compliance}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/superadmin/compliance/reports">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Compliance Reports</h3>
                <p className="text-sm text-gray-600">Audit & certification</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/compliance/privacy-requests">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">Privacy Requests</h3>
                <p className="text-sm text-gray-600">GDPR & CCPA requests</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/compliance/data-retention">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Data Retention</h3>
                <p className="text-sm text-gray-600">Retention policies</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/compliance/legal-holds">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Legal Holds</h3>
                <p className="text-sm text-gray-600">Litigation holds</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </PageLayout>
  );
}