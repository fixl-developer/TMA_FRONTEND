/**
 * Template Comparison Page - Super Admin
 * 
 * Side-by-side comparison of up to 4 templates.
 * Compare blueprints, roles, dashboards, KPIs, complexity, and features.
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Layers,
  Users,
  BarChart3,
  Target,
  Clock,
  DollarSign
} from "lucide-react"
import {
  getTemplates,
  compareTemplates,
  type Template,
  type TemplateId
} from "@/shared/services/templateService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select"

export default function TemplateComparePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const templatesData = await getTemplates()
        setTemplates(templatesData)

        // Load from URL params if present
        const ids = searchParams.get("ids")?.split(",") as TemplateId[] | undefined
        if (ids && ids.length > 0) {
          const compared = await compareTemplates(ids)
          setSelectedTemplates(compared)
        }
      } catch (e) {
        console.error("Failed to load templates", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

  const addTemplate = (templateId: string) => {
    if (selectedTemplates.length >= 4) return
    const template = templates.find(t => t.id === templateId)
    if (template && !selectedTemplates.find(t => t.id === templateId)) {
      setSelectedTemplates([...selectedTemplates, template])
    }
  }

  const removeTemplate = (templateId: string) => {
    setSelectedTemplates(selectedTemplates.filter(t => t.id !== templateId))
  }

  const getComplexityBadge = (complexity: string) => {
    const map: Record<string, string> = {
      SIMPLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      MODERATE: "bg-blue-100 text-blue-700 border-blue-200",
      COMPLEX: "bg-amber-100 text-amber-700 border-amber-200"
    }
    return map[complexity] || "bg-slate-100 text-slate-600 border-slate-200"
  }

  const availableTemplates = templates.filter(
    t => !selectedTemplates.find(st => st.id === t.id)
  )

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/templates")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Compare Templates</span>
          </div>
        }
        description="Side-by-side comparison of up to 4 templates"
      />

      {/* Template Selector */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Select Templates to Compare</span>
              <span className="text-sm font-normal text-slate-500">
                {selectedTemplates.length} of 4 selected
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {selectedTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2"
                >
                  <span className="font-mono text-sm font-semibold text-purple-700">
                    {template.id}
                  </span>
                  <button
                    onClick={() => removeTemplate(template.id)}
                    className="rounded-full p-0.5 hover:bg-purple-200"
                  >
                    <X className="h-3.5 w-3.5 text-purple-600" />
                  </button>
                </div>
              ))}
              {selectedTemplates.length < 4 && (
                <Select onValueChange={addTemplate}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.id} - {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {selectedTemplates.length === 0 ? (
        <PageSection>
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">Select templates to compare</p>
          </div>
        </PageSection>
      ) : (
        <>
          {/* Basic Info */}
          <PageSection>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-4 py-3 text-left font-medium text-slate-600 w-40">
                          Property
                        </th>
                        {selectedTemplates.map((template) => (
                          <th
                            key={template.id}
                            className="px-4 py-3 text-left font-medium text-slate-600"
                          >
                            {template.id}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-600">Name</td>
                        {selectedTemplates.map((template) => (
                          <td key={template.id} className="px-4 py-3 text-slate-800">
                            {template.name}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-600">Complexity</td>
                        {selectedTemplates.map((template) => (
                          <td key={template.id} className="px-4 py-3">
                            <Badge className={getComplexityBadge(template.complexity)}>
                              {template.complexity}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-600">Setup Time</td>
                        {selectedTemplates.map((template) => (
                          <td key={template.id} className="px-4 py-3 text-slate-800">
                            {template.setupTime}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-600">Tenants</td>
                        {selectedTemplates.map((template) => (
                          <td key={template.id} className="px-4 py-3 text-slate-800">
                            {template.tenantCount}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-600">Success Rate</td>
                        {selectedTemplates.map((template) => (
                          <td key={template.id} className="px-4 py-3 text-slate-800">
                            {template.successRate}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-600">Monthly Revenue</td>
                        {selectedTemplates.map((template) => (
                          <td key={template.id} className="px-4 py-3 text-emerald-600 font-semibold">
                            {template.monthlyRevenue}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </PageSection>

          {/* Blueprints */}
          <PageSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-500" />
                  Included Blueprints
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-4 py-3 text-left font-medium text-slate-600 w-40">
                          Blueprint
                        </th>
                        {selectedTemplates.map((template) => (
                          <th
                            key={template.id}
                            className="px-4 py-3 text-center font-medium text-slate-600"
                          >
                            {template.id}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(
                        new Set(selectedTemplates.flatMap(t => t.blueprints))
                      ).map((blueprint, i) => (
                        <tr key={blueprint} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                          <td className="px-4 py-3 font-medium text-slate-600">
                            {blueprint}
                          </td>
                          {selectedTemplates.map((template) => (
                            <td key={template.id} className="px-4 py-3 text-center">
                              {template.blueprints.includes(blueprint) ? (
                                <CheckCircle className="inline h-5 w-5 text-emerald-500" />
                              ) : (
                                <X className="inline h-5 w-5 text-slate-300" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </PageSection>

          {/* Roles & Dashboards */}
          <PageSection>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-500" />
                    Default Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-4 py-3 text-left font-medium text-slate-600">
                            Template
                          </th>
                          <th className="px-4 py-3 text-center font-medium text-slate-600">
                            Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTemplates.map((template, i) => (
                          <tr key={template.id} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                            <td className="px-4 py-3 font-medium text-slate-600">
                              {template.id}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-800">
                              {template.defaultRoles.length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Default Dashboards
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-4 py-3 text-left font-medium text-slate-600">
                            Template
                          </th>
                          <th className="px-4 py-3 text-center font-medium text-slate-600">
                            Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTemplates.map((template, i) => (
                          <tr key={template.id} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                            <td className="px-4 py-3 font-medium text-slate-600">
                              {template.id}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-800">
                              {template.defaultDashboards.length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </PageSection>

          {/* Features */}
          <PageSection>
            <Card>
              <CardHeader>
                <CardTitle>Features Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-4 py-3 text-left font-medium text-slate-600 w-64">
                          Feature
                        </th>
                        {selectedTemplates.map((template) => (
                          <th
                            key={template.id}
                            className="px-4 py-3 text-center font-medium text-slate-600"
                          >
                            {template.id}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(
                        new Set(selectedTemplates.flatMap(t => t.features))
                      ).map((feature, i) => (
                        <tr key={feature} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                          <td className="px-4 py-3 text-slate-700">{feature}</td>
                          {selectedTemplates.map((template) => (
                            <td key={template.id} className="px-4 py-3 text-center">
                              {template.features.includes(feature) ? (
                                <CheckCircle className="inline h-5 w-5 text-emerald-500" />
                              ) : (
                                <X className="inline h-5 w-5 text-slate-300" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}
    </PageLayout>
  )
}
