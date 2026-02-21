"use client"

import { AuthProvider } from "@/shared/context/AuthContext"
import { TenantProvider } from "@/shared/context/TenantContext"
import { LocaleProvider } from "@/shared/context/LocaleContext"
import { ToastProvider } from "@/shared/components/ui/toast"
import { ConditionalShell } from "@/shared/components/layout/ConditionalShell"
import { ErrorBoundary } from "@/shared/components/ui/error-boundary"

/**
 * AppProviders wraps the entire app. AuthProvider must be outermost
 * so useAuth works in all pages (including the root page and login).
 * TenantProvider enables tenant switching for tenant-scoped views.
 * LocaleProvider enables i18n (EN + HI).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TenantProvider>
        <LocaleProvider>
          <ToastProvider>
            <ErrorBoundary>
              <ConditionalShell>{children}</ConditionalShell>
            </ErrorBoundary>
          </ToastProvider>
        </LocaleProvider>
      </TenantProvider>
    </AuthProvider>
  )
}
