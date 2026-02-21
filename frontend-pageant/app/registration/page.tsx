"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { registrations } from "@/data/seed"

export default function RegistrationPage() {
  const regsData = registrations as Array<{
    id: string
    contestantName: string
    email: string
    status: string
    amountMinor: number
    currency: string
    registeredAt: string
  }>

  return (
    <PageLayout>
      <PageBanner
        title="Registration"
        subtitle="Forms, payments, and contestant management."
        variant="registration"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>Configure form</Button>
      </div>
      <PageSection>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Contestant</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Registered</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {regsData.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-200">{r.contestantName}</td>
                    <td className="px-4 py-3 text-slate-400">{r.email}</td>
                    <td className="px-4 py-3">
                      <span className={r.status === "paid" ? "text-emerald-400" : "text-amber-400"}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">₹{(r.amountMinor / 100).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-400">{r.registeredAt}</td>
                    <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
