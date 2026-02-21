import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"

export default function CompliancePage() {
  const items = [
    { name: "Consent management", status: "ok", lastChecked: "2025-02-15" },
    { name: "Data retention", status: "ok", lastChecked: "2025-02-15" },
    { name: "GDPR compliance", status: "ok", lastChecked: "2025-02-14" },
  ]

  return (
    <PageLayout>
      <PageBanner
        title="Compliance"
        subtitle="Consent, retention, GDPR. Stay compliant, stay trusted."
        variant="default"
      />
      <PageSection className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Compliance status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.name} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-200">{item.name}</p>
                    <p className="text-xs text-slate-400">Last checked: {item.lastChecked}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
