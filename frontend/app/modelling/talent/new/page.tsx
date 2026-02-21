"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function AddTalentPage() {
  const router = useRouter()
  const [stageName, setStageName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [height, setHeight] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock: just navigate back with a toast in real app
    router.push("/modelling/talent")
  }

  return (
    <AgenciesPage>
      <PageBanner
        title="Add talent"
        subtitle="Create a new talent profile"
        variant="modelling"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-[#57534E] hover:text-[#1C1917]">
          <Link href="/modelling/talent" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to roster
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
                placeholder="priya@example.com"
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mumbai"
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="5'9&quot;"
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]">
                Create talent
              </Button>
              <Button asChild type="button" variant="outline" className="border-[#E7E5E4]">
                <Link href="/modelling/talent">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
