"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Lightbulb, TrendingUp, Users, Clock, CheckCircle, Play, Pause, Eye } from "lucide-react"
import { useState } from "react"
import wesAnalytics from "@/data/seed/wesAnalytics.json"

export default function WESRecommendationsPage() {
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  
  const recommendations = wesAnalytics.recommendations

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesPriority = selectedPriority === "all" || rec.priority === selectedPriority
    const matchesCategory = selectedCategory === "all" || rec.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || rec.status === selectedStatus
    
    return matchesPriority && matchesCategory && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-700 border-red-200"
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress": return "bg-blue-50 text-blue-700 border-blue-200"
      case "planned": return "bg-purple-50 text-purple-700 border-purple-200"
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-emerald-600"
      case "Medium": return "text-amber-600"
      default: return "text-slate-600"
    }
  }

  const totalImpact = filteredRecommendations.reduce((sum, rec) => sum + rec.estimatedImprovement, 0)
  const totalAffected = filteredRecommendations.reduce((sum, rec) => sum + rec.affectedTenants, 0)

  return (
    <PageLayout>
      <PageHeader
        title="AI-Driven Recommendations"
        subtitle="Intelligent optimization suggestions to improve workflow efficiency across all tenants"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            {recommendations.length} Recommendations
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-slate-600">Total Impact</span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">
                +{totalImpact.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">WES points potential</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-slate-600">Affected Tenants</span>
              </div>
              <p className="text-2xl font-semibold text-blue-600">
                {totalAffected}
              </p>
              <p className="text-xs text-slate-500 mt-1">Across all recommendations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-slate-600">In Progress</span>
              </div>
              <p className="text-2xl font-semibold text-amber-600">
                {recommendations.filter(r => r.status === 'in_progress').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Active implementations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-slate-600">High Priority</span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">
                {recommendations.filter(r => r.priority === 'high').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Urgent recommendations</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="automation">Automation</SelectItem>
              <SelectItem value="process">Process</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="reporting">Reporting</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageSection>

      <PageSection title={`Recommendations (${filteredRecommendations.length})`}>
        <div className="space-y-6">
          {filteredRecommendations.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                      <Badge className={getStatusColor(rec.status)}>
                        {rec.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{rec.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{rec.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Impact</p>
                        <p className={`text-sm font-semibold ${getImpactColor(rec.impact)}`}>
                          {rec.impact}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Effort Required</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {rec.effort}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Affected Tenants</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {rec.affectedTenants}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">WES Improvement</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          +{rec.estimatedImprovement} points
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {rec.status === "pending" && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Implement
                      </Button>
                    )}
                    {rec.status === "in_progress" && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Recommendation ID: {rec.id}</span>
                    <span>Generated by AI Engine</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Implementation Roadmap">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Implementation Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-red-200 bg-red-50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">High Priority Items</h4>
                  <p className="text-sm text-red-700">
                    {recommendations.filter(r => r.priority === 'high').length} recommendations with immediate impact
                  </p>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  +{recommendations.filter(r => r.priority === 'high').reduce((sum, r) => sum + r.estimatedImprovement, 0).toFixed(1)} WES
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg border border-amber-200 bg-amber-50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-800">Medium Priority Items</h4>
                  <p className="text-sm text-amber-700">
                    {recommendations.filter(r => r.priority === 'medium').length} recommendations for sustained improvement
                  </p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                  +{recommendations.filter(r => r.priority === 'medium').reduce((sum, r) => sum + r.estimatedImprovement, 0).toFixed(1)} WES
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">Low Priority Items</h4>
                  <p className="text-sm text-slate-700">
                    {recommendations.filter(r => r.priority === 'low').length} recommendations for long-term optimization
                  </p>
                </div>
                <Badge className="bg-slate-100 text-slate-800 border-slate-300">
                  +{recommendations.filter(r => r.priority === 'low').reduce((sum, r) => sum + r.estimatedImprovement, 0).toFixed(1)} WES
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}