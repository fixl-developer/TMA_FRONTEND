/**
 * Showcase Service - Super Admin
 *
 * Mock service for talent showcasing content in the Super Admin app.
 * Uses local seed data and simulates API latency.
 */

import { seedContentPosts } from "@/data/seed"
import type { ContentPost } from "@/shared/lib/types/showcase"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getContentPosts = async (tenantId?: string): Promise<ContentPost[]> => {
  await delay(150)
  const posts = seedContentPosts as ContentPost[]
  if (tenantId) return posts.filter((p) => p.tenantId === tenantId)
  return posts
}

export const getContentPostById = async (id: string): Promise<ContentPost | null> => {
  await delay(100)
  const post = (seedContentPosts as ContentPost[]).find((p) => p._id === id)
  return post ?? null
}

export const getPendingContentPosts = async (tenantId: string): Promise<ContentPost[]> => {
  await delay(150)
  return (seedContentPosts as ContentPost[]).filter((p) => p.tenantId === tenantId && p.status === "PENDING")
}

