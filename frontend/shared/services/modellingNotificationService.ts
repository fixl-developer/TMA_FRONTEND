/**
 * Modelling Notification Service
 *
 * Mock service for notifications. Tenant-scoped.
 */

import { seedNotifications } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory: which notifications are marked read (persists until refresh)
const readNotificationIds = new Set<string>()

export interface Notification {
  _id: string
  tenantId: string
  userId?: string
  title: string
  message: string
  type: string
  referenceId?: string
  read: boolean
  createdAt: string
}

export const getNotifications = async (
  tenantId?: string | null,
  unreadOnly = false
): Promise<Notification[]> => {
  await delay(100)
  const id = tenantId || "tenant_001"
  let list = (seedNotifications as Notification[]).filter(
    (n) => n.tenantId === id
  ).map((n) => (readNotificationIds.has(n._id) ? { ...n, read: true } : n))
  if (unreadOnly) list = list.filter((n) => !n.read)
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export const markNotificationRead = async (
  notificationId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(100)
  readNotificationIds.add(notificationId)
}

export const markAllNotificationsRead = async (
  tenantId?: string | null
): Promise<void> => {
  await delay(150)
  const id = tenantId || "tenant_001"
  ;(seedNotifications as Notification[]).forEach((n) => {
    if (n.tenantId === id) readNotificationIds.add(n._id)
  })
}

export const getUnreadCount = async (
  tenantId?: string | null
): Promise<number> => {
  await delay(60)
  const id = tenantId || "tenant_001"
  return (seedNotifications as Notification[]).filter(
    (n) => n.tenantId === id && !n.read && !readNotificationIds.has(n._id)
  ).length
}
