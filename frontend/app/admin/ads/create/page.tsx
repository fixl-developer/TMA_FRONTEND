"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Target, ImageIcon, Wallet, Check, Save, ArrowLeft } from "lucide-react"

const DRAFT_KEY = "talentos_ad_campaign_draft"

const STEPS = [
  { id: 1, label: "Objective", icon: Target },
  { id: 2, label: "Targeting", icon: Target },
  { id: 3, label: "Creative", icon: ImageIcon },
  { id: 4, label: "Budget", icon: Wallet },
]

interface Draft {
  name: string
  objective: string
  locations: string
  ageMin: string
  ageMax: string
  interests: string
  headline: string
  budget: string
  startDate: string
  endDate: string
}

const emptyDraft: Draft = {
  name: "",
  objective: "AWARENESS",
  locations: "IN",
  ageMin: "18",
  ageMax: "35",
  interests: "",
  headline: "",
  budget: "50000",
  startDate: "",
  endDate: "",
}

function loadDraft(): Draft {
  if (typeof window === "undefined") return emptyDraft
  try {
    const s = localStorage.getItem(DRAFT_KEY)
    if (!s) return emptyDraft
    return { ...emptyDraft, ...JSON.parse(s) }
  } catch {
    return emptyDraft
  }
}

function saveDraft(d: Draft) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d))
  } catch {}
}

function clearDraft() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {}
}

export default function AdCampaignCreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [draft, setDraft] = useState<Draft>(emptyDraft)

  useEffect(() => {
    const loaded = loadDraft()
    setDraft(loaded)
  }, [])

  useEffect(() => {
    saveDraft(draft)
  }, [draft])

  const update = (k: keyof Draft, v: string) => {
    setError("")
    setDraft((p) => ({ ...p, [k]: v }))
  }

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!draft.name.trim()) {
        setError("Campaign name is required.")
        return false
      }
    }
    if (step === 2) {
      if (!draft.locations.trim()) {
        setError("At least one location is required.")
        return false
      }
    }
    if (step === 4) {
      const b = parseInt(draft.budget, 10)
      if (isNaN(b) || b < 100) {
        setError("Budget must be at least ₹100.")
        return false
      }
    }
    setError("")
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    if (step < 4) setStep(step + 1)
    else {
      clearDraft()
      router.push("/admin/ads")
    }
  }

  const handleSaveDraft = () => {
    saveDraft(draft)
    setError("")
    router.push("/admin/ads")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/ads">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white">Create ad campaign</h1>
              <p className="mt-2 text-base text-white/60">Step-by-step wizard</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Save className="mr-2 h-4 w-4" />
            Save draft
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex gap-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 ${
                step >= s.id
                  ? "border-[#d4ff00]/50 bg-[#d4ff00]/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {step > s.id ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <s.icon className={`h-4 w-4 ${step >= s.id ? "text-[#d4ff00]" : "text-white/40"}`} />
              )}
              <span className={`text-sm font-medium ${step >= s.id ? "text-white" : "text-white/50"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-bold text-white">
            Step {step}: {STEPS[step - 1].label}
          </h3>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Campaign name *</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Miss India 2025 Promo"
                  className={`rounded-md border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md ${
                    !draft.name.trim() && error ? "border-rose-500" : "border-white/20"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Objective</Label>
                <div className="flex flex-wrap gap-3">
                  {["AWARENESS", "LEADS", "CONVERSIONS"].map((o) => (
                    <label
                      key={o}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 ${
                        draft.objective === o
                          ? "border-[#d4ff00]/50 bg-[#d4ff00]/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name="objective"
                        value={o}
                        checked={draft.objective === o}
                        onChange={() => update("objective", o)}
                        className="text-[#d4ff00]"
                      />
                      <span className="text-sm text-white">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Locations *</Label>
                <Input
                  value={draft.locations}
                  onChange={(e) => update("locations", e.target.value)}
                  placeholder="IN, US, UK"
                  className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Age range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="18"
                      value={draft.ageMin}
                      onChange={(e) => update("ageMin", e.target.value)}
                      className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
                    />
                    <Input
                      type="number"
                      placeholder="35"
                      value={draft.ageMax}
                      onChange={(e) => update("ageMax", e.target.value)}
                      className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Interests</Label>
                <Input
                  value={draft.interests}
                  onChange={(e) => update("interests", e.target.value)}
                  placeholder="pageants, fashion, beauty"
                  className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8">
                <ImageIcon className="h-12 w-12 text-white/40" />
                <p className="mt-2 text-sm text-white/60">Upload creative (image or video)</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Choose file
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Headline</Label>
                <Input
                  value={draft.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  placeholder="Your headline"
                  className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Daily budget (₹) *</Label>
                <Input
                  type="number"
                  min={100}
                  value={draft.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  className={`rounded-md border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md ${
                    error ? "border-rose-500" : "border-white/20"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Schedule</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-md"
                  />
                  <Input
                    type="date"
                    value={draft.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                    className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-md"
                  />
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setError("")
                setStep(Math.max(1, step - 1))
              }}
              disabled={step === 1}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-[#d4ff00] text-black hover:bg-[#b8e600]"
            >
              {step === 4 ? "Launch campaign" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
