import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { tenantUsers, tenantRoles } from "@/data/seed"

export default function UsersPage() {
  const users = tenantUsers as Array<{
    id: string
    email: string
    displayName: string
    roleId: string
    status: string
    lastActiveAt: string | null
  }>
  const roles = tenantRoles as Array<{ id: string; name: string; description: string }>

  const getRoleName = (roleId: string) => roles.find((r) => r.id === roleId)?.name ?? "Unknown"

  return (
    <PageLayout>
      <PageBanner
        title="Users & Roles"
        subtitle="Invite, assign roles, and manage your team."
        variant="default"
      />
      <PageSection title="Roles" className="mt-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
      <PageSection title="Users">
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-200">{user.displayName}</td>
                    <td className="px-4 py-3 text-slate-400">{user.email}</td>
                    <td className="px-4 py-3 text-slate-400">{getRoleName(user.roleId)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          user.status === "active"
                            ? "rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400"
                            : "rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400"
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
