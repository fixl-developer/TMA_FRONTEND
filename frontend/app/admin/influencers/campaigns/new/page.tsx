"use client"

import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Sparkles } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function NewCampaignPage() {
  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="text-slate-500">
          <Link href="/admin/influencers">← Campaigns</Link>
        </Button>
      </div>
      <PageBanner
        title="New campaign"
        subtitle="Create a new influencer campaign. (Form coming soon)"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80"
      />
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Campaign setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Campaign creation form will be implemented in a future phase. For now, use the campaign list to view existing campaigns.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/admin/influencers">Back to campaigns</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
