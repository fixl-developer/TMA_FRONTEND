"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { getRegistrations } from "@/shared/services/pageantDataService"
import {
  getScoringCriteria,
  getScoresForPageant,
  submitScores,
  type PageantScore,
} from "@/shared/services/pageantScoringService"
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"

export default function JudgeScoringPage() {
  const params = useParams()
  const id = params.id as string
  const [pageant, setPageant] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [criteria, setCriteria] = useState<string[]>([])
  const [existingScores, setExistingScores] = useState<PageantScore[]>([])
  const [blindMode, setBlindMode] = useState(true)
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({})
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPageants(),
      getRegistrations(id),
      getScoresForPageant(id),
    ]).then(([pageants, regs, scs]) => {
      setPageant(pageants.find((p: any) => p._id === id))
      setParticipants(regs.filter((r: any) => r.status === "CONFIRMED"))
      setCriteria(getScoringCriteria(id))
      setExistingScores(scs)
      // Pre-fill from existing scores
      const prefill: Record<string, Record<string, number>> = {}
      scs.forEach((s) => {
        prefill[s.registrationId] = s.criteriaScores
        setSubmitted((prev) => new Set(prev).add(s.registrationId))
      })
      setScores(prefill)
      setLoading(false)
    })
  }, [id])

  const handleScoreChange = (participantId: string, criterion: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [participantId]: { ...(prev[participantId] ?? {}), [criterion]: value },
    }))
  }

  const getTotalScore = (participantId: string) => {
    const pScores = scores[participantId] ?? {}
    return Object.values(pScores).reduce((a, b) => a + b, 0)
  }

  const handleSubmit = async (participantId: string) => {
    const pScores = scores[participantId] ?? {}
    if (Object.keys(pScores).length === 0) return
    await submitScores(id, participantId, "PRELIMS", "judge_001", pScores)
    setSubmitted((prev) => new Set(prev).add(participantId))
    setSelectedParticipant(null)
  }

  if (loading || !pageant) {
    return (
      <AgenciesPage>
        <p className="py-12 text-center text-slate-500">Loading…</p>
      </AgenciesPage>
    )
  }

  const maxPerCriteria = 100
  const maxTotal = criteria.length * maxPerCriteria

  return (
    <AgenciesPage>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/pageant/${id}/live`}>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <PageantPageHeader title="Judge scoring" subtitle={pageant.name} />
        </div>
        <button
          type="button"
          onClick={() => setBlindMode(!blindMode)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          {blindMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {blindMode ? "Blind mode" : "Names visible"}
        </button>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Scoring rubric</CardTitle>
            <p className="text-xs text-slate-500">
              Criteria: {criteria.join(", ")} (max {maxPerCriteria} each)
            </p>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <p className="text-slate-500">No participants to score yet.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Confirm registrations before scoring.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {participants.map((p) => {
                  const isSubmitted = submitted.has(p._id)
                  return (
                    <div
                      key={p._id}
                      className={`rounded-lg border p-4 transition-colors ${
                        selectedParticipant === p._id
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-semibold text-slate-800">
                          {blindMode ? `Participant #${p._id.slice(-3)}` : p.contestantName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-violet-600">
                            {getTotalScore(p._id)} / {maxTotal}
                          </span>
                          {isSubmitted && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              <Check className="h-3 w-3" /> Submitted
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {criteria.map((c) => (
                          <div key={c}>
                            <label className="block text-xs font-medium text-slate-500">
                              {c}
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={maxPerCriteria}
                              value={scores[p._id]?.[c] ?? ""}
                              onChange={(e) =>
                                handleScoreChange(p._id, c, Number(e.target.value) || 0)
                              }
                              placeholder="0"
                              disabled={isSubmitted}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 disabled:bg-slate-100"
                            />
                          </div>
                        ))}
                      </div>
                      {!isSubmitted && (
                        <Button
                          size="sm"
                          className="mt-4 bg-violet-500 text-slate-800 hover:bg-violet-400"
                          onClick={() => handleSubmit(p._id)}
                          disabled={Object.keys(scores[p._id] ?? {}).length === 0}
                        >
                          Submit scores
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {submitted.size} of {participants.length} scored
            </p>
            <div className="mt-6">
              <Link href={`/pageant/results?pageant=${id}`}>
                <Button variant="outline" className="w-full border-slate-200 text-slate-800">
                  View results
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgenciesPage>
  )
}
