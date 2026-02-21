"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useLocale } from "@/shared/context/LocaleContext"
import { useAuth } from "@/shared/context/AuthContext"
import { useTenant } from "@/shared/context/TenantContext"
import { LayoutDashboard, CalendarCheck, ImageIcon, Wallet, ChevronRight } from "lucide-react"
import { getBookings } from "@/shared/services/bookingService"
import { getPendingApprovals } from "@/shared/services/commsService"
import { seedWallets } from "@/data/seed"

export default function MobileDashboardPage() {
  const { t } = useLocale()
  const { user } = useAuth()
  const { tenantId } = useTenant()
  const [walletBalance, setWalletBalance] = useState<string | null>(null)
  const [nextBooking, setNextBooking] = useState<{ projectName: string; dates: { start: string }; clientName: string } | null>(null)
  const [pendingApprovals, setPendingApprovals] = useState<number>(0)

  const tid = tenantId || "tenant_001"
  const displayName = user?.name?.split(" ")[0] ?? "there"

  useEffect(() => {
    const w = (seedWallets as { scope: string; tenantId?: string; balanceMinor: number }[]).find(
      (x) => x.scope === "TENANT" && x.tenantId === tid
    )
    setWalletBalance(w ? `₹${(w.balanceMinor / 100).toLocaleString("en-IN")}` : null)
  }, [tid])

  useEffect(() => {
    getBookings(tid).then((list) => {
      const confirmed = (list as { stage: string; projectName: string; dates: { start: string }; clientName: string }[])
        .filter((b) => b.stage === "CONFIRMED")
        .sort((a, b) => (a.dates?.start ?? "").localeCompare(b.dates?.start ?? ""))
      setNextBooking(confirmed[0] ?? null)
    })
  }, [tid])

  useEffect(() => {
    getPendingApprovals(tid).then((list) => setPendingApprovals(list.length))
  }, [tid])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          {t("mobile.welcome")}, {displayName}
        </h1>
        <p className="text-sm text-slate-500">{t("mobile.subtitle")}</p>
      </div>

      <div className="space-y-3">
          {walletBalance && (
            <Card className="relative border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-white transition-colors active:bg-amber-100/60">
              <Link href="/mobile/wallet" className="absolute inset-0 z-10" aria-label="View wallet" />
              <CardContent className="relative flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                      <Wallet className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Wallet balance</p>
                      <p className="text-lg font-bold text-slate-800">{walletBalance}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
              </CardContent>
            </Card>
          )}
          {nextBooking && (
            <Card className="relative border-slate-200 transition-colors active:bg-slate-50">
              <Link href="/mobile/bookings" className="absolute inset-0 z-10" aria-label="View bookings" />
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Next booking</p>
                    <p className="font-semibold text-slate-800">{nextBooking.projectName}</p>
                    <p className="text-xs text-slate-500">
                      {nextBooking.dates?.start ? new Date(nextBooking.dates.start).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) : ""} · {nextBooking.clientName}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
              </CardContent>
            </Card>
          )}
          {pendingApprovals > 0 && (
            <Card className="relative border-amber-300/80 bg-amber-50/60 transition-colors active:bg-amber-100/40">
              <Link href="/portal/approvals" className="absolute inset-0 z-10" aria-label="View pending approvals" />
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs font-medium text-amber-700">Pending approval</p>
                    <p className="font-semibold text-slate-800">{pendingApprovals} item{pendingApprovals !== 1 ? "s" : ""} need your attention</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-600" />
              </CardContent>
            </Card>
          )}
        {!walletBalance && !nextBooking && pendingApprovals === 0 && (
          <Card className="border-slate-200 bg-slate-50/50">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600">You&apos;re all set. No pending actions right now.</p>
              <p className="mt-1 text-xs text-slate-500">Check your bookings, content, or wallet below.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="relative border-slate-200 transition-colors active:bg-slate-50">
          <Link href="/mobile/bookings" className="absolute inset-0 z-10" aria-label={t("nav.bookings")} />
          <CardContent className="relative flex flex-col items-center gap-2 pt-6 pb-6">
            <CalendarCheck className="h-10 w-10 text-amber-600" />
            <span className="text-sm font-medium text-slate-800">{t("nav.bookings")}</span>
          </CardContent>
        </Card>
        <Card className="relative border-slate-200 transition-colors active:bg-slate-50">
          <Link href="/mobile/content" className="absolute inset-0 z-10" aria-label={t("nav.content")} />
          <CardContent className="relative flex flex-col items-center gap-2 pt-6 pb-6">
            <ImageIcon className="h-10 w-10 text-amber-600" />
            <span className="text-sm font-medium text-slate-800">{t("nav.content")}</span>
          </CardContent>
        </Card>
        <Card className="relative border-slate-200 transition-colors active:bg-slate-50">
          <Link href="/mobile/wallet" className="absolute inset-0 z-10" aria-label={t("nav.wallet")} />
          <CardContent className="relative flex flex-col items-center gap-2 pt-6 pb-6">
            <Wallet className="h-10 w-10 text-amber-600" />
            <span className="text-sm font-medium text-slate-800">{t("nav.wallet")}</span>
          </CardContent>
        </Card>
        <Card className="relative border-slate-200 transition-colors active:bg-slate-50">
          <Link href="/admin" className="absolute inset-0 z-10" aria-label="Admin" />
          <CardContent className="relative flex flex-col items-center gap-2 pt-6 pb-6">
            <LayoutDashboard className="h-10 w-10 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Admin</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-4">
          <p className="text-sm text-amber-800">
            PWA-ready mobile shell. Talent & Brand roles – mobile-optimized views.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
