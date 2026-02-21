"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getTalentById, getTalentAssets, getTalentTags, getTalentAvailability, type Talent, type Asset } from "@/shared/services/talentService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { ArrowLeft, UserCircle2, Mail, Phone, MapPin, Calendar, ImageIcon, Video, Upload } from "lucide-react"
import { TagsManagement } from "@/shared/components/talent/TagsManagement"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { getCreatorName } from "@/shared/lib/creator"

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function TalentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }
  const id = params.id as string
  const [talent, setTalent] = useState<Talent | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([])
  const [availability, setAvailability] = useState<{ _id: string; from: string; to: string; status: string; notes?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [tagIds, setTagIds] = useState<string[]>([])

  useEffect(() => {
    if (!id) return
    Promise.all([
      getTalentById(id, tenantId),
      getTalentAssets(id, tenantId),
      getTalentTags(tenantId),
      getTalentAvailability(id),
    ]).then(([t, a, tagList, av]) => {
      setTalent(t ?? null)
      setAssets(a)
      setTags(tagList)
      setAvailability(av)
      setTagIds(t?.tagIds ?? [])
      setLoading(false)
    })
  }, [id, tenantId])

  const handleUploadClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const url = URL.createObjectURL(file)
        setUploadPreview(url)
        setTimeout(() => setUploadPreview(null), 3000)
      }
    }
    input.click()
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!talent) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Talent not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/talent">Back to roster</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>{talent.stageName}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Talent profile & portfolio</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/talent" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to roster
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border shadow-lg" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between border-b" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#fffbeb" }}>
              <CardTitle style={{ color: theme.text }}>Profile</CardTitle>
              <Button asChild variant="outline" size="sm" className="border" style={{ borderColor: theme.border }}>
                <Link href={`/modelling/talent/${id}/edit`}>Edit</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7]">
                  <UserCircle2 className="h-10 w-10 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: theme.text }}>{talent.stageName}</p>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {talent.status ?? "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {talent.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-[#B8860B]" />
                    <span style={{ color: theme.textSecondary }}>{talent.email}</span>
                  </div>
                )}
                {talent.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-[#B8860B]" />
                    <span style={{ color: theme.textSecondary }}>{talent.phone}</span>
                  </div>
                )}
                {talent.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#B8860B]" />
                    <span style={{ color: theme.textSecondary }}>{talent.location}</span>
                  </div>
                )}
                {talent.height && (
                  <div className="text-sm" style={{ color: theme.textSecondary }}>
                    <span className="font-medium" style={{ color: theme.text }}>Height:</span> {talent.height}
                  </div>
                )}
              </div>
              {talent.measurements && Object.keys(talent.measurements).length > 0 && (
                <div className="text-sm">
                  <span className="font-medium" style={{ color: theme.text }}>Measurements:</span>{" "}
                  <span style={{ color: theme.textSecondary }}>
                    {Object.entries(talent.measurements).map(([k, v]) => `${k}: ${v}`).join(", ")}
                  </span>
                </div>
              )}
              <TagsManagement
                talentId={id}
                currentTagIds={tagIds}
                availableTags={tags}
                onAddTag={(tid) => setTagIds((prev) => (prev.includes(tid) ? prev : [...prev, tid]))}
                onRemoveTag={(tid) => setTagIds((prev) => prev.filter((id) => id !== tid))}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden border shadow-lg" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between border-b" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#f5f3ff" }}>
              <CardTitle style={{ color: theme.text }}>Portfolio</CardTitle>
              <Button variant="outline" size="sm" className="border" style={{ borderColor: theme.border }} onClick={handleUploadClick}>
                <Upload className="mr-1.5 h-4 w-4" />
                Upload (mock)
              </Button>
            </CardHeader>
            <CardContent>
              {(assets.length === 0 && !uploadPreview) ? (
                <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border }}>
                  <p style={{ color: theme.textSecondary }}>No portfolio assets yet.</p>
                  <Button variant="outline" size="sm" className="mt-3 border" style={{ borderColor: theme.border }} onClick={handleUploadClick}>
                    <Upload className="mr-1.5 h-4 w-4" />
                    Add asset (local preview)
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {uploadPreview && (
                    <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-[#B8860B] bg-amber-50/50">
                      <Image src={uploadPreview} alt="Preview" width={200} height={200} className="h-full w-full object-cover" />
                      <p className="absolute bottom-1 left-1 rounded bg-amber-200/90 px-2 py-0.5 text-xs font-medium text-amber-900">Preview</p>
                    </div>
                  )}
                  {assets.map((a) => (
                    <div key={a._id} className="group relative aspect-square overflow-hidden rounded-lg border" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                      {a.kind === "image" && a.url ? (
                        <Image src={a.url} alt="Portfolio" width={200} height={200} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center" style={{ color: theme.textSecondary }}>
                          <Video className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between gap-1 bg-black/60 px-2 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex items-center gap-1">
                          {a.kind === "image" ? <ImageIcon className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                          {a.kind}
                        </span>
                        <span>{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {availability.length > 0 && (
            <Card className="overflow-hidden border shadow-lg" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
              <CardHeader className="border-b" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#f0fdfa" }}>
                <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                  <Calendar className="h-5 w-5 text-[#B8860B]" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {availability.map((av) => (
                    <div key={av._id} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: theme.border, backgroundColor: theme.cardBg }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text }}>
                          {new Date(av.from).toLocaleDateString("en-IN")} – {new Date(av.to).toLocaleDateString("en-IN")}
                        </p>
                        {av.notes && <p className="text-xs" style={{ color: theme.textSecondary }}>{av.notes}</p>}
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        av.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {av.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="mb-6 overflow-hidden border shadow-lg" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="border-b" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#f8fafc" }}>
              <CardTitle style={{ color: theme.text }}>Ownership & attribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm" style={{ color: theme.textSecondary }}>
              <p>
                Owner: {getCreatorName(talent.userId) ?? talent.userId ?? "—"}
              </p>
              <p>
                Created by: {getCreatorName(talent.userId) ?? talent.userId ?? "System"}
              </p>
              <p>
                Created: {formatDateTime(talent.createdAt)} · Updated: —
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border shadow-lg" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="border-b" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#f0fdfa" }}>
              <CardTitle style={{ color: theme.text }}>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-[#B8860B] hover:bg-[#9A7209]">
                <Link href={`/modelling/bookings?talent=${id}`}>View bookings</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border" style={{ borderColor: theme.border }}>
                <Link href={`/modelling/castings?add=${id}`}>Add to casting</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
