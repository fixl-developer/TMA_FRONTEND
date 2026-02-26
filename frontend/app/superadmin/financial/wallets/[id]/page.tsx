"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { 
  ArrowLeft, Wallet, TrendingUp, TrendingDown, 
  DollarSign, Clock, Download, RefreshCw
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function WalletDetailPage() {
  const params = useParams()
  const router = useRouter()
  const walletId = params.id as string

  // Mock wallet data
  const wallet = {
    id: walletId,
    userId: "user_123",
    userName: "John Doe",
    userType: "TALENT",
    balance: 12450.00,
    availableBalance: 11200.00,
    pendingBalance: 1250.00,
    currency: "USD",
    status: "ACTIVE",
    createdAt: "2025-01-15T00:00:00Z",
    lastTransaction: "2026-02-24T14:30:00Z"
  }

  // Mock transactions
  const transactions = [
    { id: "txn_1", type: "CREDIT", amount: 2500, description: "Booking payment", date: "2026-02-24T14:30:00Z", status: "COMPLETED" },
    { id: "txn_2", type: "DEBIT", amount: -150, description: "Platform fee", date: "2026-02-24T14:31:00Z", status: "COMPLETED" },
    { id: "txn_3", type: "CREDIT", amount: 1800, description: "Commission payment", date: "2026-02-23T10:15:00Z", status: "COMPLETED" },
    { id: "txn_4", type: "DEBIT", amount: -500, description: "Withdrawal", date: "2026-02-22T16:45:00Z", status: "COMPLETED" },
    { id: "txn_5", type: "CREDIT", amount: 3200, description: "Booking payment", date: "2026-02-21T09:20:00Z", status: "COMPLETED" }
  ]

  // Mock balance history
  const balanceHistory = [
    { date: "Feb 18", balance: 8500 },
    { date: "Feb 19", balance: 9200 },
    { date: "Feb 20", balance: 10100 },
    { date: "Feb 21", balance: 13300 },
    { date: "Feb 22", balance: 12800 },
    { date: "Feb 23", balance: 14600 },
    { date: "Feb 24", balance: 12450 }
  ]

  // Mock transaction volume
  const transactionVolume = [
    { month: "Sep", credits: 8500, debits: 2300 },
    { month: "Oct", credits: 12000, debits: 3100 },
    { month: "Nov", credits: 15200, debits: 4200 },
    { month: "Dec", credits: 18500, debits: 5100 },
    { month: "Jan", credits: 22000, debits: 6200 },
    { month: "Feb", credits: 19800, debits: 5800 }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/financial/wallets")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Wallet className="h-6 w-6" />
            <span>Wallet Details</span>
            <Badge variant={wallet.status === "ACTIVE" ? "default" : "secondary"}>
              {wallet.status}
            </Badge>
          </div>
        }
        description={`${wallet.userName} (${wallet.userType})`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Balance Cards */}
      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">${wallet.balance.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% this month
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Available</div>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${wallet.availableBalance.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Ready for withdrawal
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Pending</div>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              ${wallet.pendingBalance.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              In escrow/processing
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Last Transaction</div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium">
              {new Date(wallet.lastTransaction).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(wallet.lastTransaction).toLocaleTimeString()}
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Tabs */}
      <PageSection>
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <div className="divide-y">
                {transactions.map((txn) => (
                  <div key={txn.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          txn.type === "CREDIT" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {txn.type === "CREDIT" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{txn.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(txn.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          txn.type === "CREDIT" ? "text-green-600" : "text-red-600"
                        }`}>
                          {txn.type === "CREDIT" ? "+" : ""}${Math.abs(txn.amount).toLocaleString()}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Balance History (7 days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={balanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Transaction Volume (6 months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={transactionVolume}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="credits" fill="#10b981" />
                    <Bar dataKey="debits" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Wallet Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Wallet ID</div>
                    <div className="font-mono text-sm">{wallet.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">User ID</div>
                    <div className="font-mono text-sm">{wallet.userId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">User Name</div>
                    <div className="font-medium">{wallet.userName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">User Type</div>
                    <Badge>{wallet.userType}</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Currency</div>
                    <div className="font-medium">{wallet.currency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={wallet.status === "ACTIVE" ? "default" : "secondary"}>
                      {wallet.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="font-medium">
                      {new Date(wallet.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Transaction</div>
                    <div className="font-medium">
                      {new Date(wallet.lastTransaction).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageSection>
    </PageLayout>
  )
}
