\"use client\"

import { useEffect, useMemo, useState } from \"react\"
import Link from \"next/link\"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  FileCheck,
  Layers,
  Rocket,
  ShieldCheck,
  Users2,
} from \"lucide-react\"
import { PageLayout, PageHeader, PageSection } from \"@/shared/components/layout/PageLayout\"
import { Card, CardContent, CardHeader, CardTitle } from \"@/shared/components/ui/card\"
import { Button } from \"@/shared/components/ui/button\"
import { Input } from \"@/shared/components/ui/input\"
import { useToast } from \"@/shared/components/ui/toast\"
import { cn } from \"@/shared/lib/utils\"
import type { Tenant } from \"@/shared/lib/types/tenants\"
import type { TenantTemplate } from \"@/shared/lib/types/templates\"
import type { Blueprint } from \"@/shared/lib/types/blueprints\"
import { getTenants, setTenantBlueprints } from \"@/shared/services/tenantService\"
import { getTemplates } from \"@/shared/services/templateService\"
import { getBlueprints } from \"@/shared/services/blueprintService\"

const STEPS = [
  { id: 1, label: \"Tenant information\", icon: Users2 },
  { id: 2, label: \"Template selection\", icon: Layers },
  { id: 3, label: \"Blueprint selection\", icon: FileCheck },
  { id: 4, label: \"Configuration\", icon: ClipboardList },
  { id: 5, label: \"Verification\", icon: ShieldCheck },
  { id: 6, label: \"Deployment\", icon: Rocket },
] as const

type StepId = (typeof STEPS)[number][\"id\"]

export default function OnboardingWizardPage() {
  const { showToast } = useToast()
  const [step, setStep] = useState<StepId>(1)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [templates, setTemplates] = useState<TenantTemplate[]>([])
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)

  const [tenantSearch, setTenantSearch] = useState(\"\")
  const [selectedTenantId, setSelectedTenantId] = useState<string>(\"\")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(\"\")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [t, tmpl, bps] = await Promise.all([getTenants(), getTemplates(), getBlueprints()])
        setTenants(t)
        setTemplates(tmpl)
        setBlueprints(bps)
        if (!selectedTenantId && t.length) {
          setSelectedTenantId(t[0]._id)
        }
        if (!selectedTemplateId && tmpl.length) {
          setSelectedTemplateId(tmpl[0].id)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const tenant = useMemo(
    () => tenants.find((t) => t._id === selectedTenantId),
    [tenants, selectedTenantId]
  )

  const template = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
  )

  const filteredTenants = useMemo(() => {
    if (!tenantSearch.trim()) return tenants
    const q = tenantSearch.toLowerCase()
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t._id.toLowerCase().includes(q)
    )
  }, [tenants, tenantSearch])

  const blueprintIdsFromTemplate = useMemo(
    () => new Set(template?.includedBlueprints ?? []),
    [template]
  )

  const currentBlueprintIds = useMemo(
    () => new Set((tenant?.blueprints as string[] | undefined) ?? []),
    [tenant]
  )

  const mergedBlueprintIds = useMemo(() => {
    const merged = new Set<string>(currentBlueprintIds)
    blueprintIdsFromTemplate.forEach((id) => merged.add(id))
    return Array.from(merged).sort()
  }, [currentBlueprintIds, blueprintIdsFromTemplate])

  const mergedBlueprints = useMemo(
    () =>
      mergedBlueprintIds
        .map((id) => blueprints.find((b) => b.id === id))
        .filter((b): b is Blueprint => Boolean(b)),
    [mergedBlueprintIds, blueprints]
  )

  const canNextFromStep1 = Boolean(selectedTenantId)
  const canNextFromStep2 = Boolean(selectedTemplateId)

  const handleDeploy = async () => {
    if (!tenant || mergedBlueprintIds.length === 0) {
      showToast(\"Select a tenant and template before deployment.\", \"error\")
      return
    }
    setDeploying(true)
    try {
      await setTenantBlueprints(tenant._id, mergedBlueprintIds)
      showToast(
        `Onboarding deployed: ${tenant.name} now has ${mergedBlueprintIds.length} blueprint(s).`,
        \"success\"
      )
    } catch {
      showToast(\"Failed to deploy onboarding configuration.\", \"error\")
    } finally {
      setDeploying(false)
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title=\"Tenant onboarding wizard\"
        description=\"Step-by-step wizard to onboard a tenant: information, template, blueprints, configuration, verification and deployment. Seed + local state only in this phase.\"
        badge={
          <span className=\"inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]\">
            <Rocket className=\"h-3.5 w-3.5 text-[#0078d4]\" />
            Onboarding
          </span>
        }
        actions={
          <Button asChild variant=\"outline\" size=\"sm\" className=\"gap-1.5\">
            <Link href=\"/tenants\">
              <ArrowLeft className=\"h-3.5 w-3.5\" />
              Tenants
            </Link>
          </Button>
        }
      />

      <PageSection>
        {/* Step indicator */}
        <div className=\"mb-6 flex flex-wrap items-center gap-2\">
          {STEPS.map((s, index) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isPast = step > s.id
            return (
              <div key={s.id} className=\"flex items-center gap-2\">
                <button
                  type=\"button\"
                  onClick={() => setStep(s.id)}
                  className={cn(
                    \"flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors\",
                    isActive && \"border-[#0078d4] bg-[#deecf9] text-[#0078d4]\",
                    isPast && \"border-[#107c10] bg-[#dff6dd] text-[#107c10]\",
                    !isActive &&
                      !isPast &&
                      \"border-[#edebe9] bg-[#faf9f8] text-[#605e5c] hover:bg-[#f3f2f1]\"
                  )}
                >
                  <span
                    className={cn(
                      \"flex h-6 w-6 items-center justify-center rounded-full text-xs\",
                      isActive && \"bg-[#0078d4] text-white\",
                      isPast && \"bg-[#107c10] text-white\",
                      !isActive && !isPast && \"bg-[#e1e1e1] text-[#605e5c]\"
                    )}
                  >
                    {isPast ? <Check className=\"h-3.5 w-3.5\" /> : s.id}
                  </span>
                  <Icon className=\"h-4 w-4\" />
                  {s.label}
                </button>
                {index < STEPS.length - 1 && (
                  <span className=\"hidden text-[#8a8886] sm:inline\">→</span>
                )}
              </div>
            )
          })}
        </div>

        {loading ? (
          <Card>
            <CardContent className=\"flex items-center justify-center py-10 text-sm text-[#605e5c]\">
              Loading tenants, templates and blueprints…
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Step 1: Tenant information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className=\"text-base\">Step 1 · Tenant information</CardTitle>
                  <p className=\"text-sm text-[#605e5c]\">
                    Pick an existing tenant to simulate onboarding. In a later phase this will also
                    support creating new tenants from signup.
                  </p>
                </CardHeader>
                <CardContent className=\"space-y-4\">
                  <div className=\"relative\">
                    <Input
                      placeholder=\"Search tenants by name, slug, or ID…\"
                      value={tenantSearch}
                      onChange={(e) => setTenantSearch(e.target.value)}
                      className=\"pl-3 text-sm\"
                    />
                  </div>
                  <div className=\"max-h-[320px] overflow-y-auto rounded border border-[#edebe9] bg-[#faf9f8]\">
                    {filteredTenants.length === 0 ? (
                      <p className=\"p-4 text-sm text-[#605e5c]\">
                        No tenants match the current search.
                      </p>
                    ) : (
                      <ul className=\"divide-y divide-[#edebe9]\">
                        {filteredTenants.map((t) => (
                          <li key={t._id}>
                            <button
                              type=\"button\"
                              onClick={() => setSelectedTenantId(t._id)}
                              className={cn(
                                \"flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#f3f2f1]\",
                                selectedTenantId === t._id && \"bg-[#deecf9]\"
                              )}
                            >
                              <span
                                className={cn(
                                  \"mt-1 h-3 w-3 rounded-full border\",
                                  selectedTenantId === t._id
                                    ? \"border-[#0078d4] bg-[#0078d4]\"
                                    : \"border-[#8a8886] bg-white\"
                                )}
                              />
                              <div>
                                <p className=\"text-sm font-medium text-[#323130]\">{t.name}</p>
                                <p className=\"text-xs text-[#605e5c]\">
                                  {t._id} · {t.slug} · {t.status}
                                </p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Template selection */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className=\"text-base\">Step 2 · Template selection</CardTitle>
                  <p className=\"text-sm text-[#605e5c]\">
                    Choose one of the T1–T8 tenant templates. The template’s included blueprints
                    will be merged with the tenant’s existing blueprints.
                  </p>
                </CardHeader>
                <CardContent className=\"space-y-4\">
                  <div className=\"space-y-2\">
                    <label className=\"text-xs font-semibold uppercase tracking-wide text-[#605e5c]\">
                      Template
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className=\"w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm\"
                    >
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  {template && (
                    <div className=\"rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5 text-xs text-[#323130]\">
                      <p className=\"text-sm font-semibold text-[#323130]\">
                        {template.name} · <span className=\"font-mono\">{template.code}</span>
                      </p>
                      <p className=\"mt-1 text-[#605e5c]\">{template.description}</p>
                      <p className=\"mt-1 text-[#605e5c]\">
                        Included blueprints:{" "}
                        <span className=\"font-mono\">
                          {template.includedBlueprints.join(\", \")}
                        </span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Blueprint selection (preview only in this phase) */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className=\"text-base\">Step 3 · Blueprint selection</CardTitle>
                  <p className=\"text-sm text-[#605e5c]\">
                    Preview how the tenant’s blueprint set changes when applying the selected
                    template. In a later phase this step can support fine-grained per-blueprint
                    toggles.
                  </p>
                </CardHeader>
                <CardContent className=\"space-y-4\">
                  <div className=\"grid gap-4 md:grid-cols-2 text-xs text-[#323130]\">
                    <div className=\"rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5\">
                      <p className=\"text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]\">
                        Current blueprints
                      </p>
                      <div className=\"mt-1 flex flex-wrap gap-1\">
                        {Array.from(currentBlueprintIds).length === 0 ? (
                          <span className=\"text-[#8a8886]\">None</span>
                        ) : (
                          Array.from(currentBlueprintIds).map((id) => (
                            <span
                              key={id}
                              className=\"rounded border border-[#edebe9] bg-[#f3f2f1] px-2 py-0.5 font-mono\"
                            >
                              {id}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    <div className=\"rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5\">
                      <p className=\"text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]\">
                        New blueprints (merged)
                      </p>
                      <div className=\"mt-1 flex flex-wrap gap-1\">
                        {mergedBlueprintIds.length === 0 ? (
                          <span className=\"text-[#8a8886]\">None</span>
                        ) : (
                          mergedBlueprintIds.map((id) => (
                            <span
                              key={id}
                              className={cn(
                                \"rounded border px-2 py-0.5 font-mono\",
                                currentBlueprintIds.has(id)
                                  ? \"border-[#edebe9] bg-[#f3f2f1]\"
                                  : \"border-[#0078d4] bg-[#deecf9] text-[#0078d4]\"
                              )}
                            >
                              {id}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {mergedBlueprints.length > 0 && (
                    <div className=\"rounded border border-[#edebe9] bg-white\">
                      <table className=\"w-full text-left text-xs\">
                        <thead className=\"border-b border-[#edebe9] bg-[#faf9f8]\">
                          <tr>
                            <th className=\"px-3 py-2 font-semibold text-[#323130]\">Blueprint</th>
                            <th className=\"px-3 py-2 font-semibold text-[#323130]\">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mergedBlueprints.map((b) => (
                            <tr key={b.id} className=\"border-b border-[#edebe9]\">
                              <td className=\"px-3 py-2\">
                                <span className=\"text-sm font-medium text-[#323130]\">
                                  {b.name}
                                </span>
                                <span className=\"ml-1 font-mono text-[11px] text-[#605e5c]\">
                                  ({b.code})
                                </span>
                              </td>
                              <td className=\"px-3 py-2 text-[#605e5c]\">{b.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Configuration (read-only summary for now) */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className=\"text-base\">Step 4 · Configuration</CardTitle>
                  <p className=\"text-sm text-[#605e5c]\">
                    High-level configuration preview combining tenant details, template use case and
                    key blueprints. Detailed per-module configuration can be added later.
                  </p>
                </CardHeader>
                <CardContent className=\"grid gap-4 md:grid-cols-2 text-xs text-[#323130]\">
                  <div className=\"rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5\">
                    <p className=\"text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]\">
                      Tenant
                    </p>
                    {tenant ? (
                      <>
                        <p className=\"mt-1 text-sm font-semibold text-[#323130]\">{tenant.name}</p>
                        <p className=\"text-[11px] text-[#605e5c]\">
                          {tenant._id} · {tenant.slug} · {tenant.type}
                        </p>
                      </>
                    ) : (
                      <p className=\"mt-1 text-[#8a8886]\">No tenant selected.</p>
                    )}
                  </div>
                  <div className=\"rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5\">
                    <p className=\"text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]\">
                      Template
                    </p>
                    {template ? (
                      <>
                        <p className=\"mt-1 text-sm font-semibold text-[#323130]\">
                          {template.name}
                        </p>
                        <p className=\"text-[11px] text-[#605e5c]\">
                          Code <span className=\"font-mono\">{template.code}</span> ·{" "}
                          {template.useCase}
                        </p>
                      </>
                    ) : (
                      <p className=\"mt-1 text-[#8a8886]\">No template selected.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Verification (static checks for this phase) */}
            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className=\"text-base\">Step 5 · Verification</CardTitle>
                  <p className=\"text-sm text-[#605e5c]\">
                    KYC, documents, payment method and compliance checks are represented as
                    read-only flags for now. In production this will integrate with dedicated
                    verification services.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className=\"grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs text-[#323130]\">
                    {[
                      \"KYC verification\",
                      \"Document verification\",
                      \"Payment verification\",
                      \"Compliance checks\",
                    ].map((label) => (
                      <div
                        key={label}
                        className=\"flex items-center justify-between gap-2 rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5\"
                      >
                        <div>
                          <p className=\"text-[11px] font-semibold text-[#323130]\">{label}</p>
                          <p className=\"text-[11px] text-[#605e5c]\">
                            Seed-only status for demo purposes.
                          </p>
                        </div>
                        <span className=\"inline-flex items-center gap-1 rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#107c10]\">
                          <Check className=\"h-3 w-3\" />
                          Passed
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Deployment */}
            {step === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className=\"text-base\">Step 6 · Deployment</CardTitle>
                  <p className=\"text-sm text-[#605e5c]\">
                    Confirm onboarding and apply the merged blueprint configuration to the selected
                    tenant. This writes to localStorage via the tenant service, keeping the demo
                    consistent across pages.
                  </p>
                </CardHeader>
                <CardContent className=\"space-y-4 text-sm text-[#323130]\">
                  <div className=\"rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5 text-xs\">
                    <p className=\"font-semibold text-[#323130]\">
                      {tenant ? tenant.name : \"No tenant selected\"}
                    </p>
                    <p className=\"mt-1 text-[#605e5c]\">
                      Blueprints after deployment:{" "}
                      <span className=\"font-mono\">{mergedBlueprintIds.join(\", \") || \"none\"}</span>
                    </p>
                  </div>
                  <Button
                    onClick={handleDeploy}
                    disabled={deploying || !tenant || mergedBlueprintIds.length === 0}
                    className=\"gap-2\"
                  >
                    <Rocket className=\"h-4 w-4\" />
                    {deploying ? \"Deploying…\" : \"Deploy onboarding\"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation controls */}
            <div className=\"mt-6 flex items-center justify-between\">
              <Button
                variant=\"outline\"
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as StepId) : s))}
                disabled={step === 1}
                className=\"gap-1.5\"
              >
                <ArrowLeft className=\"h-3.5 w-3.5\" />
                Back
              </Button>
              {step < 6 && (
                <Button
                  onClick={() => setStep((s) => ((s + 1) as StepId))}
                  disabled={
                    (step === 1 && !canNextFromStep1) ||
                    (step === 2 && !canNextFromStep2)
                  }
                  className=\"gap-1.5\"
                >
                  Next
                  <ArrowRight className=\"h-3.5 w-3.5\" />
                </Button>
              )}
            </div>
          </>
        )}
      </PageSection>
    </PageLayout>
  )
}

