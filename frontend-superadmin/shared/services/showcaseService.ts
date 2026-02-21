/**
 * Showcase Service - Super Admin
 *
 * Mock service for talent showcasing content in the Super Admin app.
 * Uses local seed data and simulates API latency.
 */

import { seedContentPosts } from "@/data/seed"
import type { ContentPost } from "@/shared/lib/types/showcase"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getContentPosts = async (): Promise<ContentPost[]> => {
  await delay(220)
  return seedContentPosts as ContentPost[]
}

