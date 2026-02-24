/**
 * Active Contracts - Super Admin
 *
 * Monitor all active contracts across tenants.
 */

"use client"

import { useEffect, useState } from "react"
import { FileText, Search, Download } from "lucide-react"
import clmData from "@/data/seed/clm.json"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { getTenantName } from "@/shared/services/userService"
import { formatCurrency } from "@/shared/lib/utils"

type Contract = {
  _id: string
  templateName: string
  tenantId: string
  tenantName: string
  partyA: string
  partyB: string
  status: string
  signedDate: string | null
  effectiveDate: string
  expiryDate: string
  value: number
  currency: string
  complianceStatus: string
  autoRenewal: boolean
  keyTerms: Record<string, string>
  documents: Array<{ name: string; uploadedAt: string }>
  milestones: Array<{ name: string; date: string; status: string }>
}

const statusColors = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING_SIGNATURE: "bg-amber-50 text-amber-700 border-amber-200",
  EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
  TERMINATED: "bg-rose-50 text-rose-700 border-rose-200",
}

export default function ActiveContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  useEffect(() => {
    setContracts(clmData.activeContracts as Contract[])
    setLoading(false)
  }, [])

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = searchQuery === "" || 
      c.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partyA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partyB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <PageLayout>
      <PageHeader
        title="Active Contracts"
        description="Monitor and manage all active contracts across tenants."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-emerald-500" />
            {contracts.filter(c => c.status === "ACTIVE").length} Active
          </span>
        }
        action={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />

      <PageSection title="Filters">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-600">Status:</span>
                {["ALL", "ACTIVE", "PENDING_SIGNATURE", "EXPIRED"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? "default" : "outline"}
                    className={statusFilter === status ? "h-7 px-3 text-xs" : "h-7 px-3 text-xs"}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title={`Contracts (${filteredContracts.length})`}>
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : filteredContracts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No contracts match the current filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <Card key={contract._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base">{contract.templateName}</CardTitle>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          statusColors[contract.status as keyof typeof statusColors]
                        }`}>
                          {contract.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {contract.partyA} ↔ {contract.partyB}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-800">
                        {formatCurrency(contract.value * 100, contract.currency)}
                      </p>
                      <p className="text-xs text-slate-500">Contract value</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Tenant</p>
                        <p className="text-sm text-slate-600">{getTenantName(contract.tenantId)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Dates</p>
                        <div className="text-xs text-slate-600 space-y-0.5">
                          {contract.signedDate && (
                            <p>Signed: {new Date(contract.signedDate).toLocaleDateString()}</p>
                          )}
                          <p>Effective: {new Date(contract.effectiveDate).toLocaleDateString()}</p>
                          <p>Expires: {new Date(contract.expiryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Key terms</p>
                        <div className="text-xs text-slate-600 space-y-0.5">
                          {Object.entries(contract.keyTerms).map(([key, value]) => (
                            <p key={key}>
                              <span className="text-slate-500">{key.replace(/_/g, " ")}:</span> {value}
                            </p>
                          ))}
                          {contract.autoRenewal && (
                            <p className="text-emerald-600 font-medium">Auto-renewal enabled</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Documents ({contract.documents.length})</p>
                        <div className="space-y-1">
                          {contract.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">{doc.name}</span>
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Milestones</p>
                        <div className="space-y-1">
                          {contract.milestones.map((milestone, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">{milestone.name}</span>
                              <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                                milestone.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                milestone.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {milestone.status.replace(/_/g, " ")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Compliance</p>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          contract.complianceStatus === "COMPLIANT" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          contract.complianceStatus === "REVIEW_REQUIRED" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {contract.complianceStatus.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  )
}
