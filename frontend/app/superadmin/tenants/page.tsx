/**
 * Tenants Management Dashboard - Super Admin
 *
 * Cinematic, read-only overview of tenants using seed data.
 */

"use client"

import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Building2, Globe2, RefreshCcw, Eye, Shield, ShieldOff, ChevronDown, ChevronRight } from "lucide-react"
import {
  getTenants,
  suspendTenant,
  activateTenant,
  approveTenantBlueprint,
  updateTenantCompliance,
  updateTenantGroupPolicyPack,
  markTenantBlueprintReviewed,
  resetTenantDemoOverrides,
} from "@/shared/services/tenantService"
import { getPageants } from "@/shared/services/pageantService"
import { seedTalents, seedStaff, seedBookings, seedSubTenantLinks } from "@/data/seed"
import { AGENCY_TYPE_LABELS } from "@/shared/lib/constants/agencyBlueprints"
import type { Tenant } from "@/shared/lib/types/tenants"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetCloseButton,
} from "@/shared/components/ui/sheet"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog"
import { useToast } from "@/shared/components/ui/toast"

type StatusFilter = "ALL" | Tenant["status"]
type ComplianceField = "kycVerified" | "agencyVerified" | "payoutsEnabled"
type ComplianceState = Record<ComplianceField, boolean>
type ApprovalRole = "COMPLIANCE_REVIEWER" | "PLATFORM_APPROVER"

const DEFAULT_GROUP_POLICY_PACK = {
  payoutCapMinor: 250000,
  requireDualApprovalForPayouts: true,
  restrictedBlueprints: ["B9"],
  childTenantKycRequired: true,
}

const BLUEPRINT_POLICY_RULES: Record<
  string,
  {
    label: string
    requirements: Array<{ field: ComplianceField; label: string }>
    note?: string
  }
> = {
  B3: {
    label: "Competition",
    requirements: [
      { field: "kycVerified", label: "KYC verified" },
      { field: "agencyVerified", label: "Agency verified" },
    ],
  },
  B4: {
    label: "Brand Deals",
    requirements: [
      { field: "kycVerified", label: "KYC verified" },
      { field: "agencyVerified", label: "Agency verified" },
    ],
  },
  B7: {
    label: "Staffing",
    requirements: [
      { field: "kycVerified", label: "KYC verified" },
      { field: "payoutsEnabled", label: "Payouts enabled" },
    ],
  },
  B10: {
    label: "Multi-tenant",
    requirements: [{ field: "agencyVerified", label: "Agency verified" }],
    note: "Requires enterprise governance review.",
  },
}

function evaluateBlueprintPolicy(blueprintId: string, compliance: ComplianceState) {
  const rule = BLUEPRINT_POLICY_RULES[blueprintId]
  if (!rule) {
    return {
      allowed: true,
      label: blueprintId,
      checks: [] as Array<{ label: string; pass: boolean }>,
      note: "",
    }
  }
  const checks = rule.requirements.map((item) => ({
    label: item.label,
    pass: Boolean(compliance[item.field]),
  }))
  return {
    allowed: checks.every((check) => check.pass),
    label: rule.label,
    checks,
    note: rule.note || "",
  }
}

