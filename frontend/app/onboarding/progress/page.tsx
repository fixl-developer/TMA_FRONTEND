"use client"

import Link from "next/link"
import { useAuth } from "@/shared/context/AuthContext"
import { CheckCircle2, Circle } from "lucide-react"

const DEMO_CHECKLIST = [
  { id: "1", label: "Complete profile", done: true },
  { id: "2", label: "Add team members", done: false },
  { id: "3", label: "Create first pageant", done: false },
  { id: "4", label: "Invite judges", done: false },
  { id: "5", label: "Publish registration", done: false },
]

export default function OnboardingProgressPage() {
  const { user } = useAuth()
  const doneCount = DEMO_CHECKLIST.filter((c) => c.done).length

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-white">Onboarding progress</h1>
          <p className="mt-2 text-slate-400">Track your setup progress</p>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="text-sm font-medium text-slate-300">Overall progress</span>
          <span className="text-lg font-semibold text-teal-400">{doneCount} / {DEMO_CHECKLIST.length}</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
          <div className="space-y-4">
            {DEMO_CHECKLIST.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                  item.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-700 bg-slate-800/50"
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-slate-500" />
                )}
                <span className={item.done ? "text-slate-300 line-through" : "text-white"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/signup/tenant" className="text-teal-400 hover:text-teal-300">← Back to onboarding</Link>
          {" · "}
          <Link href="/login" className="text-teal-400 hover:text-teal-300">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
