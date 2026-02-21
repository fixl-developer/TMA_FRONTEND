"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/shared/components/ui/toast"
import { getBlueprintConfigs } from "@/shared/services/blueprintService"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  Layers,
  Users,
  Settings,
  CheckSquare,
  Circle,
} from "lucide-react"
import { useEffect } from "react"

const AGENCY_TYPES = [
  { id: "modeling_agency", label: "Modeling Agency", icon: "👗", blueprints: ["B1", "B2", "B4"] },
  { id: "pageant_org", label: "Pageant Organization", icon: "👑", blueprints: ["B1", "B3"] },
  { id: "talent_mgmt", label: "Talent Management", icon: "🎭", blueprints: ["B1", "B2"] },
  { id: "casting_agency", label: "Casting Agency", icon: "🎬", blueprints: ["B2", "B6"] },
  { id: "influencer_mgmt", label: "Influencer Management", icon: "📱", blueprints: ["B4", "B8"] },
  { id: "staffing_agency", label: "Staffing Agency", icon: "👷", blueprints: ["B7", "B1"] },
  { id: "entertainment_co", label: "Entertainment Company", icon: "🎪", blueprints: ["B1", "B2", "B4", "B8"] },
  { id: "brand_agency", label: "Brand/PR Agency", icon: "🤝", blueprints: ["B4", "B6"] },
  { id: "academy", label: "Talent Academy", icon: "📚", blueprints: ["B5", "B1"] },
  { id: "holding_group", label: "Holding/Group Company", icon: "🏢", blueprints: ["B10"] },
  { id: "marketplace", label: "Marketplace Platform", icon: "🏪", blueprints: ["B9", "B1"] },
  { id: "production_co", label: "Production Company", icon: "🎥", blueprints: ["B6", "B2"] },
]

const OS_MODULES = [
  { id: "crm", label: "CRM", description: "Leads, accounts, contacts, pipeline" },
  { id: "quotes", label: "Quotes & Sales", description: "Rate cards, quotes, proposals" },
  { id: "clm", label: "Contracts (CLM)", description: "Contract lifecycle, obligations" },
  { id: "finance", label: "Finance Ops", description: "Invoicing, payouts, reconciliation" },
  { id: "client_portal", label: "Client Portal", description: "External approvals & collaboration" },
  { id: "vendors", label: "Vendor Management", description: "Vendors, procurement, RFQs" },
  { id: "automation", label: "Automation", description: "Rules engine, campaigns, SLA" },
  { id: "analytics", label: "Analytics", description: "Reports, dashboards, attribution" },
]

const STEPS = [
  { id: "agency_type", label: "Agency Type", icon: Building2 },
  { id: "blueprints", label: "Blueprints", icon: Layers },
  { id: "role_packs", label: "Role Packs", icon: Users },
  { id: "os_modules", label: "OS Modules", icon: Settings },
  { id: "review", label: "Review & Activate", icon: CheckSquare },
]

const BLUEPRINT_META: Record<string, { name: string; icon: string; desc: string }> = {
  B1: { name: "Roster + Booking", icon: "🎭", desc: "Talent profiles, bookings, availability, contracts" },
  B2: { name: "Casting Pipeline", icon: "🎬", desc: "Casting calls, submissions, shortlist, deals" },
  B3: { name: "Season/Competition", icon: "👑", desc: "Pageants, rounds, scoring, judges" },
  B4: { name: "Brand Deals", icon: "🤝", desc: "Creator roster, deal rooms, deliverables" },
  B5: { name: "Course/Cohort", icon: "📚", desc: "Courses, cohorts, certificates" },
  B6: { name: "Project + Assets", icon: "🗂️", desc: "Projects, asset delivery, client approvals" },
  B7: { name: "Shift/Staffing", icon: "👷", desc: "Shift rosters, check-ins, payouts" },
  B8: { name: "Community", icon: "👥", desc: "Community feed, groups, moderation" },
  B9: { name: "Marketplace", icon: "🏪", desc: "Listings, matching, escrow" },
  B10: { name: "Holding/Group", icon: "🏢", desc: "Multi-tenant management" },
}

