import Link from "next/link"
import { PageLayout, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { stages, registrations, judges, sponsors } from "@/data/seed"

export default function PageantDashboard() {
  const stagesData = stages as Array<{ status: string }>
  const regsData = registrations as Array<{ status: string }>
  const activeStages = stagesData.filter((s) => s.status === "active").length
  const paidRegs = regsData.filter((r) => r.status === "paid").length
  const judgesData = judges as Array<{ assigned: boolean }>
  const assignedJudges = judgesData.filter((j) => j.assigned).length

  return (
    <PageLayout>
      <PageBanner
        title="Pageant Organizer"
        subtitle="Process builder, registration, judges, sponsors, and results. Run the show."
        variant="default"
      />
      <PageSection title="Key metrics" className="mt-8">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Stages</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{stagesData.length}</p>
              <p className="text-xs text-slate-400">{activeStages} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Registrations</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{paidRegs}</p>
              <p className="text-xs text-slate-400">Paid contestants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Judges</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{assignedJudges}</p>
              <p className="text-xs text-slate-400">Assigned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Sponsors</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-violet-400">{(sponsors as unknown[]).length}</p>
              <p className="text-xs text-slate-400">Integrated</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Quick actions">
        <div className="flex flex-wrap gap-3">
          <Link href="/process"><Button>Process Builder</Button></Link>
          <Link href="/registration"><Button variant="outline">Registrations</Button></Link>
          <Link href="/judges"><Button variant="outline">Assign judges</Button></Link>
          <Link href="/results"><Button variant="outline">Publish results</Button></Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
