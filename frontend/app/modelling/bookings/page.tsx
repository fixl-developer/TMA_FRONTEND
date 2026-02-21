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
import { InteractiveBookingCard } from "@/shared/components/ui/InteractiveCard"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getBookingsWithFilters, type Booking } from "@/shared/services/bookingService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { Briefcase, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const STAGE_OPTIONS = [
  { value: "__all__", label: "All stages" },
  { value: "INQUIRY", label: "Inquiry" },
  { value: "OPTION_HOLD", label: "Option hold" },
  { value: "CONFIRMED", label: "Confirmed" },
]

export default function ModellingBookingsPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [bookings, setBookings] = useState<(Booking & { talentName?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [stageFilter, setStageFilter] = useState("__all__")
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
    getBookingsWithFilters(tenantId, {
      stage: stageFilter !== "__all__" ? stageFilter : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }).then((data) => {
      setBookings(data)
      setLoading(false)
    })
  }, [tenantId, stageFilter, dateFrom, dateTo])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Bookings</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Calendar, call sheets.</p>
      </div>
        <section className="mt-8">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: theme.text }}>Bookings</CardTitle>
              <Button asChild className="bg-[#B8860B] text-white hover:bg-[#9A7209]">
                <Link href="/modelling/bookings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New booking
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap items-end gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs" style={{ color: theme.textSecondary }}>Stage</Label>
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className="w-[160px]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                      <SelectValue placeholder="All stages" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs" style={{ color: theme.textSecondary }}>Date from</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-[160px]"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs" style={{ color: theme.textSecondary }}>Date to</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-[160px]"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                  />
                </div>
                {(stageFilter !== "__all__" || dateFrom || dateTo) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStageFilter("__all__")
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
                    <div key={i} className="flex h-[130px] overflow-hidden rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.cardBg }}>
                      <LoadingSkeleton className="mr-4 h-14 w-14 shrink-0 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <LoadingSkeleton className="h-5 w-3/4" />
                        <LoadingSkeleton className="h-4 w-1/2" />
                        <LoadingSkeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                  <Briefcase className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                  <p className="mt-4" style={{ color: theme.textSecondary }}>No bookings yet.</p>
                  <Button asChild className="mt-4 bg-[#B8860B] text-white hover:bg-[#9A7209]">
                  <Link href="/modelling/bookings/new">Create first booking</Link>
                </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((b) => (
                    <InteractiveBookingCard
                      key={b._id}
                      projectName={b.projectName}
                      clientName={b.clientName}
                      talentName={b.talentName}
                      dates={b.dates}
                      stage={b.stage}
                      href={`/modelling/bookings/${b._id}`}
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
