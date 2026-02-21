"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"

export default function ResultsPage() {
  return (
    <PageLayout>
      <PageBanner
        title="Results"
        subtitle="Publishing, templates, and result management."
        variant="results"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>Publish results</Button>
      </div>
      <PageSection>
        <Card>
          <CardHeader><CardTitle>Result templates</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                <p className="font-medium text-slate-200">Beauty Pageant</p>
                <p className="text-xs text-slate-500">Top 10, category winners, special awards</p>
                <Button variant="outline" size="sm" className="mt-3">Use template</Button>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                <p className="font-medium text-slate-200">Talent Hunt</p>
                <p className="text-xs text-slate-500">Finalists, category scores</p>
                <Button variant="outline" size="sm" className="mt-3">Use template</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>
      <PageSection title="Published results">
        <Card>
          <CardContent>
            <p className="text-sm text-slate-400">No results published yet. Publish when stages are complete.</p>
            <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
              Results preview placeholder
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
