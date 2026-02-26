"use client"

import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { 
  TrendingUp, TrendingDown, DollarSign, Users, 
  Shield, Wallet, Download, RefreshCw
} from "lucide-react"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

export default function FinancialAnalyticsPage() {
  // Mock data
  const stats = {
    totalVolume: 1245000,
    totalWallets: 3456,
    activeEscrows: 234,
    pendingPayouts: 89000,
    volumeChange: 12.5,
    walletsChange: 8.3,
    escrowsChange: -3.2,
    payoutsChange: 15.7
  }

  const revenueData = [
    { month: "Sep", revenue: 85000, expenses: 23000, profit: 62000 },
    { month: "Oct", revenue: 120000, expenses: 31000, profit: 89000 },
    { month: "Nov", revenue: 152000, expenses: 42000, profit: 110000 },
    { month: "Dec", revenue: 185000, expenses: 51000, profit: 134000 },
    { month: "Jan", revenue: 220000, expenses: 62000, profit: 158000 },
    { month: "Feb", revenue: 198000, expenses: 58000, profit: 140000 }
  ]

  const transactionTypes = [
    { name: "Bookings", value: 450000, color: "#3b82f6" },
    { name: "Commissions", value: 280000, color: "#10b981" },
    { name: "Payouts", value: 320000, color: "#f59e0b" },
    { name: "Refunds", value: 45000, color: "#ef4444" }
  ]

  const walletDistribution = [
    { type: "Talent", count: 1850, balance: 450000 },
    { type: "Client", count: 1200, balance: 380000 },
    { type: "Agent", count: 350, balance: 280000 },
    { type: "Vendor", count: 56, balance: 135000 }
  ]

  const escrowStatus = [
    { status: "Held", count: 156, amount: 780000 },
    { status: "Released", count: 89, amount: 445000 },
    { status: "Frozen", count: 12, amount: 60000 },
    { status: "Cancelled", count: 8, amount: 40000 }
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Financial Analytics"
        description="Comprehensive financial insights and metrics"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total Volume</div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">${(stats.totalVolume / 1000).toFixed(0)}K</div>
            <div className={`text-xs mt-1 flex items-center ${
              stats.volumeChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {stats.volumeChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(stats.volumeChange)}% this month
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total Wallets</div>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.totalWallets.toLocaleString()}</div>
            <div className={`text-xs mt-1 flex items-center ${
              stats.walletsChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {stats.walletsChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(stats.walletsChange)}% this month
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Active Escrows</div>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.activeEscrows}</div>
            <div className={`text-xs mt-1 flex items-center ${
              stats.escrowsChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {stats.escrowsChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(stats.escrowsChange)}% this month
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Pending Payouts</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">${(stats.pendingPayouts / 1000).toFixed(0)}K</div>
            <div className={`text-xs mt-1 flex items-center ${
              stats.payoutsChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {stats.payoutsChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(stats.payoutsChange)}% this month
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Revenue Chart */}
      <PageSection>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue & Profit (6 months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </PageSection>

      {/* Transaction Types & Wallet Distribution */}
      <PageSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Transaction Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={transactionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${(entry.value / 1000).toFixed(0)}K`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Wallet Distribution</h3>
            <div className="space-y-3">
              {walletDistribution.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.count} wallets
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(item.balance / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-muted-foreground">
                      ${(item.balance / item.count).toFixed(0)} avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Escrow Status */}
      <PageSection>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Escrow Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {escrowStatus.map((item) => (
              <div key={item.status} className="p-4 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={
                    item.status === "Held" ? "default" :
                    item.status === "Released" ? "default" :
                    item.status === "Frozen" ? "destructive" :
                    "secondary"
                  }>
                    {item.status}
                  </Badge>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  ${(item.amount / 1000).toFixed(0)}K total
                </div>
              </div>
            ))}
          </div>
        </Card>
      </PageSection>

      {/* Top Performers */}
      <PageSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Top Earners (This Month)</h3>
            <div className="space-y-3">
              {[
                { name: "Jane Smith", type: "Talent", amount: 45000 },
                { name: "John Doe", type: "Agent", amount: 38000 },
                { name: "ABC Productions", type: "Client", amount: 32000 },
                { name: "Sarah Johnson", type: "Talent", amount: 28000 },
                { name: "Mike Wilson", type: "Agent", amount: 25000 }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.type}</div>
                    </div>
                  </div>
                  <div className="font-bold">${user.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Large Transactions</h3>
            <div className="space-y-3">
              {[
                { description: "Booking payment", amount: 12500, date: "2026-02-24" },
                { description: "Commission payout", amount: 8900, date: "2026-02-24" },
                { description: "Escrow release", amount: 7500, date: "2026-02-23" },
                { description: "Booking payment", amount: 6800, date: "2026-02-23" },
                { description: "Vendor payment", amount: 5200, date: "2026-02-22" }
              ].map((txn, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{txn.description}</div>
                    <div className="text-sm text-muted-foreground">{txn.date}</div>
                  </div>
                  <div className="font-bold text-green-600">
                    ${txn.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
