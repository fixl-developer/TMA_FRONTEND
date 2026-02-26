"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { 
  ArrowLeft, ArrowRight, Check, Package, 
  Settings, CheckCircle, AlertTriangle
} from "lucide-react"
import { 
  getAutomationPack,
  getAutomationRulesByPackAsync,
  installAutomationPack,
  type AutomationPack
} from "@/shared/services/automationService"
import { getBlueprints } from "@/shared/services/blueprintService"

export default function PackInstallWizardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packId = searchParams.get("packId")

  const [step, setStep] = useState(1)
  const [pack, setPack] = useState<AutomationPack | null>(null)
  const [rules, setRules] = useState<any[]>([])
  const [blueprints, setBlueprints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)

  // Installation config
  const [config, setConfig] = useState({
    tenantId: "tenant_demo",
    enableAllRules: true,
    selectedRules: [] as string[],
    applyToBlueprints: [] as string[]
  })

  useEffect(() => {
    if (packId) {
      loadData()
    }
  }, [packId])

  async function loadData() {
    if (!packId) return
    
    setLoading(true)
    const [packData, rulesData, blueprintsData] = await Promise.all([
      getAutomationPack(packId),
      getAutomationRulesByPackAsync(packId),
      getBlueprints()
    ])
    
    if (packData) {
      setPack(packData)
      setRules(rulesData)
      setBlueprints(blueprintsData.filter(b => packData.blueprints.includes(b.id)))
      setConfig(prev => ({
        ...prev,
        selectedRules: rulesData.map(r => r.id)
      }))
    }
    setLoading(false)
  }

  async function handleInstall() {
    if (!pack) return
    
    setInstalling(true)
    const result = await installAutomationPack(pack.id, config.tenantId)
    setInstalling(false)
    
    if (result.success) {
      setInstalled(true)
      setStep(4)
    }
  }

  function toggleRule(ruleId: string) {
    setConfig(prev => ({
      ...prev,
      selectedRules: prev.selectedRules.includes(ruleId)
        ? prev.selectedRules.filter(id => id !== ruleId)
        : [...prev.selectedRules, ruleId]
    }))
  }

  function toggleBlueprint(blueprintId: string) {
    setConfig(prev => ({
      ...prev,
      applyToBlueprints: prev.applyToBlueprints.includes(blueprintId)
        ? prev.applyToBlueprints.filter(id => id !== blueprintId)
        : [...prev.applyToBlueprints, blueprintId]
    }))
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading installation wizard...</div>
        </div>
      </PageLayout>
    )
  }

  if (!pack) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Pack not found</h3>
          <Button onClick={() => router.push("/superadmin/automation/packs")}>
            Back to Packs
          </Button>
        </div>
      </PageLayout>
    )
  }

  const steps = [
    { number: 1, title: "Review Pack", icon: Package },
    { number: 2, title: "Select Rules", icon: Settings },
    { number: 3, title: "Configure", icon: Settings },
    { number: 4, title: "Complete", icon: CheckCircle }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/automation/packs")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Install {pack.name}</span>
          </div>
        }
        description="Follow the steps to install this automation pack"
      />

      {/* Progress Steps */}
      <PageSection>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon
              const isActive = step === s.number
              const isComplete = step > s.number
              
              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isComplete ? "bg-green-600 text-white" :
                      isActive ? "bg-primary text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className={`mt-2 text-sm font-medium ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {s.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step > s.number ? "bg-green-600" : "bg-muted"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </PageSection>

      {/* Step Content */}
      <PageSection>
        {/* Step 1: Review Pack */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Pack Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium text-lg">{pack.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div>{pack.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <Badge>{pack.category}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Version</div>
                    <Badge variant="outline">{pack.version}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={pack.status === "ACTIVE" ? "default" : "secondary"}>
                      {pack.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Rules</div>
                    <div className="font-medium">{pack.rules.length} rules</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Compatible Blueprints</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {blueprints.map(blueprint => (
                  <div key={blueprint.id} className="p-3 border rounded">
                    <div className="font-medium text-sm">{blueprint.name}</div>
                    <div className="text-xs text-muted-foreground">{blueprint.category}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Select Rules */}
        {step === 2 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Select Rules to Install</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfig(prev => ({
                  ...prev,
                  enableAllRules: !prev.enableAllRules,
                  selectedRules: !prev.enableAllRules ? rules.map(r => r.id) : []
                }))}
              >
                {config.enableAllRules ? "Deselect All" : "Select All"}
              </Button>
            </div>
            <div className="space-y-2">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className="flex items-center gap-3 p-3 border rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleRule(rule.id)}
                >
                  <input
                    type="checkbox"
                    checked={config.selectedRules.includes(rule.id)}
                    onChange={() => toggleRule(rule.id)}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-muted-foreground">{rule.description}</div>
                  </div>
                  <Badge variant="outline">{rule.priority}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Step 3: Configure */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Installation Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tenant ID</label>
                  <input
                    type="text"
                    value={config.tenantId}
                    onChange={(e) => setConfig(prev => ({ ...prev, tenantId: e.target.value }))}
                    className="w-full mt-2 px-3 py-2 border rounded-md"
                    placeholder="tenant_demo"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Apply to Blueprints (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {blueprints.map(blueprint => (
                  <div
                    key={blueprint.id}
                    className={`p-3 border rounded cursor-pointer ${
                      config.applyToBlueprints.includes(blueprint.id) ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => toggleBlueprint(blueprint.id)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.applyToBlueprints.includes(blueprint.id)}
                        onChange={() => toggleBlueprint(blueprint.id)}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium text-sm">{blueprint.name}</div>
                        <div className="text-xs text-muted-foreground">{blueprint.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Installation Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>• Installing {config.selectedRules.length} of {rules.length} rules</div>
                <div>• Target tenant: {config.tenantId}</div>
                <div>• Applying to {config.applyToBlueprints.length} blueprint(s)</div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <Card className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Installation Complete!</h3>
            <p className="text-muted-foreground mb-6">
              {pack.name} has been successfully installed with {config.selectedRules.length} rules.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push(`/superadmin/automation/packs/${pack.id}`)}>
                View Pack Details
              </Button>
              <Button variant="outline" onClick={() => router.push("/superadmin/automation/packs")}>
                Back to Packs
              </Button>
            </div>
          </Card>
        )}
      </PageSection>

      {/* Navigation */}
      {step < 4 && (
        <PageSection>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleInstall} disabled={installing}>
                  {installing ? "Installing..." : "Install Pack"}
                </Button>
              )}
            </div>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
