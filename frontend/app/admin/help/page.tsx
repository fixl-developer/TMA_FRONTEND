"use client"

import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { HelpCircle, Book, MessageSquare, FileText, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const faqs = [
  { q: "How do I add a new talent?", a: "Go to Talent → Add talent. Fill in profile details and portfolio." },
  { q: "How do I create a quote?", a: "Sales → Quotes → Create. Select a template and add line items from rate cards." },
  { q: "How do I run a pageant?", a: "Events → Create event. Configure stages, tasks, and scoring in the process builder." },
  { q: "How do I set up webhooks?", a: "Integrations → Webhooks. Add your endpoint URL and select events to receive." },
  { q: "Where can I see my revenue?", a: "Reports or Finance → Invoices. Revenue aggregates from bookings and invoices." },
]

export default function HelpPage() {
  return (
    <AgenciesPage>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageBanner
          title="Help center"
          subtitle="FAQs, documentation, support."
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
          className="flex-1 min-w-0"
        />
        <Link href="/admin/support">
          <Button className="shrink-0 bg-amber-500 text-slate-900 hover:bg-amber-400">
            <MessageSquare className="mr-1.5 h-4 w-4" /> Contact support
          </Button>
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="relative cursor-pointer transition-all hover:border-amber-400 hover:shadow-md">
          <Link href="/admin/support" className="absolute inset-0 z-10" aria-label="Support cases" />
          <CardContent className="relative z-20 flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <MessageSquare className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Support cases</p>
                <p className="text-sm text-slate-500">View and create tickets</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
              <Book className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">Documentation</p>
              <p className="text-sm text-slate-500">Coming soon</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
              <FileText className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">API reference</p>
              <p className="text-sm text-slate-500">Integrations → API keys</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> Frequently asked questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-800">{faq.q}</p>
                <p className="mt-1 text-sm text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
