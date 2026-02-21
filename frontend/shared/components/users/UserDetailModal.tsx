"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useTenant } from "@/shared/context/TenantContext"
import { getTenantRoles } from "@/shared/services/roleService"
import { useToast } from "@/shared/components/ui/toast"
import { assignRoleToUser, getRoleIdForUser } from "@/shared/services/adminService"
import { StepUpMfaModal } from "@/shared/components/security/StepUpMfaModal"
import { UserCircle2, Mail, UserX } from "lucide-react"

export interface UserDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: { _id: string; name: string; email: string; role?: string; status?: string } | null
  onSuccess?: () => void
}

export function UserDetailModal({ open, onOpenChange, user, onSuccess }: UserDetailModalProps) {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [name, setName] = React.useState("")
  const [roleId, setRoleId] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [stepUpOpen, setStepUpOpen] = React.useState(false)

  const roles = React.useMemo(() => {
    const id = tenantId || "tenant_001"
    return getTenantRoles(id)
  }, [tenantId])

  React.useEffect(() => {
    if (user) {
      setName(user.name)
      const id = tenantId || "tenant_001"
      const rId = getRoleIdForUser(id, user._id, user.role)
      setRoleId(rId || "")
    }
  }, [user, tenantId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !tenantId) return
    setLoading(true)
    try {
      if (roleId) {
        await assignRoleToUser(tenantId, user._id, roleId)
      }
      showToast(`${user.name} profile saved`, "success")
      onOpenChange(false)
      onSuccess?.()
    } catch {
      showToast("Failed to save changes", "error")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle2 className="h-5 w-5" />
            User details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 admin-dark-theme:border-white/10 admin-dark-theme:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 admin-dark-theme:bg-[#d4ff00]/20">
              <UserCircle2 className="h-5 w-5 text-amber-600 admin-dark-theme:text-[#d4ff00]" />
            </div>
            <div>
              <p className="font-medium text-slate-800 admin-dark-theme:text-white">{user.name}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500 admin-dark-theme:text-white/60">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
              {user.status && (
                <span className="mt-1 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 admin-dark-theme:bg-white/10 admin-dark-theme:text-white/70">
                  {user.status}
                </span>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name" className="text-slate-700 admin-dark-theme:text-white/80">Display name</Label>
              <Input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 admin-dark-theme:border-white/15 admin-dark-theme:bg-white/10 admin-dark-theme:text-white admin-dark-theme:placeholder:text-white/40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role" className="text-slate-700 admin-dark-theme:text-white/80">Role</Label>
              <Select value={roleId || undefined} onValueChange={setRoleId}>
                <SelectTrigger
                  id="user-role"
                  className="border-slate-300 bg-white text-slate-900 admin-dark-theme:border-white/15 admin-dark-theme:bg-white/10 admin-dark-theme:text-white"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="admin-dark-theme:border-white/10 admin-dark-theme:bg-[#23183a] admin-dark-theme:text-white">
                  {roles.map((r) => (
                    <SelectItem key={r._id} value={r._id} className="admin-dark-theme:focus:bg-white/10 admin-dark-theme:focus:text-white">
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 admin-dark-theme:border-red-300/30 admin-dark-theme:text-red-300 admin-dark-theme:hover:bg-red-500/15"
                onClick={() => setStepUpOpen(true)}
              >
                <UserX className="mr-1 h-4 w-4" />
                Remove user
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
      <StepUpMfaModal
        open={stepUpOpen}
        onOpenChange={setStepUpOpen}
        actionLabel="Remove user"
        onConfirm={async () => {
          setLoading(true)
          await new Promise((r) => setTimeout(r, 600))
          setLoading(false)
          showToast(`${user.name} has been removed`, "success")
          onOpenChange(false)
          onSuccess?.()
        }}
      />
    </Dialog>
  )
}
