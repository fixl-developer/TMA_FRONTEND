import collaborations from "@/data/seed/collaborations.json"

export interface Collaboration {
  _id: string
  tenantId: string
  partnerTenantId: string
  partnerName: string
  type: string
  status: string
  title: string
  revenueSplit: Record<string, number>
  createdAt: string
}

export async function getCollaborations(tenantId: string): Promise<Collaboration[]> {
  return (collaborations as unknown as Collaboration[]).filter((c) => c.tenantId === tenantId)
}
