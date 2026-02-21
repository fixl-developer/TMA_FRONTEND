"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense, useCallback } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { getPageantTemplates } from "@/shared/services/pageantTemplateService"
import {
  getPageantProcess,
  getStagesForPageant,
  getActionLabel,
  type PageantStage,
} from "@/shared/services/pageantProcessService"
import {
  Workflow,
  Settings2,
  BarChart3,
  GitBranch,
  Play,
  ChevronRight,
  UserPlus,
  Award,
  Trophy,
  GripVertical,
  Image,
  FileText,
  CreditCard,
  CheckSquare,
  Users,
} from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { useTenant } from "@/shared/context/TenantContext"
import { getCreatorName } from "@/shared/lib/creator"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { useCapability } from "@/shared/hooks/useCapability"

const stageIcons: Record<string, typeof UserPlus> = {
  reg: UserPlus,
  registration: UserPlus,
  prelims: Award,
  semi: Workflow,
  finals: Trophy,
  audition: Award,
  round1: Workflow,
  round2: Workflow,
  default: Workflow,
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ProcessBuilderContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenantId } = useTenant()
  const id = params.id as string
  const templateId = searchParams.get("template")
  const [pageant, setPageant] = useState<any>(null)
  const [stages, setStages] = useState<PageantStage[]>([])
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const canManagePageant = useCapability("pageant.manage")

  const loadData = useCallback(async () => {
    if (id === "new") {
      if (templateId) {
        const templates = await getPageantTemplates()
        const t = templates.find((x) => x._id === templateId)
        if (t) {
          setPageant({ _id: "new", name: `New: ${t.name}`, status: "DRAFT" })
          setStages(t.stages.map((s, i) => ({ ...s, order: i + 1 })))
        } else {
          setPageant({ _id: "new", name: "New pageant", status: "DRAFT" })
          setStages([
            { id: "reg", name: "Registration", order: 1 },
            { id: "prelims", name: "Prelims", order: 2 },
            { id: "semi", name: "Semi-finals", order: 3 },
            { id: "finals", name: "Finals", order: 4 },
          ])
        }
      } else {
        setPageant({ _id: "new", name: "New pageant", status: "DRAFT" })
        setStages([
          { id: "reg", name: "Registration", order: 1 },
          { id: "prelims", name: "Prelims", order: 2 },
          { id: "semi", name: "Semi-finals", order: 3 },
          { id: "finals", name: "Finals", order: 4 },
        ])
      }
    } else {
      const pageants = await getPageants(tenantId)
      const p = pageants.find((x) => x._id === id)
      if (p) {
        setPageant(p)
        const procStages = await getStagesForPageant(id, tenantId)
        setStages(procStages)
      }
    }
    setLoading(false)
  }, [id, templateId, tenantId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDragStart = (index: number) => {
    if (!canManagePageant) return
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!canManagePageant) return
    e.preventDefault()
    if (draggedIndex === null) return
    if (draggedIndex === index) return
    const newStages = [...stages]
    const [removed] = newStages.splice(draggedIndex, 1)
    newStages.splice(index, 0, removed)
    newStages.forEach((s, i) => (s.order = i + 1))
    setStages(newStages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    if (!canManagePageant) return
    setDraggedIndex(null)
  }

  if (loading || !pageant) {
    return (
      <AgenciesPage>
        <p className="py-12 text-center text-slate-500">Loading…</p>
      </AgenciesPage>
    )
  }

  const selectedStageData = stages.find((s) => s.id === selectedStage)

  return (
    <AgenciesPage>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageantPageHeader title={pageant.name} subtitle="Process Builder" />
        <div className="flex flex-wrap gap-2">
          <CapabilityGate capability="pageant.manage">
            <Link href={`/pageant/builder/${id}/scoring`}>
              <Button variant="outline" className="border-slate-200 text-slate-800">
                <BarChart3 className="mr-1.5 h-4 w-4" /> Scoring
              </Button>
            </Link>
          </CapabilityGate>
          <CapabilityGate capability="pageant.manage">
            <Link href={`/pageant/builder/${id}/rules`}>
              <Button variant="outline" className="border-slate-200 text-slate-800">
                <GitBranch className="mr-1.5 h-4 w-4" /> Rules
              </Button>
            </Link>
          </CapabilityGate>
          <CapabilityGate capability="pageant.manage">
            <Link href={`/pageant/builder/${id}/preview`}>
              <Button className="bg-violet-500 text-slate-800 hover:bg-violet-400">
                <Play className="mr-1.5 h-4 w-4" /> Preview
              </Button>
            </Link>
          </CapabilityGate>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ownership & attribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-600">
              <p>
                Owner: Pageant operations
              </p>
              <p>
                Created by:{" "}
                {getCreatorName(pageant.createdByUserId ?? pageant.createdBy) ??
                  pageant.createdByUserId ??
                  pageant.createdBy ??
                  "System"}
              </p>
              <p>
                Created: {formatDateTime(pageant.createdAt)} · Updated:{" "}
                {formatDateTime(pageant.updatedAt)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Process flow</CardTitle>
              <p className="text-xs text-slate-500">Drag stages to reorder</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-0 py-4">
                {stages.map((stage, i) => {
                  const Icon = stageIcons[stage.id] ?? stageIcons.default
                  const isSelected = selectedStage === stage.id
                  return (
                    <div key={stage.id} className="flex flex-col items-center">
                      <div
                        draggable={canManagePageant}
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragEnd={handleDragEnd}
                        className={`flex w-full max-w-xs cursor-grab items-center gap-3 rounded-xl border p-4 transition-all active:cursor-grabbing ${
                          isSelected
                            ? "border-violet-500 bg-violet-500/20"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        } ${draggedIndex === i ? "opacity-60" : ""}`}
                      >
                        <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                          className="flex flex-1 items-center gap-3 text-left"
                        >
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                              isSelected ? "bg-violet-500/40" : "bg-slate-200"
                            }`}
                          >
                            <Icon
                              className={`h-6 w-6 ${
                                isSelected ? "text-violet-600" : "text-slate-500"
                              }`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800">{stage.name}</p>
                            <p className="text-xs text-slate-500">Stage {stage.order}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                        </button>
                      </div>
                      {i < stages.length - 1 && (
                        <div className="my-1 h-6 w-0.5 bg-slate-200" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full shrink-0 lg:w-96">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Settings2 className="h-4 w-4 text-violet-600" />
              <CardTitle>Stage config</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStageData ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-800">
                    {selectedStageData.name}
                  </p>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <FileText className="h-3.5 w-3.5" /> Entry criteria
                    </label>
                    <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {selectedStageData.entryCriteria ?? "Previous stage completed"}
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CheckSquare className="h-3.5 w-3.5" /> Exit criteria
                    </label>
                    <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {selectedStageData.exitCriteria ?? "Stage requirements met"}
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Users className="h-3.5 w-3.5" /> Visibility
                    </label>
                    <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {selectedStageData.visibility ?? "Visible to participants"}
                    </p>
                  </div>

                  {selectedStageData.responsibleRoles?.length ? (
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        Responsible roles
                      </label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedStageData.responsibleRoles.map((r) => (
                          <span
                            key={r}
                            className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-700"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedStageData.actions?.length ? (
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        Actions
                      </label>
                      <ul className="mt-1 space-y-1">
                        {selectedStageData.actions.map((a) => (
                          <li
                            key={a}
                            className="flex items-center gap-2 rounded bg-slate-50 px-2 py-1.5 text-sm text-slate-700"
                          >
                            {a === "media_upload" && <Image className="h-4 w-4" />}
                            {a === "form_submission" && <FileText className="h-4 w-4" />}
                            {a === "payment_collection" && <CreditCard className="h-4 w-4" />}
                            {getActionLabel(a)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <CapabilityGate capability="pageant.manage">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-200 text-slate-800"
                    >
                      Edit stage (coming soon)
                    </Button>
                  </CapabilityGate>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Select a stage to view and configure its settings.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}

export default function ProcessBuilderPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-slate-500">Loading…</p>}>
      <ProcessBuilderContent />
    </Suspense>
  )
}
