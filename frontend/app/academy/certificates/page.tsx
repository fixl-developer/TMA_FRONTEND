"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getCertificates } from "@/shared/services/academyService"
import { Award, Share2 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function CertificatesPage() {
  const [certs, setCerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCertificates().then(setCerts).finally(() => setLoading(false))
  }, [])

  return (
    <AgenciesPage>
      <PageBanner title="My certificates" subtitle="Course completion certificates. View and share." variant="academy" backgroundImage="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Certificates</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-slate-500">Loading…</p>
              ) : certs.length === 0 ? (
                <div className="py-12 text-center">
                  <Award className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-4 text-slate-500">No certificates yet. Complete courses to earn them.</p>
                  <Button asChild className="mt-4 bg-indigo-500 text-slate-800 hover:bg-indigo-400">
                  <Link href="/academy/courses">Browse courses</Link>
                </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {certs.map((c) => (
                    <div key={c._id} className="overflow-hidden rounded-xl border border-[#E7E5E4] bg-white shadow-sm transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-50">
                        <Award className="h-16 w-16 text-indigo-600" />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-slate-800">{c.courseTitle}</p>
                        <p className="text-sm text-slate-500">Issued {new Date(c.issuedAt).toLocaleDateString()}</p>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => window.open(c.shareUrl ?? "#", "_blank")}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Share"
                            onClick={async () => {
                              const url = c.shareUrl ?? "#"
                              await navigator.clipboard.writeText(url)
                              // Could add toast here
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
