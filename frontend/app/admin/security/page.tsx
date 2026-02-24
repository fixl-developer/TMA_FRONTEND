"use client"

import { useState } from "react"
import { ShieldCheck, Smartphone, Copy, Check, KeyRound, Shield, Lock, AlertTriangle } from "lucide-react"
import { useToast } from "@/shared/components/ui/toast"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
} from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageLayout
        title="Security"
        subtitle="Multi-factor authentication and account security"
      >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="MFA Status"
          value={mfaEnabled ? "Enabled" : "Disabled"}
          subtitle="Two-factor auth"
          icon={ShieldCheck}
          color={mfaEnabled ? "green" : "yellow"}
        />
        <AdminStatCard
          label="Security Level"
          value={mfaEnabled ? "High" : "Medium"}
          subtitle="Protection level"
          icon={Shield}
          color={mfaEnabled ? "green" : "yellow"}
        />
        <AdminStatCard
          label="Sessions"
          value="3"
          subtitle="Active sessions"
          icon={Lock}
          color="blue"
        />
        <AdminStatCard
          label="Last Login"
          value="Today"
          subtitle="Recent activity"
          icon={AlertTriangle}
          color="purple"
        />
      </AdminStatsGrid>

      {/* MFA Configuration */}
      <AdminCard title="Multi-factor Authentication (MFA)" subtitle="Add an extra layer of security to your account">
        {mfaEnabled ? (
          <div className="flex items-center justify-between rounded border border-[#107c10] bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-green-600">MFA is enabled</p>
                <p className="text-xs text-gray-600">Your account is protected with TOTP.</p>
              </div>
            </div>
            <AdminButton variant="danger" size="sm" onClick={handleDisableMfa}>
              Disable MFA
            </AdminButton>
          </div>
        ) : mfaStep === "overview" ? (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Add an extra layer of security with TOTP (Time-based One-Time Password). Use an
              authenticator app like Google Authenticator or Authy.
            </p>
            <AdminButton onClick={handleEnableMfa}>
              <Smartphone className="h-4 w-4" />
              Enable MFA
            </AdminButton>
          </div>
        ) : mfaStep === "qr" ? (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">Scan this QR code with your authenticator app:</p>
            <div className="flex justify-center rounded border-2 border-dashed border-gray-200 bg-gray-50 p-8">
              <div className="flex h-40 w-40 items-center justify-center rounded bg-white text-center text-xs text-gray-400">
                [QR Code placeholder]
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Or enter this secret manually:{" "}
              <code className="rounded bg-gray-50 px-2 py-1 font-mono text-gray-900">
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
            <p className="text-xs text-gray-600">
              Enter the 6-digit code from your authenticator app:
            </p>
            <div className="space-y-2">
              <Label htmlFor="mfa-code" className="text-xs text-gray-600">
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
                className="border-gray-200 bg-white font-mono text-lg tracking-widest text-gray-900"
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
            <p className="text-xs text-gray-600">
              Save these recovery codes in a secure place. Each code can be used once if you lose
              access to your authenticator.
            </p>
            <div className="grid gap-2 rounded border border-gray-200 bg-gray-50 p-4">
              {MOCK_RECOVERY_CODES.map((code, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-gray-900"
                >
                  <span>{code}</span>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyRecoveryCode(code, idx)}
                  >
                    {copiedIndex === idx ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </AdminButton>
                </div>
              ))}
            </div>
            <AdminButton onClick={handleFinishMfa} className="w-full">
              <KeyRound className="h-4 w-4" />
              I&apos;ve saved my recovery codes
            </AdminButton>
          </div>
        ) : null}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
