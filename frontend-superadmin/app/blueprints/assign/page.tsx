"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers,
  Users2,
  FileCheck,
  Rocket,
  Search,
} from "lucide-react"
import type { Tenant } from "@/shared/lib/types/tenants"
import type { Blueprint, BlueprintId } from "@/shared/lib/types/blueprints"
import { getTenants } from "@/shared/services/tenantService"
import { getBlueprints } from "@/shared/services/blueprintService"
import { setTenantBlueprints } from "@/shared/services/tenantService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { useToast } from "@/shared/components/ui/toast"
import { cn } from "@/shared/lib/utils"

const STEPS = [
  { id: 1, label: "Select tenants", icon: Users2 },
  { id: 2, label: "Choose blueprints", icon: Layers },
  { id: 3, label: "Preview changes", icon: FileCheck },
  { id: 4, label: "Confirm & deploy", icon: Rocket },
]

export default function BlueprintAssignPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)

  const [selectedTenantIds, setSelectedTenantIds] = useState<Set<string>>(new Set())
  const [selectedBlueprintIds, setSelectedBlueprintIds] = useState<Set<BlueprintId>>(new Set())
  const [tenantSearch, setTenantSearch] = useState("")
  const [blueprintSearch, setBlueprintSearch] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [t, b] = await Promise.all([getTenants(), getBlueprints()])
        setTenants(t)
        setBlueprints(b)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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

  const filteredBlueprints = useMemo(() => {
    if (!blueprintSearch.trim()) return blueprints
    const q = blueprintSearch.toLowerCase()
    return blueprints.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    )
  }, [blueprints, blueprintSearch])

  const previewRows = useMemo(() => {
    const currentByTenant = new Map<string, string[]>()
    tenants.forEach((t) => {
      currentByTenant.set(t._id, (t.blueprints as string[] | undefined) ?? [])
    })
    const toAssign = Array.from(selectedBlueprintIds)
    return selectedTenantIds.size > 0
      ? Array.from(selectedTenantIds).map((tenantId) => {
          const current = currentByTenant.get(tenantId) ?? []
          const merged = [...new Set([...current, ...toAssign])].sort()
          const tenant = tenants.find((t) => t._id === tenantId)
          return {
            tenantId,
            tenantName: tenant?.name ?? tenantId,
            current,
            newList: merged,
            changed: JSON.stringify(current.sort()) !== JSON.stringify(merged),
          }
        })
      : []
  }, [tenants, selectedTenantIds, selectedBlueprintIds])

  const toggleTenant = (id: string) => {
    setSelectedTenantIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleBlueprint = (id: BlueprintId) => {
    setSelectedBlueprintIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllTenants = () => {
    if (selectedTenantIds.size === filteredTenants.length) {
      setSelectedTenantIds(new Set())
    } else {
      setSelectedTenantIds(new Set(filteredTenants.map((t) => t._id)))
    }
  }

  const selectAllBlueprints = () => {
    if (selectedBlueprintIds.size === filteredBlueprints.length) {
      setSelectedBlueprintIds(new Set())
    } else {
      setSelectedBlueprintIds(new Set(filteredBlueprints.map((b) => b.id)))
    }
  }

  const handleDeploy = async () => {
    setDeploying(true)
    try {
      for (const row of previewRows) {
        if (row.changed) {
          await setTenantBlueprints(row.tenantId, row.newList)
        }
      }
      const changedCount = previewRows.filter((r) => r.changed).length
      showToast(
        changedCount > 0
          ? `Blueprint assignment updated for ${changedCount} tenant(s).`
          : "No changes to apply.",
        "success"
      )
      router.push("/blueprints/catalog")
    } catch {
      showToast("Failed to apply blueprint assignments.", "error")
    } finally {
      setDeploying(false)
    }
  }

  const canNextStep1 = selectedTenantIds.size > 0
  const canNextStep2 = selectedBlueprintIds.size > 0
  const hasChanges = previewRows.some((r) => r.changed)

  return (
    <PageLayout>
      <PageHeader
        title="Assign blueprints to tenants"
        description="Select tenants and blueprints, then confirm to apply. Changes persist in this session (localStorage)."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Layers className="h-3.5 w-3.5 text-[#0078d4]" />
            Assignment wizard
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/blueprints/catalog">
              <ArrowLeft className="h-3.5 w-3.5" />
              Catalog
            </Link>
          </Button>
        }
      />

      <PageSection>
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isPast = step > s.id
            return (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    isActive && "border-[#0078d4] bg-[#deecf9] text-[#0078d4]",
                    isPast && "border-[#107c10] bg-[#dff6dd] text-[#107c10]",
                    !isActive && !isPast && "border-[#edebe9] bg-[#faf9f8] text-[#605e5c] hover:bg-[#f3f2f1]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isActive && "bg-[#0078d4] text-white",
                      isPast && "bg-[#107c10] text-white",
                      !isActive && !isPast && "bg-[#e1e1e1] text-[#605e5c]"
                    )}
                  >
                    {isPast ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </span>
                  <Icon className="h-4 w-4" />
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <span className="text-[#8a8886]">→</span>
                )}
              </div>
            )
          })}
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12 text-sm text-[#605e5c]">
              Loading tenants and blueprints…
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Step 1: Select tenants */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Select tenants</CardTitle>
                  <p className="text-sm text-[#605e5c]">
                    Choose one or more tenants to assign blueprints to. {selectedTenantIds.size} selected.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8886]" />
                    <Input
                      placeholder="Search tenants by name, slug, or ID…"
                      value={tenantSearch}
                      onChange={(e) => setTenantSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex items-center gap-2 border-b border-[#edebe9] pb-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          filteredTenants.length > 0 &&
                          selectedTenantIds.size === filteredTenants.length
                        }
                        onChange={selectAllTenants}
                        className="rounded border-[#8a8886]"
                      />
                      Select all ({filteredTenants.length} shown)
                    </label>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto rounded border border-[#edebe9] bg-[#faf9f8]">
                    {filteredTenants.length === 0 ? (
                      <p className="p-4 text-sm text-[#605e5c]">No tenants match the search.</p>
                    ) : (
                      <ul className="divide-y divide-[#edebe9]">
                        {filteredTenants.map((t) => (
                          <li key={t._id}>
                            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-[#f3f2f1]">
                              <input
                                type="checkbox"
                                checked={selectedTenantIds.has(t._id)}
                                onChange={() => toggleTenant(t._id)}
                                className="rounded border-[#8a8886]"
                              />
                              <div>
                                <p className="text-sm font-medium text-[#323130]">{t.name}</p>
                                <p className="text-xs text-[#605e5c]">
                                  {t._id} · {t.slug} · {t.type}
                                </p>
                              </div>
                              {(t.blueprints as string[] | undefined)?.length > 0 && (
                                <span className="ml-auto text-xs text-[#605e5c]">
                                  {(t.blueprints as string[]).join(", ")}
                                </span>
                              )}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Choose blueprints */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Choose blueprints to assign</CardTitle>
                  <p className="text-sm text-[#605e5c]">
                    Selected blueprints will be added to each chosen tenant (existing blueprints kept). {selectedBlueprintIds.size} selected.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8886]" />
                    <Input
                      placeholder="Search blueprints by name, code, or category…"
                      value={blueprintSearch}
                      onChange={(e) => setBlueprintSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex items-center gap-2 border-b border-[#edebe9] pb-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          filteredBlueprints.length > 0 &&
                          selectedBlueprintIds.size === filteredBlueprints.length
                        }
                        onChange={selectAllBlueprints}
                        className="rounded border-[#8a8886]"
                      />
                      Select all ({filteredBlueprints.length} shown)
                    </label>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto rounded border border-[#edebe9] bg-[#faf9f8]">
                    {filteredBlueprints.length === 0 ? (
                      <p className="p-4 text-sm text-[#605e5c]">No blueprints match the search.</p>
                    ) : (
                      <ul className="grid gap-2 p-2 sm:grid-cols-2">
                        {filteredBlueprints.map((b) => (
                          <li key={b.id}>
                            <label className="flex cursor-pointer items-start gap-3 rounded border border-[#edebe9] bg-white p-3 hover:bg-[#faf9f8]">
                              <input
                                type="checkbox"
                                checked={selectedBlueprintIds.has(b.id)}
                                onChange={() => toggleBlueprint(b.id)}
                                className="mt-1 rounded border-[#8a8886]"
                              />
                              <div>
                                <p className="text-sm font-semibold text-[#323130]">
                                  {b.name} <span className="font-mono text-[#605e5c]">({b.code})</span>
                                </p>
                                <p className="text-xs text-[#605e5c]">{b.category}</p>
                              </div>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preview changes</CardTitle>
                  <p className="text-sm text-[#605e5c]">
                    New blueprint list = current + selected blueprints (merged, no duplicates).
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded border border-[#edebe9]">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#edebe9] bg-[#faf9f8]">
                          <th className="px-4 py-3 font-semibold text-[#323130]">Tenant</th>
                          <th className="px-4 py-3 font-semibold text-[#323130]">Current blueprints</th>
                          <th className="px-4 py-3 font-semibold text-[#323130]">New blueprints</th>
                          <th className="px-4 py-3 font-semibold text-[#323130]">Changed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-[#605e5c]">
                              Select tenants and blueprints in steps 1–2 to see preview.
                            </td>
                          </tr>
                        ) : (
                          previewRows.map((row) => (
                            <tr
                              key={row.tenantId}
                              className="border-b border-[#edebe9] hover:bg-[#faf9f8]"
                            >
                              <td className="px-4 py-3">
                                <p className="font-medium text-[#323130]">{row.tenantName}</p>
                                <p className="text-xs font-mono text-[#605e5c]">{row.tenantId}</p>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {row.current.length === 0 ? (
                                    <span className="text-[#8a8886]">—</span>
                                  ) : (
                                    row.current.map((b) => (
                                      <span
                                        key={b}
                                        className="rounded border border-[#edebe9] bg-[#f3f2f1] px-2 py-0.5 text-xs font-mono"
                                      >
                                        {b}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {row.newList.length === 0 ? (
                                    <span className="text-[#8a8886]">—</span>
                                  ) : (
                                    row.newList.map((b) => (
                                      <span
                                        key={b}
                                        className="rounded border border-[#0078d4] bg-[#deecf9] px-2 py-0.5 text-xs font-mono text-[#0078d4]"
                                      >
                                        {b}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {row.changed ? (
                                  <span className="rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-xs font-medium text-[#107c10]">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#605e5c]">No change</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirm & deploy */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Confirm & deploy</CardTitle>
                  <p className="text-sm text-[#605e5c]">
                    Apply blueprint assignments. Updates are stored locally (localStorage) and reflected across Blueprint and Tenant views.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-3 text-sm">
                    <p className="font-medium text-[#323130]">
                      {previewRows.filter((r) => r.changed).length} tenant(s) will be updated.
                    </p>
                    <p className="mt-1 text-[#605e5c]">
                      {previewRows.filter((r) => r.changed).length === 0
                        ? "No changes to apply. Go back to add tenants or blueprints."
                        : "Click Deploy to save. You can change assignments again later from this wizard or from tenant details."}
                    </p>
                  </div>
                  <Button
                    onClick={handleDeploy}
                    disabled={deploying || !hasChanges}
                    className="gap-2"
                  >
                    <Rocket className="h-4 w-4" />
                    {deploying ? "Deploying…" : "Deploy"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
              {step < 4 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={
                    (step === 1 && !canNextStep1) ||
                    (step === 2 && !canNextStep2)
                  }
                  className="gap-1.5"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : null}
            </div>
          </>
        )}
      </PageSection>
    </PageLayout>
  )
}
