"use client"

import Link from "next/link"
import { Scale, FileText, Lock, ChevronRight, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"

const SECTIONS = [
  {
    href: "/superadmin/data-legal/privacy",
    icon: Scale,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Privacy & DSR",
    description: "Manage Data Subject Requests (access, erasure, portability), GDPR compliance, and platform-wide consent configuration.",
    stats: [{ label: "Pending DSRs", value: "2" }, { label: "Consent types", value: "5" }],
    badge: "GDPR · IT Act",
  },
  {
    href: "/superadmin/data-legal/retention",
    icon: FileText,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    title: "Data Retention",
    description: "Configure per-entity retention periods, post-expiry actions (delete, archive, anonymize), and compliance framework mappings.",
    stats: [{ label: "Active policies", value: "6" }, { label: "Frameworks", value: "6" }],
    badge: "RBI · ISO 27001",
  },
  {
    href: "/superadmin/data-legal/legal-hold",
    icon: Lock,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    title: "Legal Hold",
    description: "Freeze data for litigation, SEBI inquiries, or regulatory matters. Track active holds, expiry dates, and release history.",
    stats: [{ label: "Active holds", value: "3" }, { label: "Released", value: "1" }],
    badge: "Litigation · Compliance",
  },
]

export default function DataLegalPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Data & Legal"
        description="Privacy compliance, data retention governance, and legal hold management across all tenants."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Shield className="h-3.5 w-3.5 text-blue-500" />
            Compliance Hub
          </span>
        }
      />

      <PageSection title="Compliance Modules">
        <div className="grid gap-5 sm:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link key={section.href} href={section.href} className="group block">
              <Card className="h-full transition-all duration-200 group-hover:border-blue-300 group-hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.iconBg}`}>
                      <section.icon className={`h-5 w-5 ${section.iconColor}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-500" />
                  </div>
                  <CardTitle className="mt-3 text-base">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-slate-600">{section.description}</p>
                  <div className="flex gap-4">
                    {section.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {section.badge}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </PageSection>

      <PageSection title="Compliance Summary">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: "GDPR Compliant", value: "Yes", color: "text-emerald-600" },
                { label: "Data Residency", value: "India (IN)", color: "text-slate-800" },
                { label: "Encryption at Rest", value: "AES-256", color: "text-slate-800" },
                { label: "Last Audit", value: "Jan 2025", color: "text-slate-800" },
                { label: "DPO Appointed", value: "Yes", color: "text-emerald-600" },
                { label: "Privacy Policy", value: "v2.4 — Feb 2025", color: "text-slate-800" },
                { label: "Breach Notifications", value: "0 (FY25)", color: "text-emerald-600" },
                { label: "Sub-Processors Listed", value: "12", color: "text-slate-800" },
              ].map((item) => (
                <div key={item.label} className="border-l-2 border-slate-100 pl-4">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className={`mt-0.5 text-sm font-semibold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
