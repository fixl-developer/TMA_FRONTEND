"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getNotificationPreferences } from "@/shared/services/commsService"
import { useAuth } from "@/shared/context/AuthContext"
import { useTenant } from "@/shared/context/TenantContext"
import { Bell, Mail, Smartphone } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function NotificationsSettingsPage() {
  const { user } = useAuth()
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [prefs, setPrefs] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = user?.id ?? "user_admin_002"
    getNotificationPreferences(userId, tenantId).then((p) => {
      setPrefs(p)
      setLoading(false)
    })
  }, [user?.id, tenantId])

  return (
    <AgenciesPage>
      <PageBanner
        title="Notification Preferences"
        subtitle="Digest, priority routing, quiet hours"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/settings">
          <Button variant="ghost" size="sm">
            ← Settings
          </Button>
        </Link>
      </div>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3 py-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200/50" />
              ))}
            </div>
          ) : prefs ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded border p-3" style={{ borderColor: page.border }}>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-sm" style={{ color: page.text }}>
                      Email digest
                    </p>
                    <p className="text-xs text-slate-500">{prefs.emailDigest}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded border p-3" style={{ borderColor: page.border }}>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-sm" style={{ color: page.text }}>
                      In-app notifications
                    </p>
                    <p className="text-xs text-slate-500">
                      {prefs.inAppEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded border p-3" style={{ borderColor: page.border }}>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-sm" style={{ color: page.text }}>
                      Push notifications
                    </p>
                    <p className="text-xs text-slate-500">
                      {prefs.pushEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
              {prefs.priorityTypes?.length > 0 && (
                <div className="rounded border p-3" style={{ borderColor: page.border }}>
                  <p className="font-medium text-sm" style={{ color: page.text }}>
                    Priority types
                  </p>
                  <p className="text-xs text-slate-500">
                    {prefs.priorityTypes.join(", ")}
                  </p>
                </div>
              )}
              {prefs.quietHoursStart && prefs.quietHoursEnd && (
                <div className="rounded border p-3" style={{ borderColor: page.border }}>
                  <p className="font-medium text-sm" style={{ color: page.text }}>
                    Quiet hours
                  </p>
                  <p className="text-xs text-slate-500">
                    {prefs.quietHoursStart} – {prefs.quietHoursEnd}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-slate-500">
              No preferences set. Using defaults.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" disabled>
          Save (coming soon)
        </Button>
      </div>
    </AgenciesPage>
  )
}
