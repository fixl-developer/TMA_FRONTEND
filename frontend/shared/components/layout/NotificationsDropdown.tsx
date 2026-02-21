"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Check } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useTenant } from "@/shared/context/TenantContext"
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
  type Notification,
} from "@/shared/services/modellingNotificationService"
import { cn } from "@/shared/lib/utils"

export function NotificationsDropdown({ viewAllHref = "/modelling/notifications" }: { viewAllHref?: string }) {
  const { tenantId } = useTenant()
  const [open, setOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  const load = React.useCallback(() => {
    getNotifications(tenantId).then(setNotifications)
    getUnreadCount(tenantId).then(setUnreadCount)
  }, [tenantId])

  React.useEffect(() => {
    load()
  }, [load])

  React.useEffect(() => {
    if (open) load()
  }, [open, load])

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id, tenantId)
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(tenantId)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B8860B] px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-[340px] max-h-[400px] overflow-hidden rounded-lg border border-[#E7E5E4] bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-[#E7E5E4] px-4 py-3">
            <span className="font-semibold text-[#1C1917]">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-[#B8860B] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#57534E]">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={cn(
                    "border-b border-[#E7E5E4] px-4 py-3 transition-colors last:border-0",
                    !n.read && "bg-[#FEF3C7]/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", n.read ? "text-[#57534E]" : "font-medium text-[#1C1917]")}>
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#57534E] line-clamp-2">{n.message}</p>
                      <p className="mt-1 text-[10px] text-[#78716C]">
                        {new Date(n.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(n._id)}
                        className="shrink-0 rounded p-1 text-[#B8860B] hover:bg-[#FEF3C7]"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href={viewAllHref}
            onClick={() => setOpen(false)}
            className="block border-t border-[#E7E5E4] px-4 py-3 text-center text-sm font-medium text-[#B8860B] hover:bg-[#FEF3C7]/50"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}
