/**
 * Conditional Shell
 *
 * Renders the appropriate shell based on route:
 * - /login, /signup -> AuthLayout
 * - /superadmin/* -> SuperAdminShell
 * - /admin/* -> TenantAdminShell
 * - /modelling/* -> ModellingShell
 * - /pageant/* -> PageantShell
 * - /tenant/* -> TenantShell
 *
 * Route protection: unauthenticated users are redirected to /login when
 * accessing protected routes.
 */

"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/shared/context/AuthContext"
import { TenantShell } from "./TenantShell"
import { AuthLayout } from "./AuthLayout"
import { SuperAdminShell } from "./SuperAdminShell"
import { TenantAdminShell } from "./TenantAdminShell"
import { ModellingShell } from "./ModellingShell"
import { PageantShell } from "./PageantShell"
import { TalentMgmtShell } from "./TalentMgmtShell"
import { AcademyShell } from "./AcademyShell"
import { InfluencerShell } from "./InfluencerShell"
import { ShowcaseShell } from "./ShowcaseShell"
import { MobileShell } from "./MobileShell"

const AUTH_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password", "/onboarding", "/accept-invite"]
const PROTECTED_PREFIXES = ["/admin", "/superadmin", "/modelling", "/pageant", "/talent-mgmt", "/academy", "/influencer", "/portal", "/mobile"]

// Role-to-route mapping for access control
const ROLE_ROUTES: Record<string, string[]> = {
  superadmin: ["/superadmin"],
  admin: ["/admin"],
  modelling: ["/modelling"],
  pageant: ["/pageant"],
  "talent-mgmt": ["/talent-mgmt"],
  academy: ["/academy"],
  influencer: ["/influencer"],
}

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isReady, dashboardPath } = useAuth()

  // Check authentication
  useEffect(() => {
    if (!isReady || !pathname) return
    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
    if (isProtected && !user) {
      const returnUrl = encodeURIComponent(pathname)
      router.replace(`/login?returnUrl=${returnUrl}`)
    }
  }, [pathname, user, isReady, router])

  // Role-based route protection: redirect users to their dashboard if they access wrong routes
  useEffect(() => {
    if (!isReady || !pathname || !user) return
    
    const userRole = user.role
    const allowedRoutes = ROLE_ROUTES[userRole] || []
    const isOnAllowedRoute = allowedRoutes.some((route) => pathname.startsWith(route))
    
    // Check if user is trying to access a protected route that doesn't match their role
    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
    if (isProtected && !isOnAllowedRoute && dashboardPath) {
      // Redirect to their dashboard
      router.replace(dashboardPath)
    }
  }, [pathname, user, isReady, router, dashboardPath])

  const isProtected = pathname ? PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) : false
  if (isProtected && !user && isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Redirecting to sign in…</p>
      </div>
    )
  }

  // Show loading while checking role access
  if (isProtected && user && isReady) {
    const userRole = user.role
    const allowedRoutes = ROLE_ROUTES[userRole] || []
    const isOnAllowedRoute = allowedRoutes.some((route) => pathname?.startsWith(route))
    if (!isOnAllowedRoute && dashboardPath) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Redirecting to your dashboard…</p>
        </div>
      )
    }
  }

  if (AUTH_PREFIXES.some((p) => pathname?.startsWith(p))) {
    return <AuthLayout>{children}</AuthLayout>
  }

  // Role-based shell rendering with access control
  if (pathname?.startsWith("/superadmin")) {
    if (user?.role !== "superadmin") {
      if (dashboardPath) router.replace(dashboardPath)
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Access denied. Redirecting…</p>
        </div>
      )
    }
    return <SuperAdminShell>{children}</SuperAdminShell>
  }
  
  if (pathname?.startsWith("/admin")) {
    if (user?.role !== "admin") {
      if (dashboardPath) router.replace(dashboardPath)
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Access denied. Redirecting…</p>
        </div>
      )
    }
    return <TenantAdminShell>{children}</TenantAdminShell>
  }
  
  if (pathname?.startsWith("/modelling")) {
    if (user?.role !== "modelling") {
      if (dashboardPath) router.replace(dashboardPath)
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Access denied. Redirecting…</p>
        </div>
      )
    }
    return <ModellingShell>{children}</ModellingShell>
  }
  
  if (pathname?.startsWith("/pageant")) {
    if (user?.role !== "pageant") {
      if (dashboardPath) router.replace(dashboardPath)
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Access denied. Redirecting…</p>
        </div>
      )
    }
    return <PageantShell>{children}</PageantShell>
  }
  
  if (pathname?.startsWith("/talent-mgmt")) {
    if (user?.role !== "talent-mgmt") {
      if (dashboardPath) router.replace(dashboardPath)
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Access denied. Redirecting…</p>
        </div>
      )
    }
    return <TalentMgmtShell>{children}</TalentMgmtShell>
  }
  
  if (pathname?.startsWith("/academy")) {
    if (user?.role !== "academy") {
      if (dashboardPath) router.replace(dashboardPath)
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Access denied. Redirecting…</p>
        </div>
      )
    }
    return <AcademyShell>{children}</AcademyShell>
  }
  
  if (pathname?.startsWith("/influencer")) {
    if (user?.role !== "influencer") {
      if (dashboardPath) router.replace(dashboardPath)
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Access denied. Redirecting…</p>
        </div>
      )
    }
    return <InfluencerShell>{children}</InfluencerShell>
  }
  
  if (pathname?.startsWith("/showcase")) return <ShowcaseShell>{children}</ShowcaseShell>
  if (pathname?.startsWith("/tenant")) return <TenantShell>{children}</TenantShell>
  if (pathname?.startsWith("/portal")) return <TenantShell>{children}</TenantShell>
  if (pathname?.startsWith("/mobile")) return <MobileShell>{children}</MobileShell>

  // Root "/" is a redirect-only page – render without shell so redirect completes cleanly
  if (pathname === "/" || !pathname) return <>{children}</>

  // Unauthorized / health – no shell
  if (pathname?.startsWith("/unauthorized") || pathname?.startsWith("/health")) return <>{children}</>

  // Default fallback: redirect to user's dashboard if authenticated, otherwise SuperAdminShell
  if (user && dashboardPath) {
    router.replace(dashboardPath)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Redirecting to your dashboard…</p>
      </div>
    )
  }

  return <SuperAdminShell>{children}</SuperAdminShell>
}
