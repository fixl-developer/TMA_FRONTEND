"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getNotificationPreferences } from "@/shared/services/commsService"
import { useAuth } from "@/shared/context/AuthContext"
import { useTenant } from "@/shared/context/TenantContext"
import { Bell, Mail, Smartphone, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminTableSkeleton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function NotificationsSettingsPage() {
  const { user } = useAuth()
  const { tenantId } = useTenant()
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
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Notification Preferences"
        subtitle="Digest, priority routing, quiet hours"
        action={
          <Link href="/admin/settings">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Settings
            </AdminButton>
          </Link>
        }
      />

      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>
        {loading ? (
          <AdminTableSkeleton rows={3} cols={2} />
        ) : prefs ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/40" />
                <div>
                  <p className="font-medium text-sm text-white">
                    Email digest
                  </p>
                  <p className="text-xs text-white/60">{prefs.emailDigest}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-white/40" />
                <div>
                  <p className="font-medium text-sm text-white">
                    In-app notifications
                  </p>
                  <p className="text-xs text-white/60">
                    {prefs.inAppEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-white/40" />
                <div>
                  <p className="font-medium text-sm text-white">
                    Push notifications
                  </p>
                  <p className="text-xs text-white/60">
                    {prefs.pushEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </div>
            {prefs.priorityTypes?.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-sm text-white">
                  Priority types
                </p>
                <p className="text-xs text-white/60">
                  {prefs.priorityTypes.join(", ")}
                </p>
              </div>
            )}
            {prefs.quietHoursStart && prefs.quietHoursEnd && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-sm text-white">
                  Quiet hours
                </p>
                <p className="text-xs text-white/60">
                  {prefs.quietHoursStart} – {prefs.quietHoursEnd}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="py-8 text-center text-white/60">
            No preferences set. Using defaults.
          </p>
        )}
      </AdminCard>

      <div className="mt-6">
        <AdminButton variant="secondary" disabled>
          Save (coming soon)
        </AdminButton>
      </div>
    </AdminPageWrapper>
  )
}
