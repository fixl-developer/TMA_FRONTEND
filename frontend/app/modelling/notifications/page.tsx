"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from "@/shared/services/modellingNotificationService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { Bell, Check } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const typeLabels: Record<string, string> = {
  CONTRACT: "Contract",
  ESCROW: "Escrow",
  BOOKING: "Booking",
  DISPUTE: "Dispute",
  INVOICE: "Invoice",
}

export default function ModellingNotificationsPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showPrefs, setShowPrefs] = useState(false)

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    unreadBg: isDark ? "#fbbf24" : "#FEF3C7",
  }

  const load = () => {
    getNotifications(tenantId).then((data) => {
      setNotifications(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [tenantId])

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id, tenantId)
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(tenantId)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Notifications</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Stay updated</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle style={{ color: theme.text }}>Notifications</CardTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#B8860B] text-[#B8860B] hover:bg-[#FEF3C7]"
                    onClick={handleMarkAllRead}
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Mark all read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPrefs((v) => !v)}
                >
                  Preferences
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showPrefs && (
              <div className="mb-6 rounded-xl border p-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5", borderColor: theme.border }}>
                <h3 className="font-medium mb-3" style={{ color: theme.text }}>Notification preferences</h3>
                <p className="text-sm mb-3" style={{ color: theme.textSecondary }}>
                  Configure which notifications you receive. (Form placeholder – not wired to backend.)
                </p>
                <div className="space-y-2">
                  {["Contracts", "Escrows", "Bookings", "Disputes", "Invoices"].map((label) => (
                    <label key={label} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm" style={{ color: theme.text }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <LoadingSkeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <Bell className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex items-start gap-4 rounded-xl border p-4 transition-colors`}
                    style={{
                      backgroundColor: n.read ? theme.cardBg : (isDark ? "rgba(251, 191, 36, 0.1)" : "rgba(254, 243, 199, 0.2)"),
                      borderColor: n.read ? theme.border : "#FEF3C7",
                    }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7]">
                      <Bell className="h-5 w-5 text-[#B8860B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={n.read ? "font-medium" : "font-semibold"} style={{ color: n.read ? theme.textSecondary : theme.text }}>
                          {n.title}
                        </p>
                        {n.type && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {typeLabels[n.type] ?? n.type}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{n.message}</p>
                      <p className="mt-2 text-xs" style={{ color: isDark ? "#78716C" : "#78716C" }}>
                        {new Date(n.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    {!n.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 text-[#B8860B]"
                        onClick={() => handleMarkRead(n._id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
