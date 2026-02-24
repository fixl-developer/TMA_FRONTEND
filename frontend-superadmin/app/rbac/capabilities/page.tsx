"use client"

import Link from "next/link"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function CapabilitiesPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Capability management"
        description="All capabilities (action taxonomy), categories, risk levels. Seed/API later."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><ShieldCheck className="h-3.5 w-3.5 text-[#0078d4]" />Capabilities</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/rbac/roles"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Roles</Link></Button>}
      />
      <PageSection>
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Capability management (action taxonomy, categories, risk levels) will use GET /v1/superadmin/rbac/capabilities. Seed data structure TBD.</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
