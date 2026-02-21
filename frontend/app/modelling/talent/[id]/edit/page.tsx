"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { getTalentById } from "@/shared/services/talentService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function EditTalentPage() {
  const params = useParams()
  const router = useRouter()
  const { tenantId } = useTenant()
  const id = params.id as string
  const [stageName, setStageName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [height, setHeight] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getTalentById(id, tenantId).then((t) => {
      if (t) {
        setStageName(t.stageName ?? "")
        setEmail(t.email ?? "")
        setPhone(t.phone ?? "")
        setLocation(t.location ?? "")
        setHeight(t.height ?? "")
      }
      setLoading(false)
    })
  }, [id, tenantId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/modelling/talent/${id}`)
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center text-[#57534E]">Loading…</div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title="Edit talent"
        subtitle={`Update ${stageName || "talent"} profile`}
        variant="modelling"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-[#57534E] hover:text-[#1C1917]">
          <Link href={`/modelling/talent/${id}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </Link>
        </Button>
      </div>

      <Card className="mt-6 border-[#E7E5E4] max-w-2xl">
        <CardHeader>
          <CardTitle className="text-[#1C1917]">Talent details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="stageName">Stage name *</Label>
              <Input
                id="stageName"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="mt-1 border-[#E7E5E4]"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]">
                Save changes
              </Button>
              <Button asChild type="button" variant="outline" className="border-[#E7E5E4]">
                <Link href={`/modelling/talent/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
