/**
 * Auth Layout
 *
 * Minimal layout for auth pages (login, signup, forgot-password, etc.).
 * No sidebar or shell – just renders children.
 */

"use client"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
