import Link from "next/link"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"

export default function TenantAdminDashboard() {
  return (
    <PageLayout>
      <PageBanner
        title="Command Centre"
        subtitle="Your talent empire at a glance. Manage castings, events, and talent from one place."
        variant="default"
      />
      <PageSection title="Key metrics" className="mt-8">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-xs text-slate-400">Active users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-xs text-slate-400">Configured roles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-400">OK</p>
              <p className="text-xs text-slate-400">All checks passed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">Low</p>
              <p className="text-xs text-slate-400">Within limits</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Quick actions">
        <div className="flex flex-wrap gap-3">
          <Button>Invite user</Button>
          <Link href="/organization">
            <Button variant="outline">Edit organization</Button>
          </Link>
          <Link href="/talent">
            <Button variant="outline">Talent</Button>
          </Link>
          <Link href="/casting">
            <Button variant="outline">Castings</Button>
          </Link>
          <Link href="/events">
            <Button variant="outline">Events</Button>
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
