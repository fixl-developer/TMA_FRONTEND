"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, DASHBOARD_PATH } from "@/shared/context/AuthContext"
import { SignupStepper } from "@/shared/components/auth/SignupStepper"
import { UserCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

const STEPS = [
  { label: "Personal" },
  { label: "Category" },
  { label: "Consent" },
]

export default function TalentSignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("")
  const [acceptedConsent, setAcceptedConsent] = useState(false)
  const [error, setError] = useState("")

  const handleNext = () => {
    setError("")
    if (step === 1) {
      if (!fullName.trim() || !email.trim()) {
        setError("Please fill name and email.")
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!category) {
        setError("Please select a category.")
        return
      }
      setStep(3)
    } else {
      if (!acceptedConsent) {
        setError("Please accept the consent forms.")
        return
      }
      const result = login("modelling@talentos.io", "demo123")
      if (result.ok) {
        router.push(DASHBOARD_PATH.modelling)
      } else {
        setError("Signup complete. Use modelling@talentos.io / demo123 to sign in.")
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20">
            <UserCircle2 className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-white">Talent signup</h1>
            <p className="text-sm text-slate-400">Step {step} of {STEPS.length}</p>
          </div>
        </div>

        <SignupStepper steps={STEPS} currentStep={step} variant="amber" className="mb-8" />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Full name</Label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-amber-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-amber-500/50"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="">Select category</option>
                  <option value="MODEL">Model</option>
                  <option value="PAGEANT">Pageant contestant</option>
                  <option value="INFLUENCER">Influencer</option>
                  <option value="ACTOR">Actor</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <p className="text-xs text-slate-500">Portfolio upload will be available in a later phase.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedConsent}
                  onChange={(e) => setAcceptedConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-300">
                  I consent to my profile and portfolio being shared with agencies and brands on the platform.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500" />
                <span className="text-sm text-slate-300">I accept the Terms of Service and Privacy Policy.</span>
              </label>
              <p className="text-xs text-slate-500">Demo: Signup completes and redirects to Modelling dashboard.</p>
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
              className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-medium"
            >
              {step === 3 ? "Complete signup" : "Next"} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link href="/signup" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
            ← Back to signup options
          </Link>
        </p>
      </div>
    </div>
  )
}
