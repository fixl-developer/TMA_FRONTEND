import Link from "next/link"
import { PageLayout, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { talents, castings, bookings } from "@/data/seed"

export default function ModellingDashboard() {
  const activeTalents = (talents as Array<{ status: string }>).filter((t) => t.status === "active").length
  const openCastings = (castings as Array<{ status: string }>).filter((c) => c.status === "open").length
  const upcomingBookings = (bookings as Array<{ status: string }>).filter((b) => b.status === "confirmed").length

  return (
    <PageLayout>
      <PageBanner
        title="Modelling Agency"
        subtitle="Your talent roster, castings, and bookings at a glance."
        variant="default"
      />
      <PageSection title="Key metrics" className="mt-8">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Active Talent</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{activeTalents}</p>
              <p className="text-xs text-slate-400">Signed talent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Open Castings</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{openCastings}</p>
              <p className="text-xs text-slate-400">Accepting submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Upcoming Bookings</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{upcomingBookings}</p>
              <p className="text-xs text-slate-400">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Pipeline</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-400">3</p>
              <p className="text-xs text-slate-400">In pipeline</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Quick actions">
        <div className="flex flex-wrap gap-3">
          <Link href="/talent"><Button>Add talent</Button></Link>
          <Link href="/castings"><Button variant="outline">New casting</Button></Link>
          <Link href="/bookings"><Button variant="outline">View calendar</Button></Link>
          <Link href="/contracts"><Button variant="outline">Contracts</Button></Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
