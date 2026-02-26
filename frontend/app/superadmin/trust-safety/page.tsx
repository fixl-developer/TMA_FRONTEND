'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { trustSafetyService } from '@/shared/services/trustSafetyService';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  Gavel,
  Bell,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Download
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

export default function TrustSafetyPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentDisputes, setRecentDisputes] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, disputesData, alertsData] = await Promise.all([
        trustSafetyService.getTrustSafetyStats(),
        trustSafetyService.getDisputes({ search: '' }),
        trustSafetyService.getSafetyAlerts({ search: '' })
      ]);
      
      setStats(statsData);
      setRecentDisputes(disputesData.slice(0, 5));
      setRecentAlerts(alertsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load trust & safety data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      LOW: 'green',
      MEDIUM: 'yellow',
      HIGH: 'orange',
      CRITICAL: 'red'
    };
    return colors[severity] || 'gray';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'red',
      INVESTIGATING: 'yellow',
      RESOLVED: 'green',
      ESCALATED: 'orange',
      NEW: 'blue',
      ACTIVE: 'orange',
      PENDING: 'yellow'
    };
    return colors[status] || 'gray';
  };

  // Mock trend data
  const disputeTrendData = [
    { date: '2024-02-18', disputes: 12, resolved: 8, escalated: 2 },
    { date: '2024-02-19', disputes: 15, resolved: 10, escalated: 3 },
    { date: '2024-02-20', disputes: 18, resolved: 12, escalated: 4 },
    { date: '2024-02-21', disputes: 14, resolved: 11, escalated: 2 },
    { date: '2024-02-22', disputes: 20, resolved: 15, escalated: 3 },
    { date: '2024-02-23', disputes: 16, resolved: 13, escalated: 2 },
    { date: '2024-02-24', disputes: 13, resolved: 10, escalated: 1 },
    { date: '2024-02-25', disputes: 11, resolved: 9, escalated: 1 }
  ];

  const categoryDistribution = [
    { name: 'Financial', value: 45, color: '#3B82F6' },
    { name: 'Behavioral', value: 30, color: '#EF4444' },
    { name: 'Content', value: 15, color: '#F59E0B' },
    { name: 'Security', value: 8, color: '#10B981' },
    { name: 'Compliance', value: 2, color: '#8B5CF6' }
  ];

  const alertTypeData = [
    { type: 'Fraud Detection', count: 15, trend: '+12%' },
    { type: 'Unusual Activity', count: 8, trend: '-5%' },
    { type: 'Policy Violation', count: 12, trend: '+8%' },
    { type: 'Security Threat', count: 3, trend: '-20%' },
    { type: 'Compliance Issue', count: 5, trend: '+25%' }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Trust & Safety"
        description="Monitor platform safety, manage disputes, and enforce policies"
        icon={Shield}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Create Alert
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
                <p className="text-sm text-gray-600">Open Disputes</p>
                <p className="text-2xl font-bold mt-1">{stats.disputes.open + stats.disputes.investigating}</p>
                <p className="text-xs text-red-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +15% this week
                </p>
              </div>
              <FileText className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold mt-1">{stats.safetyAlerts.new + stats.safetyAlerts.investigating}</p>
                <p className="text-xs text-orange-600 mt-1">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  -8% this week
                </p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enforcement Actions</p>
                <p className="text-2xl font-bold mt-1">{stats.enforcementActions.active}</p>
                <p className="text-xs text-blue-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +3 this week
                </p>
              </div>
              <Gavel className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Appeals</p>
                <p className="text-2xl font-bold mt-1">{stats.appeals.pending + stats.appeals.underReview}</p>
                <p className="text-xs text-purple-600 mt-1">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  -2 this week
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Dispute Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dispute Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={disputeTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Line type="monotone" dataKey="disputes" stroke="#EF4444" strokeWidth={2} name="New Disputes" />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
              <Line type="monotone" dataKey="escalated" stroke="#F59E0B" strokeWidth={2} name="Escalated" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dispute Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {categoryDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alert Types */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Safety Alert Types</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={alertTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link href="/superadmin/trust-safety/disputes">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Manage Disputes</h3>
                <p className="text-sm text-gray-600">Review and resolve disputes</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/trust-safety/enforcement">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Gavel className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Enforcement Actions</h3>
                <p className="text-sm text-gray-600">Manage policy enforcement</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/trust-safety/alerts">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">Safety Alerts</h3>
                <p className="text-sm text-gray-600">Monitor safety alerts</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/trust-safety/appeals">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Appeal Cases</h3>
                <p className="text-sm text-gray-600">Review appeal requests</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Disputes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Disputes</h3>
            <Link href="/superadmin/trust-safety/disputes">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDisputes.map((dispute) => (
                <div key={dispute.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{dispute.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{dispute.tenantName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getSeverityColor(dispute.severity)} size="sm">
                        {dispute.severity}
                      </Badge>
                      <Badge variant={getStatusColor(dispute.status)} size="sm">
                        {dispute.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Safety Alerts</h3>
            <Link href="/superadmin/trust-safety/alerts">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {alert.tenantName || 'Platform-wide'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getSeverityColor(alert.severity)} size="sm">
                        {alert.severity}
                      </Badge>
                      <Badge variant={getStatusColor(alert.status)} size="sm">
                        {alert.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Risk: {alert.riskScore}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(alert.detectedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}