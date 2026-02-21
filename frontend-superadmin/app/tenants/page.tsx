/**
 * Tenants Management Dashboard - Super Admin
 *
 * Cinematic, read-only overview of tenants using seed data.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { Building2, Globe2, RefreshCcw, Eye, Shield, ShieldOff, Plus, XCircle } from "lucide-react"
import { getTenants, createTenant, activateTenant, suspendTenant, rejectTenant, onTenantsUpdated, type CreateTenantPayload } from "@/shared/services/tenantService"
import { getPageants } from "@/shared/services/pageantService"
import { seedTalents, seedStaff, seedBookings, seedSubTenantLinks, seedTenants } from "@/data/seed"
import type { Tenant } from "@/shared/lib/types/tenants"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetCloseButton,
} from "@/shared/components/ui/sheet"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog"
import { useToast } from "@/shared/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import type { CreateTenantPayload } from "@/shared/services/tenantService"

type StatusFilter = "ALL" | Tenant["status"]

const TENANT_TYPES: { value: CreateTenantPayload["type"]; label: string }[] = [
  { value: "AGENCY", label: "Agency" },
  { value: "PAGEANT_ORG", label: "Pageant Organiser" },
  { value: "EVENT_ORG", label: "Event Organiser" },
  { value: "BRAND", label: "Brand / Sponsor" },
  { value: "ACADEMY", label: "Academy" },
  { value: "HOLDING", label: "Holding" },
  { value: "MARKETPLACE", label: "Marketplace" },
]

function CreateTenantModal({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateTenantPayload) => Promise<void>
  submitting: boolean
}) {
  const [name, setName] = useState("")
  const [type, setType] = useState<CreateTenantPayload["type"]>("AGENCY")
  const [ownerName, setOwnerName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [slug, setSlug] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      type,
      ownerName: ownerName.trim() || undefined,
      ownerEmail: ownerEmail.trim() || undefined,
      slug: slug.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add tenant</DialogTitle>
          <DialogDescription>
            Create a new organization. It will start in PENDING status until approved.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">Organization name</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Talent Co"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-type">Type</Label>
            <select
              id="create-type"
              value={type}
              onChange={(e) => setType(e.target.value as CreateTenantPayload["type"])}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {TENANT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-owner">Owner name</Label>
            <Input
              id="create-owner"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-email">Owner email</Label>
            <Input
              id="create-email"
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="owner@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-slug">Slug (optional)</Label>
            <Input
              id="create-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function TenantsDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [pageants, setPageants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [agencyTypeFilter, setAgencyTypeFilter] = useState<string[]>([])
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [confirmSuspendOpen, setConfirmSuspendOpen] = useState(false)
  const [confirmActivateOpen, setConfirmActivateOpen] = useState(false)
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const [tenantsData, pageantsData] = await Promise.all([
          getTenants(),
          getPageants(),
        ])
        setTenants(tenantsData)
        setPageants(pageantsData)
      } catch (e) {
        console.error("Failed to load data", e)
        showToast("Failed to load tenants", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
    const unsub = onTenantsUpdated(load)
    return unsub
  }, [showToast])

  const metrics = useMemo(() => {
    const total = tenants.length
    const active = tenants.filter((t) => t.status === "ACTIVE").length
    const suspended = tenants.filter((t) => t.status === "SUSPENDED").length
    const pending = tenants.filter((t) => t.status === "PENDING").length

    const byType = tenants.reduce<Record<string, number>>((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1
      return acc
    }, {})

    const byCountry = tenants.reduce<Record<string, number>>((acc, t) => {
      if (!t.countryCode) return acc
      acc[t.countryCode] = (acc[t.countryCode] || 0) + 1
      return acc
    }, {})

    return { total, active, suspended, pending, byType, byCountry }
  }, [tenants])

  const filteredTenants = useMemo(() => {
    let filtered = tenants

    // Status filter
    if (filter !== "ALL") {
      filtered = filtered.filter((t) => t.status === filter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.slug.toLowerCase().includes(query) ||
          t._id.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter((t) => typeFilter.includes(t.type))
    }

    // Agency type filter (e.g. Modeling Agency)
    if (agencyTypeFilter.length > 0) {
      filtered = filtered.filter(
        (t) => (t as any).agencyType && agencyTypeFilter.includes((t as any).agencyType)
      )
    }

    return filtered
  }, [tenants, filter, searchQuery, typeFilter, agencyTypeFilter])

  const getTenantStats = (tenantId: string) => {
    const tenantPageants = pageants.filter((p) => p.tenantId === tenantId)
    const tenantTalents = seedTalents.filter((t: any) => t.tenantId === tenantId)
    const tenantStaff = seedStaff.filter((s: any) => s.tenantId === tenantId)
    const tenantBookings = seedBookings.filter((b: any) => b.tenantId === tenantId)
    return {
      pageants: tenantPageants.length,
      activePageants: tenantPageants.filter((p) => p.status === "ACTIVE").length,
      talents: tenantTalents.length,
      staff: tenantStaff.length,
      bookings: tenantBookings.length,
    }
  }

  const typeOptions: FilterOption[] = [
    { value: "AGENCY", label: "Agency" },
    { value: "PAGEANT_ORG", label: "Pageant Organiser" },
    { value: "EVENT_ORG", label: "Event Organiser" },
    { value: "BRAND", label: "Brand / Sponsor" },
    { value: "HOLDING", label: "Holding" },
  ]

  const agencyTypeOptions: FilterOption[] = [
    { value: "MODELING_AGENCY", label: "Modeling" },
    { value: "TALENT_AGENCY", label: "Talent" },
    { value: "CASTING_AGENCY", label: "Casting" },
    { value: "PRODUCTION_HOUSE", label: "Production" },
    { value: "INFLUENCER_AGENCY", label: "Influencer" },
    { value: "UGC_PRODUCTION", label: "UGC" },
    { value: "SOCIAL_MARKETING_AGENCY", label: "Social Marketing" },
    { value: "PAGEANT_ORGANIZER", label: "Pageant" },
    { value: "PAGEANT_TRAINING", label: "Pageant Training" },
    { value: "ACTING_ACADEMY", label: "Academy" },
    { value: "SPEAKER_BUREAU", label: "Speaker Bureau" },
    { value: "SPORTS_AGENCY", label: "Sports" },
    { value: "EVENT_PROMOTER", label: "Event Promoter" },
    { value: "PHOTOGRAPHY_AGENCY", label: "Photography" },
    { value: "STYLING_AGENCY", label: "Styling" },
    { value: "EVENT_STAFFING_AGENCY", label: "Event Staffing" },
    { value: "CREATIVE_RECRUITMENT", label: "Creative Recruitment" },
    { value: "BRAND", label: "Brand" },
    { value: "MEDIA_BUYING_AGENCY", label: "Media Buying" },
    { value: "TALENT_NETWORK", label: "Talent Network" },
    { value: "MARKETPLACE_AGGREGATOR", label: "Marketplace" },
    { value: "HOLDING_COMPANY", label: "Holding" },
  ]

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setDetailOpen(true)
  }

  const handleSuspend = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setConfirmSuspendOpen(true)
  }

  const handleActivate = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setConfirmActivateOpen(true)
  }

  const handleReject = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setConfirmRejectOpen(true)
  }

  const confirmSuspend = async () => {
    if (!selectedTenant) return
    try {
      await suspendTenant(selectedTenant._id)
      showToast(`Suspended tenant: ${selectedTenant.name}`, "info")
      setTenants((prev) => prev.map((t) => (t._id === selectedTenant._id ? { ...t, status: "SUSPENDED" as const } : t)))
    } catch {
      showToast("Failed to suspend tenant", "error")
    }
    setConfirmSuspendOpen(false)
    setSelectedTenant(null)
  }

  const confirmActivate = async () => {
    if (!selectedTenant) return
    try {
      await activateTenant(selectedTenant._id)
      showToast(`Activated tenant: ${selectedTenant.name}`, "success")
      setTenants((prev) => prev.map((t) => (t._id === selectedTenant._id ? { ...t, status: "ACTIVE" as const } : t)))
    } catch {
      showToast("Failed to activate tenant", "error")
    }
    setConfirmActivateOpen(false)
    setSelectedTenant(null)
  }

  const confirmReject = async () => {
    if (!selectedTenant) return
    try {
      await rejectTenant(selectedTenant._id)
      showToast(`Rejected tenant: ${selectedTenant.name}`, "info")
      setTenants((prev) => prev.filter((t) => t._id !== selectedTenant._id))
    } catch {
      showToast("Failed to reject tenant", "error")
    }
    setConfirmRejectOpen(false)
    setSelectedTenant(null)
  }

  return (
    <PageLayout>
      <PageHeader
        title="Tenants"
        description="Overview of agencies, pageant organisers, brands and event orgs using the platform. Powered by seed data for this phase."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Building2 className="h-3.5 w-3.5 text-sky-500" />
            Organization
          </span>
        }
        actions={
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add tenant
          </Button>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                All seeded organisations across types.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {loading ? "—" : metrics.active}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Eligible to run pageants, campaigns and showcases.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-sky-600">
                {loading ? "—" : metrics.pending || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Awaiting Super Admin approval (from signup or manual create).
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">
                {loading ? "—" : metrics.suspended || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Tenants temporarily disabled.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-sky-600">
                {loading ? "—" : Object.keys(metrics.byCountry).length || 1}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Seeded tenants are India-first; global later.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Distribution">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Tenants by type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-600">
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <>
                  <RechartsBar
                    data={Object.entries(metrics.byType).map(([type, count]) => ({
                      label:
                        type === "AGENCY"
                          ? "Agency"
                          : type === "PAGEANT_ORG"
                          ? "Pageant org"
                          : type === "EVENT_ORG"
                          ? "Event org"
                          : type === "BRAND"
                          ? "Brand"
                          : "Other",
                      value: count,
                    }))}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Distribution of tenant types from seed data.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Region distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-600">
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : Object.keys(metrics.byCountry).length === 0 ? (
                <p className="text-[10px] text-slate-500">
                  No country codes in seed. Showing placeholder.
                </p>
              ) : (
                <>
                  <RechartsPie
                    data={Object.entries(metrics.byCountry).map(([country, count]) => ({
                      label: country,
                      value: count,
                    }))}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Tenants by country code.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="By type & region">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Tenant types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading seeded tenants…</p>
              ) : metrics.total === 0 ? (
                <p className="text-slate-500">
                  No tenants in the current seed. Update{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/tenants.json
                  </code>{" "}
                  to configure tenant mix.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {Object.entries(metrics.byType).map(([type, count]) => (
                    <li
                      key={type}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/85 px-3 py-2"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-semibold text-slate-800">
                          {type === "AGENCY"
                            ? "Agency"
                            : type === "PAGEANT_ORG"
                            ? "Pageant organiser"
                            : type === "EVENT_ORG"
                            ? "Event organiser"
                            : type === "BRAND"
                            ? "Brand / Sponsor"
                            : "Platform internal"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Type code: {type}
                        </p>
                      </div>
                      <p className="text-[12px] font-semibold text-sky-600">
                        {count}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Region snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-700">
              {loading ? (
                <p className="text-slate-500">Loading region data…</p>
              ) : Object.keys(metrics.byCountry).length === 0 ? (
                <p className="text-slate-500">
                  No explicit country codes in seed. By default, treat all as{" "}
                  <span className="font-semibold text-sky-600">IN (India)</span>
                  .
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {Object.entries(metrics.byCountry).map(([country, count]) => (
                    <li
                      key={country}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/85 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                          <Globe2 className="h-4 w-4 text-sky-300" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-semibold text-slate-800">
                            {country}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Country code
                          </p>
                        </div>
                      </div>
                      <p className="text-[12px] font-semibold text-sky-600">
                        {count}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        title="Tenants"
        description={filteredTenants.length !== tenants.length ? `${filteredTenants.length} of ${tenants.length} shown` : undefined}
      >
        <div className="space-y-3">
        <FilterPanel
            searchPlaceholder="Search tenants by name, slug, or ID..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              {
                key: "type",
                label: "Type",
                options: typeOptions,
                selected: typeFilter,
                onSelectionChange: setTypeFilter,
              },
              {
                key: "agencyType",
                label: "Agency Type",
                options: agencyTypeOptions,
                selected: agencyTypeFilter,
                onSelectionChange: setAgencyTypeFilter,
              },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setTypeFilter([])
              setAgencyTypeFilter([])
            }}
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-500">Status:</span>
              {([
                { key: "ALL", label: "All" },
                { key: "PENDING", label: "Pending" },
                { key: "ACTIVE", label: "Active" },
                { key: "SUSPENDED", label: "Suspended" },
                { key: "DELETED", label: "Deleted" },
              ] as { key: StatusFilter; label: string }[]).map((opt) => (
                <Button
                  key={opt.key}
                  size="sm"
                  variant={filter === opt.key ? "default" : "outline"}
                  className={
                    filter === opt.key
                      ? "h-7 px-3 text-[11px]"
                      : "h-7 px-3 text-[11px] bg-slate-50/70"
                  }
                  onClick={() => setFilter(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-[11px] bg-slate-50/70"
                disabled
              >
                <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                Sync (coming later)
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur">
            {loading ? (
              <div className="flex items-center justify-center py-14 text-slate-600">
                <span className="text-sm">
                  Loading tenants from seed for this environment…
                </span>
              </div>
            ) : filteredTenants.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center text-slate-600">
                <p className="text-sm font-medium">
                  No tenants match this filter in the current seed.
                </p>
                <p className="max-w-md text-[11px] text-slate-500">
                  Adjust{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                    data/seed/tenants.json
                  </code>{" "}
                  to explore different states and mixes.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-[11px] text-slate-700 sm:text-xs">
                {filteredTenants.map((tenant) => {
                  const stats = getTenantStats(tenant._id)
                  return (
                    <article
                      key={tenant._id}
                      className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/85 px-3 py-2.5 sm:px-4"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-semibold text-slate-800">
                          {tenant.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Id{" "}
                          <span className="font-mono text-slate-600">
                            {tenant._id}
                          </span>{" "}
                          · Slug{" "}
                          <span className="font-mono text-slate-600">
                            {tenant.slug}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Pageants: {stats.pageants} ({stats.activePageants} active)
                          {(tenant as any).agencyType === "MODELING_AGENCY" && (
                            <> · Talents: {stats.talents} · Bookings: {stats.bookings}</>
                          )}
                          {(tenant as any).blueprints?.includes("B10") && (
                            <> · Sub-tenants: {seedSubTenantLinks.filter((l: any) => l.groupId === tenant._id).length}</>
                          )}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[11px] text-slate-700">
                          {(tenant as any).agencyType
                            ? (tenant as any).agencyType.replace(/_/g, " ")
                            : tenant.type === "AGENCY"
                            ? "Agency"
                            : tenant.type === "PAGEANT_ORG"
                            ? "Pageant organiser"
                            : tenant.type === "EVENT_ORG"
                            ? "Event organiser"
                            : tenant.type === "BRAND"
                            ? "Brand / Sponsor"
                            : tenant.type === "HOLDING"
                            ? "Holding"
                            : "Platform internal"}
                        </p>
                        {(tenant as any).blueprints?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {((tenant as any).blueprints as string[]).map((b) => (
                              <span
                                key={b}
                                className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-600"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-500">
                          Timezone: {tenant.timezone || "not set"} · Country:{" "}
                          {tenant.countryCode || "IN"}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 text-right text-[10px] text-slate-500">
                        <span
                          className={
                            tenant.status === "ACTIVE"
                              ? "rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600"
                              : tenant.status === "SUSPENDED"
                              ? "rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600"
                              : tenant.status === "PENDING"
                              ? "rounded-full border border-sky-500/60 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-600"
                              : "rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700"
                          }
                        >
                          {tenant.status.toLowerCase()}
                        </span>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(tenant)}
                            className="h-7 px-2 text-[10px] text-sky-600 hover:bg-sky-500/10"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {tenant.status === "PENDING" ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleActivate(tenant)}
                                className="h-7 px-2 text-[10px] text-emerald-600 hover:bg-emerald-500/10"
                                title="Approve"
                              >
                                <Shield className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(tenant)}
                                className="h-7 px-2 text-[10px] text-red-600 hover:bg-red-500/10"
                                title="Reject"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          ) : tenant.status === "ACTIVE" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSuspend(tenant)}
                              className="h-7 px-2 text-[10px] text-amber-600 hover:bg-amber-500/10"
                            >
                              <ShieldOff className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleActivate(tenant)}
                              className="h-7 px-2 text-[10px] text-emerald-600 hover:bg-emerald-500/10"
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </PageSection>

      {/* Tenant detail side panel */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" size="full" className="flex flex-col p-0">
          {selectedTenant && (
            <>
              <SheetHeader className="relative pr-12">
                <SheetCloseButton />
                <SheetTitle>{selectedTenant.name}</SheetTitle>
                <SheetDescription>
                  Tenant configuration and activity overview.
                </SheetDescription>
              </SheetHeader>

              <SheetBody className="space-y-4 text-sm text-slate-700">
                  {/* Basic Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Tenant ID
                      </p>
                      <p className="mt-1 font-mono text-sm text-slate-800">
                        {selectedTenant._id}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Slug
                      </p>
                      <p className="mt-1 font-mono text-sm text-slate-800">
                        {selectedTenant.slug}
                      </p>
                    </div>
                  </div>

                  {/* Type, Agency Type & Status */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Type
                      </p>
                      <p className="mt-1 text-sm text-slate-800">
                        {selectedTenant.type === "AGENCY"
                          ? "Agency"
                          : selectedTenant.type === "PAGEANT_ORG"
                          ? "Pageant Organiser"
                          : selectedTenant.type === "EVENT_ORG"
                          ? "Event Organiser"
                          : selectedTenant.type === "BRAND"
                          ? "Brand / Sponsor"
                          : "Platform Internal"}
                      </p>
                    </div>
                    {(selectedTenant as any).agencyType && (
                      <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Agency Type
                        </p>
                        <p className="mt-1 text-sm text-slate-800">
                          {(selectedTenant as any).agencyType.replace(/_/g, " ")}
                        </p>
                      </div>
                    )}
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </p>
                      <p className="mt-1">
                        <span
                          className={
                            selectedTenant.status === "ACTIVE"
                              ? "rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600"
                              : "rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600"
                          }
                        >
                          {selectedTenant.status.toLowerCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Location & Timezone
                    </p>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-slate-800">
                      <div>
                        <span className="text-slate-500">Country:</span>{" "}
                        {selectedTenant.countryCode || "IN"}
                      </div>
                      <div>
                        <span className="text-slate-500">Timezone:</span>{" "}
                        {selectedTenant.timezone || "not set"}
                      </div>
                    </div>
                  </div>

                  {/* Blueprints */}
                  {(selectedTenant as any).blueprints?.length > 0 && (
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Blueprints
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {((selectedTenant as any).blueprints as string[]).map((b) => (
                          <span
                            key={b}
                            className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* B10 Sub-tenants (Holding Company) */}
                  {(selectedTenant as any).blueprints?.includes("B10") && (
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Sub-tenants
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {seedSubTenantLinks
                          .filter((l) => l.groupId === selectedTenant._id)
                          .map((l) => {
                            const sub = seedTenants.find((t: any) => t._id === l.subTenantId)
                            return (
                              <div
                                key={l.subTenantId}
                                className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                              >
                                <span className="font-medium text-slate-800">
                                  {sub?.name ?? l.subTenantId}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {sub?.agencyType?.replace(/_/g, " ") ?? ""}
                                </span>
                              </div>
                            )
                          })}
                        {seedSubTenantLinks.filter((l) => l.groupId === selectedTenant._id).length === 0 && (
                          <p className="text-xs text-slate-500">No sub-tenants linked</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Quick Stats
                    </p>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-[10px] text-slate-500">Pageants</p>
                        <p className="mt-0.5 text-lg font-semibold text-sky-600">
                          {getTenantStats(selectedTenant._id).pageants}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Active Pageants</p>
                        <p className="mt-0.5 text-lg font-semibold text-emerald-600">
                          {getTenantStats(selectedTenant._id).activePageants}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Talents</p>
                        <p className="mt-0.5 text-lg font-semibold text-slate-800">
                          {getTenantStats(selectedTenant._id).talents}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Staff</p>
                        <p className="mt-0.5 text-lg font-semibold text-slate-800">
                          {getTenantStats(selectedTenant._id).staff}
                        </p>
                      </div>
                      {(selectedTenant as any).agencyType === "MODELING_AGENCY" && (
                        <div>
                          <p className="text-[10px] text-slate-500">Bookings</p>
                          <p className="mt-0.5 text-lg font-semibold text-slate-800">
                            {getTenantStats(selectedTenant._id).bookings}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Branding */}
                  {selectedTenant.settings?.branding && (
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Branding
                      </p>
                      <div className="mt-1 space-y-1 text-sm text-slate-800">
                        {selectedTenant.settings.branding.primaryColor && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Primary Color:</span>
                            <div
                              className="h-4 w-12 rounded border border-slate-200"
                              style={{
                                backgroundColor:
                                  selectedTenant.settings.branding.primaryColor,
                              }}
                            />
                            <span className="font-mono text-xs">
                              {selectedTenant.settings.branding.primaryColor}
                            </span>
                          </div>
                        )}
                        {selectedTenant.settings.branding.logo && (
                          <div>
                            <span className="text-slate-500">Logo:</span>{" "}
                            {selectedTenant.settings.branding.logo}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

        {/* Suspend Confirmation */}
        <ConfirmDialog
          open={confirmSuspendOpen}
          onOpenChange={setConfirmSuspendOpen}
          title="Suspend tenant?"
          description={`This will suspend ${selectedTenant?.name}. They will not be able to access the platform until reactivated. (UI-only for now)`}
          confirmText="Suspend"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmSuspend}
        />

        {/* Activate Confirmation */}
        <ConfirmDialog
          open={confirmActivateOpen}
          onOpenChange={setConfirmActivateOpen}
          title="Activate tenant?"
          description={`This will activate ${selectedTenant?.name} and restore their platform access.`}
          confirmText="Activate"
          cancelText="Cancel"
          variant="default"
          onConfirm={confirmActivate}
        />

        {/* Reject Confirmation */}
        <ConfirmDialog
          open={confirmRejectOpen}
          onOpenChange={setConfirmRejectOpen}
          title="Reject tenant?"
          description={`This will remove ${selectedTenant?.name} from the platform. They will need to sign up again.`}
          confirmText="Reject"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmReject}
        />

        {/* Create Tenant Modal */}
        <CreateTenantModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={async (payload) => {
              setCreateSubmitting(true)
              try {
                const tenant = await createTenant(payload)
                showToast(`Created tenant: ${tenant.name} (pending approval)`, "success")
                setTenants((prev) => [...prev, tenant])
                setCreateOpen(false)
              } catch {
                showToast("Failed to create tenant", "error")
              } finally {
                setCreateSubmitting(false)
              }
            }}
            submitting={createSubmitting}
          />
    </PageLayout>
  )
}