const STORAGE_KEY = "talentos_onboarding_state"

function saveOnboardingState(state: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export default function OnboardingWizardPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [agencyType, setAgencyType] = useState("")
  const [selectedBlueprints, setSelectedBlueprints] = useState<Set<string>>(new Set())
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(["crm", "finance", "automation"]))
  const [activating, setActivating] = useState(false)

  const selectedAgency = AGENCY_TYPES.find((a) => a.id === agencyType)

  // Auto-select blueprints when agency type changes
  useEffect(() => {
    if (selectedAgency) {
      setSelectedBlueprints(new Set(selectedAgency.blueprints))
    }
  }, [agencyType])

  const toggleBlueprint = (id: string) => {
    setSelectedBlueprints((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleActivate = () => {
    setActivating(true)
    const config = {
      agencyType,
      blueprints: Array.from(selectedBlueprints),
      osModules: Array.from(selectedModules),
      activatedAt: new Date().toISOString(),
    }
    saveOnboardingState(config)
    setTimeout(() => {
      setActivating(false)
      showToast("Tenant provisioned successfully! Blueprints and modules are now active.", "success")
      router.push("/admin/blueprints")
    }, 1500)
  }

  const canProceed = [
    !!agencyType,
    selectedBlueprints.size > 0,
    true,
    selectedModules.size > 0,
    true,
  ][step]

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Onboarding Wizard"
        subtitle="Configure your TalentOS tenant — select agency type, blueprints, role packs, and OS modules"
      />

      {/* Step indicator */}
      <div className="mb-8 flex items-center">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done = i < step
          const active = i === step
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  done ? "border-emerald-400 bg-emerald-400" : active ? "border-purple-400 bg-purple-500/20" : "border-white/20 bg-white/5"
                }`}>
                  {done ? <CheckCircle2 className="h-5 w-5 text-black" /> : <Icon className={`h-5 w-5 ${active ? "text-purple-300" : "text-white/30"}`} />}
                </div>
                <p className={`mt-1 text-xs font-medium ${active ? "text-white" : done ? "text-emerald-400" : "text-white/30"}`}>{s.label}</p>
              </div>
              {i < STEPS.length - 1 && <div className={`mx-2 h-px flex-1 ${done ? "bg-emerald-400/50" : "bg-white/10"}`} />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      {step === 0 && (
        <AdminCard>
          <h3 className="mb-6 text-lg font-bold text-white">What type of agency are you?</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AGENCY_TYPES.map((a) => (
              <button
                key={a.id}
                onClick={() => setAgencyType(a.id)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  agencyType === a.id
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="font-semibold text-white">{a.label}</p>
                  <p className="text-xs text-white/50">{a.blueprints.length} recommended blueprints</p>
                </div>
                {agencyType === a.id && <CheckCircle2 className="ml-auto h-5 w-5 text-purple-400" />}
              </button>
            ))}
          </div>
        </AdminCard>
      )}

      {step === 1 && (
        <AdminCard>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Select Blueprints</h3>
            <p className="text-sm text-white/50">Recommended based on your agency type are pre-selected</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(BLUEPRINT_META).map(([id, meta]) => {
              const isSelected = selectedBlueprints.has(id)
              const isRecommended = selectedAgency?.blueprints.includes(id)
              return (
                <button
                  key={id}
                  onClick={() => toggleBlueprint(id)}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    isSelected ? "border-purple-400 bg-purple-500/20" : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <span className="mt-0.5 text-xl">{meta.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{id} · {meta.name}</p>
                      {isRecommended && <AdminBadge variant="info">Recommended</AdminBadge>}
                    </div>
                    <p className="mt-0.5 text-xs text-white/50">{meta.desc}</p>
                  </div>
                  <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-purple-400 bg-purple-400" : "border-white/20"}`}>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-black" />}
                  </div>
                </button>
              )
            })}
          </div>
        </AdminCard>
      )}

      {step === 2 && (
        <AdminCard>
          <h3 className="mb-2 text-lg font-bold text-white">Role Packs</h3>
          <p className="mb-6 text-sm text-white/50">Role packs will be automatically provisioned based on your selected blueprints.</p>
          <div className="space-y-4">
            {Array.from(selectedBlueprints).map((bpId) => {
              const meta = BLUEPRINT_META[bpId]
              if (!meta) return null
              const rolePacks: Record<string, string[]> = {
                B1: ["Owner", "Admin", "Agent", "Talent Manager", "Talent", "Finance"],
                B2: ["Casting Director", "Casting Associate", "Coordinator", "Client Viewer"],
                B3: ["Owner", "Program Director", "Judge", "Moderator", "Participant Support"],
                B4: ["Owner", "Creator Manager", "Brand Partnerships", "Content Reviewer", "Analyst"],
                B5: ["Owner", "Trainer", "Mentor", "Student", "Finance"],
                B6: ["Producer", "PM", "Client Approver", "Finance"],
                B7: ["Staffing Manager", "Coordinator", "Staff", "Finance"],
                B8: ["Owner", "Moderator", "Community Manager"],
                B9: ["Owner", "Ops", "Finance"],
                B10: ["Owner", "Admin", "Ops", "Finance"],
              }
              return (
                <div key={bpId} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">{meta.icon}</span>
                    <p className="font-semibold text-white">{bpId} · {meta.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(rolePacks[bpId] || []).map((r) => (
                      <span key={r} className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">{r}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </AdminCard>
      )}

      {step === 3 && (
        <AdminCard>
          <h3 className="mb-6 text-lg font-bold text-white">Enable OS Modules</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {OS_MODULES.map((m) => {
              const isSelected = selectedModules.has(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => toggleModule(m.id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    isSelected ? "border-emerald-400 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected ? "bg-emerald-400/20" : "bg-white/10"}`}>
                    {isSelected
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      : <Circle className="h-4 w-4 text-white/30" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{m.label}</p>
                    <p className="text-xs text-white/50">{m.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </AdminCard>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <AdminCard>
            <h3 className="mb-4 text-lg font-bold text-white">Review Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50">Agency Type</p>
                    <p className="font-semibold text-white">{selectedAgency?.icon} {selectedAgency?.label}</p>
                  </div>
                </div>
                <AdminButton size="sm" variant="ghost" onClick={() => setStep(0)}>Edit</AdminButton>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-white/50" />
                    <p className="text-xs text-white/50">Blueprints ({selectedBlueprints.size})</p>
                  </div>
                  <AdminButton size="sm" variant="ghost" onClick={() => setStep(1)}>Edit</AdminButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedBlueprints).map((id) => (
                    <span key={id} className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                      {BLUEPRINT_META[id]?.icon} {id} · {BLUEPRINT_META[id]?.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-white/50" />
                    <p className="text-xs text-white/50">OS Modules ({selectedModules.size})</p>
                  </div>
                  <AdminButton size="sm" variant="ghost" onClick={() => setStep(3)}>Edit</AdminButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedModules).map((id) => {
                    const m = OS_MODULES.find((x) => x.id === id)
                    return (
                      <span key={id} className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        {m?.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </AdminCard>

          <div className="flex justify-end">
            <AdminButton onClick={handleActivate} disabled={activating}>
              {activating ? "Activating…" : "Activate Tenant"}
            </AdminButton>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <AdminButton
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </AdminButton>
        {step < STEPS.length - 1 && (
          <AdminButton
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </AdminButton>
        )}
      </div>
    </AdminPageWrapper>
  )
}
