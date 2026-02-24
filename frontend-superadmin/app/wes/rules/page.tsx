"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Settings, Play, Pause, Edit, Trash2, Plus, Search, Filter } from "lucide-react"
import { useState } from "react"
import automationRules from "@/data/seed/automationRules.json"

export default function AutomationRulesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  
  const rules = automationRules.rules
  const categories = automationRules.categories

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || rule.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || rule.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-slate-50 text-slate-700 border-slate-200"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-50 text-red-700 border-red-200"
      case "high": return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Automation Rules Management"
        subtitle="Configure and monitor 60+ automation rules across all tenant workflows"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Settings className="h-3.5 w-3.5 text-blue-500" />
            {automationRules.metrics.totalRules} Rules
          </span>
        }
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Active Rules</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800 mt-1">
                {automationRules.metrics.activeRules}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                <span className="text-sm text-slate-600">Inactive Rules</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800 mt-1">
                {automationRules.metrics.inactiveRules}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-600">Time Saved</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800 mt-1">
                {automationRules.metrics.totalTimeSaved}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-slate-600">Avg Adoption</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800 mt-1">
                {automationRules.metrics.avgAdoptionRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search rules by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
              ))}
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

      <PageSection title="Rule Categories">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categories.map((category) => (
            <Card key={category.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{category.name}</h3>
                  <Badge variant="outline">
                    {category.activeCount}/{category.ruleCount}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(category.activeCount / category.ruleCount) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {Math.round((category.activeCount / category.ruleCount) * 100)}% active
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title={`Automation Rules (${filteredRules.length})`}>
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
                      <Badge className={getPriorityColor(rule.priority)}>
                        {rule.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rule.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{rule.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
                      <div>
                        <span className="font-medium">Blueprint:</span> {rule.blueprint}
                      </div>
                      <div>
                        <span className="font-medium">Adoption:</span> {rule.adoptionRate}%
                      </div>
                      <div>
                        <span className="font-medium">Time Saved:</span> {rule.timeSaved}
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Trigger</h4>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {rule.trigger}
                      </code>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Action</h4>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {rule.action}
                      </code>
                    </div>
                  </div>
                  
                  {rule.conditions && rule.conditions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Conditions</h4>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <code key={index} className="block text-xs bg-slate-100 px-2 py-1 rounded">
                            {condition}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                    <span>Created by: {rule.createdBy}</span>
                    <span>Last modified: {new Date(rule.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  )
}