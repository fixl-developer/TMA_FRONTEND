"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Link2, ArrowLeft } from "lucide-react"

export default function CollaborationInitiatePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [type, setType] = useState("SHARED_CASTING")
  const [ourSplit, setOurSplit] = useState("60")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/admin/collaboration")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/collaboration">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Initiate collaboration</h1>
            <p className="mt-2 text-base text-white/60">Start a cross-tenant deal</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-6 flex items-center gap-2">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Link2 className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">New collaboration</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spring 2025 Campaign"
                required
                className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Partner organization</Label>
              <Input
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Partner tenant name"
                required
                className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-md"
              >
                <option value="SHARED_CASTING" className="bg-[#1a0b2e] text-white">
                  Shared casting
                </option>
                <option value="INFLUENCER_DEAL" className="bg-[#1a0b2e] text-white">
                  Influencer deal
                </option>
                <option value="EVENT_PARTNERSHIP" className="bg-[#1a0b2e] text-white">
                  Event partnership
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Our revenue share (%)</Label>
              <Input
                type="number"
                min={1}
                max={99}
                value={ourSplit}
                onChange={(e) => setOurSplit(e.target.value)}
                required
                className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">
                Initiate
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/collaboration")}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
