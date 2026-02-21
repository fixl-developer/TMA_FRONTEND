"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { getContractTemplateById, getClauses, updateContractTemplate, type ContractTemplate, type Clause } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function ContractTemplateDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }
  const id = params.id as string
  const [template, setTemplate] = useState<ContractTemplate | null>(null)
  const [clauses, setClauses] = useState<Clause[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedClauseIds, setSelectedClauseIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getContractTemplateById(id, tenantId),
      getClauses(tenantId),
    ]).then(([t, c]) => {
      setTemplate(t ?? null)
      setClauses(c)
      if (t) {
        setName(t.name)
        setDescription(t.description ?? "")
        setSelectedClauseIds(t.clauseIds ?? [])
      }
      setLoading(false)
    })
  }, [id, tenantId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateContractTemplate(id, { name, description, clauseIds: selectedClauseIds }, tenantId)
    setTemplate((prev) => prev ? { ...prev, name, description, clauseIds: selectedClauseIds } : null)
    setEditing(false)
    showToast("Template updated (mock)", "success")
    setSaving(false)
  }

  const toggleClause = (clauseId: string) => {
    setSelectedClauseIds((prev) =>
      prev.includes(clauseId) ? prev.filter((c) => c !== clauseId) : [...prev, clauseId]
    )
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!template) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Template not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/contracts/templates">Back to templates</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>{template.name}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Edit template</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/contracts/templates" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to templates
          </Link>
        </Button>
      </div>

      <Card className="mt-6 border max-w-2xl" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle style={{ color: theme.text }}>Template details</CardTitle>
          {!editing ? (
            <Button size="sm" className="bg-[#B8860B] hover:bg-[#9A7209]" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="border" style={{ borderColor: theme.border }} onClick={() => setEditing(false)}>
              Cancel
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label style={{ color: theme.text }}>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 border"
                  style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                  required
                />
              </div>
              <div>
                <Label style={{ color: theme.text }}>Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                />
              </div>
              <div>
                <Label style={{ color: theme.text }}>Clauses (select order)</Label>
                <div className="mt-2 space-y-2 rounded-lg border p-3" style={{ borderColor: theme.border }}>
                  {clauses.map((c) => (
                    <label key={c._id} className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedClauseIds.includes(c._id)}
                        onChange={() => toggleClause(c._id)}
                        className="mt-1 rounded border"
                        style={{ borderColor: theme.border }}
                      />
                      <div>
                        <p className="font-medium" style={{ color: theme.text }}>{c.name}</p>
                        <p className="text-xs line-clamp-2" style={{ color: theme.textSecondary }}>{c.content}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={saving}>
                  Save
                </Button>
                <Button type="button" variant="outline" className="border" style={{ borderColor: theme.border }} onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Name</p>
                <p style={{ color: theme.text }}>{template.name}</p>
              </div>
              {template.description && (
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Description</p>
                  <p style={{ color: theme.text }}>{template.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Clauses</p>
                <div className="mt-2 space-y-2">
                  {template.clauseIds?.map((clauseId) => {
                    const c = clauses.find((x) => x._id === clauseId)
                    return c ? (
                      <div key={c._id} className="rounded-lg border p-3" style={{ borderColor: theme.border }}>
                        <p className="font-medium" style={{ color: theme.text }}>{c.name}</p>
                        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{c.content}</p>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
