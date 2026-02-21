"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, DASHBOARD_PATH } from "@/shared/context/AuthContext"
import { SignupStepper } from "@/shared/components/auth/SignupStepper"
import { UserCircle2, CheckCircle2, ArrowRight } from "lucide-react"

const STEPS = [
  { label: "Welcome" },
  { label: "Profile" },
  { label: "Complete" },
]

export default function TalentOnboardingPage() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [step, setStep] = useState(1)
  const [stageName, setStageName] = useState("")
  const [completed, setCompleted] = useState(false)

  const handleNext = () => {
    if (step === 1) setStep(2)
    else if (step === 2) {
      if (!stageName.trim()) return
      setStep(3)
    } else {
      setCompleted(true)
      const email = user?.email ?? "modelling@talentos.io"
      login(email, "demo123")
      setTimeout(() => router.push(DASHBOARD_PATH.modelling), 2000)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else router.push("/signup")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
            <UserCircle2 className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-white">Talent onboarding</h1>
            <p className="text-sm text-slate-400">Step {step} of {STEPS.length}</p>
          </div>
        </div>

        <SignupStepper steps={STEPS} currentStep={step} variant="amber" className="mb-8" />

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl sm:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Welcome to TalentOS</h2>
              <p className="text-slate-400">
                Complete your talent profile to get discovered by agencies and brands.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">• Add your stage name and portfolio</li>
                <li className="flex items-center gap-2">• Select your categories</li>
                <li className="flex items-center gap-2">• Set your availability</li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Stage name</label>
                <input
                  type="text"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  placeholder="Your professional name"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-slate-500">Demo: Portfolio upload and other fields would be here.</p>
            </div>
          )}

          {step === 3 && !completed && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">You&apos;re all set!</h2>
              <p className="text-slate-400">
                Your talent profile is ready. Go to your dashboard to explore castings and opportunities.
              </p>
            </div>
          )}

          {completed && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">Onboarding complete!</p>
              <p className="mt-1 text-sm text-slate-400">Redirecting to your dashboard…</p>
            </div>
          )}

          {!completed && (
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400"
              >
                {step === 3 ? "Go to dashboard" : "Next"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/login" className="text-amber-400 hover:text-amber-300">Skip to sign in</Link>
        </p>
      </div>
    </div>
  )
}
