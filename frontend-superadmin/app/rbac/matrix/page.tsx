"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Grid3x3, ArrowLeft } from "lucide-react"
import type { PermissionMatrix } from "@/shared/lib/types/rbac"
import { getPermissionMatrix } from "@/shared/services/rbacService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function PermissionMatrixPage() {
  const [matrix, setMatrix] = useState<PermissionMatrix[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getPermissionMatrix().then(setMatrix).finally(() => setLoading(false)) }, [])

  return (
    <PageLayout>
      <PageHeader
        title="Permission matrix"
        description="Role vs Capability matrix, visual heatmap. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Grid3x3 className="h-3.5 w-3.5 text-[#0078d4]" />Matrix</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/rbac/roles"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Roles</Link></Button>}
      />
      <PageSection>
        {loading ? <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Loading…</CardContent></Card> : matrix.length === 0 ? <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">No matrix data in seed.</CardContent></Card> : (
          <div className="space-y-4">
            {matrix.map((m) => (
              <Card key={m.blueprint}>
                <CardHeader><CardTitle className="text-sm">{m.blueprint} blueprint</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#edebe9]">
                          <th className="px-2 py-1 text-left font-medium">Resource / Action</th>
                          {m.roles.map((r) => <th key={r} className="px-2 py-1 text-center font-medium">{r}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {m.resources.map((res) => res.permissions.map((perm) => (
                          <tr key={`${res.name}-${perm.action}`} className="border-b border-[#edebe9]">
                            <td className="px-2 py-1 font-mono text-[10px]">{res.name} · {perm.action}</td>
                            {m.roles.map((role) => (
                              <td key={role} className="px-2 py-1 text-center">
                                {perm.roleAccess[role] ? <span className="inline-block h-3 w-3 rounded bg-[#107c10]"></span> : <span className="inline-block h-3 w-3 rounded bg-[#edebe9]"></span>}
                              </td>
                            ))}
                          </tr>
                        )))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  )
}
