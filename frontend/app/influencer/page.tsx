"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { HeroCarousel } from "@/shared/components/ui/HeroCarousel"
import { InteractiveMetricCard, InteractiveFeaturedCard } from "@/shared/components/ui/InteractiveCard"
import { Button } from "@/shared/components/ui/button"
import { ROLE_DASHBOARD_CONFIG } from "@/shared/config/roleDashboardConfig"
import { Megaphone, Wallet, Package, FileText, BarChart3 } from "lucide-react"
import { getTenantCampaigns } from "@/shared/services/adminService"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { MetricCardSkeleton } from "@/shared/components/ui/loading-skeleton"

const ROLE = "influencer"
const config = ROLE_DASHBOARD_CONFIG[ROLE]

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD", maximumFractionDigits: 0 }).format(amountMinor / 100)
}

export default function InfluencerDashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTenantCampaigns().then(setCampaigns).finally(() => setLoading(false))
  }, [])

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length
  const totalBudget = campaigns.reduce((s, c) => s + (c.budgetMinor ?? 0), 0)

  const heroSlides = config.heroSlides.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    ctaLabel: s.ctaLabel,
    ctaHref: s.ctaHref,
    gradient: s.gradient,
    videoUrl: s.videoUrl,
    imageUrl: s.imageUrl,
  }))

  return (
    <AgenciesPage>
      <HeroCarousel slides={heroSlides} gradients={config.heroGradients} className="mb-8" />
      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-[#1C1917] sm:text-base">Key metrics</h2>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InteractiveMetricCard title="Active campaigns" value={activeCampaigns} subtitle="Live" icon={Megaphone} variant={config.metricVariants[0] as any} imageUrl={config.metricImages.campaigns} />
          <InteractiveMetricCard title="Total budget" value={formatCurrency(totalBudget, "INR")} subtitle="Allocated" icon={Wallet} variant={config.metricVariants[1] as any} imageUrl={config.metricImages.budget} />
          <InteractiveMetricCard title="Deliverables" value="5" subtitle="Pending" icon={Package} variant={config.metricVariants[2] as any} imageUrl={config.metricImages.deliverables} />
          <InteractiveMetricCard title="Media kits" value="3" subtitle="Available" icon={FileText} variant={config.metricVariants[3] as any} imageUrl={config.metricImages.mediaKits} />
        </div>
        )}
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-[#1C1917] sm:text-base">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InteractiveFeaturedCard
            title="Campaigns"
            subtitle="Create and track campaigns"
            ctaLabel="View"
            href="/influencer/campaigns"
            icon={Megaphone}
            variant={config.metricVariants[0] as any}
            imageUrl={config.metricImages.campaigns}
            videoUrl={config.heroSlides[0].videoUrl}
          />
          <InteractiveFeaturedCard
            title="Deliverables"
            subtitle="Content submissions"
            ctaLabel="Manage"
            href="/influencer/deliverables"
            icon={Package}
            variant={config.metricVariants[1] as any}
            imageUrl={config.metricImages.deliverables}
            videoUrl={config.heroSlides[1].videoUrl}
          />
          <InteractiveFeaturedCard
            title="Reporting"
            subtitle="Analytics and insights"
            ctaLabel="View"
            href="/influencer/reporting"
            icon={BarChart3}
            variant={config.metricVariants[2] as any}
            imageUrl={config.metricImages.mediaKits}
            videoUrl={config.heroSlides[2].videoUrl}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]">
            <Link href="/influencer/media-kits">Media Kits</Link>
          </Button>
        </div>
      </section>
    </AgenciesPage>
  )
}
