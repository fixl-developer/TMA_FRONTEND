"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { 
  ArrowLeft, Shield, Clock, CheckCircle, XCircle,
  AlertTriangle, DollarSign, Users, FileText
} from "lucide-react"

export default function EscrowDetailPage() {
  const params = useParams()
  const router = useRouter()
  const escrowId = params.id as string

  // Mock escrow data
  const escrow = {
    id: escrowId,
    contractId: "contract_456",
    amount: 5000.00,
    currency: "USD",
    status: "HELD",
    createdAt: "2026-02-20T10:00:00Z",
    releaseDate: "2026-03-05T00:00:00Z",
    parties: {
      client: { id: "user_client", name: "ABC Productions", approved: true },
      talent: { id: "user_talent", name: "Jane Smith", approved: false }
    },
    conditions: [
      { id: "cond_1", description: "Service completion", status: "PENDING" },
      { id: "cond_2", description: "Client approval", status: "MET" },
      { id: "cond_3", description: "Quality review", status: "PENDING" }
    ],
    timeline: [
      { date: "2026-02-20T10:00:00Z", event: "Escrow created", actor: "System" },
      { date: "2026-02-20T10:15:00Z", event: "Funds deposited", actor: "ABC Productions" },
      { date: "2026-02-22T14:30:00Z", event: "Client approved", actor: "ABC Productions" },
      { date: "2026-02-24T09:00:00Z", event: "Dispute filed", actor: "Jane Smith" }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HELD": return "orange"
      case "RELEASED": return "green"
      case "FROZEN": return "red"
      case "CANCELLED": return "gray"
      default: return "blue"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/financial/escrow")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Shield className="h-6 w-6" />
            <span>Escrow Details</span>
            <Badge variant={getStatusColor(escrow.status) as any}>
              {escrow.status}
            </Badge>
          </div>
        }
        description={`Contract: ${escrow.contractId}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Release Funds
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              Freeze Escrow
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Escrow Amount</div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">${escrow.amount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">{escrow.currency}</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <Shield className="h-4 w-4 text-orange-600" />
            </div>
            <Badge variant={getStatusColor(escrow.status) as any} className="text-sm">
              {escrow.status}
            </Badge>
            <div className="text-xs text-muted-foreground mt-2">
              Held since {new Date(escrow.createdAt).toLocaleDateString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Conditions</div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {escrow.conditions.filter(c => c.status === "MET").length}/{escrow.conditions.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Conditions met</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Release Date</div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium">
              {new Date(escrow.releaseDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.ceil((new Date(escrow.releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Tabs */}
      <PageSection>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parties">Parties</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Escrow Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Escrow ID</div>
                    <div className="font-mono text-sm">{escrow.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Contract ID</div>
                    <div className="font-mono text-sm">{escrow.contractId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="font-bold text-lg">${escrow.amount.toLocaleString()} {escrow.currency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={getStatusColor(escrow.status) as any}>{escrow.status}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="font-medium">{new Date(escrow.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Scheduled Release</div>
                    <div className="font-medium">{new Date(escrow.releaseDate).toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Approval Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{escrow.parties.client.name}</div>
                        <div className="text-sm text-muted-foreground">Client</div>
                      </div>
                    </div>
                    {escrow.parties.client.approved ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{escrow.parties.talent.name}</div>
                        <div className="text-sm text-muted-foreground">Talent</div>
                      </div>
                    </div>
                    {escrow.parties.talent.approved ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Parties Tab */}
          <TabsContent value="parties" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Client</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">{escrow.parties.client.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">User ID</div>
                    <div className="font-mono text-sm">{escrow.parties.client.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Approval Status</div>
                    <Badge variant={escrow.parties.client.approved ? "default" : "secondary"}>
                      {escrow.parties.client.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Talent</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">{escrow.parties.talent.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">User ID</div>
                    <div className="font-mono text-sm">{escrow.parties.talent.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Approval Status</div>
                    <Badge variant={escrow.parties.talent.approved ? "default" : "secondary"}>
                      {escrow.parties.talent.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Conditions Tab */}
          <TabsContent value="conditions" className="mt-6">
            <Card>
              <div className="divide-y">
                {escrow.conditions.map((condition) => (
                  <div key={condition.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {condition.status === "MET" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : condition.status === "FAILED" ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <div className="font-medium">{condition.description}</div>
                          <div className="text-sm text-muted-foreground">ID: {condition.id}</div>
                        </div>
                      </div>
                      <Badge variant={
                        condition.status === "MET" ? "default" :
                        condition.status === "FAILED" ? "destructive" :
                        "secondary"
                      }>
                        {condition.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Escrow Timeline</h3>
              <div className="space-y-4">
                {escrow.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {index < escrow.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium">{item.event}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.actor} • {new Date(item.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageSection>
    </PageLayout>
  )
}
