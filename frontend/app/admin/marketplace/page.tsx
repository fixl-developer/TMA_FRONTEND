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
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

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
      <AdminSectionHeader
        title="Marketplace"
        subtitle="Vendor listings – discover and book talent (B9)"
        action={
          <div className="flex items-center gap-2">
            <AdminButton variant="secondary" size="sm" onClick={handleResetDemo}>
              Reset demo
            </AdminButton>
            <AdminButton size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New listing
            </AdminButton>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
        ) : (
          <AdminStatCard
            title="Active Listings"
            value={activeCount}
            subtitle={`${listings.length} total`}
            icon={Store}
            color="purple"
          />
        )}
      </div>

      {/* Listings */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
          Marketplace Listings
        </h3>
        
        {editorOpen && (
          <div className="mb-6 rounded-xl border border-[#d4ff00]/30 bg-[#d4ff00]/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold text-white admin-light-theme:text-slate-900 transition-colors">
              {editingListingId ? "Edit listing" : "Create listing"}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={draft.title}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Listing title"
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 admin-light-theme:border-slate-300 admin-light-theme:bg-white admin-light-theme:text-slate-900 admin-light-theme:placeholder:text-slate-400 transition-colors"
              />
              <select
                value={draft.category}
                onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white admin-light-theme:border-slate-300 admin-light-theme:bg-white admin-light-theme:text-slate-900 transition-colors"
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
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 admin-light-theme:border-slate-300 admin-light-theme:bg-white admin-light-theme:text-slate-900 admin-light-theme:placeholder:text-slate-400 transition-colors"
              />
              <select
                value={draft.status}
                onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white admin-light-theme:border-slate-300 admin-light-theme:bg-white admin-light-theme:text-slate-900 transition-colors"
              >
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
              </select>
            </div>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Listing description"
              className="mt-3 min-h-[90px] w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 admin-light-theme:border-slate-300 admin-light-theme:bg-white admin-light-theme:text-slate-900 admin-light-theme:placeholder:text-slate-400 transition-colors"
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
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </div>
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
          <div className="space-y-4">
            {listings.map((l) => (
              <div
                key={l._id}
                className="flex flex-col gap-3 rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md border-white/10 bg-white/5 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 admin-light-theme:bg-purple-100 admin-light-theme:text-purple-600 transition-colors">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white admin-light-theme:text-slate-900 transition-colors">{l.title}</p>
                    <p className="mt-0.5 text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors line-clamp-2">{l.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-[#d4ff00]/20 px-2 py-0.5 text-xs font-medium text-[#d4ff00] admin-light-theme:bg-[#d4ff00]/30 admin-light-theme:text-black">
                        {categoryLabels[l.category] ?? l.category}
                      </span>
                      <span className="font-semibold text-[#d4ff00]">
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
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </AdminButton>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
