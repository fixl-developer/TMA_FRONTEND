"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { contracts } from "@/data/seed"

export default function ContractsPage() {
  const contractsData = contracts as Array<{
    id: string
    talentId: string
    template: string
    status: string
    signedAt: string | null
    expiresAt: string | null
  }>

  return (
    <PageLayout>
      <PageBanner
        title="Contracts"
        subtitle="Templates, e-sign flow, and contract management."
        variant="contracts"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>New contract</Button>
      </div>
      <PageSection>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Contract ID</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Talent</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Template</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Signed</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contractsData.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-200">{c.id}</td>
                    <td className="px-4 py-3 text-slate-400">{c.talentId}</td>
                    <td className="px-4 py-3 text-slate-400">{c.template}</td>
                    <td className="px-4 py-3">
                      <span className={c.status === "signed" ? "text-emerald-400" : "text-amber-400"}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{c.signedAt ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      {c.status === "pending" && <Button variant="ghost" size="sm">Send for e-sign</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
      <PageSection title="Templates">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Standard Representation</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Base talent representation agreement.</p>
              <Button variant="outline" size="sm" className="mt-3">Use template</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Project Contract</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Single project or campaign agreement.</p>
              <Button variant="outline" size="sm" className="mt-3">Use template</Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
