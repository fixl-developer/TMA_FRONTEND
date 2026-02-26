/**
 * Blueprint Assignment Wizard - Super Admin
 * 
 * Multi-step wizard to assign blueprints to tenants:
 * Step 1: Select Blueprint
 * Step 2: Select Tenant
 * Step 3: Check Compatibility
 * Step 4: Preview Configuration
 * Step 5: Confirm & Assign
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react"
import {
  getBlueprints,
  assignBlueprintToTenant,
  type Blueprint,
  type BlueprintId
} from "@/shared/services/blueprintService"
import { getTenants } from "@/shared/services/tenantService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { useToast } from "@/shared/components/ui/toast"

type Step = 1 | 2 | 3 | 4 | 5

interface CompatibilityCheck {
  passed: boolean
  message: string
  severity: "error" | "warning" | "info"
}

export default function BlueprintAssignPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)

  // Selection state
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null)
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null)
  const [compatibilityChecks, setCompatibilityChecks] = useState<CompatibilityCheck[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [blueprintsData, tenantsData] = await Promise.all([
          getBlueprints(),
          getTenants()
        ])
        setBlueprints(blueprintsData.filter(bp => bp.status === "ACTIVE"))
        setTenants(tenantsData.filter(t => t.status === "ACTIVE"))
      } catch (e) {
        console.error("Failed to load data", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (selectedBlueprint && selectedTenant) {
      performCompatibilityCheck()
    }
  }, [selectedBlueprint, selectedTenant])

  const performCompatibilityCheck = () => {
    if (!selectedBlueprint || !selectedTenant) return

    const checks: CompatibilityCheck[] = []

    // Check dependencies
    if (selectedBlueprint.dependencies.length > 0) {
      const hasAllDeps = selectedBlueprint.dependencies.every(depId =>
        (selectedTenant.approvedBlueprints || []).includes(depId)
      )
      checks.push({
        passed: hasAllDeps,
        message: hasAllDeps
          ? `All dependencies satisfied (${selectedBlueprint.dependencies.join(", ")})`
          : `Missing dependencies: ${selectedBlueprint.dependencies.join(", ")}`,
        severity: hasAllDeps ? "info" : "error"
      })
    } else {
      checks.push({
        passed: true,
        message: "No dependencies required",
        severity: "info"
      })
    }

    // Check plan compatibility
    const planCheck = selectedTenant.plan !== "STARTER" || selectedBlueprint.category !== "ADVANCED"
    checks.push({
      passed: planCheck,
      message: planCheck
        ? `Plan ${selectedTenant.plan} supports ${selectedBlueprint.category} blueprints`
        : `Plan ${selectedTenant.plan} does not support ADVANCED blueprints`,
      severity: planCheck ? "info" : "error"
    })

    // Check existing blueprints
    const alreadyHas = (selectedTenant.approvedBlueprints || []).includes(selectedBlueprint.id)
    checks.push({
      passed: !alreadyHas,
      message: alreadyHas
        ? `Tenant already has ${selectedBlueprint.id}`
        : `Blueprint not yet assigned`,
      severity: alreadyHas ? "warning" : "info"
    })

    setCompatibilityChecks(checks)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedBlueprint !== null
      case 2:
        return selectedTenant !== null
      case 3:
        return compatibilityChecks.every(check => check.severity !== "error")
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

  const handleAssign = async () => {
    if (!selectedBlueprint || !selectedTenant) return

    setAssigning(true)
    try {
      const result = await assignBlueprintToTenant(
        selectedTenant._id,
        selectedBlueprint.id
      )
      if (result.success) {
        showToast(result.message, "success")
        setCurrentStep(5)
      } else {
        showToast(result.message, "error")
      }
    } catch (e) {
      showToast("Failed to assign blueprint", "error")
    } finally {
      setAssigning(false)
    }
  }

  const steps = [
    { number: 1, label: "Select Blueprint" },
    { number: 2, label: "Select Tenant" },
    { number: 3, label: "Compatibility Check" },
    { number: 4, label: "Preview & Confirm" },
    { number: 5, label: "Complete" }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/blueprints/catalog")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Assign Blueprint to Tenant</span>
          </div>
        }
        description="Multi-step wizard to assign blueprints with compatibility checks"
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
                      ? "border-blue-500 bg-blue-500 text-white"
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
            {/* Step 1: Select Blueprint */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Select a Blueprint
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {blueprints.map((blueprint) => (
                    <Card
                      key={blueprint.id}
                      className={`cursor-pointer transition-all ${
                        selectedBlueprint?.id === blueprint.id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedBlueprint(blueprint)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-xs font-semibold text-slate-600">
                              {blueprint.id}
                            </span>
                            <CardTitle className="mt-1 text-base">
                              {blueprint.name}
                            </CardTitle>
                          </div>
                          {selectedBlueprint?.id === blueprint.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {blueprint.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline">{blueprint.category}</Badge>
                          <span className="text-xs text-slate-500">
                            {blueprint.tenantCount} tenants
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
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedTenant(tenant)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-blue-100 p-3">
                            <Users className="h-5 w-5 text-blue-600" />
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
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Compatibility Check */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Compatibility Check
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Checking compatibility for {selectedBlueprint?.name} →{" "}
                      {selectedTenant?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {compatibilityChecks.map((check, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-lg border p-4 ${
                          check.severity === "error"
                            ? "border-red-200 bg-red-50"
                            : check.severity === "warning"
                            ? "border-amber-200 bg-amber-50"
                            : "border-emerald-200 bg-emerald-50"
                        }`}
                      >
                        {check.severity === "error" ? (
                          <X className="h-5 w-5 shrink-0 text-red-500" />
                        ) : check.severity === "warning" ? (
                          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                        )}
                        <p
                          className={`text-sm ${
                            check.severity === "error"
                              ? "text-red-700"
                              : check.severity === "warning"
                              ? "text-amber-700"
                              : "text-emerald-700"
                          }`}
                        >
                          {check.message}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Preview & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Preview & Confirm
                </h2>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Blueprint Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-500">Blueprint</p>
                        <p className="font-semibold text-slate-800">
                          {selectedBlueprint?.id} - {selectedBlueprint?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Category</p>
                        <Badge>{selectedBlueprint?.category}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Modules</p>
                        <p className="text-sm text-slate-700">
                          {selectedBlueprint?.defaultModules.length} modules
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Roles</p>
                        <p className="text-sm text-slate-700">
                          {selectedBlueprint?.defaultRoles.length} roles
                        </p>
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
                      <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <Badge className="bg-emerald-100 text-emerald-700">
                          {selectedTenant?.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="flex items-start gap-3 p-4">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Ready to assign blueprint
                      </p>
                      <p className="mt-1 text-sm text-blue-700">
                        This will enable {selectedBlueprint?.defaultModules.length}{" "}
                        modules, create {selectedBlueprint?.defaultRoles.length} roles,
                        and configure {selectedBlueprint?.defaultDashboards.length}{" "}
                        dashboards for {selectedTenant?.name}.
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
                  Blueprint Assigned Successfully!
                </h2>
                <p className="mt-2 text-center text-slate-600">
                  {selectedBlueprint?.name} has been assigned to {selectedTenant?.name}
                </p>
                <div className="mt-8 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/superadmin/blueprints/catalog")}
                  >
                    Back to Catalog
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
            <Button onClick={handleAssign} disabled={!canProceed() || assigning}>
              {assigning ? "Assigning..." : "Assign Blueprint"}
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
