"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getTalents, getTalentTags, type Talent } from "@/shared/services/talentService"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useTenant } from "@/shared/context/TenantContext"

const STATUS_OPTIONS: FilterOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
]

export default function TalentMgmtTalentPage() {
  const { tenantId } = useTenant()
  const [talents, setTalents] = useState<Talent[]>([])
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [formStageName, setFormStageName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formStatus, setFormStatus] = useState("ACTIVE")

  useEffect(() => {
    if (!tenantId) return
    Promise.all([getTalents(tenantId), getTalentTags(tenantId)]).then(([t, tg]) => {
      setTalents(t)
      setTags(tg)
      setLoading(false)
    })
  }, [tenantId])

  const filteredTalents = useMemo(() => {
    let list = talents
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.stageName?.toLowerCase().includes(q) ||
          t._id?.toLowerCase().includes(q) ||
          t.userId?.toLowerCase().includes(q) ||
          t.email?.toLowerCase().includes(q)
      )
    }
    if (statusFilter.length > 0) {
      list = list.filter((t) => statusFilter.includes(t.status ?? "ACTIVE"))
    }
    if (tagFilter.length > 0) {
      list = list.filter((t) => tagFilter.some((tid) => t.tagIds?.includes(tid)))
    }
    return list
  }, [talents, search, statusFilter, tagFilter])

  const tagOptions: FilterOption[] = tags.map((t) => ({ value: t._id, label: t.name }))

  const TALENT_COLUMNS: Column<Talent>[] = [
    {
      key: "stageName",
      header: "Stage name",
      sortable: true,
      render: (_, row) => (
        <Link
          href={`/talent-mgmt/talent/${row._id}`}
          className="font-medium text-[#1C1917] hover:underline"
        >
          {row.stageName}
        </Link>
      ),
    },
    { key: "_id", header: "ID", sortable: true },
    { key: "status", header: "Status", sortable: true, render: (v) => v ?? "ACTIVE" },
    { key: "location", header: "Location", sortable: true },
  ]

  const handleAddTalent = () => {
    if (!formStageName.trim()) return
    const newTalent: Talent = {
      _id: `talent_new_${Date.now()}`,
      tenantId: tenantId!,
      stageName: formStageName.trim(),
      email: formEmail.trim() || undefined,
      status: formStatus,
      createdAt: new Date().toISOString(),
    }
    setTalents((prev) => [newTalent, ...prev])
    setFormStageName("")
    setFormEmail("")
    setFormStatus("ACTIVE")
    setAddModalOpen(false)
  }

  return (
    <AgenciesPage>
      <PageBanner title="Talent CRM" subtitle="Profiles, pipelines, commission rules." variant="talent-mgmt" backgroundImage="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=80" />
      <section className="mt-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 shrink-0">
            <FilterPanel
              searchPlaceholder="Search talent…"
              searchValue={search}
              onSearchChange={setSearch}
              multiSelectFilters={[
                {
                  key: "status",
                  label: "Status",
                  options: STATUS_OPTIONS,
                  selected: statusFilter,
                  onSelectionChange: setStatusFilter,
                },
                ...(tagOptions.length > 0
                  ? [
                      {
                        key: "tags",
                        label: "Tags",
                        options: tagOptions,
                        selected: tagFilter,
                        onSelectionChange: setTagFilter,
                      },
                    ]
                  : []),
              ]}
            />
          </aside>
          <div className="min-w-0 flex-1">
            <Card className="border-[#E7E5E4]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1C1917]">Talent roster</CardTitle>
                <Button
                  className="bg-teal-500 text-slate-900 hover:bg-teal-400"
                  onClick={() => setAddModalOpen(true)}
                >
                  Add talent
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="py-8 text-center text-slate-500">Loading talents…</p>
                ) : (
                  <DataTable
                    data={filteredTalents}
                    columns={TALENT_COLUMNS}
                    pageSize={10}
                    exportable
                    exportFileName="talent-roster"
                    emptyMessage="No talents yet."
                    variant="agencies"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md border-[#E7E5E4]">
          <DialogHeader>
            <DialogTitle className="text-[#1C1917]">Add talent</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="stageName" className="text-[#57534E]">Stage name</Label>
              <Input
                id="stageName"
                value={formStageName}
                onChange={(e) => setFormStageName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="border-[#E7E5E4]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[#57534E]">Email</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="priya@example.com"
                className="border-[#E7E5E4]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-[#57534E]">Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger id="status" className="border-[#E7E5E4]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)} className="border-[#E7E5E4]">
              Cancel
            </Button>
            <Button
              className="bg-teal-500 text-slate-900 hover:bg-teal-400"
              onClick={handleAddTalent}
              disabled={!formStageName.trim()}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgenciesPage>
  )
}
