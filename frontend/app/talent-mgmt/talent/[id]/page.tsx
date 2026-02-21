"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import {
  getTalentById,
  getTalentAssets,
  getTalentAvailability,
  getTalentTags,
  type Talent,
  type Asset,
  type TalentAvailability,
  type TalentTag,
} from "@/shared/services/talentService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft, Mail, Phone, MapPin, Image, Video, Calendar, Tag } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-100 text-slate-600",
  PENDING: "bg-amber-100 text-amber-700",
}

export default function TalentDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const id = params.id as string
  const [talent, setTalent] = useState<Talent | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [availability, setAvailability] = useState<TalentAvailability[]>([])
  const [tags, setTags] = useState<TalentTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !tenantId) return
    setLoading(true)
    Promise.all([
      getTalentById(id, tenantId),
      getTalentAssets(id, tenantId),
      getTalentAvailability(id),
      getTalentTags(tenantId),
    ]).then(([t, a, av, tg]) => {
      setTalent(t ?? null)
      setAssets(a)
      setAvailability(av)
      setTags(tg)
      setLoading(false)
    })
  }, [id, tenantId])

  if (loading) {
    return (
      <AgenciesPage>
        <div className="flex items-center justify-center py-24">
          <p className="text-slate-500">Loading talent…</p>
        </div>
      </AgenciesPage>
    )
  }

  if (!talent) {
    return (
      <AgenciesPage>
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-slate-600">Talent not found.</p>
          <Button asChild variant="outline" className="border-[#E7E5E4]">
            <Link href="/talent-mgmt/talent">Back to roster</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  const tagMap = Object.fromEntries(tags.map((t) => [t._id, t.name]))
  const talentTags = (talent.tagIds ?? []).map((tid) => tagMap[tid]).filter(Boolean)

  return (
    <AgenciesPage>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]">
          <Link href="/talent-mgmt/talent" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to roster
          </Link>
        </Button>
      </div>

      <PageBanner
        title={talent.stageName}
        subtitle={`ID: ${talent._id} • ${talent.status ?? "ACTIVE"}`}
        variant="talent-mgmt"
        backgroundImage={assets[0]?.kind === "image" ? assets[0].url : "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=80"}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <Card className="border-[#E7E5E4] lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#1C1917]">Profile</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={statusStyles[talent.status ?? "ACTIVE"] ?? statusStyles.ACTIVE}>
                {talent.status ?? "ACTIVE"}
              </Badge>
              <Button size="sm" variant="outline" className="border-[#E7E5E4] text-[#57534E]">
                Edit (mock)
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {talent.email && (
                <div className="flex items-center gap-2 text-sm text-[#57534E]">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${talent.email}`} className="text-[#1C1917] hover:underline">
                    {talent.email}
                  </a>
                </div>
              )}
              {talent.phone && (
                <div className="flex items-center gap-2 text-sm text-[#57534E]">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{talent.phone}</span>
                </div>
              )}
              {talent.location && (
                <div className="flex items-center gap-2 text-sm text-[#57534E]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{talent.location}</span>
                </div>
              )}
            </div>
            {talent.height && (
              <p className="text-sm text-[#57534E]">
                <span className="font-medium text-[#1C1917]">Height:</span> {talent.height}
              </p>
            )}
            {talent.measurements && Object.keys(talent.measurements).length > 0 && (
              <p className="text-sm text-[#57534E]">
                <span className="font-medium text-[#1C1917]">Measurements:</span>{" "}
                {Object.entries(talent.measurements)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </p>
            )}
            {talentTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 shrink-0 text-[#57534E]" />
                {talentTags.map((name) => (
                  <Badge key={name} variant="secondary" className="bg-[#F5F0E8] text-[#57534E]">
                    {name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="border-[#E7E5E4]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <Calendar className="h-4 w-4" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availability.length === 0 ? (
              <p className="text-sm text-[#57534E]">No availability blocks.</p>
            ) : (
              <ul className="space-y-3">
                {availability.map((a) => (
                  <li
                    key={a._id}
                    className="rounded-lg border border-[#E7E5E4] p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1C1917]">
                        {formatDate(a.from)} – {formatDate(a.to)}
                      </span>
                      <Badge
                        className={
                          a.status === "AVAILABLE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }
                      >
                        {a.status}
                      </Badge>
                    </div>
                    {a.notes && <p className="mt-1 text-[#57534E]">{a.notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio */}
      <Card className="mt-6 border-[#E7E5E4]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#1C1917]">Portfolio</CardTitle>
          <Button size="sm" variant="outline" className="border-[#E7E5E4] text-[#57534E]">
            Upload (mock)
          </Button>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E7E5E4] py-12">
              <Image className="h-12 w-12 text-[#A8A29E]" />
              <p className="mt-2 text-sm text-[#57534E]">No portfolio assets yet.</p>
              <Button size="sm" variant="outline" className="mt-2 border-[#E7E5E4]">
                Add asset (mock)
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {assets.map((asset) => (
                <div
                  key={asset._id}
                  className="overflow-hidden rounded-lg border border-[#E7E5E4]"
                >
                  {asset.kind === "image" ? (
                    <img
                      src={asset.url}
                      alt="Portfolio"
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-[#F5F0E8]">
                      <Video className="h-10 w-10 text-[#57534E]" />
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-[#E7E5E4] px-3 py-2">
                    <span className="text-[10px] font-medium uppercase text-[#57534E]">
                      {asset.kind}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {asset.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
