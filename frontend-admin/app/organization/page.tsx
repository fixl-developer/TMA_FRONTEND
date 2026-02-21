import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { tenantSettings } from "@/data/seed"

export default function OrganizationPage() {
  const settings = tenantSettings as {
    organizationName: string
    subdomain: string
    branding: { primaryColor: string; logoUrl: string | null }
    limits: { maxUsers: number; maxStorage: number; maxApiCalls: number }
    features: Record<string, boolean>
  }

  return (
    <PageLayout>
      <PageBanner
        title="Organization"
        subtitle="Your brand. Your rules. Profile, branding, and subdomain."
        variant="default"
      />
      <PageSection className="mt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-400">Organization name</p>
                <p className="text-sm text-slate-200">{settings.organizationName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Subdomain</p>
                <p className="text-sm text-slate-200">{settings.subdomain}.talentos.io</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Primary color</p>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded border border-slate-700"
                    style={{ backgroundColor: settings.branding.primaryColor }}
                  />
                  <span className="text-sm text-slate-300">{settings.branding.primaryColor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Pageants</span>
                  <span className={settings.features.pageants ? "text-emerald-400" : "text-slate-400"}>
                    {settings.features.pageants ? "Enabled" : "Disabled"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Talent</span>
                  <span className={settings.features.talent ? "text-emerald-400" : "text-slate-400"}>
                    {settings.features.talent ? "Enabled" : "Disabled"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Influencers</span>
                  <span className={settings.features.influencers ? "text-emerald-400" : "text-slate-400"}>
                    {settings.features.influencers ? "Enabled" : "Disabled"}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
