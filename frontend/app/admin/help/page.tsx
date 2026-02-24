"use client"

import Link from "next/link"
import { HelpCircle, Book, MessageSquare, FileText, ChevronRight } from "lucide-react"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
} from "@/shared/components/admin/AdminPageLayout"

const faqs = [
  { q: "How do I add a new talent?", a: "Go to Talent → Add talent. Fill in profile details and portfolio." },
  { q: "How do I create a quote?", a: "Sales → Quotes → Create. Select a template and add line items from rate cards." },
  { q: "How do I run a pageant?", a: "Events → Create event. Configure stages, tasks, and scoring in the process builder." },
  { q: "How do I set up webhooks?", a: "Integrations → Webhooks. Add your endpoint URL and select events to receive." },
  { q: "Where can I see my revenue?", a: "Reports or Finance → Invoices. Revenue aggregates from bookings and invoices." },
]

export default function HelpPage() {
  return (
    <AdminPageLayout
      title="Help center"
      subtitle="FAQs, documentation, support"
      actions={
        <Link href="/admin/support">
          <AdminButton>
            <MessageSquare className="h-4 w-4" />
            Contact support
          </AdminButton>
        </Link>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/support">
          <div className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <MessageSquare className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Support cases</p>
                <p className="text-sm text-white/60">View and create tickets</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40" />
            </div>
          </div>
        </Link>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
              <Book className="h-6 w-6 text-white/60" />
            </div>
            <div>
              <p className="font-medium text-white">Documentation</p>
              <p className="text-sm text-white/60">Coming soon</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
              <FileText className="h-6 w-6 text-white/60" />
            </div>
            <div>
              <p className="font-medium text-white">API reference</p>
              <p className="text-sm text-white/60">Integrations → API keys</p>
            </div>
          </div>
        </div>
      </div>

      <AdminCard
        title={
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <span>Frequently asked questions</span>
          </div>
        }
      >
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-medium text-white">{faq.q}</p>
              <p className="mt-1 text-sm text-white/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </AdminCard>
    </AdminPageLayout>
  )
}
