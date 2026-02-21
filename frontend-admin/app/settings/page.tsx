import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { tenantSettings } from "@/data/seed"

export default function SettingsPage() {
  const settings = tenantSettings as {
    organizationName: string
    subdomain: string
    limits: { maxUsers: number; maxStorage: number; maxApiCalls: number }
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / 1073741824
    return `${gb} GB`
  }

  return (
    <PageLayout>
      <PageBanner
        title="Tenant Settings"
        subtitle="Configure tenant-wide settings and preferences."
        variant="default"
      />
      <PageSection className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Organization name</label>
              <p className="mt-1 text-sm text-slate-200">{settings.organizationName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Subdomain</label>
              <p className="mt-1 text-sm text-slate-200">{settings.subdomain}.talentos.io</p>
            </div>
          </CardContent>
        </Card>
      </PageSection>
      <PageSection title="Limits">
        <Card>
          <CardContent className="pt-4">
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-400">Max users</span>
                <span className="font-medium text-slate-200">{settings.limits.maxUsers}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Max storage</span>
                <span className="font-medium text-slate-200">{formatBytes(settings.limits.maxStorage)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">API calls / month</span>
                <span className="font-medium text-slate-200">{settings.limits.maxApiCalls.toLocaleString()}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
