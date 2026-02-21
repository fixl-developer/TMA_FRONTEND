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
import { useAuth } from "@/shared/context/AuthContext"
import { getTenantRoles } from "@/shared/services/roleService"
import { useToast } from "@/shared/components/ui/toast"
import { inviteUser } from "@/shared/services/invitationService"

export interface InviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function InviteUserModal({ open, onOpenChange, onSuccess }: InviteUserModalProps) {
  const { tenantId } = useTenant()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = React.useState("")
  const [roleId, setRoleId] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const roles = React.useMemo(() => {
    const id = tenantId || "tenant_001"
    return getTenantRoles(id)
  }, [tenantId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !roleId || !tenantId) return
    setLoading(true)
    try {
      const inv = await inviteUser(tenantId, email.trim(), roleId, user?.email)
      const link = typeof window !== "undefined" ? `${window.location.origin}/accept-invite?token=${inv._id}` : ""
      if (link && navigator?.clipboard?.writeText) navigator.clipboard.writeText(link)
      showToast(`Invitation sent to ${email}. Link copied to clipboard.`, "success")
      setEmail("")
      setRoleId("")
      onOpenChange(false)
      onSuccess?.()
    } catch {
      showToast("Failed to send invitation", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={roleId} onValueChange={setRoleId} required>
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r._id} value={r._id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
