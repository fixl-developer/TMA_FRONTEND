'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { securityManagementService } from '@/shared/services/securityManagementService';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Settings, 
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

export default function SecurityPage() {
  const [stats, setStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, metricsData, incidentsData, alertsData] = await Promise.all([
        securityManagementService.getSecurityStats(),
        securityManagementService.getSecurityMetrics({
          start: '2024-02-01T00:00:00Z',
          end: '2024-02-29T23:59:59Z'
        }),
        securityManagementService.getSecurityIncidents({ search: '' }),
        securityManagementService.getThreatAlerts({ search: '' })
      ]);
      
      setStats(statsData);
      setMetrics(metricsData);
      setRecentIncidents(incidentsData.slice(0, 5));
      setRecentAlerts(alertsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'red',
      HIGH: 'orange',
      MEDIUM: 'yellow',
      LOW: 'blue'
    };
    return colors[severity] || 'gray';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'red',
      NEW: 'red',
      INVESTIGATING: 'yellow',
      RESOLVED: 'green',
      CLOSED: 'gray',
      CONFIRMED: 'orange',
      FALSE_POSITIVE: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'NEW':
        return <AlertTriangle className="w-4 h-4" />;
      case 'INVESTIGATING':
        return <Clock className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Mock data for charts
  const incidentTrends = metrics?.incidentTrends || [
    { date: '2024-02-01', incidents: 3, resolved: 2 },
    { date: '2024-02-08', incidents: 5, resolved: 4 },
    { date: '2024-02-15', incidents: 2, resolved: 3 },
    { date: '2024-02-22', incidents: 4, resolved: 3 }
  ];

  const threatDistribution = metrics?.threatDistribution || [
    { type: 'Suspicious Login', count: 15, percentage: 35, color: '#EF4444' },
    { type: 'Brute Force', count: 12, percentage: 28, color: '#F97316' },
    { type: 'API Abuse', count: 8, percentage: 19, color: '#EAB308' },
    { type: 'Data Exfiltration', count: 5, percentage: 12, color: '#8B5CF6' },
    { type: 'Malware', count: 3, percentage: 7, color: '#6B7280' }
  ];

  const complianceData = [
    { name: 'Compliant', value: metrics?.complianceStatus?.compliant || 65, color: '#10B981' },
    { name: 'Partially Compliant', value: metrics?.complianceStatus?.partiallyCompliant || 25, color: '#F59E0B' },
    { name: 'Non-Compliant', value: metrics?.complianceStatus?.nonCompliant || 10, color: '#EF4444' }
  ];

  const riskScoreHistory = metrics?.riskScoreHistory || [
    { date: '2024-02-01', score: 75 },
    { date: '2024-02-08', score: 72 },
    { date: '2024-02-15', score: 68 },
    { date: '2024-02-22', score: 65 }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Security Management"
        description="Monitor security incidents, threats, and compliance"
        icon={Shield}
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
            <Button>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Create Incident
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
                <p className="text-sm text-gray-600">Active Incidents</p>
                <p className="text-2xl font-bold mt-1">{stats.incidents.open + stats.incidents.investigating}</p>
                <p className="text-xs text-red-600 mt-1">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {stats.incidents.critical} critical
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Threat Alerts</p>
                <p className="text-2xl font-bold mt-1">{stats.threats.new + stats.threats.investigating}</p>
                <p className="text-xs text-orange-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Avg risk: {stats.threats.avgRiskScore}
                </p>
              </div>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Access Reviews</p>
                <p className="text-2xl font-bold mt-1">{stats.reviews.pending + stats.reviews.inProgress}</p>
                <p className="text-xs text-blue-600 mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {stats.reviews.overdue} overdue
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-2xl font-bold mt-1">{Math.round((stats.configurations.compliant / stats.configurations.total) * 100)}%</p>
                <p className="text-xs text-green-600 mt-1">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  {stats.configurations.compliant}/{stats.configurations.total} compliant
                </p>
              </div>
              <Settings className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Incident Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security Incident Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incidentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any, name: any) => [value, name === 'incidents' ? 'New Incidents' : 'Resolved']}
              />
              <Line type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Threat Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Threat Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threatDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {threatDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any, name: any, props: any) => [
                `${value} alerts (${props.payload.percentage}%)`,
                props.payload.type
              ]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {threatDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.type}: {entry.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk Score and Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Score History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security Risk Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={riskScoreHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [`${value}/100`, 'Risk Score']}
              />
              <Area type="monotone" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Compliance Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {complianceData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link href="/superadmin/security/incidents">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Security Incidents</h3>
                <p className="text-sm text-gray-600">Manage security incidents</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/security/threats">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">Threat Monitoring</h3>
                <p className="text-sm text-gray-600">Monitor threat alerts</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/security/access-reviews">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Access Reviews</h3>
                <p className="text-sm text-gray-600">Review user access</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/security/configurations">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Security Config</h3>
                <p className="text-sm text-gray-600">Manage security settings</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Security Incidents</h3>
            <Link href="/superadmin/security/incidents">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{incident.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{incident.type.replace('_', ' ')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusColor(incident.status)} size="sm">
                        {getStatusIcon(incident.status)}
                        <span className="ml-1">{incident.status}</span>
                      </Badge>
                      <Badge variant={getSeverityColor(incident.severity)} size="sm">
                        {incident.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(incident.detectedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {incident.affectedUsers} users affected
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Threat Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Threat Alerts</h3>
            <Link href="/superadmin/security/threats">
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
                    <p className="text-xs text-gray-600 mt-1">{alert.source} • {alert.type.replace('_', ' ')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusColor(alert.status)} size="sm">
                        {getStatusIcon(alert.status)}
                        <span className="ml-1">{alert.status}</span>
                      </Badge>
                      <Badge variant={getSeverityColor(alert.severity)} size="sm">
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Risk: {alert.riskScore}/100</p>
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