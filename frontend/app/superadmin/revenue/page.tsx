'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { revenueManagementService } from '@/shared/services/revenueManagementService';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Download,
  Settings,
  Plus,
  Activity
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

export default function RevenuePage() {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentSubscriptions, setRecentSubscriptions] = useState<any[]>([]);
  const [recentDisputes, setRecentDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, analyticsData, subscriptionsData, disputesData] = await Promise.all([
        revenueManagementService.getRevenueStats(),
        revenueManagementService.getRevenueAnalytics({
          start: '2024-02-01T00:00:00Z',
          end: '2024-02-29T23:59:59Z'
        }),
        revenueManagementService.getSubscriptions({ search: '' }),
        revenueManagementService.getBillingDisputes({ search: '' })
      ]);
      
      setStats(statsData);
      setAnalytics(analyticsData);
      setRecentSubscriptions(subscriptionsData.slice(0, 5));
      setRecentDisputes(disputesData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'green',
      TRIALING: 'blue',
      PAST_DUE: 'orange',
      CANCELLED: 'red',
      SUSPENDED: 'gray',
      OPEN: 'red',
      INVESTIGATING: 'yellow',
      RESOLVED: 'green'
    };
    return colors[status] || 'gray';
  };

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      STARTER: 'gray',
      GROWTH: 'blue',
      PRO: 'purple',
      ENTERPRISE: 'indigo'
    };
    return colors[plan] || 'gray';
  };

  // Mock trend data
  const revenueTrendData = analytics?.trends || [
    { date: '2024-02-01', revenue: 98500, subscriptions: 148 },
    { date: '2024-02-08', revenue: 105200, subscriptions: 152 },
    { date: '2024-02-15', revenue: 112800, subscriptions: 155 },
    { date: '2024-02-22', revenue: 118900, subscriptions: 158 },
    { date: '2024-02-29', revenue: 125750, subscriptions: 156 }
  ];

  const planDistribution = [
    { name: 'Starter', value: analytics?.plans?.starter?.count || 45, revenue: analytics?.plans?.starter?.revenue || 18950, color: '#6B7280' },
    { name: 'Growth', value: analytics?.plans?.growth?.count || 38, revenue: analytics?.plans?.growth?.revenue || 32450, color: '#3B82F6' },
    { name: 'Pro', value: analytics?.plans?.pro?.count || 28, revenue: analytics?.plans?.pro?.revenue || 45600, color: '#8B5CF6' },
    { name: 'Enterprise', value: analytics?.plans?.enterprise?.count || 8, revenue: analytics?.plans?.enterprise?.revenue || 28750, color: '#4F46E5' }
  ];

  const revenueBreakdown = [
    { category: 'Subscriptions', amount: 98500, percentage: 78.3 },
    { category: 'Transaction Fees', amount: 18250, percentage: 14.5 },
    { category: 'Platform Fees', amount: 9000, percentage: 7.2 }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Revenue Management"
        description="Monitor platform revenue, subscriptions, and billing"
        icon={DollarSign}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Configure Pricing
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
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold mt-1">${stats.revenue.monthly.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +{stats.revenue.growth}% this month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold mt-1">{stats.subscriptions.active}</p>
                <p className="text-xs text-blue-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +{stats.subscriptions.trialing} trialing
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ARPU</p>
                <p className="text-2xl font-bold mt-1">${stats.revenue.arpu}</p>
                <p className="text-xs text-purple-600 mt-1">
                  <Activity className="w-3 h-3 inline mr-1" />
                  Average per user
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold mt-1">{stats.revenue.churn}%</p>
                <p className="text-xs text-orange-600 mt-1">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  {stats.subscriptions.pastDue} past due
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Plan Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Subscription Plans</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any, name: any, props: any) => [
                `${value} subscriptions`,
                `$${props.payload.revenue.toLocaleString()} revenue`
              ]} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {planDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']} />
            <Bar dataKey="amount" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link href="/superadmin/revenue/subscriptions">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Subscriptions</h3>
                <p className="text-sm text-gray-600">Manage subscriptions</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/revenue/fees">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Platform Fees</h3>
                <p className="text-sm text-gray-600">Configure fee structure</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/revenue/reports">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Revenue Reports</h3>
                <p className="text-sm text-gray-600">Financial analytics</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/superadmin/revenue/disputes">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">Billing Disputes</h3>
                <p className="text-sm text-gray-600">Resolve billing issues</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Subscriptions</h3>
            <Link href="/superadmin/revenue/subscriptions">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{subscription.tenantName}</h4>
                    <p className="text-xs text-gray-600 mt-1">{subscription.plan} Plan</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusColor(subscription.status)} size="sm">
                        {subscription.status}
                      </Badge>
                      <Badge variant={getPlanColor(subscription.plan)} size="sm">
                        {subscription.plan}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${subscription.finalPrice}</p>
                    <p className="text-xs text-gray-500">
                      {subscription.billingCycle.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Disputes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Billing Disputes</h3>
            <Link href="/superadmin/revenue/disputes">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : recentDisputes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm">No recent disputes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDisputes.map((dispute) => (
                <div key={dispute.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{dispute.tenantName}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {dispute.disputeType.replace('_', ' ')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusColor(dispute.status)} size="sm">
                        {dispute.status}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {dispute.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${dispute.amount}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(dispute.createdAt).toLocaleDateString()}
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