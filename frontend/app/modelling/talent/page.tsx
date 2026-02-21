"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { InteractiveTalentCard } from "@/shared/components/ui/InteractiveCard"
import { getTalentsWithFilters, getTalentAssets, getTalentTags, type Talent } from "@/shared/services/talentService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { UserCircle2, Plus, Filter } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { Badge } from "@/shared/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { EmptyState } from "@/shared/components/ui/empty-state"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"

export default function ModellingTalentPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [talents, setTalents] = useState<(Talent & { imageUrl?: string; tagNames?: string[] })[]>([])
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }

  useEffect(() => {
    getTalentTags(tenantId).then(setTags)
  }, [tenantId])

  useEffect(() => {
    setLoading(true)
    const filters: { status?: string; tagId?: string } = {}
    if (statusFilter !== "all") filters.status = statusFilter
    if (tagFilter !== "all") filters.tagId = tagFilter
    getTalentsWithFilters(tenantId, filters).then(async (data) => {
      const enriched = await Promise.all(
        data.map(async (t) => {
          const [assets] = await Promise.all([getTalentAssets(t._id, tenantId)])
          const firstImage = assets.find((a) => a.kind === "image")?.url
          const tagNames = (t.tagIds || []).map((tid) => tags.find((x) => x._id === tid)?.name).filter(Boolean) as string[]
          return { ...t, imageUrl: firstImage, tagNames }
        })
      )
      setTalents(enriched)
      setLoading(false)
    })
  }, [tenantId, statusFilter, tagFilter, tags])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Talent CRM</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Profiles, portfolios, pipelines.</p>
      </div>
        <section className="mt-8">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <CardTitle style={{ color: theme.text }}>Talent roster</CardTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" style={{ color: theme.textSecondary }} />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger className="w-[140px]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tags</SelectItem>
                      {tags.map((t) => (
                        <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button asChild className="bg-[#B8860B] text-white hover:bg-[#9A7209]">
                  <Link href="/modelling/talent/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add talent
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <LoadingSkeleton key={i} className="h-40 rounded-xl" />
                  ))}
                </div>
              ) : talents.length === 0 ? (
                <EmptyState
                  icon={<UserCircle2 className="h-6 w-6" />}
                  title="No talents found"
                  description={statusFilter !== "all" || tagFilter !== "all" ? "Try adjusting your filters." : "Add your first talent to get started."}
                  action={
                    <Button asChild className="bg-[#B8860B] text-white hover:bg-[#9A7209]">
                      <Link href="/modelling/talent/new">Add talent</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {talents.map((t) => (
                    <div key={t._id} className="relative">
                      <InteractiveTalentCard
                        name={t.stageName}
                        subtitle={t.location ?? t.email}
                        imageUrl={t.imageUrl}
                        tags={t.tagNames}
                        href={`/modelling/talent/${t._id}`}
                        theme={isDark ? "dark" : "light"}
                      />
                      <Badge variant={t.status === "ACTIVE" ? "success" : "secondary"} className="absolute top-2 right-2">
                        {t.status ?? "ACTIVE"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
