"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HeroCarousel } from "@/shared/components/ui/HeroCarousel"
import { InteractiveMetricCard, InteractiveFeaturedCard } from "@/shared/components/ui/InteractiveCard"
import { Button } from "@/shared/components/ui/button"
import { ROLE_DASHBOARD_CONFIG } from "@/shared/config/roleDashboardConfig"
import { UserCircle2, FileSignature, Wallet, Calendar } from "lucide-react"
import { getTalents } from "@/shared/services/talentService"
import { getContracts } from "@/shared/services/contractService"
import { getRecentTransactions } from "@/shared/services/financeService"
import { seedWallets } from "@/data/seed"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useTenant } from "@/shared/context/TenantContext"
import { MetricCardSkeleton } from "@/shared/components/ui/loading-skeleton"
const ROLE = "talent-mgmt"
const config = ROLE_DASHBOARD_CONFIG[ROLE]

export default function TalentMgmtDashboard() {
  const { tenantId } = useTenant()
  const [talents, setTalents] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tenantId) return
    setLoading(true)
    Promise.all([
      getTalents(tenantId),
      getContracts(tenantId),
      getRecentTransactions(tenantId),
    ]).then(([t, c, tx]) => {
      setTalents((t as any[]).filter((x) => x.tenantId === tenantId))
      setContracts((c as any[]).filter((x) => x.tenantId === tenantId))
      setTransactions((tx as any[]).filter((x) => x.tenantId === tenantId))
    }).finally(() => setLoading(false))
  }, [tenantId])

  const tenantWallet = (seedWallets as any[]).find((w) => w.scope === "TENANT" && w.tenantId === tenantId)
  const balance = tenantWallet?.balanceMinor ?? 0

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
          <InteractiveMetricCard title="Active Talent" value={talents.length} subtitle="In roster" icon={UserCircle2} variant={config.metricVariants[0] as any} imageUrl={config.metricImages.talent} />
          <InteractiveMetricCard title="Contracts" value={contracts.length} subtitle="Total" icon={FileSignature} variant={config.metricVariants[1] as any} imageUrl={config.metricImages.contracts} />
          <InteractiveMetricCard title="Wallet" value={`₹${(balance / 100).toLocaleString("en-IN")}`} subtitle="Balance" icon={Wallet} variant={config.metricVariants[2] as any} imageUrl={config.metricImages.wallet} />
          <InteractiveMetricCard title="Transactions" value={transactions.length} subtitle="Recent" icon={Wallet} variant={config.metricVariants[3] as any} imageUrl={config.metricImages.transactions} />
        </div>
        )}
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-[#1C1917] sm:text-base">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InteractiveFeaturedCard
            title="Talent CRM"
            subtitle="Profiles, pipelines, tracking"
            ctaLabel="View"
            href="/talent-mgmt/talent"
            icon={UserCircle2}
            variant={config.metricVariants[0] as any}
            imageUrl={config.metricImages.talent}
            videoUrl={config.heroSlides[0].videoUrl}
          />
          <InteractiveFeaturedCard
            title="Contracts"
            subtitle="Templates, e-sign flow"
            ctaLabel="Manage"
            href="/talent-mgmt/contracts"
            icon={FileSignature}
            variant={config.metricVariants[1] as any}
            imageUrl={config.metricImages.contracts}
            videoUrl={config.heroSlides[1].videoUrl}
          />
          <InteractiveFeaturedCard
            title="Calendar"
            subtitle="Availability, holds"
            ctaLabel="Open"
            href="/talent-mgmt/calendar"
            icon={Calendar}
            variant={config.metricVariants[2] as any}
            imageUrl={config.metricImages.wallet}
            videoUrl={config.heroSlides[2].videoUrl}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]">
            <Link href="/talent-mgmt/ledger">Ledger</Link>
          </Button>
        </div>
      </section>
    </AgenciesPage>
  )
}
