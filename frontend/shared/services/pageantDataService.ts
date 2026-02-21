import { seedRegistrations, seedJudges, seedSponsors } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Registration {
  _id: string
  pageantId: string
  contestantName: string
  email: string
  status: string
  stage: string
  registeredAt: string
}

export interface Judge {
  _id: string
  pageantId: string
  name: string
  role: string
  category: string
  assignedStages: string[]
}

export interface Sponsor {
  _id: string
  pageantId: string
  name: string
  tier: string
  amountMinor: number
  currency: string
  visibility: string
}

export const getRegistrations = async (pageantId?: string): Promise<Registration[]> => {
  await delay(150)
  const all = seedRegistrations as Registration[]
  if (pageantId) return all.filter((r) => r.pageantId === pageantId)
  return all
}

export const getRegistrationById = async (id: string): Promise<Registration | null> => {
  await delay(100)
  const all = seedRegistrations as Registration[]
  return all.find((r) => r._id === id) ?? null
}

export const getJudges = async (): Promise<Judge[]> => {
  await delay(150)
  return seedJudges as Judge[]
}

export const getSponsors = async (): Promise<Sponsor[]> => {
  await delay(150)
  return seedSponsors as Sponsor[]
}
