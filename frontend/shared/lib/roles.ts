/** Platform roles (from users.json) */
const PLATFORM_ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  TENANT_OWNER: "Tenant Owner",
  ADMIN: "Admin",
  AGENT: "Agent",
  TALENT_MANAGER: "Talent Manager",
  TALENT: "Talent",
  JUDGE: "Judge",
  BRAND: "Brand",
  FINANCE: "Finance",
  PAGEANT_DIRECTOR: "Pageant Director",
}

/** App roles (from AuthContext) — fallback when no seed match */
export const APP_ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  modelling: "Modelling Agency",
  pageant: "Pageant Organizer",
  "talent-mgmt": "Talent Management",
  academy: "Academy",
  influencer: "Influencer Agency",
}

export function getRoleLabel(role?: string | null): string {
  if (!role) return "—"
  if (PLATFORM_ROLE_LABELS[role]) return PLATFORM_ROLE_LABELS[role]
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Platform role -> role name (from seed roles) */
export const ROLE_PLATFORM_TO_NAME: Record<string, string> = {
  TENANT_OWNER: "Tenant Owner",
  ADMIN: "Admin",
  AGENT: "Agent",
  FINANCE: "Finance",
  PAGEANT_DIRECTOR: "Pageant Director",
  JUDGE: "Judge",
}

/** Role name (from seed roles) -> platform role */
export const ROLE_NAME_TO_PLATFORM: Record<string, string> = {
  "Tenant Owner": "TENANT_OWNER",
  Admin: "ADMIN",
  Agent: "AGENT",
  Finance: "FINANCE",
  "Pageant Director": "PAGEANT_DIRECTOR",
  Judge: "JUDGE",
}

/** For login/demo: prefer platform role from seed when email matches, else app role label */
export function getDisplayRoleLabel(
  email: string | undefined,
  appRole: string | undefined,
  seedUsers: { email?: string; role?: string }[]
): string {
  if (!email) return APP_ROLE_LABELS[appRole ?? ""] ?? appRole ?? "—"
  const match = seedUsers.find((u) => u.email?.toLowerCase() === email.toLowerCase())
  if (match?.role) return getRoleLabel(match.role)
  return APP_ROLE_LABELS[appRole ?? ""] ?? appRole ?? "—"
}
