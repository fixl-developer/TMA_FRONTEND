"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { RetentionPolicy } from "@/shared/lib/types/compliance"
import { getRetentionPolicyById } from "@/shared/services/complianceService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function RetentionPolicyDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [policy, setPolicy] = useState<RetentionPolicy | undefined>(undefined)

  useEffect(() => { if (id) getRetentionPolicyById(id).then(setPolicy) }, [id])

  if (!id) return <PageLayout><PageHeader title="Policy" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/compliance/retention/policies">Back</Link></Button></PageLayout>
  if (!policy) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/compliance/retention/policies">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={`Policy ${policy._id}`}
        description={policy.description ?? "Retention policy details. Seed data only."}
        actions={<Button asChild variant="outline" size="sm"><Link href="/compliance/retention/policies"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Policies</Link></Button>}
      />
      <PageSection title="Configuration">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Entity type:</strong> {policy.entityType}</p>
          <p><strong>Retention period:</strong> {policy.retentionMonths} months</p>
          <p><strong>Status:</strong> {policy.status}</p>
          {policy.deletionRule && <p><strong>Deletion rule:</strong> {policy.deletionRule}</p>}
          {policy.tenantId && <p><strong>Tenant:</strong> <span className="font-mono">{policy.tenantId}</span></p>}
          {policy.exceptions && policy.exceptions.length > 0 && (
            <div className="mt-3">
              <p className="font-medium mb-1">Exceptions:</p>
              <ul className="list-inside list-disc text-xs text-[#605e5c]">
                {policy.exceptions.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
