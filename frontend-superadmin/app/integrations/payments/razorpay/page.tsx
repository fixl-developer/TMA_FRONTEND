"use client"

import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import paymentGateways from "@/data/seed/paymentGateways.json"

const razorpay = (paymentGateways as any[]).find((g) => g.provider === "razorpay")

export default function RazorpayConfigPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Razorpay configuration"
        description="API credentials, webhook configuration, payment methods, and settlement settings. UI placeholder only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <CreditCard className="h-3.5 w-3.5 text-[#0078d4]" />
            Razorpay
          </span>
        }
        actions={
          <Link href="/integrations/payments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Payments
            </Button>
          </Link>
        }
      />

      <PageSection title="Gateway details">
        <Card>
          <CardContent className="pt-4 text-sm text-[#323130]">
            {razorpay ? (
              <>
                <p>
                  Status: <span className="font-semibold">{razorpay.status}</span> · Environment:{" "}
                  <span className="font-semibold">{razorpay.environment}</span>
                </p>
                <p className="mt-1 text-xs text-[#605e5c]">
                  Last health check: {new Date(razorpay.lastHealthCheckAt).toLocaleString("en-IN")}
                </p>
              </>
            ) : (
              <p>No Razorpay gateway in seed data.</p>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

