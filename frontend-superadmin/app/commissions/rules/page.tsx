"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Settings, Play, Pause, Edit, Trash2, Plus, Search, TrendingUp } from "lucide-react"
import { useState } from "react"
import commissionEngine from "@/data/seed/commissionEngine.json"

export default function CommissionRulesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBlueprint, setSelectedBlueprint] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  
  const rules = commissionEngine.commissionRules

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBlueprint = selectedBlueprint === "all" || rule.blueprint === selectedBlueprint
    const matchesStatus = selectedStatus === "all" || rule.status === selectedStatus
    
    return matchesSearch && matchesBlueprint && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-slate-50 text-slate-700 border-slate-200"
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium": return "bg-purple-50 text-purple-700 border-purple-200"
      case "standard": return "bg-blue-50 text-blue-700 border-blue-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Commission Rules Engine"
        subtitle="Configure commission calculation rules across all blueprints and roles"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Settings className="h-3.5 w-3.5 text-blue-500" />
            {rules.length} Rules
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Active Rules</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">
                {rules.filter(r => r.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-600">Total Paid</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">
                ₹{(rules.reduce((sum, r) => sum + r.totalPaid, 0) / 100000).toFixed(2)}L
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-slate-600">Blueprints</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">
                {new Set(rules.map(r => r.blueprint)).size}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-600">Avg Rate</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">
                {(rules.filter(r => r.type === 'percentage').reduce((sum, r) => sum + r.value, 0) / rules.filter(r => r.type === 'percentage').length).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search rules by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedBlueprint} onValueChange={setSelectedBlueprint}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by blueprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blueprints</SelectItem>
              <SelectItem value="pageant">Pageant</SelectItem>
              <SelectItem value="modelling">Modelling</SelectItem>
              <SelectItem value="talent">Talent</SelectItem>
              <SelectItem value="campaign">Campaign</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        </div>
      </PageSection>

      <PageSection title={`Commission Rules (${filteredRules.length})`}>
        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">{rule.name}</h3>
                      <Badge className={getStatusColor(rule.status)}>
                        {rule.status}
                      </Badge>
                      <Badge className={getTierColor(rule.tier)}>
                        {rule.tier}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {rule.blueprint}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Type</p>
                        <p className="text-sm font-semibold text-slate-800 capitalize">
                          {rule.type}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Rate/Value</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {rule.type === 'percentage' ? `${rule.value}%` : 'Tiered'}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Applicable Tenants</p>
                        <p className="text-sm font-semibold text-purple-600">
                          {rule.applicableTenants}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Total Paid</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          ₹{(rule.totalPaid / 100000).toFixed(2)}L
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      {rule.status === "active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Conditions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(rule.conditions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-800">
                          {value === null ? 'No limit' : String(value)}
                        </code>
                      </div>
                    ))}
                  </div>
                  
                  {rule.type === 'tiered' && rule.tiers && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Tier Structure</h4>
                      <div className="space-y-2">
                        {rule.tiers.map((tier: any, index: number) => (
                          <div key={index} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                            <span className="text-sm text-slate-600">
                              Above ₹{(tier.threshold / 1000).toFixed(0)}K
                            </span>
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                              {tier.rate}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                    <span>Role: {rule.role}</span>
                    <span>Last modified: {new Date(rule.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Rule Performance">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...rules]
                .sort((a, b) => b.totalPaid - a.totalPaid)
                .slice(0, 5)
                .map((rule, index) => (
                  <div key={rule.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-700">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{rule.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{rule.blueprint} • {rule.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        ₹{(rule.totalPaid / 100000).toFixed(2)}L
                      </p>
                      <p className="text-xs text-slate-500">{rule.applicableTenants} tenants</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}