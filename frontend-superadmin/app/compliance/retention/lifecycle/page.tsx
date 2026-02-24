"use client"

import Link from "next/link"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function RetentionLifecyclePage() {
  return (
    <PageLayout>
      <PageHeader
        title="Data lifecycle view"
        description="Data age visualization, retention status, upcoming deletions, exceptions. Seed/API later."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><TrendingUp className="h-3.5 w-3.5 text-[#0078d4]" />Lifecycle</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/compliance/retention/policies"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Policies</Link></Button>}
      />
      <PageSection>
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Data lifecycle view (data age visualization, retention status, upcoming deletions, exceptions) will use GET /v1/superadmin/compliance/retention/lifecycle. Chart placeholders for data age distribution and retention status heatmap.</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
