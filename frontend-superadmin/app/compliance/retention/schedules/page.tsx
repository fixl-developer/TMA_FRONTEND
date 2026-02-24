"use client"

import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function RetentionSchedulesPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Schedule configuration"
        description="Scheduled deletions, execution calendar, status tracking. Seed/API later."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Calendar className="h-3.5 w-3.5 text-[#0078d4]" />Schedules</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/compliance/retention/policies"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Policies</Link></Button>}
      />
      <PageSection>
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Schedule configuration (scheduled deletions, execution calendar, status tracking, error handling) will use GET /v1/superadmin/compliance/retention/schedules. Seed data structure TBD.</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
