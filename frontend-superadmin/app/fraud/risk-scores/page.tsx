"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Activity, Search, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useState } from "react"
import fraudRiskMonitoring from "@/data/seed/fraudRiskMonitoring.json"

export default function RiskScoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEntityType, setSelectedEntityType] = useState("all")
  
  const riskScores = fraudRiskMonitoring.riskScores

  const filteredScores = riskScores.filter(score => {
    const matchesSearch = score.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         score.entityId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || score.category === selectedCategory
    const matchesType = selectedEntityType === "all" || score.entityType === selectedEntityType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "critical_risk": return "bg-red-50 text-red-700 border-red-200"
      case "high_risk": return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium_risk": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-orange-600"
    if (score >= 40) return "text-amber-600"
    return "text-emerald-600"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="h-3 w-3 text-red-600" />
      case "decreasing": return <TrendingDown className="h-3 w-3 text-emerald-600" />
      default: return <Minus className="h-3 w-3 text-slate-400" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Risk Scoring System"
        subtitle="Real-time risk assessment and scoring for users, tenants, and transactions"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Activity className="h-3.5 w-3.5 text-amber-500" />
            {riskScores.length} Entities
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600">Critical Risk</span>
              </div>
              <p className="text-2xl font-semibold text-red-600">
                {riskScores.filter(s => s.category === 'critical_risk').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Score ≥ 80</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span className="text-sm text-slate-600">High Risk</span>
              </div>
              <p className="text-2xl font-semibold text-orange-600">
                {riskScores.filter(s => s.category === 'high_risk').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Score 60-79</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-600">Medium Risk</span>
              </div>
              <p className="text-2xl font-semibold text-amber-600">
                {riskScores.filter(s => s.category === 'medium_risk').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Score 40-59</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Low Risk</span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">
                {riskScores.filter(s => s.category === 'low_risk').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Score < 40</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by entity name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Risk Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="critical_risk">Critical Risk</SelectItem>
              <SelectItem value="high_risk">High Risk</SelectItem>
              <SelectItem value="medium_risk">Medium Risk</SelectItem>
              <SelectItem value="low_risk">Low Risk</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageSection>

      <PageSection title={`Risk Scores (${filteredScores.length})`}>
        <div className="space-y-4">
          {filteredScores.map((entity) => (
            <Card key={entity.entityId}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">{entity.entityName}</h3>
                      <Badge className={getCategoryColor(entity.category)}>
                        {entity.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {entity.entityType}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(entity.trend)}
                        <span className="text-xs font-medium">{entity.trend}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-4">
                      Entity ID: {entity.entityId} • Last updated: {new Date(entity.lastUpdated).toLocaleString('en-IN')}
                    </p>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div>
                        <p className="text-xs text-slate-500">Overall Risk Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(entity.overallScore)}`}>
                          {entity.overallScore}
                        </p>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-3 md:grid-cols-6 gap-3">
                        {Object.entries(entity.factors).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <p className="text-xs text-slate-500 capitalize mb-1">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className={`text-lg font-semibold ${getScoreColor(value as number)}`}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>

                {entity.recommendations && entity.recommendations.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {entity.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>
                          <span className="text-slate-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Risk Scoring Methodology">
        <Card>
          <CardHeader>
            <CardTitle>Scoring Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <h4 className="font-semibold text-slate-800 mb-1">Account Age</h4>
                  <p className="text-sm text-slate-600">Newer accounts have higher risk scores</p>
                </div>
                
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <h4 className="font-semibold text-slate-800 mb-1">Activity Pattern</h4>
                  <p className="text-sm text-slate-600">Unusual or suspicious activity patterns</p>
                </div>
                
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <h4 className="font-semibold text-slate-800 mb-1">Payment History</h4>
                  <p className="text-sm text-slate-600">Failed payments, chargebacks, disputes</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <h4 className="font-semibold text-slate-800 mb-1">Device Trust</h4>
                  <p className="text-sm text-slate-600">Known devices vs new/suspicious devices</p>
                </div>
                
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <h4 className="font-semibold text-slate-800 mb-1">Location Consistency</h4>
                  <p className="text-sm text-slate-600">Geographic anomalies and VPN usage</p>
                </div>
                
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <h4 className="font-semibold text-slate-800 mb-1">Social Validation</h4>
                  <p className="text-sm text-slate-600">Profile completeness and verification</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}