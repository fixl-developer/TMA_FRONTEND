"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, DASHBOARD_PATH } from "@/shared/context/AuthContext"
import { SignupStepper } from "@/shared/components/auth/SignupStepper"
import { Building2, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { createTenant, addSessionTenantId } from "@/shared/services/tenantService"
import { AGENCY_TYPE_BLUEPRINT_MAP, AGENCY_TYPE_LABELS } from "@/shared/lib/constants/agencyBlueprints"
import type { AgencyType } from "@/shared/lib/types/tenants"

type TenantType = "AGENCY" | "PAGEANT_ORG" | "BRAND" | "ACADEMY" | "EVENT_ORG"

const BLUEPRINT_LABELS: Record<string, string> = {
  B1: "Roster + Booking",
  B2: "Casting Pipeline",
  B3: "Competition",
  B4: "Brand Deals",
  B5: "Course",
  B6: "Project + Assets",
  B7: "Staffing",
  B8: "Community",
  B9: "Marketplace",
  B10: "Multi-tenant",
}

const BLUEPRINT_IDS = Object.keys(BLUEPRINT_LABELS)

const ORG_OPTIONS: Array<{
  agencyType: AgencyType
  tenantType: TenantType
  label: string
}> = [
  { agencyType: "MODELING_AGENCY", tenantType: "AGENCY", label: "Modeling Agency" },
  { agencyType: "CASTING_AGENCY", tenantType: "AGENCY", label: "Casting Agency" },
  { agencyType: "PAGEANT_ORGANIZER", tenantType: "PAGEANT_ORG", label: "Pageant Organizer" },
  { agencyType: "INFLUENCER_AGENCY", tenantType: "AGENCY", label: "Influencer Agency" },
  { agencyType: "ACTING_ACADEMY", tenantType: "ACADEMY", label: "Academy" },
  { agencyType: "BRAND", tenantType: "BRAND", label: "Brand Team" },
  { agencyType: "PRODUCTION_HOUSE", tenantType: "AGENCY", label: "Production House" },
  { agencyType: "EVENT_STAFFING_AGENCY", tenantType: "EVENT_ORG", label: "Event Staffing" },
  { agencyType: "TALENT_NETWORK", tenantType: "AGENCY", label: "Community Network" },
]

const APPROVAL_REQUIRED_BLUEPRINTS = new Set<string>(["B3", "B4", "B7", "B10"])
const BLOCKED_FOR_SELF_SERVE = new Set<string>(["B9"])
const INCOMPATIBLE_BLUEPRINTS: Array<{ left: string; right: string; reason: string }> = [
  {
    left: "B3",
    right: "B10",
    reason: "Competition and multi-tenant governance must be reviewed together.",
  },
]

const BLUEPRINT_GUARDRAIL_REASON: Record<string, string> = {
  B3: "Requires pageant compliance review and identity checks.",
  B4: "Requires brand-deals review and policy approval.",
  B7: "Requires staffing compliance and payout controls verification.",
  B10: "Requires enterprise governance approval.",
}

const STEPS = [
  { label: "Organization" },
  { label: "Owner" },
  { label: "Capabilities" },
  { label: "Confirm" },
]

function findIncompatibility(selected: string[]): string | null {
  for (const rule of INCOMPATIBLE_BLUEPRINTS) {
    if (selected.includes(rule.left) && selected.includes(rule.right)) {
      return rule.reason
    }
  }
  return null
}

export default function TenantSignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [orgName, setOrgName] = useState("")
  const [agencyType, setAgencyType] = useState<AgencyType | "">("")
  const [subdomain, setSubdomain] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [enabledBlueprints, setEnabledBlueprints] = useState<string[]>([])
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const selectedOrg = useMemo(
    () => ORG_OPTIONS.find((option) => option.agencyType === agencyType),
    [agencyType]
  )

  const defaultBlueprints = useMemo(() => {
    if (!agencyType) return []
    return [...(AGENCY_TYPE_BLUEPRINT_MAP[agencyType] ?? [])]
  }, [agencyType])

  const approvalRequiredBlueprints = useMemo(
    () => enabledBlueprints.filter((id) => APPROVAL_REQUIRED_BLUEPRINTS.has(id)),
    [enabledBlueprints]
  )

  useEffect(() => {
    if (!agencyType) return
    setEnabledBlueprints(defaultBlueprints)
    setError("")
  }, [agencyType, defaultBlueprints])

  const toggleBlueprint = (blueprintId: string) => {
    setError("")
    if (BLOCKED_FOR_SELF_SERVE.has(blueprintId)) {
      setError("Marketplace (B9) is restricted for new self-serve tenants.")
      return
    }
    const next = enabledBlueprints.includes(blueprintId)
      ? enabledBlueprints.filter((id) => id !== blueprintId)
      : [...enabledBlueprints, blueprintId]
    const incompatibility = findIncompatibility(next)
    if (incompatibility) {
      setError(incompatibility)
      return
    }
    setEnabledBlueprints(next)
  }

  const handleNext = async () => {
    setError("")
    if (step === 1) {
      if (!orgName.trim() || !agencyType) {
        setError("Please fill organization name and business type.")
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!ownerName.trim() || !ownerEmail.trim()) {
        setError("Please fill owner details.")
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (enabledBlueprints.length === 0) {
        setError("Select at least one blueprint capability.")
        return
      }
      const incompatibility = findIncompatibility(enabledBlueprints)
      if (incompatibility) {
        setError(incompatibility)
        return
      }
      if (enabledBlueprints.some((id) => BLOCKED_FOR_SELF_SERVE.has(id))) {
        setError("One or more selected blueprints are restricted for new self-serve tenants.")
        return
      }
      setStep(4)
    } else {
      if (!acceptedTerms) {
        setError("Please accept the terms.")
        return
      }
      if (!agencyType || !selectedOrg) {
        setError("Please choose a valid business type.")
        setStep(1)
        return
      }
      setSubmitting(true)
      try {
        const approvedBlueprints = enabledBlueprints.filter(
          (id) => !APPROVAL_REQUIRED_BLUEPRINTS.has(id)
        )
        const requestedBlueprints = enabledBlueprints.filter((id) =>
          APPROVAL_REQUIRED_BLUEPRINTS.has(id)
        )

        const tenant = await createTenant({
          name: orgName.trim(),
          type: selectedOrg.tenantType,
          agencyType,
          blueprints: approvedBlueprints,
          enabledBlueprints,
          approvedBlueprints,
          requestedBlueprints,
          ownerName: ownerName.trim(),
          ownerEmail: ownerEmail.trim(),
          subdomain: subdomain.trim() || undefined,
        })
        addSessionTenantId(tenant._id)
        const result = login("admin@talentos.io", "demo123")
        if (result.ok) {
          router.push(`${DASHBOARD_PATH.admin}?tenantId=${tenant._id}`)
        } else {
          router.push(DASHBOARD_PATH.admin)
        }
      } catch (e) {
        setError("Signup failed. Please try again.")
        setSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    setError("")
    if (step > 1) setStep(step - 1)
    else router.push("/signup")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20">
            <Building2 className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-white">Tenant signup</h1>
            <p className="text-sm text-slate-400">Step {step} of {STEPS.length}</p>
          </div>
        </div>

        <SignupStepper steps={STEPS} currentStep={step} className="mb-8" />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Organization name</Label>
                <Input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Elite Talent Co"
                  className="border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-teal-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Organization type</Label>
                <select
                  value={agencyType}
                  onChange={(e) => setAgencyType(e.target.value as AgencyType)}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  <option value="">What best describes your organization?</option>
                  {ORG_OPTIONS.map((option) => (
                    <option key={option.agencyType} value={option.agencyType}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Subdomain (optional)</Label>
                <Input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="elite"
                  className="border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-teal-500/50"
                />
                <p className="text-xs text-slate-500">elite.talentos.io</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Owner full name</Label>
                <Input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="John Doe"
                  className="border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-teal-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Owner email</Label>
                <Input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@example.com"
                  className="border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-teal-500/50"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-teal-400/40 bg-teal-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-300">
                Step 1 - Founder selects capabilities
              </div>
              <div className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-3">
                <p className="text-sm font-medium text-white">
                  We preconfigured your workspace for{" "}
                  {agencyType ? AGENCY_TYPE_LABELS[agencyType] : "your organization"}.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Default blueprints: {defaultBlueprints.join(", ") || "None"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Add more capabilities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {BLUEPRINT_IDS.map((blueprintId) => {
                    const checked = enabledBlueprints.includes(blueprintId)
                    const isDefault = defaultBlueprints.includes(blueprintId)
                    const isBlocked = BLOCKED_FOR_SELF_SERVE.has(blueprintId)
                    const needsApproval = APPROVAL_REQUIRED_BLUEPRINTS.has(blueprintId)
                    return (
                      <button
                        key={blueprintId}
                        type="button"
                        onClick={() => toggleBlueprint(blueprintId)}
                        disabled={isBlocked}
                        className={`rounded-lg border px-3 py-2 text-left transition ${
                          checked
                            ? "border-teal-500/80 bg-teal-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        } ${isBlocked ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <p className="text-xs font-semibold text-white">
                          {blueprintId} - {BLUEPRINT_LABELS[blueprintId]}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {isBlocked
                            ? "Restricted for new tenants"
                            : isDefault
                            ? "Default for your agency type"
                            : needsApproval
                            ? "Requires admin approval"
                            : "Can be enabled immediately"}
                        </p>
                        {needsApproval && !isBlocked && (
                          <p className="mt-1 text-[10px] text-amber-300">
                            {BLUEPRINT_GUARDRAIL_REASON[blueprintId]}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-sky-400/40 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-300">
                Step 2 - System applies guardrails
              </div>
              <div className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-3 text-xs text-slate-300">
                <p className="font-medium text-white">Configuration review</p>
                <p className="mt-1">Agency type: {agencyType ? AGENCY_TYPE_LABELS[agencyType] : "-"}</p>
                <p className="mt-1">Enabled blueprints: {enabledBlueprints.join(", ") || "-"}</p>
                <p className="mt-1">
                  Active now:{" "}
                  {enabledBlueprints.filter((id) => !APPROVAL_REQUIRED_BLUEPRINTS.has(id)).join(", ") || "None"}
                </p>
                <p className="mt-1">
                  Pending approval: {approvalRequiredBlueprints.join(", ") || "None"}
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-300">
                  I accept the <a href="#" className="text-teal-400 hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-teal-400 hover:underline">Privacy Policy</a>.
                </span>
              </label>
              <p className="text-xs text-slate-500">
                Platform decides what is allowed, founder decides what is needed, and the
                system enables only approved capabilities.
              </p>
              <div className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                Step 3 - Admin approval for sensitive modules
              </div>
            </div>
          )}

          {error && <p className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-400">{error}</p>}

          <div className="mt-6 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="bg-teal-500 text-slate-900 hover:bg-teal-400 font-medium"
            >
              {submitting ? "Creating…" : step === 4 ? "Complete signup" : "Next"}{" "}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link href="/signup" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
            ← Back to signup options
          </Link>
        </p>
      </div>
    </div>
  )
}
