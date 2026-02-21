"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { createCasting } from "@/shared/services/castingService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const TYPE_OPTIONS = [
  { value: "FASHION", label: "Fashion" },
  { value: "BEAUTY", label: "Beauty" },
  { value: "EDITORIAL", label: "Editorial" },
]

export default function NewCastingPage() {
  const router = useRouter()
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
  const [title, setTitle] = useState("")
  const [client, setClient] = useState("")
  const [type, setType] = useState("FASHION")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    const casting = await createCasting(
      { title: title.trim(), client: client.trim(), type, description: description.trim(), deadline },
      tenantId
    )
    showToast("Casting created (mock)", "success")
    setSubmitting(false)
    router.push(casting ? `/modelling/castings/${casting._id}` : "/modelling/castings")
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>New casting</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Create a casting call</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/castings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to castings
          </Link>
        </Button>
      </div>

      <Card className="mt-6 border max-w-2xl" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
        <CardHeader>
          <CardTitle style={{ color: theme.text }}>Casting details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" style={{ color: theme.text }}>Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Fashion Campaign 2024"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                required
              />
            </div>
            <div>
              <Label htmlFor="client" style={{ color: theme.text }}>Client</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Client name"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div>
              <Label htmlFor="type" style={{ color: theme.text }}>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="mt-1 border" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}>
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
              <Label htmlFor="description" style={{ color: theme.text }}>Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={4}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div>
              <Label htmlFor="deadline" style={{ color: theme.text }}>Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={submitting}>
                Create casting
              </Button>
              <Button asChild type="button" variant="outline" className="border" style={{ borderColor: theme.border }}>
                <Link href="/modelling/castings">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
