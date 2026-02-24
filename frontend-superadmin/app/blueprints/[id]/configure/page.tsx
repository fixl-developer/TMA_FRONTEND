"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Settings,
  Save,
  RefreshCcw,
  Shield,
  Workflow,
  Boxes,
} from "lucide-react"
import type { BlueprintId } from "@/shared/lib/types/blueprints"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog"
import { useToast } from "@/shared/components/ui/toast"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import {
  clearConfig,
  fetchBlueprintConfig,
  saveBlueprintConfig,
  setDirty,
} from "@/shared/state/blueprintConfigSlice"

function uniqTrim(values: string[]) {
  const set = new Set(values.map((v) => v.trim()).filter(Boolean))
  return Array.from(set)
}

export default function BlueprintConfigurePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const blueprintId = params?.id?.toUpperCase() as BlueprintId | undefined

  const dispatch = useAppDispatch()
  const { current, loading, saving, dirty, error } = useAppSelector(
    (s) => s.blueprintConfig
  )
  const { showToast } = useToast()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT" | "DEPRECATED">("ACTIVE")
  const [description, setDescription] = useState("")

  const [modules, setModules] = useState<string[]>([])
  const [workflows, setWorkflows] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [capabilities, setCapabilities] = useState<string[]>([])

  const [addModule, setAddModule] = useState("")
  const [addWorkflow, setAddWorkflow] = useState("")
  const [addRole, setAddRole] = useState("")
  const [addCapability, setAddCapability] = useState("")

  const [resetOpen, setResetOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [pendingNavigateTo, setPendingNavigateTo] = useState<string | null>(null)

  useEffect(() => {
    if (!blueprintId) return
    dispatch(fetchBlueprintConfig(blueprintId))
    return () => {
      dispatch(clearConfig())
    }
  }, [dispatch, blueprintId])

  useEffect(() => {
    if (!current) return
    setName(current.name)
    setCategory(current.category)
    setStatus(current.status)
    setDescription(current.description)
    setModules(current.modules ?? [])
    setWorkflows(current.defaultWorkflows ?? [])
    setRoles(current.primaryRoles ?? [])
    setCapabilities(current.capabilities ?? [])
  }, [current])

  const computedDirty = useMemo(() => {
    if (!current) return false
    const base = {
      name: current.name,
      category: current.category,
      status: current.status,
      description: current.description,
      modules: current.modules ?? [],
      workflows: current.defaultWorkflows ?? [],
      roles: current.primaryRoles ?? [],
      capabilities: current.capabilities ?? [],
    }
    const next = {
      name,
      category,
      status,
      description,
      modules,
      workflows,
      roles,
      capabilities,
    }
    return JSON.stringify(base) !== JSON.stringify(next)
  }, [
    current,
    name,
    category,
    status,
    description,
    modules,
    workflows,
    roles,
    capabilities,
  ])

  useEffect(() => {
    if (dirty !== computedDirty) dispatch(setDirty(computedDirty))
  }, [dispatch, dirty, computedDirty])

  const handleSave = async () => {
    if (!blueprintId) return
    try {
      await dispatch(
        saveBlueprintConfig({
          id: blueprintId,
          patch: {
            name: name.trim(),
            category: category.trim(),
            status,
            description: description.trim(),
            modules: uniqTrim(modules),
            defaultWorkflows: uniqTrim(workflows),
            primaryRoles: uniqTrim(roles),
            capabilities: uniqTrim(capabilities),
          },
        })
      ).unwrap()
      showToast("Blueprint configuration saved (local override).", "success")
    } catch {
      showToast("Failed to save configuration.", "error")
    }
  }

  const resetToSeed = async () => {
    // Simple reset: clear overrides by reloading fresh config and replacing fields.
    // Since overrides are stored in localStorage, we reset by saving the seed values.
    if (!blueprintId) return
    try {
      // Re-fetch from service will already apply overrides; we need to clear localStorage key.
      if (typeof window !== "undefined") {
        localStorage.removeItem("talentos_blueprint_overrides_v1")
      }
      await dispatch(fetchBlueprintConfig(blueprintId)).unwrap()
      showToast("Reset to seed configuration.", "info")
    } catch {
      showToast("Failed to reset configuration.", "error")
    }
  }

  const safeNavigate = (href: string) => {
    if (!computedDirty) {
      router.push(href)
      return
    }
    setPendingNavigateTo(href)
    setLeaveOpen(true)
  }

  const confirmLeave = () => {
    if (!pendingNavigateTo) return
    router.push(pendingNavigateTo)
    setPendingNavigateTo(null)
  }

  if (!blueprintId) {
    return (
      <PageLayout>
        <PageHeader title="Configure blueprint" description="Invalid blueprint id in URL." />
        <PageSection>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/blueprints/catalog">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to catalog
            </Link>
          </Button>
        </PageSection>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Configure blueprint"
        description={`Blueprint ${blueprintId}. UI-only configuration with local overrides; backend integration later.`}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Settings className="h-3.5 w-3.5 text-[#0078d4]" />
            Config
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => safeNavigate(`/blueprints/${blueprintId}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setResetOpen(true)}
              disabled={saving || loading}
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleSave}
              disabled={saving || loading || !computedDirty}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : computedDirty ? "Save changes" : "Saved"}
            </Button>
          </div>
        }
      />

      {error && (
        <PageSection>
          <Card className="border-[#fed9cc] bg-[#fff5f5]">
            <CardHeader>
              <CardTitle className="text-sm text-[#a80000]">Error</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#a80000]">{error}</CardContent>
          </Card>
        </PageSection>
      )}

      <PageSection title="Blueprint metadata">
        <Card>
          <CardContent className="grid gap-4 p-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bp-name">Name</Label>
              <Input
                id="bp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Blueprint name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp-category">Category</Label>
              <Input
                id="bp-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Modeling & Talent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp-status">Status</Label>
              <select
                id="bp-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "ACTIVE" | "DRAFT" | "DEPRECATED")
                }
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DRAFT">DRAFT</option>
                <option value="DEPRECATED">DEPRECATED</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bp-desc">Description</Label>
              <textarea
                id="bp-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[96px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="What is this blueprint used for?"
              />
              <p className="text-[11px] text-[#605e5c]">
                Tip: keep this user-facing; used in catalog and assignment wizard.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Modules">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Boxes className="h-4 w-4 text-[#0078d4]" />
              Included modules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {modules.length === 0 ? (
                <p className="text-xs text-[#605e5c]">No modules configured.</p>
              ) : (
                modules.map((m) => (
                  <button
                    key={m}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] text-slate-700 hover:border-slate-300"
                    onClick={() => setModules((prev) => prev.filter((x) => x !== m))}
                    title="Click to remove"
                    type="button"
                  >
                    {m}
                  </button>
                ))
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="add-module">Add module</Label>
                <Input
                  id="add-module"
                  value={addModule}
                  onChange={(e) => setAddModule(e.target.value)}
                  placeholder="e.g. Booking pipeline"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => {
                  const v = addModule.trim()
                  if (!v) return
                  setModules((prev) => uniqTrim([...prev, v]))
                  setAddModule("")
                }}
              >
                Add
              </Button>
            </div>
            <p className="text-[11px] text-[#605e5c]">
              Modules drive what appears in tenant UIs and which workflows are available (API enforcement later).
            </p>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Workflows">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Workflow className="h-4 w-4 text-[#0078d4]" />
              Default workflows shipped
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              {workflows.length === 0 ? (
                <p className="text-xs text-[#605e5c]">No workflows configured.</p>
              ) : (
                workflows.map((w) => (
                  <div
                    key={w}
                    className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2 text-[11px]"
                  >
                    <span>{w}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[10px] text-[#a80000] hover:bg-[#f3f2f1]"
                      onClick={() => setWorkflows((prev) => prev.filter((x) => x !== w))}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="add-workflow">Add workflow</Label>
                <Input
                  id="add-workflow"
                  value={addWorkflow}
                  onChange={(e) => setAddWorkflow(e.target.value)}
                  placeholder="e.g. Intake → Review → Onboard"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => {
                  const v = addWorkflow.trim()
                  if (!v) return
                  setWorkflows((prev) => uniqTrim([...prev, v]))
                  setAddWorkflow("")
                }}
              >
                Add
              </Button>
            </div>
            <p className="text-[11px] text-[#605e5c]">
              In Phase 2, this will connect to the workflow engine and versioning.
            </p>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Roles & permissions">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-[#0078d4]" />
                Primary roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {roles.length === 0 ? (
                  <p className="text-xs text-[#605e5c]">No roles configured.</p>
                ) : (
                  roles.map((r) => (
                    <button
                      key={r}
                      className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] text-slate-700 hover:border-slate-300"
                      onClick={() => setRoles((prev) => prev.filter((x) => x !== r))}
                      title="Click to remove"
                      type="button"
                    >
                      {r}
                    </button>
                  ))
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="add-role">Add role</Label>
                  <Input
                    id="add-role"
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    placeholder="e.g. Operations Manager"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    const v = addRole.trim()
                    if (!v) return
                    setRoles((prev) => uniqTrim([...prev, v]))
                    setAddRole("")
                  }}
                >
                  Add
                </Button>
              </div>
              <p className="text-[11px] text-[#605e5c]">
                Primary roles are used for documentation and template defaults; enforcement is via RBAC/ABAC later.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-[#5c2d91]" />
                Key capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {capabilities.length === 0 ? (
                  <p className="text-xs text-[#605e5c]">No capabilities configured.</p>
                ) : (
                  capabilities.map((c) => (
                    <div
                      key={c}
                      className="flex items-center justify-between rounded border border-[#edebe9] bg-[#f3f2f1] px-3 py-2"
                    >
                      <code className="text-[11px]">{c}</code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] text-[#a80000] hover:bg-[#f3f2f1]"
                        onClick={() => setCapabilities((prev) => prev.filter((x) => x !== c))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="add-capability">Add capability</Label>
                  <Input
                    id="add-capability"
                    value={addCapability}
                    onChange={(e) => setAddCapability(e.target.value)}
                    placeholder="e.g. booking.manage"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    const v = addCapability.trim()
                    if (!v) return
                    setCapabilities((prev) => uniqTrim([...prev, v]))
                    setAddCapability("")
                  }}
                >
                  Add
                </Button>
              </div>
              <p className="text-[11px] text-[#605e5c]">
                Capability naming should follow a stable taxonomy (action/resource). API enforcement later.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset to seed configuration?"
        description="This will discard any locally saved overrides for this blueprint and restore seed defaults."
        confirmText="Reset"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={resetToSeed}
      />

      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Discard unsaved changes?"
        description="You have unsaved changes. If you leave now, those changes will be lost."
        confirmText="Leave"
        cancelText="Stay"
        variant="destructive"
        onConfirm={confirmLeave}
      />
    </PageLayout>
  )
}

