"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { getTalents } from "@/shared/services/talentService"
import { getCastings, type Casting } from "@/shared/services/castingService"
import { createBooking } from "@/shared/services/bookingService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function NewBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const castingIdFromUrl = searchParams.get("castingId")
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
  const [talents, setTalents] = useState<{ _id: string; stageName: string }[]>([])
  const [castings, setCastings] = useState<Casting[]>([])
  const [castingId, setCastingId] = useState(castingIdFromUrl || "__none__")
  const [talentId, setTalentId] = useState("__none__")
  const [projectName, setProjectName] = useState("")
  const [clientName, setClientName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTalents(tenantId).then((data) => setTalents(data))
    getCastings(tenantId).then((data) => setCastings(data))
  }, [tenantId])

  useEffect(() => {
    if (castingIdFromUrl) setCastingId(castingIdFromUrl)
  }, [castingIdFromUrl])

  useEffect(() => {
    if (castingId && castingId !== "__none__") {
      const c = castings.find((x) => x._id === castingId)
      if (c) {
        setProjectName(c.title)
        setClientName(c.client)
        setNotes(c.description ?? "")
      }
    }
  }, [castingId, castings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (talentId === "__none__" || !talentId || !projectName.trim()) return
    setSubmitting(true)
    const booking = await createBooking(
      {
        talentId,
        projectName: projectName.trim(),
        clientName: clientName.trim() || undefined,
        startDate: startDate || new Date().toISOString().slice(0, 10),
        endDate: endDate || startDate || new Date().toISOString().slice(0, 10),
        notes: notes.trim() || undefined,
        castingId: castingId !== "__none__" ? castingId : undefined,
      },
      tenantId
    )
    showToast("Booking created (mock)", "success")
    setSubmitting(false)
    router.push(booking ? `/modelling/bookings/${booking._id}` : "/modelling/bookings")
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>New booking</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Create a booking</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/bookings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </Link>
        </Button>
      </div>

      <Card className="mt-6 border max-w-2xl" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
        <CardHeader>
          <CardTitle style={{ color: theme.text }}>Booking details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label style={{ color: theme.text }}>Create from job (optional)</Label>
              <Select value={castingId} onValueChange={setCastingId}>
                <SelectTrigger className="mt-1 border" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                  <SelectValue placeholder="Select casting/job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None – create from scratch</SelectItem>
                  {castings.filter((c) => c.status !== "CLOSED").map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title} ({c.client})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs" style={{ color: theme.textSecondary }}>Pre-fills project and client from the selected job.</p>
            </div>
            <div>
              <Label htmlFor="talentId" style={{ color: theme.text }}>Talent *</Label>
              <Select value={talentId} onValueChange={setTalentId}>
                <SelectTrigger id="talentId" className="mt-1 border" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                  <SelectValue placeholder="Select talent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select talent</SelectItem>
                  {talents.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.stageName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="projectName" style={{ color: theme.text }}>Project name *</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Summer Campaign 2024"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientName" style={{ color: theme.text }}>Client name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client name"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="startDate" style={{ color: theme.text }}>Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 border"
                  style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                />
              </div>
              <div>
                <Label htmlFor="endDate" style={{ color: theme.text }}>End date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 border"
                  style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes" style={{ color: theme.text }}>Notes</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={submitting}>
                Create booking
              </Button>
              <Button asChild type="button" variant="outline" className="border" style={{ borderColor: theme.border }}>
                <Link href="/modelling/bookings">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
