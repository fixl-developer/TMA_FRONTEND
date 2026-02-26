/**
 * Template Application Wizard - Super Admin
 * 
 * Multi-step wizard to apply templates to tenants:
 * Step 1: Select Template
 * Step 2: Select Tenant
 * Step 3: Review Configuration
 * Step 4: Confirm & Apply
 * Step 5: Complete
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers,
  Users,
  AlertTriangle,
  CheckCircle,
  Package
} from "lucide-react"
import {
  getTemplates,
  applyTemplateToTenant,
  type Template,
  type TemplateId
} from "@/shared/services/templateService"
import { getTenants } from "@/shared/services/tenantService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { useToast } from "@/shared/components/ui/toast"

type Step = 1 | 2 | 3 | 4 | 5

export default function TemplateApplyPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [templates, setTemplates] = useState<Template[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  // Selection state
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [templatesData, tenantsData] = await Promise.all([
          getTemplates(),
          getTenants()
        ])
        setTemplates(templatesData)
        setTenants(tenantsData.filter(t => t.status === "ACTIVE"))
      } catch (e) {
        console.error("Failed to load data", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null
      case 2:
        return selectedTenant !== null
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleApply = async () => {
    if (!selectedTemplate || !selectedTenant) return

    setApplying(true)
    try {
      const result = await applyTemplateToTenant(
        selectedTenant._id,
        selectedTemplate.id
      )
      if (result.success) {
        showToast(result.message, "success")
        setCurrentStep(5)
      } else {
        showToast(result.message, "error")
      }
    } catch (e) {
      showToast("Failed to apply template", "error")
    } finally {
      setApplying(false)
    }
  }

  const steps = [
    { number: 1, label: "Select Template" },
    { number: 2, label: "Select Tenant" },
    { number: 3, label: "Review Configuration" },
    { number: 4, label: "Confirm & Apply" },
    { number: 5, label: "Complete" }
  ]

  const getComplexityBadge = (complexity: string) => {
    const map: Record<string, string> = {
      SIMPLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      MODERATE: "bg-blue-100 text-blue-700 border-blue-200",
      COMPLEX: "bg-amber-100 text-amber-700 border-amber-200"
    }
    return map[complexity] || "bg-slate-100 text-slate-600 border-slate-200"
  }

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
            <span>Apply Template to Tenant</span>
          </div>
        }
        description="Multi-step wizard to apply templates with full configuration"
      />

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition ${
                    currentStep > step.number
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : currentStep === step.number
                      ? "border-purple-500 bg-purple-500 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <p
                  className={`mt-2 text-xs font-medium ${
                    currentStep >= step.number ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 flex-1 transition ${
                    currentStep > step.number ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">Loading...</p>
          </div>
        ) : (
          <>
            {/* Step 1: Select Template */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Select a Template
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? "border-purple-500 ring-2 ring-purple-200"
                          : "hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-xs font-semibold text-slate-600">
                              {template.id}
                            </span>
                            <CardTitle className="mt-1 text-base">
                              {template.name}
                            </CardTitle>
                          </div>
                          {selectedTemplate?.id === template.id && (
                            <CheckCircle className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge className={getComplexityBadge(template.complexity)}>
                            {template.complexity}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {template.setupTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Tenant */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Select a Tenant
                </h2>
                <div className="space-y-2">
                  {tenants.map((tenant) => (
                    <Card
                      key={tenant._id}
                      className={`cursor-pointer transition-all ${
                        selectedTenant?._id === tenant._id
                          ? "border-purple-500 ring-2 ring-purple-200"
                          : "hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedTenant(tenant)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-purple-100 p-3">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {tenant.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {tenant.type} • {tenant.plan}
                            </p>
                          </div>
                        </div>
                        {selectedTenant?._id === tenant._id && (
                          <CheckCircle className="h-5 w-5 text-purple-500" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review Configuration */}
            {currentStep === 3 && selectedTemplate && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Review Configuration
                </h2>

                <Card>
                  <CardHeader>
                    <CardTitle>What will be provisioned</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="h-4 w-4 text-purple-500" />
                          <p className="text-sm font-medium text-slate-600">Blueprints</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                          {selectedTemplate.blueprints.length}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedTemplate.blueprints.map(bp => (
                            <Badge key={bp} variant="outline" className="text-xs">
                              {bp}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-emerald-500" />
                          <p className="text-sm font-medium text-slate-600">Roles</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                          {selectedTemplate.defaultRoles.length}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Default roles will be created
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          <p className="text-sm font-medium text-slate-600">Dashboards</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                          {selectedTemplate.defaultDashboards.length}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Pre-configured dashboards
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-amber-500" />
                          <p className="text-sm font-medium text-slate-600">Features</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">
                          {selectedTemplate.features.length}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Ready-to-use features
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Core Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="font-mono text-sm text-slate-700">
                        {selectedTemplate.coreWorkflow}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Confirm & Apply */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Confirm & Apply
                </h2>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Template Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-500">Template</p>
                        <p className="font-semibold text-slate-800">
                          {selectedTemplate?.id} - {selectedTemplate?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Complexity</p>
                        <Badge className={getComplexityBadge(selectedTemplate?.complexity || "")}>
                          {selectedTemplate?.complexity}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Setup Time</p>
                        <p className="text-sm text-slate-700">{selectedTemplate?.setupTime}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Tenant Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-500">Tenant</p>
                        <p className="font-semibold text-slate-800">
                          {selectedTenant?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Type</p>
                        <p className="text-sm text-slate-700">{selectedTenant?.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Plan</p>
                        <Badge>{selectedTenant?.plan}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="flex items-start gap-3 p-4">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">
                        Ready to apply template
                      </p>
                      <p className="mt-1 text-sm text-purple-700">
                        This will provision {selectedTemplate?.blueprints.length} blueprint(s),
                        create {selectedTemplate?.defaultRoles.length} roles, and configure{" "}
                        {selectedTemplate?.defaultDashboards.length} dashboards for{" "}
                        {selectedTenant?.name}. This action cannot be undone.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-emerald-100 p-6">
                  <CheckCircle className="h-16 w-16 text-emerald-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-800">
                  Template Applied Successfully!
                </h2>
                <p className="mt-2 text-center text-slate-600">
                  {selectedTemplate?.name} has been applied to {selectedTenant?.name}
                </p>
                <div className="mt-8 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/superadmin/templates")}
                  >
                    Back to Templates
                  </Button>
                  <Button
                    onClick={() => router.push(`/superadmin/tenants/${selectedTenant?._id}`)}
                  >
                    View Tenant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      {currentStep < 5 && !loading && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          {currentStep === 4 ? (
            <Button onClick={handleApply} disabled={!canProceed() || applying}>
              {applying ? "Applying..." : "Apply Template"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </PageLayout>
  )
}
