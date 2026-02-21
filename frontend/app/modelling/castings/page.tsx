"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { InteractiveCastingCard } from "@/shared/components/ui/InteractiveCard"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getCastingsWithFilters, type Casting } from "@/shared/services/castingService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { Megaphone, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const castingImages: Record<string, string> = {
  FASHION: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  BEAUTY: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
  EDITORIAL: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
}

const STATUS_OPTIONS = [
  { value: "__all__", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "SHORTLISTING", label: "Shortlisting" },
  { value: "CLOSED", label: "Closed" },
]

export default function ModellingCastingsPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [castings, setCastings] = useState<Casting[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("__all__")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }

  useEffect(() => {
    setLoading(true)
    getCastingsWithFilters(tenantId, {
      status: statusFilter && statusFilter !== "__all__" ? statusFilter : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }).then((data) => {
      setCastings(data)
      setLoading(false)
    })
  }, [tenantId, statusFilter, dateFrom, dateTo])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Castings</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Create, publish, shortlist.</p>
      </div>
        <section className="mt-8">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: theme.text }}>Casting calls</CardTitle>
              <Button asChild className="bg-[#B8860B] text-white hover:bg-[#9A7209]">
                <Link href="/modelling/castings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New casting
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap items-end gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs" style={{ color: theme.textSecondary }}>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs" style={{ color: theme.textSecondary }}>Deadline from</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-[160px]"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs" style={{ color: theme.textSecondary }}>Deadline to</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-[160px]"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                  />
                </div>
                {(statusFilter !== "__all__" || dateFrom || dateTo) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("__all__")
                      setDateFrom("")
                      setDateTo("")
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border p-6" style={{ borderColor: theme.border }}>
                      <LoadingSkeleton className="mb-4 h-32 w-full rounded-lg" />
                      <LoadingSkeleton className="mb-2 h-5 w-3/4" />
                      <LoadingSkeleton className="mb-2 h-4 w-1/2" />
                      <LoadingSkeleton className="h-4 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : castings.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                  <Megaphone className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                  <p className="mt-4" style={{ color: theme.textSecondary }}>No castings yet.</p>
                  <Button asChild className="mt-4 bg-[#B8860B] text-white hover:bg-[#9A7209]">
                  <Link href="/modelling/castings/new">Create first casting</Link>
                </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {castings.map((c) => (
                    <InteractiveCastingCard
                      key={c._id}
                      title={c.title}
                      client={c.client}
                      type={c.type}
                      status={c.status}
                      deadline={c.deadline}
                      submissionsCount={c.submissionsCount}
                      shortlistedCount={c.shortlistedCount}
                      imageUrl={castingImages[c.type] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"}
                      href={`/modelling/castings/${c._id}`}
                      theme={isDark ? "dark" : "light"}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
