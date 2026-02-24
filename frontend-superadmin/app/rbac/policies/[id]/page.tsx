"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Policy } from "@/shared/lib/types/rbac"
import { getPolicyById } from "@/shared/services/rbacService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function PolicyDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [policy, setPolicy] = useState<Policy | undefined>(undefined)

  useEffect(() => { if (id) getPolicyById(id).then(setPolicy) }, [id])

  if (!id) return <PageLayout><PageHeader title="Policy" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/rbac/policies">Back</Link></Button></PageLayout>
  if (!policy) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/rbac/policies">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader title={policy.name} description={policy.description ?? "Policy details. Seed data only." actions={<Button asChild variant="outline" size="sm"><Link href="/rbac/policies"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Policies</Link></Button>} />
      <PageSection title="Configuration">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Type:</strong> {policy.type}</p>
          <p><strong>Blueprint:</strong> {policy.blueprint}</p>
          <p><strong>Status:</strong> {policy.status}</p>
          <p><strong>Priority:</strong> {policy.priority}</p>
          <p><strong>Actions:</strong> {policy.actions.join(", ")}</p>
          <p><strong>Resources:</strong> {policy.resources.join(", ")}</p>
          {policy.conditions && policy.conditions.length > 0 && (
            <div className="mt-3">
              <p className="font-medium mb-1">Conditions:</p>
              <ul className="list-inside list-disc text-xs text-[#605e5c]">
                {policy.conditions.map((c, i) => <li key={i}>{c.field} {c.operator} {String(c.value)}</li>)}
              </ul>
            </div>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
