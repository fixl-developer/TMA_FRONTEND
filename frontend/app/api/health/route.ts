/**
 * Health check API – Phase 24 Polish & Launch Prep
 *
 * For uptime monitors and load balancers.
 * GET /api/health → 200 { status: "ok" }
 */

import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
    { status: 200 }
  )
}
