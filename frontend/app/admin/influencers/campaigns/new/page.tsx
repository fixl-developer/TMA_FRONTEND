"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton } from "@/shared/components/admin/AdminPageLayout"

export default function NewCampaignPage() {
  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="New campaign"
        subtitle="Create a new influencer campaign. (Form coming soon)"
        actions={
          <Link href="/admin/influencers">
            <AdminButton variant="outline">← Campaigns</AdminButton>
          </Link>
        }
      >
        <AdminCard>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#d4ff00]" />
            <h3 className="text-lg font-semibold text-white">Campaign setup</h3>
          </div>
          <p className="text-white/60 mb-4">Campaign creation form will be implemented in a future phase. For now, use the campaign list to view existing campaigns.</p>
          <Link href="/admin/influencers">
            <AdminButton variant="outline">Back to campaigns</AdminButton>
          </Link>
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
