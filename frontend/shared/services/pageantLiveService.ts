import { seedPageantLive, seedPageantAnalytics } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getPageantLiveData = async (pageantId: string) => {
  await delay(150)
  return seedPageantLive[pageantId] ?? {
    pageantId,
    currentStage: "REGISTRATION",
    funnel: [
      { stage: "REGISTRATION", count: 0, label: "Registration" },
      { stage: "PRELIMS", count: 0, label: "Prelims" },
      { stage: "SEMI_FINALS", count: 0, label: "Semi-finals" },
      { stage: "FINALS", count: 0, label: "Finals" },
    ],
    participants: [],
  }
}

export const getPageantAnalytics = async (pageantId: string) => {
  await delay(150)
  return seedPageantAnalytics[pageantId] ?? {
    conversionFunnel: [],
    revenue: { totalMinor: 0, currency: "INR", registrations: 0 },
    stageCompletion: [],
  }
}
