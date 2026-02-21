"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
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
import { getCastingById, updateCasting, type Casting } from "@/shared/services/castingService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const TYPE_OPTIONS = [
  { value: "FASHION", label: "Fashion" },
  { value: "BEAUTY", label: "Beauty" },
  { value: "EDITORIAL", label: "Editorial" },
]

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "SHORTLISTING", label: "Shortlisting" },
  { value: "CLOSED", label: "Closed" },
]

function toDateInput(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toISOString().slice(0, 10)
}

export default function EditCastingPage() {
  const params = useParams()
  const router = useRouter()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const id = params.id as string
  const [casting, setCasting] = useState<Casting | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [client, setClient] = useState("")
  const [type, setType] = useState("FASHION")
  const [status, setStatus] = useState("OPEN")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id || !tenantId) return
    getCastingById(id, tenantId).then((c) => {
      setCasting(c ?? null)
      if (c) {
        setTitle(c.title)
        setClient(c.client ?? "")
        setType(c.type ?? "FASHION")
        setStatus(c.status ?? "OPEN")
        setDescription(c.description ?? "")
        setDeadline(toDateInput(c.deadline))
      }
      setLoading(false)
    })
  }, [id, tenantId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !casting) return
    setSubmitting(true)
    const updated = await updateCasting(
      id,
      { title: title.trim(), client: client.trim(), type, status, description: description.trim(), deadline },
      tenantId
    )
    showToast("Casting updated (mock)", "success")
    setSubmitting(false)
    router.push(updated ? `/modelling/castings/${id}` : "/modelling/castings")
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center text-[#57534E]">Loading…</div>
      </AgenciesPage>
    )
  }

  if (!casting) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p className="text-[#57534E]">Casting not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/modelling/castings">Back to castings</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={`Edit: ${casting.title}`}
        subtitle="Update casting details"
        variant="modelling"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-[#57534E] hover:text-[#1C1917]">
          <Link href={`/modelling/castings/${id}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to casting
          </Link>
        </Button>
      </div>

      <Card className="mt-6 max-w-2xl border-[#E7E5E4]">
        <CardHeader>
          <CardTitle className="text-[#1C1917]">Casting details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Fashion Campaign 2024"
                className="mt-1 border-[#E7E5E4]"
                required
              />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Client name"
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type" className="mt-1 border-[#E7E5E4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="mt-1 border-[#E7E5E4]">
                    <SelectValue />
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
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={4}
                className="mt-1 w-full rounded-md border border-[#E7E5E4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={submitting}>
                Save changes
              </Button>
              <Button asChild type="button" variant="outline" className="border-[#E7E5E4]">
                <Link href={`/modelling/castings/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