export default function TenantsDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [pageants, setPageants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<string[]>([])
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [confirmSuspendOpen, setConfirmSuspendOpen] = useState(false)
  const [confirmActivateOpen, setConfirmActivateOpen] = useState(false)
  const [expandedB10, setExpandedB10] = useState<Set<string>>(new Set())
  const [approvingBlueprintId, setApprovingBlueprintId] = useState<string | null>(null)
  const [reviewingBlueprintId, setReviewingBlueprintId] = useState<string | null>(null)
  const [approvalReason, setApprovalReason] = useState("")
  const [approvalRole, setApprovalRole] = useState<ApprovalRole>("COMPLIANCE_REVIEWER")
  const [complianceDraft, setComplianceDraft] = useState<ComplianceState>({
    kycVerified: false,
    agencyVerified: false,
    payoutsEnabled: false,
  })
  const [savingCompliance, setSavingCompliance] = useState(false)
  const [groupPolicyDraft, setGroupPolicyDraft] = useState("")
  const [savingGroupPolicy, setSavingGroupPolicy] = useState(false)
  const [resettingOverrides, setResettingOverrides] = useState(false)
  const policyImportInputRef = useRef<HTMLInputElement | null>(null)
  const { showToast } = useToast()

  const subTenantsByGroup = useMemo(() => {
    const links = (seedSubTenantLinks as { groupId: string; subTenantId: string }[]) || []
    const map: Record<string, string[]> = {}
    links.forEach((l) => {
      if (!map[l.groupId]) map[l.groupId] = []
      map[l.groupId].push(l.subTenantId)
    })
    return map
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const [tenantsData, pageantsData] = await Promise.all([
          getTenants(),
          getPageants(),
        ])
        setTenants(tenantsData)
        setPageants(pageantsData)
      } catch (e) {
        console.error("Failed to load data", e)
        showToast("Failed to load tenants", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [showToast])

  const metrics = useMemo(() => {
    const total = tenants.length
    const active = tenants.filter((t) => t.status === "ACTIVE").length
    const suspended = tenants.filter((t) => t.status === "SUSPENDED").length

    const byType = tenants.reduce<Record<string, number>>((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1
      return acc
    }, {})

    const byCountry = tenants.reduce<Record<string, number>>((acc, t) => {
      if (!t.countryCode) return acc
      acc[t.countryCode] = (acc[t.countryCode] || 0) + 1
      return acc
    }, {})

    return { total, active, suspended, byType, byCountry }
  }, [tenants])

  const filteredTenants = useMemo(() => {
    let filtered = tenants

    // Status filter
    if (filter !== "ALL") {
      filtered = filtered.filter((t) => t.status === filter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.slug.toLowerCase().includes(query) ||
          t._id.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter((t) => typeFilter.includes(t.type))
    }

    // Agency type filter (e.g. Modeling Agency)
    if (agencyTypeFilter.length > 0) {
      filtered = filtered.filter(
        (t) => (t as any).agencyType && agencyTypeFilter.includes((t as any).agencyType)
      )
    }

    return filtered
  }, [tenants, filter, searchQuery, typeFilter, agencyTypeFilter])

  const getTenantStats = (tenantId: string) => {
    const tenantPageants = pageants.filter((p) => p.tenantId === tenantId)
    const tenantTalents = seedTalents.filter((t: any) => t.tenantId === tenantId)
    const tenantStaff = seedStaff.filter((s: any) => s.tenantId === tenantId)
    const tenantBookings = seedBookings.filter((b: any) => b.tenantId === tenantId)
    return {
      pageants: tenantPageants.length,
      activePageants: tenantPageants.filter((p) => p.status === "ACTIVE").length,
      talents: tenantTalents.length,
      staff: tenantStaff.length,
      bookings: tenantBookings.length,
    }
  }

  const typeOptions: FilterOption[] = [
    { value: "AGENCY", label: "Agency" },
    { value: "PAGEANT_ORG", label: "Pageant Organiser" },
    { value: "EVENT_ORG", label: "Event Organiser" },
    { value: "BRAND", label: "Brand / Sponsor" },
    { value: "HOLDING", label: "Holding Company" },
  ]

  const agencyTypeOptions: FilterOption[] = Object.entries(AGENCY_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setApprovalReason("")
    setDetailOpen(true)
  }

  useEffect(() => {
    if (!selectedTenant) return
    const compliance = ((selectedTenant.settings as any)?.compliance as Partial<ComplianceState> | undefined) ?? {}
    const policyPack =
      ((selectedTenant.settings as any)?.groupPolicyPack as Record<string, any> | undefined) ??
      DEFAULT_GROUP_POLICY_PACK
    setComplianceDraft({
      kycVerified: Boolean(compliance.kycVerified),
      agencyVerified: Boolean(compliance.agencyVerified),
      payoutsEnabled: Boolean(compliance.payoutsEnabled),
    })
    setGroupPolicyDraft(JSON.stringify(policyPack, null, 2))
  }, [selectedTenant])

  const handleSuspend = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setConfirmSuspendOpen(true)
  }

  const handleActivate = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setConfirmActivateOpen(true)
  }

  const confirmSuspend = async () => {
    if (!selectedTenant) return
    await suspendTenant(selectedTenant._id)
    setTenants((prev) =>
      prev.map((t) =>
        t._id === selectedTenant._id ? { ...t, status: "SUSPENDED" as const } : t
      )
    )
    setSelectedTenant((prev) => (prev ? { ...prev, status: "SUSPENDED" as const } : null))
    showToast(`Suspended tenant: ${selectedTenant.name} (mock)`, "info")
    setConfirmSuspendOpen(false)
    setSelectedTenant(null)
  }

  const confirmActivate = async () => {
    if (!selectedTenant) return
    await activateTenant(selectedTenant._id)
    setTenants((prev) =>
      prev.map((t) =>
        t._id === selectedTenant._id ? { ...t, status: "ACTIVE" as const } : t
      )
    )
    setSelectedTenant((prev) => (prev ? { ...prev, status: "ACTIVE" as const } : null))
    showToast(`Activated tenant: ${selectedTenant.name} (mock)`, "success")
    setConfirmActivateOpen(false)
    setSelectedTenant(null)
  }

  const handleApproveBlueprint = async (blueprintId: string) => {
    if (!selectedTenant) return
    if (approvalRole !== "PLATFORM_APPROVER") {
      showToast("Switch role to Platform Approver to finalize approvals.", "error")
      return
    }
    if (approvalReason.trim().length < 8) {
      showToast("Please enter an approval reason (minimum 8 characters).", "error")
      return
    }
    const policy = evaluateBlueprintPolicy(blueprintId, complianceDraft)
    if (!policy.allowed) {
      showToast(`Policy blocks ${blueprintId}. Update compliance controls first.`, "error")
      return
    }
    const tenantLog = ((selectedTenant.settings as any)?.blueprintApprovalLog as Array<any> | undefined) ?? []
    const reviewed = tenantLog.some(
      (entry) => entry?.blueprintId === blueprintId && entry?.action === "REVIEWED"
    )
    if (!reviewed) {
      showToast(`Maker-checker: ${blueprintId} must be reviewed first.`, "error")
      return
    }
    setApprovingBlueprintId(blueprintId)
    try {
      const updated = await approveTenantBlueprint(selectedTenant._id, blueprintId, approvalReason)
      if (!updated) {
        showToast("Unable to approve blueprint for this tenant.", "error")
        return
      }
      setTenants((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
      setSelectedTenant(updated)
      setApprovalReason("")
      showToast(`Approved ${blueprintId} for ${updated.name}`, "success")
    } catch (e) {
      showToast("Failed to approve blueprint.", "error")
    } finally {
      setApprovingBlueprintId(null)
    }
  }

  const toggleComplianceDraft = (field: ComplianceField) => {
    setComplianceDraft((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const saveComplianceControls = async () => {
    if (!selectedTenant) return
    setSavingCompliance(true)
    try {
      const updated = await updateTenantCompliance(selectedTenant._id, complianceDraft)
      if (!updated) {
        showToast("Unable to update compliance controls.", "error")
        return
      }
      setSelectedTenant(updated)
      setTenants((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
      showToast(`Compliance controls updated for ${updated.name}`, "success")
    } catch (e) {
      showToast("Failed to update compliance controls.", "error")
    } finally {
      setSavingCompliance(false)
    }
  }

  const saveGroupPolicyPack = async () => {
    if (!selectedTenant) return
    let parsed: Record<string, any>
    try {
      parsed = JSON.parse(groupPolicyDraft)
    } catch {
      showToast("Group policy pack must be valid JSON.", "error")
      return
    }
    setSavingGroupPolicy(true)
    try {
      const updated = await updateTenantGroupPolicyPack(selectedTenant._id, parsed)
      if (!updated) {
        showToast("Unable to save group policy pack.", "error")
        return
      }
      setSelectedTenant(updated)
      setTenants((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
      showToast("Group policy pack updated.", "success")
    } catch {
      showToast("Failed to save group policy pack.", "error")
    } finally {
      setSavingGroupPolicy(false)
    }
  }

  const handleImportGroupPolicyPack = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      setGroupPolicyDraft(JSON.stringify(parsed, null, 2))
      showToast("Policy JSON imported. Review and save.", "success")
    } catch {
      showToast("Invalid JSON file. Please import a valid policy pack.", "error")
    } finally {
      e.target.value = ""
    }
  }

  const applyDemoScenario = async (scenario: "blocked" | "ready") => {
    if (!selectedTenant) return
    try {
      if (scenario === "blocked") {
        const updated = await updateTenantCompliance(selectedTenant._id, {
          kycVerified: false,
          agencyVerified: false,
          payoutsEnabled: false,
        })
        if (updated) {
          setSelectedTenant(updated)
          setTenants((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
        }
        showToast("Applied blocked scenario for screenshots.", "success")
        return
      }

      const complianceUpdated = await updateTenantCompliance(selectedTenant._id, {
        kycVerified: true,
        agencyVerified: true,
        payoutsEnabled: true,
      })
      const base = complianceUpdated ?? selectedTenant
      const pending = ((base as any).requestedBlueprints as string[] | undefined) ?? []
      let latest = base
      if (pending.length > 0) {
        const reviewed = await markTenantBlueprintReviewed(
          base._id,
          pending[0],
          "Demo reviewer sign-off for screenshot-ready scenario."
        )
        if (reviewed) latest = reviewed
      }
      setSelectedTenant(latest)
      setTenants((prev) => prev.map((t) => (t._id === latest._id ? latest : t)))
      showToast("Applied ready-to-approve scenario for screenshots.", "success")
    } catch {
      showToast("Unable to apply demo scenario.", "error")
    }
  }

  const handleMarkReviewed = async (blueprintId: string) => {
    if (!selectedTenant) return
    if (approvalRole !== "COMPLIANCE_REVIEWER") {
      showToast("Switch role to Compliance Reviewer to add review notes.", "error")
      return
    }
    if (approvalReason.trim().length < 8) {
      showToast("Please enter a review reason (minimum 8 characters).", "error")
      return
    }
    setReviewingBlueprintId(blueprintId)
    try {
      const updated = await markTenantBlueprintReviewed(
        selectedTenant._id,
        blueprintId,
        approvalReason
      )
      if (!updated) {
        showToast("Unable to mark blueprint as reviewed.", "error")
        return
      }
      setTenants((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
      setSelectedTenant(updated)
      setApprovalReason("")
      showToast(`Reviewed ${blueprintId} for ${updated.name}`, "success")
    } catch (e) {
      showToast("Failed to mark reviewed.", "error")
    } finally {
      setReviewingBlueprintId(null)
    }
  }

  const handleResetOverrides = async () => {
    setResettingOverrides(true)
    try {
      resetTenantDemoOverrides()
      const [tenantsData, pageantsData] = await Promise.all([getTenants(), getPageants()])
      setTenants(tenantsData)
      setPageants(pageantsData)
      setSelectedTenant(null)
      setDetailOpen(false)
      showToast("Demo overrides reset to baseline seed state.", "success")
    } catch (e) {
      showToast("Failed to reset demo overrides.", "error")
    } finally {
      setResettingOverrides(false)
    }
  }

  const handleExportAuditReport = () => {
    if (!selectedTenant || typeof window === "undefined") return
    const compliance = ((selectedTenant.settings as any)?.compliance as ComplianceState | undefined) ?? {
      kycVerified: false,
      agencyVerified: false,
      payoutsEnabled: false,
    }
    const report = {
      generatedAt: new Date().toISOString(),
      tenant: {
        id: selectedTenant._id,
        name: selectedTenant.name,
        type: selectedTenant.type,
        agencyType: (selectedTenant as any).agencyType ?? null,
      },
      compliance,
      activeBlueprints:
        ((selectedTenant as any).approvedBlueprints as string[] | undefined) ??
        ((selectedTenant as any).blueprints as string[] | undefined) ??
        [],
      pendingBlueprints:
        ((selectedTenant as any).requestedBlueprints as string[] | undefined) ?? [],
      auditLog:
        ((selectedTenant.settings as any)?.blueprintApprovalLog as Array<any> | undefined) ?? [],
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${selectedTenant.slug || selectedTenant._id}-audit-report.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    showToast("Audit report exported.", "success")
  }

  const pendingBlueprintPolicyPreview = useMemo(() => {
    const requested = ((selectedTenant as any)?.requestedBlueprints as string[] | undefined) ?? []
    return requested.map((blueprintId) => ({
      blueprintId,
      ...evaluateBlueprintPolicy(blueprintId, complianceDraft),
    }))
  }, [selectedTenant, complianceDraft])

  const approvalQueue = useMemo(() => {
    const requests: Array<{
      tenantId: string
      tenantName: string
      blueprintId: string
      reviewed: boolean
      policyAllowed: boolean
    }> = []
    tenants.forEach((tenant) => {
      const requested = ((tenant as any).requestedBlueprints as string[] | undefined) ?? []
      const compliance = ((tenant.settings as any)?.compliance as ComplianceState | undefined) ?? {
        kycVerified: false,
        agencyVerified: false,
        payoutsEnabled: false,
      }
      const log = ((tenant.settings as any)?.blueprintApprovalLog as Array<any> | undefined) ?? []
      requested.forEach((blueprintId) => {
        requests.push({
          tenantId: tenant._id,
          tenantName: tenant.name,
          blueprintId,
          reviewed: log.some((entry) => entry?.blueprintId === blueprintId && entry?.action === "REVIEWED"),
          policyAllowed: evaluateBlueprintPolicy(blueprintId, compliance).allowed,
        })
      })
    })
    return {
      reviewer: requests.filter((item) => !item.reviewed),
      approver: requests.filter((item) => item.reviewed && item.policyAllowed),
      blocked: requests.filter((item) => !item.policyAllowed),
    }
  }, [tenants])

  return (
    <PageLayout>
      <PageHeader
        title="Tenants"
        description="Overview of agencies, pageant organisers, brands and event orgs using the platform. Powered by seed data for this phase."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Building2 className="h-3.5 w-3.5 text-sky-500" />
            Organization
          </span>
        }
      />

      <PageSection title="Approval Operations">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Role simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[11px] text-slate-700">
              <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                Step 1 - Reviewer and approver roles
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  { id: "COMPLIANCE_REVIEWER", label: "Compliance Reviewer" },
                  { id: "PLATFORM_APPROVER", label: "Platform Approver" },
                ] as Array<{ id: ApprovalRole; label: string }>).map((role) => (
                  <Button
                    key={role.id}
                    size="sm"
                    variant={approvalRole === role.id ? "default" : "outline"}
                    onClick={() => setApprovalRole(role.id)}
                    className="h-7 px-2 text-[10px]"
                  >
                    {role.label}
                  </Button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                Maker-checker simulation: reviewer adds review note first, approver finalizes.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetOverrides}
                  disabled={resettingOverrides}
                  className="h-7 px-2 text-[10px]"
                >
                  {resettingOverrides ? "Resetting..." : "Reset demo overrides"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyDemoScenario("blocked")}
                  disabled={!selectedTenant}
                  className="h-7 px-2 text-[10px]"
                >
                  Scenario: blocked
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyDemoScenario("ready")}
                  disabled={!selectedTenant}
                  className="h-7 px-2 text-[10px]"
                >
                  Scenario: ready
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Queue snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="text-slate-500">Reviewer queue</p>
                <p className="mt-1 text-lg font-semibold text-slate-700">{approvalQueue.reviewer.length}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                <p className="text-emerald-700">Ready to approve</p>
                <p className="mt-1 text-lg font-semibold text-emerald-700">{approvalQueue.approver.length}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2">
                <p className="text-amber-700">Policy blocked</p>
                <p className="mt-1 text-lg font-semibold text-amber-700">{approvalQueue.blocked.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                All seeded organisations across types.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {loading ? "—" : metrics.active}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Eligible to run pageants, campaigns and showcases.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">
                {loading ? "—" : metrics.suspended || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Tenants temporarily disabled (none in seed by default).
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-sky-600">
                {loading ? "—" : Object.keys(metrics.byCountry).length || 1}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Seeded tenants are India-first; global later.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Role-based approval queues">
        <div className="grid gap-4 lg:grid-cols-3">
          {([
            { key: "reviewer", title: "Compliance reviewer", data: approvalQueue.reviewer, tone: "text-slate-700" },
            { key: "approver", title: "Platform approver", data: approvalQueue.approver, tone: "text-emerald-700" },
            { key: "blocked", title: "Policy blocked", data: approvalQueue.blocked, tone: "text-amber-700" },
          ] as Array<{ key: string; title: string; data: Array<any>; tone: string }>).map((bucket) => (
            <Card key={bucket.key}>
              <CardHeader>
                <CardTitle className={bucket.tone}>{bucket.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-[10px]">
                {bucket.data.length === 0 ? (
                  <p className="text-slate-500">No items in this queue.</p>
                ) : (
                  bucket.data.slice(0, 6).map((item) => (
                    <div
                      key={`${bucket.key}_${item.tenantId}_${item.blueprintId}`}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5"
                    >
                      <p className="font-medium text-slate-700">
                        {item.tenantName} · {item.blueprintId}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="text-slate-500">
                          {item.reviewed ? "Reviewed" : "Awaiting review"} · {item.policyAllowed ? "Policy OK" : "Policy blocked"}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1.5 text-[10px] text-sky-600"
                          onClick={() => {
                            const tenant = tenants.find((t) => t._id === item.tenantId)
                            if (tenant) handleViewDetails(tenant)
                          }}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Distribution">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Tenants by type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-600">
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <>
                  <RechartsBar
                    data={Object.entries(metrics.byType).map(([type, count]) => ({
                      label:
                        type === "AGENCY"
                          ? "Agency"
                          : type === "PAGEANT_ORG"
                          ? "Pageant org"
                          : type === "EVENT_ORG"
                          ? "Event org"
                          : type === "BRAND"
                          ? "Brand"
                          : "Other",
                      value: count,
                    }))}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Distribution of tenant types from seed data.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Region distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-600">
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : Object.keys(metrics.byCountry).length === 0 ? (
                <p className="text-[10px] text-slate-500">
                  No country codes in seed. Showing placeholder.
                </p>
              ) : (
                <>
                  <RechartsPie
                    data={Object.entries(metrics.byCountry).map(([country, count]) => ({
                      label: country,
                      value: count,
                    }))}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Tenants by country code.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="By type & region">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Tenant types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading seeded tenants…</p>
              ) : metrics.total === 0 ? (
                <p className="text-slate-500">
                  No tenants in the current seed. Update{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/tenants.json
                  </code>{" "}
                  to configure tenant mix.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {Object.entries(metrics.byType).map(([type, count]) => (
                    <li
                      key={type}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/85 px-3 py-2"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-semibold text-slate-800">
                          {type === "AGENCY"
                            ? "Agency"
                            : type === "PAGEANT_ORG"
                            ? "Pageant organiser"
                            : type === "EVENT_ORG"
                            ? "Event organiser"
                            : type === "BRAND"
                            ? "Brand / Sponsor"
                            : "Platform internal"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Type code: {type}
                        </p>
                      </div>
                      <p className="text-[12px] font-semibold text-sky-600">
                        {count}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Region snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading region data…</p>
              ) : Object.keys(metrics.byCountry).length === 0 ? (
                <p className="text-slate-500">
                  No explicit country codes in seed. By default, treat all as{" "}
                  <span className="font-semibold text-sky-600">IN (India)</span>
                  .
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {Object.entries(metrics.byCountry).map(([country, count]) => (
                    <li
                      key={country}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/85 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                          <Globe2 className="h-4 w-4 text-sky-300" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-semibold text-slate-800">
                            {country}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Country code
                          </p>
                        </div>
                      </div>
                      <p className="text-[12px] font-semibold text-sky-600">
                        {count}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        title="Tenants"
        description={filteredTenants.length !== tenants.length ? `${filteredTenants.length} of ${tenants.length} shown` : undefined}
      >
        <div className="space-y-3">
        <FilterPanel
            searchPlaceholder="Search tenants by name, slug, or ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              {
                key: "type",
                label: "Type",
                options: typeOptions,
                selected: typeFilter,
                onSelectionChange: setTypeFilter,
              },
              {
                key: "agencyType",
                label: "Agency Type",
                options: agencyTypeOptions,
                selected: agencyTypeFilter,
                onSelectionChange: setAgencyTypeFilter,
              },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setTypeFilter([])
              setAgencyTypeFilter([])
            }}
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-500">Status:</span>
              {([
                { key: "ALL", label: "All" },
                { key: "ACTIVE", label: "Active" },
                { key: "SUSPENDED", label: "Suspended" },
                { key: "DELETED", label: "Deleted" },
              ] as { key: StatusFilter; label: string }[]).map((opt) => (
                <Button
                  key={opt.key}
                  size="sm"
                  variant={filter === opt.key ? "default" : "outline"}
                  className={
                    filter === opt.key
                      ? "h-7 px-3 text-[11px]"
                      : "h-7 px-3 text-[11px] bg-slate-50/70"
                  }
                  onClick={() => setFilter(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-[11px] bg-slate-50/70"
                disabled
              >
                <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                Sync (coming later)
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3  backdrop-blur">
            {loading ? (
              <div className="flex items-center justify-center py-14 text-slate-600">
                <span className="text-sm">
                  Loading tenants from seed for this environment…
                </span>
              </div>
            ) : filteredTenants.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center text-slate-600">
                <p className="text-sm font-medium">
                  No tenants match this filter in the current seed.
                </p>
                <p className="max-w-md text-[11px] text-slate-500">
                  Adjust{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/tenants.json
                  </code>{" "}
                  to explore different states and mixes.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-[11px] text-slate-700 sm:text-xs">
                {filteredTenants.map((tenant) => {
                  const stats = getTenantStats(tenant._id)
                  const subTenants = subTenantsByGroup[tenant._id] || []
                  const isB10 = (tenant as any).agencyType === "HOLDING_COMPANY" || tenant.type === "HOLDING"
                  const isExpanded = expandedB10.has(tenant._id)
                  return (
                    <div key={tenant._id} className="space-y-1">
                    <article
                      className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/85 px-3 py-2.5 sm:px-4"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-semibold text-slate-800">
                          {tenant.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Id{" "}
                          <span className="font-mono text-slate-600">
                            {tenant._id}
                          </span>{" "}
                          · Slug{" "}
                          <span className="font-mono text-slate-600">
                            {tenant.slug}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Pageants: {stats.pageants} ({stats.activePageants} active)
                          {(tenant as any).agencyType === "MODELING_AGENCY" && (
                            <> · Talents: {stats.talents} · Bookings: {stats.bookings}</>
                          )}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[11px] text-slate-700">
                          {(tenant as any).agencyType
                            ? AGENCY_TYPE_LABELS[(tenant as any).agencyType as keyof typeof AGENCY_TYPE_LABELS] ?? (tenant as any).agencyType.replace(/_/g, " ")
                            : tenant.type === "AGENCY"
                            ? "Agency"
                            : tenant.type === "PAGEANT_ORG"
                            ? "Pageant organiser"
                            : tenant.type === "EVENT_ORG"
                            ? "Event organiser"
                            : tenant.type === "BRAND"
                            ? "Brand / Sponsor"
                            : tenant.type === "HOLDING"
                            ? "Holding Company"
                            : "Platform internal"}
                        </p>
                        {(tenant as any).blueprints?.length > 0 && (
                          <p className="text-[10px] text-slate-500">
                            Active: {(tenant as any).blueprints.join(", ")}
                          </p>
                        )}
                        {(tenant as any).requestedBlueprints?.length > 0 && (
                          <p className="text-[10px] text-amber-600">
                            Pending approval: {(tenant as any).requestedBlueprints.join(", ")}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500">
                          Timezone: {tenant.timezone || "not set"} · Country:{" "}
                          {tenant.countryCode || "IN"}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 text-right text-[10px] text-slate-500">
                        <span
                          className={
                            tenant.status === "ACTIVE"
                              ? "rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600"
                              : tenant.status === "SUSPENDED"
                              ? "rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600"
                              : "rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700"
                          }
                        >
                          {tenant.status.toLowerCase()}
                        </span>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(tenant)}
                            className="h-7 px-2 text-[10px] text-sky-600 hover:bg-sky-500/10"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {tenant.status === "ACTIVE" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSuspend(tenant)}
                              className="h-7 px-2 text-[10px] text-amber-600 hover:bg-amber-500/10"
                            >
                              <ShieldOff className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleActivate(tenant)}
                              className="h-7 px-2 text-[10px] text-emerald-600 hover:bg-emerald-500/10"
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                    {isB10 && subTenants.length > 0 && (
                      <div className="ml-4 border-l-2 border-slate-200 pl-3">
                        <button
                          type="button"
                          onClick={() => setExpandedB10((prev) => {
                            const next = new Set(prev)
                            if (next.has(tenant._id)) next.delete(tenant._id)
                            else next.add(tenant._id)
                            return next
                          })}
                          className="flex items-center gap-1 text-[10px] text-sky-600 hover:underline"
                        >
                          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          {subTenants.length} sub-tenant{subTenants.length !== 1 ? "s" : ""}
                        </button>
                        {isExpanded && (
                          <ul className="mt-1 space-y-1">
                            {subTenants.map((subId) => {
                              const sub = tenants.find((t) => t._id === subId)
                              return (
                                <li key={subId} className="text-[10px] text-slate-600">
                                  {sub?.name ?? subId}
                                  {sub && (sub as any).agencyType && (
                                    <span className="ml-1 text-slate-400">
                                      ({AGENCY_TYPE_LABELS[(sub as any).agencyType as keyof typeof AGENCY_TYPE_LABELS] ?? (sub as any).agencyType})
                                    </span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </PageSection>

      {/* Tenant detail side panel */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" size="full" className="flex flex-col p-0">
          {selectedTenant && (
            <>
              <SheetHeader className="relative pr-12">
                <SheetCloseButton />
                <SheetTitle>{selectedTenant.name}</SheetTitle>
                <SheetDescription>
                  Tenant configuration and activity overview.
                </SheetDescription>
              </SheetHeader>

              <SheetBody className="space-y-4 text-sm text-slate-700">
                  {/* Basic Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Tenant ID
                      </p>
                      <p className="mt-1 font-mono text-sm text-slate-800">
                        {selectedTenant._id}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Slug
                      </p>
                      <p className="mt-1 font-mono text-sm text-slate-800">
                        {selectedTenant.slug}
                      </p>
                    </div>
                  </div>

                  {/* Type, Agency Type & Status */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Type
                      </p>
                      <p className="mt-1 text-sm text-slate-800">
                        {selectedTenant.type === "AGENCY"
                          ? "Agency"
                          : selectedTenant.type === "PAGEANT_ORG"
                          ? "Pageant Organiser"
                          : selectedTenant.type === "EVENT_ORG"
                          ? "Event Organiser"
                          : selectedTenant.type === "BRAND"
                          ? "Brand / Sponsor"
                          : selectedTenant.type === "HOLDING"
                          ? "Holding Company"
                          : selectedTenant.type === "ACADEMY"
                          ? "Academy"
                          : selectedTenant.type === "MARKETPLACE"
                          ? "Marketplace"
                          : "Platform Internal"}
                      </p>
                    </div>
                    {(selectedTenant as any).agencyType && (
                      <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Agency Type
                        </p>
                        <p className="mt-1 text-sm text-slate-800">
                          {AGENCY_TYPE_LABELS[(selectedTenant as any).agencyType as keyof typeof AGENCY_TYPE_LABELS] ?? (selectedTenant as any).agencyType.replace(/_/g, " ")}
                        </p>
                      </div>
                    )}
                    {(((selectedTenant as any).enabledBlueprints as string[] | undefined)?.length > 0 ||
                      ((selectedTenant as any).blueprints as string[] | undefined)?.length > 0) && (
                      <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Enabled Blueprints
                        </p>
                        <p className="mt-1 text-sm text-slate-800">
                          {(((selectedTenant as any).enabledBlueprints as string[] | undefined) ??
                            ((selectedTenant as any).blueprints as string[] | undefined) ??
                            []
                          ).join(", ")}
                        </p>
                      </div>
                    )}
                    {(((selectedTenant as any).approvedBlueprints as string[] | undefined)?.length > 0 ||
                      ((selectedTenant as any).blueprints as string[] | undefined)?.length > 0) && (
                      <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Approved (Active)
                        </p>
                        <p className="mt-1 text-sm text-slate-800">
                          {(((selectedTenant as any).approvedBlueprints as string[] | undefined) ??
                            ((selectedTenant as any).blueprints as string[] | undefined) ??
                            []
                          ).join(", ")}
                        </p>
                      </div>
                    )}
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </p>
                      <p className="mt-1">
                        <span
                          className={
                            selectedTenant.status === "ACTIVE"
                              ? "rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600"
                              : "rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600"
                          }
                        >
                          {selectedTenant.status.toLowerCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {(selectedTenant as any).requestedBlueprints?.length > 0 && (
                    <div className="rounded-lg border border-amber-300/80 bg-amber-50/70 px-3 py-2.5">
                      <div className="mb-2 inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                        Step 2 - Review and approve requests
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        Pending Blueprint Approval
                      </p>
                      <div className="mt-2 space-y-1.5">
                        <label className="text-[10px] font-medium text-amber-700">
                          Approval reason (required)
                        </label>
                        <textarea
                          value={approvalReason}
                          onChange={(e) => setApprovalReason(e.target.value)}
                          placeholder="Example: Verified KYC package and legal checks completed."
                          className="min-h-[72px] w-full rounded-md border border-amber-300 bg-white px-2 py-1.5 text-[11px] text-slate-700 outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="mt-2 space-y-2">
                        {((selectedTenant as any).requestedBlueprints as string[]).map((blueprintId) => {
                          const policy = evaluateBlueprintPolicy(blueprintId, complianceDraft)
                          const log = ((selectedTenant.settings as any)?.blueprintApprovalLog as Array<any> | undefined) ?? []
                          const reviewed = log.some(
                            (entry) => entry?.blueprintId === blueprintId && entry?.action === "REVIEWED"
                          )
                          return (
                            <div
                              key={blueprintId}
                              className="flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-white px-2 py-1.5"
                            >
                              <p className="text-[10px] text-slate-700">
                                {blueprintId} · {reviewed ? "Reviewed" : "Not reviewed"} ·{" "}
                                {policy.allowed ? "Policy OK" : "Policy blocked"}
                              </p>
                              <div className="flex gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkReviewed(blueprintId)}
                                  disabled={
                                    reviewingBlueprintId === blueprintId ||
                                    approvalReason.trim().length < 8 ||
                                    approvalRole !== "COMPLIANCE_REVIEWER"
                                  }
                                  className="h-7 border-slate-300 bg-white px-2 text-[10px] text-slate-700 hover:bg-slate-100"
                                >
                                  {reviewingBlueprintId === blueprintId ? "Reviewing..." : "Mark reviewed"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveBlueprint(blueprintId)}
                                  disabled={
                                    approvingBlueprintId === blueprintId ||
                                    approvalReason.trim().length < 8 ||
                                    approvalRole !== "PLATFORM_APPROVER" ||
                                    !policy.allowed ||
                                    !reviewed
                                  }
                                  className="h-7 border-amber-300 bg-white px-2 text-[10px] text-amber-700 hover:bg-amber-100"
                                >
                                  {approvingBlueprintId === blueprintId ? "Approving..." : `Approve ${blueprintId}`}
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Policy decision preview */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                    <div className="mb-2 inline-flex items-center rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                      Step 3 - Policy decision preview
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Policy decision preview
                    </p>
                    {pendingBlueprintPolicyPreview.length === 0 ? (
                      <p className="mt-2 text-[11px] text-slate-500">
                        No pending blueprint requests for this tenant.
                      </p>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {pendingBlueprintPolicyPreview.map((item) => (
                          <div
                            key={item.blueprintId}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[10px]"
                          >
                            <p className={`font-medium ${item.allowed ? "text-emerald-600" : "text-amber-600"}`}>
                              {item.blueprintId} ({item.label}) - {item.allowed ? "Can approve now" : "Blocked by policy"}
                            </p>
                            {item.checks.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {item.checks.map((check) => (
                                  <span
                                    key={`${item.blueprintId}_${check.label}`}
                                    className={`rounded-full border px-1.5 py-0.5 ${
                                      check.pass
                                        ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-700"
                                        : "border-amber-400/70 bg-amber-500/10 text-amber-700"
                                    }`}
                                  >
                                    {check.label}: {check.pass ? "OK" : "Missing"}
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.note && <p className="mt-1 text-slate-500">{item.note}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Compliance controls */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                    <div className="mb-2 inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Step 4 - Update compliance controls
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Compliance controls
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {([
                        { key: "kycVerified", label: "KYC verified" },
                        { key: "agencyVerified", label: "Agency verified" },
                        { key: "payoutsEnabled", label: "Payouts enabled" },
                      ] as Array<{ key: ComplianceField; label: string }>).map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleComplianceDraft(item.key)}
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium transition ${
                            complianceDraft[item.key]
                              ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                              : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {item.label}: {complianceDraft[item.key] ? "ON" : "OFF"}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={saveComplianceControls}
                        disabled={savingCompliance}
                        className="h-7 px-2 text-[10px]"
                      >
                        {savingCompliance ? "Saving..." : "Save compliance controls"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleExportAuditReport}
                        className="ml-2 h-7 px-2 text-[10px] text-sky-600 hover:bg-sky-500/10"
                      >
                        Export audit report
                      </Button>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Location & Timezone
                    </p>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-slate-800">
                      <div>
                        <span className="text-slate-500">Country:</span>{" "}
                        {selectedTenant.countryCode || "IN"}
                      </div>
                      <div>
                        <span className="text-slate-500">Timezone:</span>{" "}
                        {selectedTenant.timezone || "not set"}
                      </div>
                    </div>
                  </div>

                  {/* Sub-tenants (B10) */}
                  {subTenantsByGroup[selectedTenant._id]?.length > 0 && (
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Sub-tenants
                      </p>
                      <ul className="mt-2 space-y-1">
                        {subTenantsByGroup[selectedTenant._id].map((subId) => {
                          const sub = tenants.find((t) => t._id === subId)
                          return (
                            <li key={subId} className="text-sm text-slate-800">
                              {sub?.name ?? subId}
                              {sub && (sub as any).agencyType && (
                                <span className="ml-1 text-slate-500">
                                  ({AGENCY_TYPE_LABELS[(sub as any).agencyType as keyof typeof AGENCY_TYPE_LABELS] ?? (sub as any).agencyType})
                                </span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  {((selectedTenant as any).agencyType === "HOLDING_COMPANY" ||
                    selectedTenant.type === "HOLDING" ||
                    (((selectedTenant as any).blueprints as string[] | undefined) ?? []).includes("B10")) && (
                    <div className="rounded-lg border border-sky-200/80 bg-sky-50/70 px-3 py-2.5">
                      <div className="mb-2 inline-flex items-center rounded-full border border-sky-300 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                        Step 5 - Apply B10 group policy pack
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                        Group policy pack (B10)
                      </p>
                      <p className="mt-1 text-[10px] text-sky-700/80">
                        Governs sub-tenant controls, payout limits, and approval rules.
                      </p>
                      <textarea
                        value={groupPolicyDraft}
                        onChange={(e) => setGroupPolicyDraft(e.target.value)}
                        className="mt-2 min-h-[150px] w-full rounded-md border border-sky-200 bg-white px-2 py-1.5 font-mono text-[11px] text-slate-700 outline-none focus:border-sky-400"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={saveGroupPolicyPack}
                          disabled={savingGroupPolicy}
                          className="h-7 border-sky-300 bg-white px-2 text-[10px] text-sky-700 hover:bg-sky-100"
                        >
                          {savingGroupPolicy ? "Saving..." : "Save policy pack"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => policyImportInputRef.current?.click()}
                          className="h-7 border-sky-300 bg-white px-2 text-[10px] text-sky-700 hover:bg-sky-100"
                        >
                          Import JSON
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setGroupPolicyDraft(
                              JSON.stringify(DEFAULT_GROUP_POLICY_PACK, null, 2)
                            )
                          }
                          className="h-7 px-2 text-[10px] text-slate-600"
                        >
                          Use default
                        </Button>
                        <input
                          ref={policyImportInputRef}
                          type="file"
                          accept="application/json,.json"
                          className="hidden"
                          onChange={handleImportGroupPolicyPack}
                        />
                      </div>
                    </div>
                  )}

                  {/* Risk flags */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Risk flags
                    </p>
                    {(() => {
                      const compliance = ((selectedTenant.settings as any)?.compliance as {
                        kycVerified?: boolean
                        agencyVerified?: boolean
                        payoutsEnabled?: boolean
                      } | undefined) ?? { kycVerified: false, agencyVerified: false, payoutsEnabled: false }
                      const pendingCount = (((selectedTenant as any).requestedBlueprints as string[] | undefined) ?? []).length
                      const score = Math.min(
                        100,
                        (compliance.kycVerified ? 0 : 25) +
                          (compliance.agencyVerified ? 0 : 20) +
                          (compliance.payoutsEnabled ? 0 : 15) +
                          pendingCount * 10
                      )
                      const level = score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW"
                      return (
                        <>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        compliance.kycVerified
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                          : "border-amber-500/60 bg-amber-500/10 text-amber-600"
                      }`}>
                        KYC: {compliance.kycVerified ? "Verified" : "Pending"}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        compliance.agencyVerified
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                          : "border-amber-500/60 bg-amber-500/10 text-amber-600"
                      }`}>
                        Agency: {compliance.agencyVerified ? "Verified" : "Review"}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        compliance.payoutsEnabled
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                          : "border-amber-500/60 bg-amber-500/10 text-amber-600"
                      }`}>
                        Payouts: {compliance.payoutsEnabled ? "Enabled" : "Restricted"}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        pendingCount === 0
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                          : "border-amber-500/60 bg-amber-500/10 text-amber-600"
                      }`}>
                        Pending Blueprints: {pendingCount}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Risk level: {level} · Score: {score}/100
                    </p>
                        </>
                      )
                    })()}
                  </div>

                  {/* Approval audit log */}
                  {(((selectedTenant.settings as any)?.blueprintApprovalLog as any[] | undefined)?.length ?? 0) > 0 && (
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Blueprint approval log
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {((selectedTenant.settings as any).blueprintApprovalLog as any[])
                          .slice()
                          .reverse()
                          .slice(0, 8)
                          .map((entry) => (
                            <div
                              key={entry.id}
                              className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-600"
                            >
                              <p className="font-medium text-slate-700">
                                {entry.action} {entry.blueprintId} · {entry.actor}
                              </p>
                              <p className="mt-0.5">{entry.reason}</p>
                              <p className="mt-0.5 text-slate-400">{entry.at}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Quick Stats
                    </p>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-[10px] text-slate-500">Pageants</p>
                        <p className="mt-0.5 text-lg font-semibold text-sky-600">
                          {getTenantStats(selectedTenant._id).pageants}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Active Pageants</p>
                        <p className="mt-0.5 text-lg font-semibold text-emerald-600">
                          {getTenantStats(selectedTenant._id).activePageants}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Talents</p>
                        <p className="mt-0.5 text-lg font-semibold text-slate-800">
                          {getTenantStats(selectedTenant._id).talents}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Staff</p>
                        <p className="mt-0.5 text-lg font-semibold text-slate-800">
                          {getTenantStats(selectedTenant._id).staff}
                        </p>
                      </div>
                      {(selectedTenant as any).agencyType === "MODELING_AGENCY" && (
                        <div>
                          <p className="text-[10px] text-slate-500">Bookings</p>
                          <p className="mt-0.5 text-lg font-semibold text-slate-800">
                            {getTenantStats(selectedTenant._id).bookings}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Branding */}
                  {selectedTenant.settings?.branding && (
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Branding
                      </p>
                      <div className="mt-1 space-y-1 text-sm text-slate-800">
                        {selectedTenant.settings.branding.primaryColor && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Primary Color:</span>
                            <div
                              className="h-4 w-12 rounded border border-slate-200"
                              style={{
                                backgroundColor:
                                  selectedTenant.settings.branding.primaryColor,
                              }}
                            />
                            <span className="font-mono text-xs">
                              {selectedTenant.settings.branding.primaryColor}
                            </span>
                          </div>
                        )}
                        {selectedTenant.settings.branding.logo && (
                          <div>
                            <span className="text-slate-500">Logo:</span>{" "}
                            {selectedTenant.settings.branding.logo}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

        {/* Suspend Confirmation */}
        <ConfirmDialog
          open={confirmSuspendOpen}
          onOpenChange={setConfirmSuspendOpen}
          title="Suspend tenant?"
          description={`This will suspend ${selectedTenant?.name}. They will not be able to access the platform until reactivated. (UI-only for now)`}
          confirmText="Suspend"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmSuspend}
        />

        {/* Activate Confirmation */}
        <ConfirmDialog
          open={confirmActivateOpen}
          onOpenChange={setConfirmActivateOpen}
          title="Activate tenant?"
          description={`This will activate ${selectedTenant?.name} and restore their platform access. (UI-only for now)`}
          confirmText="Activate"
          cancelText="Cancel"
          variant="default"
          onConfirm={confirmActivate}
        />
    </PageLayout>
  )
}

