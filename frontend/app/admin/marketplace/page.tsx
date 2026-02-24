"use client"

import { useEffect, useState } from "react"
import {
  getMarketplaceListings,
  resetMarketplaceListingOverrides,
  upsertMarketplaceListing,
  type MarketplaceListing,
} from "@/shared/services/marketplaceService"
import { useTenant } from "@/shared/context/TenantContext"
import { Store, Pencil, Plus } from "lucide-react"
import { useToast } from "@/shared/components/ui/toast"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

const categoryLabels: Record<string, string> = {
  MODELING: "Modeling",
  VIDEO: "Video",
  HOSTING: "Hosting",
  PHOTOGRAPHY: "Photography",
  BEAUTY: "Beauty",
}

/**
 * B9 Marketplace – Vendor listings for marketplace/aggregator tenants.
 */
export default function MarketplaceListingsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingListingId, setEditingListingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    title: "",
    category: "MODELING",
    description: "",
    rate: "10000",
    currency: "INR",
    status: "ACTIVE",
  })

  const loadListings = async () => {
    setLoading(true)
    const data = await getMarketplaceListings(tenantId)
    setListings(data)
    setLoading(false)
  }

  useEffect(() => {
    loadListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId])

  const activeCount = listings.filter((l) => l.status === "ACTIVE").length

  const openCreate = () => {
    setEditingListingId(null)
    setDraft({
      title: "",
      category: "MODELING",
      description: "",
      rate: "10000",
      currency: "INR",
      status: "ACTIVE",
    })
    setEditorOpen(true)
  }

  const openEdit = (listing: MarketplaceListing) => {
    setEditingListingId(listing._id)
    setDraft({
      title: listing.title || "",
      category: listing.category || "MODELING",
      description: listing.description || "",
      rate: String(listing.rate ?? 0),
      currency: listing.currency || "INR",
      status: listing.status || "ACTIVE",
    })
    setEditorOpen(true)
  }

  const handleSave = async () => {
    if (!tenantId) return
    if (!draft.title.trim() || !draft.description.trim()) {
      showToast("Title and description are required.", "error")
      return
    }
    setSaving(true)
    try {
      await upsertMarketplaceListing({
        tenantId,
        listingId: editingListingId ?? undefined,
        title: draft.title,
        category: draft.category,
        description: draft.description,
        rate: Number(draft.rate),
        currency: draft.currency,
        status: draft.status,
      })
      await loadListings()
      setEditorOpen(false)
      showToast(editingListingId ? "Listing updated." : "Listing created.", "success")
    } catch {
      showToast("Unable to save listing.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleResetDemo = async () => {
    resetMarketplaceListingOverrides()
    await loadListings()
    showToast("Marketplace demo overrides reset.", "success")
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Marketplace"
        subtitle="Vendor listings – discover and book talent (B9)"
        actions={
        <>
          <AdminButton variant="secondary" onClick={handleResetDemo}>
            Reset demo
          </AdminButton>
          <AdminButton onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New listing
          </AdminButton>
        </>
      }
    >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Active Listings"
          value={activeCount}
          subtitle={`${listings.length} total`}
          icon={Store}
          color="purple"
        />
        <AdminStatCard
          label="Total Listings"
          value={listings.length}
          subtitle="All listings"
          icon={Store}
          color="blue"
        />
        <AdminStatCard
          label="Paused"
          value={listings.filter((l) => l.status === "PAUSED").length}
          subtitle="Inactive"
          icon={Store}
          color="yellow"
        />
        <AdminStatCard
          label="Categories"
          value={Object.keys(categoryLabels).length}
          subtitle="Available"
          icon={Store}
          color="green"
        />
      </AdminStatsGrid>

      <AdminCard title="Marketplace Listings" subtitle={`${listings.length} total listings`}>
        {editorOpen && (
          <div className="mb-6 rounded border border-[#0078d4] bg-[#e3f2fd] p-4">
            <p className="text-xs font-semibold text-[#323130] mb-3">
              {editingListingId ? "Edit listing" : "Create listing"}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={draft.title}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Listing title"
                className="rounded border border-[#edebe9] bg-white px-3 py-2 text-xs text-[#323130] placeholder:text-[#a19f9d] focus:border-[#0078d4] focus:outline-none"
              />
              <select
                value={draft.category}
                onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                className="rounded border border-[#edebe9] bg-white px-3 py-2 text-xs text-[#323130] focus:border-[#0078d4] focus:outline-none"
              >
                {Object.keys(categoryLabels).map((key) => (
                  <option key={key} value={key}>
                    {categoryLabels[key]}
                  </option>
                ))}
              </select>
              <input
                value={draft.rate}
                onChange={(e) => setDraft((prev) => ({ ...prev, rate: e.target.value }))}
                placeholder="Rate"
                className="rounded border border-[#edebe9] bg-white px-3 py-2 text-xs text-[#323130] placeholder:text-[#a19f9d] focus:border-[#0078d4] focus:outline-none"
              />
              <select
                value={draft.status}
                onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}
                className="rounded border border-[#edebe9] bg-white px-3 py-2 text-xs text-[#323130] focus:border-[#0078d4] focus:outline-none"
              >
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
              </select>
            </div>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Listing description"
              className="mt-3 min-h-[90px] w-full rounded border border-[#edebe9] bg-white px-3 py-2 text-xs text-[#323130] placeholder:text-[#a19f9d] focus:border-[#0078d4] focus:outline-none"
            />
            <div className="mt-3 flex items-center gap-2">
              <AdminButton size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingListingId ? "Save changes" : "Create listing"}
              </AdminButton>
              <AdminButton size="sm" variant="ghost" onClick={() => setEditorOpen(false)}>
                Cancel
              </AdminButton>
            </div>
          </div>
        )}

        {loading ? (
          <AdminLoading rows={5} />
        ) : listings.length === 0 ? (
          <AdminEmptyState
            icon={Store}
            title="No listings yet"
            description="Add vendor listings to your marketplace. Buyers can browse and book talent or services."
            action={
              <a href="/admin/vendors">
                <AdminButton>Add Vendor</AdminButton>
              </a>
            }
          />
        ) : (
          <div className="space-y-2">
            {listings.map((l) => (
              <div
                key={l._id}
                className="flex flex-col gap-3 rounded border border-[#edebe9] bg-white p-4 transition-all hover:bg-[#f3f2f1] hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#8764b8] text-white">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#323130]">{l.title}</p>
                    <p className="mt-0.5 text-xs text-[#605e5c] line-clamp-2">{l.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded border border-[#8764b8] bg-[#f4f0ff] px-2 py-0.5 text-xs font-semibold text-[#8764b8]">
                        {categoryLabels[l.category] ?? l.category}
                      </span>
                      <span className="text-xs font-semibold text-[#107c10]">
                        ₹{l.rate?.toLocaleString("en-IN")} {l.currency}
                      </span>
                    </div>
                  </div>
                </div>
                <AdminButton
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(l)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </AdminButton>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
