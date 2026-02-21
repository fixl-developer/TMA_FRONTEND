"use client"

import { useState } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  talentProfiles,
  talentPortfolios,
  talentContracts,
} from "@/data/seed"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { cn } from "@/shared/lib/utils"

type Tab = "profiles" | "portfolios" | "contracts" | "availability"

export default function TalentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profiles")

  const profiles = talentProfiles as Array<{
    id: string
    displayName: string
    email: string
    status: string
    verified: boolean
    createdAt: string
  }>
  const portfolios = talentPortfolios as Array<{
    id: string
    talentId: string
    type: string
    status: string
    uploadedAt: string
  }>
  const contracts = talentContracts as Array<{
    id: string
    talentId: string
    status: string
    signedAt: string | null
    expiresAt: string | null
  }>

  const tabs: { id: Tab; label: string }[] = [
    { id: "profiles", label: "Profiles" },
    { id: "portfolios", label: "Portfolios" },
    { id: "contracts", label: "Contracts" },
    { id: "availability", label: "Availability" },
  ]

  return (
    <PageLayout>
      <PageBanner
        title="Talent"
        subtitle="Profiles, portfolios, contracts, and availability. Your roster, your rules."
        variant="talent"
      />
      <div className="mb-6 mt-6 flex items-center justify-between">
        <div className="flex gap-2 border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "border-b-2 border-amber-500 text-amber-400"
                : "text-slate-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
        </div>
        <Button>Add talent</Button>
      </div>

      {activeTab === "profiles" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Verified</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{p.displayName}</td>
                      <td className="px-4 py-3 text-slate-400">{p.email}</td>
                      <td className="px-4 py-3">
                        <span className={p.status === "active" ? "text-emerald-400" : "text-amber-400"}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{p.verified ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "portfolios" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Talent ID</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Uploaded</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((p) => (
                    <tr key={p.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{p.talentId}</td>
                      <td className="px-4 py-3 text-slate-400">{p.type}</td>
                      <td className="px-4 py-3 text-slate-400">{p.status}</td>
                      <td className="px-4 py-3 text-slate-400">{p.uploadedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">Review</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "contracts" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Contract ID</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Talent</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Signed</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <tr key={c.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{c.id}</td>
                      <td className="px-4 py-3 text-slate-400">{c.talentId}</td>
                      <td className="px-4 py-3 text-slate-400">{c.status}</td>
                      <td className="px-4 py-3 text-slate-400">{c.signedAt ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "availability" && (
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Availability calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">View and manage talent availability, holds, and bookings.</p>
              <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                Calendar view placeholder – integrate with availability API
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
