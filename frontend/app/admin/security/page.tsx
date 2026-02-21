"use client"

import { useState } from "react"
import { ShieldCheck, Smartphone, Copy, Check, KeyRound, Shield, Lock, AlertTriangle } from "lucide-react"
import { useToast } from "@/shared/components/ui/toast"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

type MfaStep = "overview" | "qr" | "verify" | "recovery" | "done"

const MOCK_RECOVERY_CODES = [
  "ABCD-1234-EFGH",
  "IJKL-5678-MNOP",
  "QRST-9012-UVWX",
  "YZAB-3456-CDEF",
  "GHIJ-7890-KLMN",
]

export default function AdminSecurityPage() {
  const { showToast } = useToast()
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [mfaStep, setMfaStep] = useState<MfaStep>("overview")
  const [verifyCode, setVerifyCode] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopyRecoveryCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(idx)
    showToast("Recovery code copied", "success")
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleEnableMfa = () => setMfaStep("qr")
  const handleVerifyMfa = () => {
    if (verifyCode.length >= 6) setMfaStep("recovery")
  }
  const handleFinishMfa = () => {
    setMfaEnabled(true)
    setMfaStep("done")
    showToast("MFA enabled successfully", "success")
  }
  const handleDisableMfa = () => {
    setMfaEnabled(false)
    setMfaStep("overview")
    setVerifyCode("")
    showToast("MFA disabled", "success")
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Security"
        subtitle="Multi-factor authentication and account security"
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="MFA Status"
          value={mfaEnabled ? "Enabled" : "Disabled"}
          subtitle="Two-factor auth"
          icon={ShieldCheck}
          color={mfaEnabled ? "green" : "yellow"}
        />
        <AdminStatCard
          title="Security Level"
          value={mfaEnabled ? "High" : "Medium"}
          subtitle="Protection level"
          icon={Shield}
          color={mfaEnabled ? "green" : "yellow"}
        />
        <AdminStatCard
          title="Sessions"
          value="3"
          subtitle="Active sessions"
          icon={Lock}
          color="blue"
        />
        <AdminStatCard
          title="Last Login"
          value="Today"
          subtitle="Recent activity"
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* MFA Configuration */}
      <AdminCard>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-3">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Multi-factor Authentication (MFA)</h3>
            <p className="text-sm text-white/60">Add an extra layer of security to your account</p>
          </div>
        </div>

        {mfaEnabled ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-emerald-400">MFA is enabled</p>
                <p className="text-sm text-emerald-400/70">Your account is protected with TOTP.</p>
              </div>
            </div>
            <AdminButton variant="danger" size="sm" onClick={handleDisableMfa}>
              Disable MFA
            </AdminButton>
          </div>
        ) : mfaStep === "overview" ? (
          <div className="space-y-4">
            <p className="text-white/70">
              Add an extra layer of security with TOTP (Time-based One-Time Password). Use an
              authenticator app like Google Authenticator or Authy.
            </p>
            <AdminButton onClick={handleEnableMfa}>
              <Smartphone className="mr-2 h-4 w-4" />
              Enable MFA
            </AdminButton>
          </div>
        ) : mfaStep === "qr" ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">Scan this QR code with your authenticator app:</p>
            <div className="flex justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-white text-center text-xs text-slate-400">
                [QR Code placeholder]
              </div>
            </div>
            <p className="text-xs text-white/50">
              Or enter this secret manually:{" "}
              <code className="rounded bg-white/10 px-2 py-1 font-mono text-white/70">
                JBSWY3DPEHPK3PXP
              </code>
            </p>
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={() => setMfaStep("overview")}>
                Back
              </AdminButton>
              <AdminButton onClick={() => setMfaStep("verify")}>Next: Verify</AdminButton>
            </div>
          </div>
        ) : mfaStep === "verify" ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Enter the 6-digit code from your authenticator app:
            </p>
            <div className="space-y-2">
              <Label htmlFor="mfa-code" className="text-white/70">
                Verification code
              </Label>
              <Input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                className="border-white/20 bg-white/5 font-mono text-lg tracking-widest text-white backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={() => setMfaStep("qr")}>
                Back
              </AdminButton>
              <AdminButton onClick={handleVerifyMfa} disabled={verifyCode.length < 6}>
                Verify
              </AdminButton>
            </div>
          </div>
        ) : mfaStep === "recovery" ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Save these recovery codes in a secure place. Each code can be used once if you lose
              access to your authenticator.
            </p>
            <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              {MOCK_RECOVERY_CODES.map((code, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white backdrop-blur-sm"
                >
                  <span>{code}</span>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyRecoveryCode(code, idx)}
                  >
                    {copiedIndex === idx ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </AdminButton>
                </div>
              ))}
            </div>
            <AdminButton onClick={handleFinishMfa} className="w-full">
              <KeyRound className="mr-2 h-4 w-4" />
              I&apos;ve saved my recovery codes
            </AdminButton>
          </div>
        ) : null}
      </AdminCard>
    </AdminPageWrapper>
  )
}
