"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Mail,
  MessageSquare,
  Bell,
  Monitor,
  Send,
  Copy,
  Check,
} from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import notificationTemplates from "@/data/seed/notificationTemplates.json"

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
  "in-app": Monitor,
}

interface NotificationTemplate {
  id: string
  name: string
  channel: string
  subject: string | null
  body: string
  variables: string[]
  status: string
  usageCount: number
  lastModified: string
  tenantScope: string
}

export default function NotificationTemplateDetailPage() {
  const params = useParams<{ id: string }>()
  const templateId = params?.id
  const [copied, setCopied] = useState(false)
  const [testEmail, setTestEmail] = useState("")

  const template = useMemo(() => {
    const tpl = (notificationTemplates as NotificationTemplate[]).find((t) => t.id === templateId)
    return tpl
  }, [templateId])

  const Icon = template ? channelIcons[template.channel] ?? FileText : FileText

  const handleCopyVariables = () => {
    if (!template) return
    const vars = template.variables.join(", ")
    navigator.clipboard.writeText(vars)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    }
    catch {
      return d
    }
  }

  if (!templateId) {
    return (
      <PageLayout>
        <PageHeader title="Template not found" description="Invalid template id." />
        <Button asChild variant="outline" size="sm">
          <Link href="/notifications/templates">Back to templates</Link>
        </Button>
      </PageLayout>
    )
  }

  if (!template) {
    return (
      <PageLayout>
        <PageHeader title={`Template ${templateId}`} description="Not found in seed data." />
        <Button asChild variant="outline" size="sm">
          <Link href="/notifications/templates">Back to templates</Link>
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title={template.name}
        description={`Template ${template.id} · ${template.channel} channel`}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Icon className="h-3.5 w-3.5 text-[#0078d4]" />
            {template.channel}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/notifications/templates">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Templates
              </Link>
            </Button>
            <Button size="sm" className="bg-[#0078d4] hover:bg-[#106ebe]">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Test send
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PageSection title="Content">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2 font-mono text-sm text-[#323130]">
                  {template.subject ?? "(No subject – SMS/push/in-app)"}
                </p>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Body</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap rounded border border-[#edebe9] bg-[#faf9f8] p-4 font-mono text-sm text-[#323130]">
                  {template.body}
                </pre>
              </CardContent>
            </Card>
          </PageSection>
        </div>

        <div className="space-y-6">
          <PageSection title="Details">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#605e5c]">Status</p>
                  <Badge
                    className={
                      template.status === "active"
                        ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
                        : "border-[#605e5c] bg-[#f3f2f1] text-[#605e5c]"
                    }
                  >
                    {template.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#605e5c]">Tenant scope</p>
                  <p className="text-sm font-medium text-[#323130] capitalize">
                    {template.tenantScope}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#605e5c]">Usage count</p>
                  <p className="text-sm font-semibold text-[#323130]">
                    {template.usageCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#605e5c]">Last modified</p>
                  <p className="text-sm text-[#323130]">{formatDate(template.lastModified)}</p>
                </div>
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Variables">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-[#605e5c]">
                    {template.variables.length} variables
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-[#0078d4]"
                    onClick={handleCopyVariables}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map((v) => (
                    <code
                      key={v}
                      className="rounded bg-[#deecf9] px-2 py-1 text-xs font-mono text-[#0078d4]"
                    >
                      {"{{" + v + "}}"}
                    </code>
                  ))}
                </div>
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Test send">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-[#605e5c] mb-2">
                  Send a test notification (UI placeholder – API integration later).
                </p>
                <div className="space-y-2">
                  {(template.channel === "email" || template.channel === "in-app") && (
                    <input
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] placeholder:text-[#605e5c] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                    />
                  )}
                  {template.channel === "sms" && (
                    <input
                      type="tel"
                      placeholder="+919876543210"
                      className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] placeholder:text-[#605e5c] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                    />
                  )}
                  <Button size="sm" className="w-full bg-[#0078d4] hover:bg-[#106ebe]">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Send test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PageSection>
        </div>
      </div>
    </PageLayout>
  )
}
