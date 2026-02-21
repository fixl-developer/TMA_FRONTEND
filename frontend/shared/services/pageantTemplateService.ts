import { seedPageantTemplates } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface PageantTemplate {
  _id: string
  name: string
  description: string
  category: string
  stages: { id: string; name: string; order: number }[]
  scoringCriteria: string[]
}

export const getPageantTemplates = async (): Promise<PageantTemplate[]> => {
  await delay(150)
  return seedPageantTemplates as PageantTemplate[]
}
