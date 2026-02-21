import communityPosts from "@/data/seed/communityPosts.json"
import groups from "@/data/seed/groups.json"
import { seedContentReports, seedGroupMembers } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface CommunityPost {
  _id: string
  tenantId: string
  authorId: string
  authorName: string
  content: string
  type: string
  status: string
  createdAt: string
  likesCount: number
  commentsCount: number
}

export interface CommunityGroup {
  _id: string
  tenantId: string
  name: string
  description: string
  memberCount: number
  isPrivate: boolean
  createdAt?: string
}

export interface ContentReport {
  _id: string
  postId: string
  tenantId: string
  reporterId: string
  reason: string
  status: string
  createdAt: string
  resolvedAt?: string
}

// In-memory overrides for demo
const postOverrides: CommunityPost[] = []
const postStatusOverrides: Record<string, string> = {}
const joinedGroups: Set<string> = new Set()
const reportStatusOverrides: Record<string, string> = {}

export async function getCommunityPosts(tenantId: string): Promise<CommunityPost[]> {
  await delay(100)
  const seed = communityPosts as CommunityPost[]
  const all = [...seed, ...postOverrides]
  return all
    .filter((p) => p.tenantId === tenantId)
    .map((p) => ({
      ...p,
      status: postStatusOverrides[p._id] ?? p.status,
    }))
}

export async function getCommunityGroups(tenantId: string): Promise<CommunityGroup[]> {
  await delay(100)
  return (groups as CommunityGroup[]).filter((g) => g.tenantId === tenantId)
}

export async function getGroupById(
  groupId: string,
  tenantId?: string
): Promise<CommunityGroup | null> {
  await delay(100)
  const list = (groups as CommunityGroup[]).filter(
    (g) => g._id === groupId && (!tenantId || g.tenantId === tenantId)
  )
  return list[0] ?? null
}

export async function getGroupMembers(groupId: string): Promise<{ userId: string }[]> {
  await delay(100)
  return (seedGroupMembers as { _id: string; groupId: string; userId: string }[])?.filter(
    (m) => m.groupId === groupId
  ) ?? []
}

export async function isUserInGroup(groupId: string, userId: string): Promise<boolean> {
  const members = await getGroupMembers(groupId)
  return members.some((m) => m.userId === userId) || joinedGroups.has(`${groupId}:${userId}`)
}

export async function joinGroup(groupId: string, userId: string): Promise<void> {
  await delay(150)
  joinedGroups.add(`${groupId}:${userId}`)
}

export async function leaveGroup(groupId: string, userId: string): Promise<void> {
  await delay(150)
  joinedGroups.delete(`${groupId}:${userId}`)
}

export async function getPendingPosts(tenantId: string): Promise<CommunityPost[]> {
  const posts = await getCommunityPosts(tenantId)
  return posts.filter((p) => p.status === "PENDING")
}

export async function createPost(
  tenantId: string,
  authorId: string,
  authorName: string,
  content: string
): Promise<CommunityPost> {
  await delay(200)
  const post: CommunityPost = {
    _id: `post_${Date.now()}`,
    tenantId,
    authorId,
    authorName,
    content,
    type: "TEXT",
    status: "PENDING",
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
  }
  postOverrides.push(post)
  return post
}

export async function approvePost(postId: string): Promise<void> {
  await delay(150)
  postStatusOverrides[postId] = "APPROVED"
}

export async function rejectPost(postId: string): Promise<void> {
  await delay(150)
  postStatusOverrides[postId] = "REJECTED"
}

export async function getReportedContent(tenantId: string): Promise<
  (ContentReport & { post?: CommunityPost })[]
> {
  await delay(100)
  const allReports = seedContentReports as ContentReport[]
  const reports = allReports
    .filter((r) => r.tenantId === tenantId)
    .map((r) => ({ ...r, status: reportStatusOverrides[r._id] ?? r.status }))
    .filter((r) => r.status === "PENDING")
  const seed = communityPosts as CommunityPost[]
  const all = [...seed, ...postOverrides]
  return reports.map((r) => {
    const post = all.find((p) => p._id === r.postId)
    return { ...r, post }
  })
}

export async function dismissReport(reportId: string): Promise<void> {
  await delay(100)
  reportStatusOverrides[reportId] = "DISMISSED"
}

export async function resolveReportTakedown(reportId: string, postId: string): Promise<void> {
  await delay(100)
  reportStatusOverrides[reportId] = "ACTION_TAKEN"
  postStatusOverrides[postId] = "REJECTED"
}
