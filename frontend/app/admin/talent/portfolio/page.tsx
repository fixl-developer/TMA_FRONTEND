"use client"

import { useEffect, useMemo, useState } from "react"
import { User, MapPin, Star, Image, Video, FileText, Plus, Search } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import seedTalents from "@/data/seed/talents.json"
import seedPosts from "@/data/seed/contentPosts.json"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

const PORTFOLIO_KEY = "talentos_talent_portfolios"

function getPortfolios(): Record<string, any[]> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "{}") } catch { return {} }
}
function addToPortfolio(talentId: string, item: any) {
  const p = getPortfolios()
  p[talentId] = [item, ...(p[talentId] || [])]
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(p))
}

const MEDIA_TYPES = ["Headshot", "Runway Video", "Editorial", "Behind-the-Scenes", "Campaign Still", "Showreel"]

export default function TalentPortfolioStudio() {
  const [talents] = useState<any[]>(seedTalents as any[])
  const [portfolios, setPortfolios] = useState<Record<string, any[]>>({})
  const [selectedTalent, setSelectedTalent] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ type: "Headshot", title: "", url: "" })

  useEffect(() => {
    const stored = getPortfolios()
    // Seed portfolio with content posts
    const contentMap: Record<string, any[]> = { ...stored }
    ;(seedPosts as any[]).forEach((p) => {
      if (!contentMap[p.ownerId]) contentMap[p.ownerId] = []
      // Avoid duplicates
      if (!contentMap[p.ownerId].find((i) => i._id === p._id)) {
        contentMap[p.ownerId].push({ ...p, fromSeed: true })
      }
    })
    setPortfolios(contentMap)
  }, [])

  const filteredTalents = useMemo(() =>
    talents.filter((t) =>
      !search || t.stageName?.toLowerCase().includes(search.toLowerCase()) || t.location?.toLowerCase().includes(search.toLowerCase())
    ),
    [talents, search]
  )

  const currentTalent = selectedTalent ? talents.find((t) => t._id === selectedTalent) : null
  const currentPortfolio = selectedTalent ? (portfolios[selectedTalent] || []) : []

  function handleAddItem() {
    if (!selectedTalent || !addForm.title) return
    const item = {
      _id: `port_${Date.now()}`,
      type: addForm.type,
      title: addForm.title,
      url: addForm.url,
      status: "LIVE",
      createdAt: new Date().toISOString(),
    }
    addToPortfolio(selectedTalent, item)
    setPortfolios((prev) => ({
      ...prev,
      [selectedTalent]: [item, ...(prev[selectedTalent] || [])],
    }))
    setAddForm({ type: "Headshot", title: "", url: "" })
    setAddOpen(false)
  }

  const totalPortfolioItems = Object.values(portfolios).reduce((s, v) => s + v.length, 0)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Portfolio Studio"
        subtitle="Manage talent portfolios, media reels, and showcase items"
        action={
          selectedTalent && (
            <AdminButton onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add to Portfolio
            </AdminButton>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Total Talent" value={talents.length} icon={User} />
        <AdminStatCard title="Portfolio Items" value={totalPortfolioItems} icon={Image} />
        <AdminStatCard title="With Content" value={Object.keys(portfolios).length} icon={Star} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Talent list */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search talent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredTalents.map((talent) => {
              const count = portfolios[talent._id]?.length || 0
              return (
                <button
                  key={talent._id}
                  onClick={() => setSelectedTalent(talent._id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedTalent === talent._id
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                      {talent.stageName?.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{talent.stageName}</p>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <MapPin className="h-3 w-3" />{talent.location}
                      </div>
                    </div>
                    {count > 0 && (
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">{count}</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Portfolio view */}
        <div className="lg:col-span-2">
          {!selectedTalent ? (
            <AdminCard>
              <div className="py-16 text-center">
                <User className="mx-auto mb-3 h-12 w-12 text-white/20" />
                <p className="text-white/40">Select a talent to view their portfolio</p>
              </div>
            </AdminCard>
          ) : (
            <div className="space-y-4">
              <AdminCard>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                    {currentTalent?.stageName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentTalent?.stageName}</h3>
                    <div className="flex gap-3 text-sm text-white/50">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{currentTalent?.location}</span>
                      {currentTalent?.height && <span>{currentTalent.height}</span>}
                    </div>
                  </div>
                </div>
              </AdminCard>

              {currentPortfolio.length === 0 ? (
                <AdminEmptyState title="No portfolio items" description="Add headshots, videos, and other media to this portfolio." />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {currentPortfolio.map((item) => {
                    const Icon = item.type === "VIDEO" ? Video : item.type === "DOCUMENT" ? FileText : Image
                    return (
                      <AdminCard key={item._id}>
                        <div className="flex items-start justify-between">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                            <Icon className="h-4 w-4" />
                          </div>
                          {item.status && <AdminBadge variant={item.status === "LIVE" ? "success" : "default"}>{item.status}</AdminBadge>}
                        </div>
                        <p className="mt-2 text-sm font-medium text-white line-clamp-2">{item.title}</p>
                        <p className="mt-1 text-xs text-white/40">{item.type} · {new Date(item.createdAt).toLocaleDateString()}</p>
                        {item.tags?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((t: string) => (
                              <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-white/40">#{t}</span>
                            ))}
                          </div>
                        )}
                      </AdminCard>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-dark-theme:border-white/10 admin-dark-theme:bg-slate-900 admin-light-theme:text-slate-900 admin-dark-theme:text-white">
          <DialogHeader>
            <DialogTitle>Add Portfolio Item — {currentTalent?.stageName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Media Type</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
                value={addForm.type}
                onChange={(e) => setAddForm((f) => ({ ...f, type: e.target.value }))}
              >
                {MEDIA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Title</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Vogue India Shoot 2024"
                value={addForm.title}
                onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">URL / Link (optional)</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://..."
                value={addForm.url}
                onChange={(e) => setAddForm((f) => ({ ...f, url: e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setAddOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleAddItem} disabled={!addForm.title}>Add Item</AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
